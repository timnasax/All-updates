const fs = require('fs');
const path = require('path');
const conf = require('../set');

const dbPath = path.join(__dirname, '../autoai_status.json');

// Kama faili halipo, litumie thamani iliyopo kwenye set.js (AUTO_AI)
if (!fs.existsSync(dbPath)) {
  const defaultStatus = conf.AUTO_AI.toLowerCase() === 'yes';
  fs.writeFileSync(dbPath, JSON.stringify({ enabled: defaultStatus }), 'utf-8');
}

function getAutoAiStatus() {
  try {
    const data = fs.readFileSync(dbPath, 'utf-8');
    return JSON.parse(data).enabled;
  } catch (err) {
    return conf.AUTO_AI.toLowerCase() === 'yes';
  }
}

function setAutoAiStatus(status) {
  try {
    fs.writeFileSync(dbPath, JSON.stringify({ enabled: Boolean(status) }), 'utf-8');
    return true;
  } catch (err) {
    console.error("Database Write Error:", err);
    return false;
  }
}

module.exports = { getAutoAiStatus, setAutoAiStatus };
