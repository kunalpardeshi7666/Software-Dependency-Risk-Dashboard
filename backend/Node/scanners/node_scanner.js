// scanners/node_scanner.js
const { exec } = require('child_process');
const parseAuditReport = require('../utils/parseAuditReport');
const logger = require('../utils/logger');

/**
 * scanNodeProject(path, options) -> Promise
 * options: { timeoutMs }
 */
function scanNodeProject(projectPath, options = {}) {
  const timeoutMs = options.timeoutMs || 2 * 60 * 1000; // default 2 minutes

  return new Promise((resolve, reject) => {
    const cmd = `cd ${projectPath} && npm audit --json`;

    logger.info('Running node scanner command:', cmd);
    const child = exec(cmd, { maxBuffer: 10 * 1024 * 1024, timeout: timeoutMs }, (error, stdout, stderr) => {
      if (error) {
        // npm audit exits with code >0 when vulnerabilities found; but we still get JSON in stdout.
        if (stdout) {
          try {
            const parsed = JSON.parse(stdout);
            const normalized = parseAuditReport('node', parsed);
            return resolve({ raw: parsed, normalized });
          } catch (parseErr) {
            return reject(new Error('Failed to parse npm audit JSON: ' + parseErr.message));
          }
        }
        return reject(new Error('npm audit failed: ' + (stderr || error.message)));
      }

      if (!stdout) {
        return reject(new Error('npm audit did not return output.'));
      }

      try {
        const parsed = JSON.parse(stdout);
        const normalized = parseAuditReport('node', parsed);
        return resolve({ raw: parsed, normalized });
      } catch (parseErr) {
        return reject(new Error('Failed to parse npm audit JSON: ' + parseErr.message));
      }
    });
  });
}

module.exports = scanNodeProject;
