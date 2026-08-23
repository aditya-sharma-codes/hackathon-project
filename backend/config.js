const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '../.env');

if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;

    const separator = line.indexOf('=');
    if (separator < 1) continue;

    const name = line.slice(0, separator).trim();
    let value = line.slice(separator + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    if (process.env[name] === undefined) process.env[name] = value;
  }
}

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is required. Copy .env.example to .env and set a secure value.');
}

module.exports = { envPath };

