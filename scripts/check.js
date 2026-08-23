const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const failures = [];
let checked = 0;

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    if (entry.name === 'node_modules' || entry.name === '.git') return [];
    const fullPath = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(fullPath) : [fullPath];
  });
}

function checkJavaScript(filePath, source) {
  try {
    new vm.Script(source, { filename: filePath });
    checked += 1;
  } catch (error) {
    failures.push(`${path.relative(root, filePath)}: ${error.message}`);
  }
}

for (const directory of ['backend', 'frontend']) {
  for (const filePath of walk(path.join(root, directory))) {
    if (filePath.endsWith('.js')) {
      checkJavaScript(filePath, fs.readFileSync(filePath, 'utf8'));
      continue;
    }

    if (filePath.endsWith('.html')) {
      const html = fs.readFileSync(filePath, 'utf8');
      for (const match of html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/gi)) {
        if (/type=["']module["']/i.test(match[1]) || /\ssrc=/i.test(match[1])) continue;
        checkJavaScript(filePath, match[2]);
      }
      continue;
    }

    if (filePath.endsWith('.json')) {
      try {
        JSON.parse(fs.readFileSync(filePath, 'utf8'));
        checked += 1;
      } catch (error) {
        failures.push(`${path.relative(root, filePath)}: ${error.message}`);
      }
    }
  }
}

if (failures.length) {
  console.error(`Project checks failed (${failures.length}):`);
  failures.forEach(failure => console.error(`- ${failure}`));
  process.exitCode = 1;
} else {
  console.log(`Project checks passed (${checked} scripts and data files).`);
}
