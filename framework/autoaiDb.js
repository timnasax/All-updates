const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../autoai_status.json');

// Initialize database file if not exists
if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, JSON.stringify({ enabled: false }), 'utf-8');
}

function getAutoAiStatus() {
  try {
    const data = fs.readFileSync(dbPath, 'utf-8');
    return JSON.parse(data).enabled;
  } catch (err) {
    return false;
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
