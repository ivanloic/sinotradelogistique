const fs = require('fs');
const filePath = 'c:/Users/pc/SinoTrade/src/data/perruque.js';
const content = fs.readFileSync(filePath, 'utf8');

// Replace % inside /perruque/... path strings that are NOT already %XX sequences
const fixed = content.replace(/"(\/perruque\/[^"]+)"/g, (match, path) => {
  // Replace bare % not followed by two hex digits
  const fixedPath = path.replace(/%(?![0-9A-Fa-f]{2})/g, '%25');
  return '"' + fixedPath + '"';
});

fs.writeFileSync(filePath, fixed, 'utf8');

// Verify
const remaining = (fixed.match(/"\/perruque\/[^"]*%(?![0-9A-Fa-f]{2})[^"]*"/g) || []).length;
console.log('Done. Remaining bare % in paths:', remaining);
