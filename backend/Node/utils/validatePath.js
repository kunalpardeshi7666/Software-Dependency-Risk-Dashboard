// utils/validatePath.js
const fs = require('fs');
const path = require('path');

function isAccessibleDirectory(dirPath) {
  try {
    const stat = fs.statSync(dirPath);
    return stat.isDirectory();
  } catch (err) {
    return false;
  }
}

function isAccessibleFile(filePath) {
  try {
    const stat = fs.statSync(filePath);
    return stat.isFile();
  } catch (err) {
    return false;
  }
}

module.exports = { isAccessibleDirectory, isAccessibleFile };
