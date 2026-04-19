// ============================================================
// fix-urls.mjs — Corrige les URLs Cloudinary dupliquées
// Usage : node fix-urls.mjs
// ============================================================

import { readdirSync, readFileSync, writeFileSync, statSync } from 'fs';
import { join, extname } from 'path';

let totalFiles = 0;
let modifiedFiles = 0;
let totalFixes = 0;

function fixContent(content) {
  let result = content;
  let count = 0;

  // Cas 1 : URL complète dupliquée
  // "https://res.cloudinary.com/deuttziac/image/uploadhttps://res.cloudinary.com/deuttziac//dossier/..."
  const regex1 = /https:\/\/res\.cloudinary\.com\/[^/]+\/image\/uploadhttps:\/\/res\.cloudinary\.com\/[^/]+\/\/([^"']+)/g;
  result = result.replace(regex1, (match, path) => {
    count++;
    return `https://res.cloudinary.com/deuttziac/image/upload/${path}`;
  });

  // Cas 2 : double slash après upload
  // "https://res.cloudinary.com/deuttziac/image/upload//dossier/..."
  const regex2 = /https:\/\/res\.cloudinary\.com\/(deuttziac)\/image\/upload\/\/([^"']+)/g;
  result = result.replace(regex2, (match, cloud, path) => {
    count++;
    return `https://res.cloudinary.com/${cloud}/image/upload/${path}`;
  });

  // Cas 3 : uploadhttps sans double slash
  // "https://res.cloudinary.com/deuttziac/image/uploadhttps://..."
  const regex3 = /https:\/\/res\.cloudinary\.com\/[^/]+\/image\/uploadhttps:\/\/[^"']+\/([^/]+\/[^"']+)/g;
  result = result.replace(regex3, (match, path) => {
    count++;
    return `https://res.cloudinary.com/deuttziac/image/upload/${path}`;
  });

  return { result, count };
}

function processDir(dirPath) {
  const items = readdirSync(dirPath);
  for (const item of items) {
    const fullPath = join(dirPath, item);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      processDir(fullPath);
    } else if (['.js', '.ts', '.jsx', '.tsx', '.json'].includes(extname(item))) {
      totalFiles++;
      const content = readFileSync(fullPath, 'utf-8');
      const { result, count } = fixContent(content);

      if (count > 0) {
        writeFileSync(fullPath, result, 'utf-8');
        modifiedFiles++;
        totalFixes += count;
        console.log(`✅ ${fullPath} — ${count} correction(s)`);
      } else {
        console.log(`⏭️  ${fullPath} — aucun problème`);
      }
    }
  }
}

console.log('🔧 Correction des URLs dupliquées...\n');
processDir('src/data');

console.log('\n============================================================');
console.log(`📄 Fichiers analysés  : ${totalFiles}`);
console.log(`✏️  Fichiers corrigés  : ${modifiedFiles}`);
console.log(`🔁 Corrections total  : ${totalFixes}`);
console.log('============================================================');

if (totalFixes === 0) {
  console.log('\n⚠️  Aucune URL dupliquée trouvée.');
  console.log('   Colle un exemple d\'URL problématique pour affiner le script.');
} else {
  console.log('\n✅ Corrections appliquées ! Lance maintenant :');
  console.log('   git add src/data/');
  console.log('   git commit -m "fix: correct duplicated Cloudinary URLs"');
  console.log('   git push\n');
}
