// ============================================================
// replace-urls.mjs — Remplace les chemins locaux par URLs Cloudinary
// Usage : node replace-urls.mjs
// ============================================================

import { readdirSync, readFileSync, writeFileSync, statSync } from 'fs';
import { join, extname } from 'path';

// 🔑 Ton cloud name Cloudinary
const CLOUD_NAME = 'deuttziac'; // ex: deuttziac
const BASE_URL = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload`;

// 📁 Dossier contenant tes fichiers de données
const DATA_DIR = 'src/data';

// 📂 Mapping des dossiers locaux → dossiers Cloudinary
// (les espaces dans les noms de dossiers sont remplacés par _)
const FOLDER_MAP = {
  '/bannier/':              `${BASE_URL}/bannier/`,
  '/bijou/':                `${BASE_URL}/bijou/`,
  '/chaussure/':            `${BASE_URL}/chaussure/`,
  '/images/':               `${BASE_URL}/images/`,
  '/logo/':                 `${BASE_URL}/logo/`,
  '/payement/':             `${BASE_URL}/payement/`,
  '/perruque/':             `${BASE_URL}/perruque/`,
  '/sac/':                  `${BASE_URL}/sac/`,
  '/sac femme/':            `${BASE_URL}/sac_femme/`,
  '/sac%20femme/':          `${BASE_URL}/sac_femme/`,
  '/telephone_accessoires/': `${BASE_URL}/telephone_accessoires/`,
  '/vetement_enfant/':      `${BASE_URL}/vetement_enfant/`,
  '/vetement_femme/':       `${BASE_URL}/vetement_femme/`,
  '/vetement_homme/':       `${BASE_URL}/vetement_homme/`,
};

let totalFiles = 0;
let modifiedFiles = 0;
let totalReplacements = 0;

function replaceInFile(filePath) {
  let content = readFileSync(filePath, 'utf-8');
  const original = content;
  let fileReplacements = 0;

  for (const [localPrefix, cloudPrefix] of Object.entries(FOLDER_MAP)) {
    // Remplace toutes les occurrences (avec guillemets simples ou doubles)
    const escapedPrefix = localPrefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escapedPrefix, 'g');
    const matches = content.match(regex);
    if (matches) {
      fileReplacements += matches.length;
      content = content.replace(regex, cloudPrefix);
    }
  }

  if (content !== original) {
    writeFileSync(filePath, content, 'utf-8');
    modifiedFiles++;
    totalReplacements += fileReplacements;
    console.log(`✅ ${filePath} — ${fileReplacements} remplacement(s)`);
  } else {
    console.log(`⏭️  ${filePath} — aucun changement`);
  }
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
      replaceInFile(fullPath);
    }
  }
}

function main() {
  console.log('🔄 Remplacement des URLs locales par Cloudinary...\n');
  console.log(`📂 Dossier traité : ${DATA_DIR}`);
  console.log(`☁️  Cloud : ${CLOUD_NAME}\n`);

  processDir(DATA_DIR);

  console.log('\n============================================================');
  console.log(`📄 Fichiers analysés   : ${totalFiles}`);
  console.log(`✏️  Fichiers modifiés   : ${modifiedFiles}`);
  console.log(`🔁 Remplacements total : ${totalReplacements}`);
  console.log('============================================================');

  if (totalReplacements === 0) {
    console.log('\n⚠️  Aucun remplacement effectué.');
    console.log('   Vérifie que tes chemins commencent bien par /sac/, /vetement_femme/, etc.');
  } else {
    console.log('\n✅ Terminé ! Lance maintenant :');
    console.log('   git add src/data/');
    console.log('   git commit -m "fix: use Cloudinary URLs for all images"');
    console.log('   git push');
  }
}

main();
