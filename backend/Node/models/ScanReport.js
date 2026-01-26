// models/ScanReport.js
const mongoose = require('mongoose');

const VulnerabilitySchema = new mongoose.Schema({
  id: String,
  title: String,
  severity: String,
  packageName: String,
  version: String,
  description: String,
  url: String
}, { _id: false });

const ScanReportSchema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  type: { type: String, enum: ['node','python','maven','manual'], required: true },
  summary: {
    totalDependencies: Number,
    totalVulnerabilities: Number,
    severityCounts: {
      critical: { type: Number, default: 0 },
      high: { type: Number, default: 0 },
      medium: { type: Number, default: 0 },
      low: { type: Number, default: 0 }
    },
    riskScore: Number
  },
  vulnerabilities: [VulnerabilitySchema],
  rawReport: { type: mongoose.Schema.Types.Mixed }, // store raw scanner JSON
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ScanReport', ScanReportSchema);
