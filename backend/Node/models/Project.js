// models/Project.js
const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  repoUrl: { type: String },
  path: { type: String },
  createdAt: { type: Date, default: Date.now },
  lastScanAt: { type: Date }
});

module.exports = mongoose.model('Project', ProjectSchema);
