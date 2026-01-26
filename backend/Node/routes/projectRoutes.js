// routes/projectRoutes.js
const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const ScanReport = require('../models/ScanReport');

// list projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 }).lean();
    return res.json({ ok: true, projects });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// get project by id + recent reports
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    const reports = await ScanReport.find({ project: project._id }).sort({ createdAt: -1 }).limit(20);
    return res.json({ ok: true, project, reports });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// delete project
router.delete('/:id', async (req, res) => {
  try {
    await ScanReport.deleteMany({ project: req.params.id });
    await Project.findByIdAndDelete(req.params.id);
    return res.json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
