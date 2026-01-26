// routes/scanRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const Project = require('../models/Project');
const ScanReport = require('../models/ScanReport');
const scanNodeProject = require('../scanners/node_scanner');
const scanPythonProject = require('../scanners/python_scanner');
const parseAuditReport = require('../utils/parseAuditReport');
const { isAccessibleDirectory, isAccessibleFile } = require('../utils/validatePath');
const logger = require('../utils/logger');

const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);

// multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    const id = uuidv4();
    cb(null, `${id}-${file.originalname}`);
  }
});
const upload = multer({ storage });

// --- scan Node project by path
router.post('/node', async (req, res) => {
  const projectPath = req.body.path;
  const projectName = req.body.name || path.basename(projectPath || 'unnamed');

  if (!projectPath) return res.status(400).json({ error: 'path is required' });
  if (!isAccessibleDirectory(projectPath)) return res.status(400).json({ error: 'path is not an accessible directory on server' });

  try {
    // create or update project
    let project = await Project.findOne({ path: projectPath });
    if (!project) project = await Project.create({ name: projectName, path: projectPath });

    const { raw, normalized } = await scanNodeProject(projectPath);

    const scanReport = await ScanReport.create({
      project: project._id,
      type: 'node',
      summary: {
        totalDependencies: normalized.totalDependencies,
        totalVulnerabilities: normalized.totalVulnerabilities,
        severityCounts: normalized.severityCounts,
        riskScore: normalized.riskScore
      },
      vulnerabilities: normalized.vulnerabilities,
      rawReport: raw
    });

    project.lastScanAt = scanReport.createdAt;
    await project.save();

    return res.json({ ok: true, scanReportId: scanReport._id, normalized });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ error: err.message });
  }
});

// --- scan Python project by path
router.post('/python', async (req, res) => {
  const projectPath = req.body.path;
  const projectName = req.body.name || path.basename(projectPath || 'unnamed');

  if (!projectPath) return res.status(400).json({ error: 'path is required' });
  if (!isAccessibleDirectory(projectPath)) return res.status(400).json({ error: 'path is not an accessible directory on server' });

  try {
    let project = await Project.findOne({ path: projectPath });
    if (!project) project = await Project.create({ name: projectName, path: projectPath });

    const { raw, normalized } = await scanPythonProject(projectPath);

    const scanReport = await ScanReport.create({
      project: project._id,
      type: 'python',
      summary: {
        totalDependencies: normalized.totalDependencies,
        totalVulnerabilities: normalized.totalVulnerabilities,
        severityCounts: normalized.severityCounts,
        riskScore: normalized.riskScore
      },
      vulnerabilities: normalized.vulnerabilities,
      rawReport: raw
    });

    project.lastScanAt = scanReport.createdAt;
    await project.save();

    return res.json({ ok: true, scanReportId: scanReport._id, normalized });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ error: err.message });
  }
});

// --- upload manifest and run simple parse
// Accept package.json or requirements.txt and create a manual "scan" based on parsing (no external CLI)
router.post('/upload', upload.single('manifest'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'manifest file is required' });

    const filepath = req.file.path;
    const originalname = req.file.originalname.toLowerCase();

    // Quick manual parse: for package.json, we will run npm audit using a temp folder approach or just parse dependencies and return candidates.
    if (originalname.endsWith('package.json')) {
      const content = JSON.parse(fs.readFileSync(filepath, 'utf8'));
      const deps = Object.assign({}, content.dependencies || {}, content.devDependencies || {});
      // Create a lightweight normalized object: totalDependencies + list
      const normalized = {
        totalDependencies: Object.keys(deps).length,
        totalVulnerabilities: null,
        severityCounts: { critical: 0, high: 0, medium: 0, low: 0 },
        riskScore: 0,
        vulnerabilities: []
      };

      const project = await Project.create({ name: content.name || req.file.originalname || 'uploaded-package', path: filepath });

      const scanReport = await ScanReport.create({
        project: project._id,
        type: 'manual',
        summary: {
          totalDependencies: normalized.totalDependencies,
          totalVulnerabilities: normalized.totalVulnerabilities,
          severityCounts: normalized.severityCounts,
          riskScore: normalized.riskScore
        },
        vulnerabilities: normalized.vulnerabilities,
        rawReport: { parsedDependencies: deps, manifestUploaded: true, filename: req.file.originalname }
      });

      return res.json({ ok: true, scanReportId: scanReport._id, normalized });
    } else if (originalname.endsWith('requirements.txt')) {
      // parse lines
      const lines = fs.readFileSync(filepath, 'utf8').split('\n').map(l => l.trim()).filter(Boolean).filter(l => !l.startsWith('#'));
      const normalized = {
        totalDependencies: lines.length,
        totalVulnerabilities: null,
        severityCounts: { critical: 0, high: 0, medium: 0, low: 0 },
        riskScore: 0,
        vulnerabilities: []
      };
      const project = await Project.create({ name: path.basename(filepath), path: filepath });

      const scanReport = await ScanReport.create({
        project: project._id,
        type: 'manual',
        summary: {
          totalDependencies: normalized.totalDependencies,
          totalVulnerabilities: normalized.totalVulnerabilities,
          severityCounts: normalized.severityCounts,
          riskScore: normalized.riskScore
        },
        vulnerabilities: normalized.vulnerabilities,
        rawReport: { parsedDependencies: lines, manifestUploaded: true, filename: req.file.originalname }
      });

      return res.json({ ok: true, scanReportId: scanReport._id, normalized });
    } else {
      return res.status(400).json({ error: 'Unsupported manifest type. Upload package.json or requirements.txt' });
    }
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ error: err.message });
  }
});

// get report by id
router.get('/reports/:id', async (req, res) => {
  try {
    const report = await ScanReport.findById(req.params.id).populate('project');
    if (!report) return res.status(404).json({ error: 'report not found' });
    return res.json({ ok: true, report });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
