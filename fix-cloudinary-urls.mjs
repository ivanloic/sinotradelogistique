// ============================================================
// fix-cloudinary-urls.mjs — Remplace les URLs Cloudinary cassées
// par les vraies URLs récupérées depuis l'API Cloudinary
// Usage : node fix-cloudinary-urls.mjs
// ============================================================

import { v2 as cloudinary } from 'cloudinary';
import { readdirSync, readFileSync, writeFileSync, statSync } from 'fs';
import { join, extname } from 'path';

// 🔑 Tes clés Cloudinary
cloudinary.config({
  cloud_name: 'deuttziac',
  api_key: '732393772858198',
  api_secret: 'p4MJ7lYtGwtt8yWthTQFUuiierU',
});

const CLOUD_FOLDERS = [
  'bannier', 'bijou', 'chaussure', 'images', 'logo', 'payement',
  'perruque', 'sac', 'sac_femme', 'telephone_accessoires',
  'vetement_enfant', 'vetement_femme', 'vetement_homme',
];

// Récupère toutes les ressources avec pagination
async function getAllResources(folder) {
  let resources = [];
  let nextCursor = null;
  do {
    const params = { type: 'upload', prefix: folder + '/', max_results: 500, context: true };
    if (nextCursor) params.next_cursor = nextCursor;
    const result = await cloudinary.api.resources(params);
    resources = resources.concat(result.resources);
    nextCursor = result.next_cursor;
  } while (nextCursor);
  return resources;
}

// Construit une map :
// "original_filename_sans_extension" → "secure_url"
// "dossier/original_filename_sans_extension" → "secure_url"
function buildMap(resources) {
  const map = {};
  for (const r of resources) {
    const url = r.secure_url;
    const publicId = r.public_id; // ex: "perruque/1/n7pupveepa9gxighjk0r"

    // Clé par public_id complet
    map[publicId] = url;

    // Clé par original_filename (nom avant renommage Cloudinary)
    if (r.original_filename) {
      const orig = r.original_filename; // sans extension
      map[orig] = url;

      // Clé : dossier/sous-dossier/original_filename
      const parts = publicId.split('/');
      parts.pop();
      map[`${parts.join('/')}/${orig}`] = url;
    }
  }
  return map;
}

// Extrait le "nom" d'une URL Cloudinary cassée
// ex: "https://res.cloudinary.com/.../perruque/1/Mon fichier spécial.webp"
// → "perruque/1/Mon fichier spécial" (sans extension)
function extractKeyFromUrl(url) {
  try {
    // Retire le préfixe Cloudinary
    const prefix = `https://res.cloudinary.com/deuttziac/image/upload/`;
    let path = url.startsWith(prefix) ? url.slice(prefix.length) : url;

    // Retire la version si présente ex: v1776589710/
    path = path.replace(/^v\d+\//, '');

    // Retire l'extension
    path = path.replace(/\.[^.]+$/, '');

    return path; // ex: "perruque/1/Mon fichier spécial"
  } catch {
    return null;
  }
}

// Remplace toutes les URLs Cloudinary cassées dans le contenu
function fixUrls(content, urlMap) {
  let result = content;
  let count = 0;
  let notFound = new Set();

  // Capture toutes les URLs Cloudinary entre guillemets
  const regex = /["'](https:\/\/res\.cloudinary\.com\/deuttziac\/image\/upload\/[^"']+)["']/g;

  result = result.replace(regex, (match, url) => {
    const quote = match[0];

    // Si l'URL contient des espaces ou caractères spéciaux → cassée
    const hasProblem = /[ àâäéèêëîïôöùûüçÀÂÄÉÈÊËÎÏÔÖÙÛÜÇ()\[\]{}|\\^`<>]/.test(url)
      || url !== encodeURI(decodeURIComponent(url)).replace(/%20/g, ' ');

    if (!hasProblem) return match; // URL propre, on laisse

    // Extrait la clé de recherche depuis l'URL cassée
    const key = extractKeyFromUrl(url);
    if (!key) return match;

    // Cherche dans la map par clé complète
    if (urlMap[key]) {
      count++;
      return `${quote}${urlMap[key]}${quote}`;
    }

    // Cherche par nom de fichier seul
    const fileName = key.split('/').pop();
    if (urlMap[fileName]) {
      count++;
      return `${quote}${urlMap[fileName]}${quote}`;
    }

    notFound.add(key);
    return match;
  });

  return { result, count, notFound: [...notFound] };
}

async function main() {
  console.log('☁️  Connexion à Cloudinary...\n');
  console.log('📥 Récupération des ressources depuis Cloudinary...');

  const urlMap = {};
  let totalImages = 0;

  for (const folder of CLOUD_FOLDERS) {
    process.stdout.write(`   Scan: ${folder}... `);
    try {
      const resources = await getAllResources(folder);
      Object.assign(urlMap, buildMap(resources));
      totalImages += resources.length;
      console.log(`${resources.length} images`);
    } catch (err) {
      console.log(`❌ Erreur: ${err.message}`);
    }
  }

  console.log(`\n✅ ${totalImages} images indexées (${Object.keys(urlMap).length} clés)\n`);
  console.log('🔄 Correction des fichiers dans src/data/...\n');

  let totalFiles = 0, modifiedFiles = 0, totalReplacements = 0;
  const allNotFound = [];

  function processDir(dirPath) {
    for (const item of readdirSync(dirPath)) {
      const fullPath = join(dirPath, item);
      if (statSync(fullPath).isDirectory()) {
        processDir(fullPath);
      } else if (['.js', '.ts', '.jsx', '.tsx', '.json'].includes(extname(item))) {
        totalFiles++;
        const content = readFileSync(fullPath, 'utf-8');
        const { result, count, notFound } = fixUrls(content, urlMap);

        if (count > 0) {
          writeFileSync(fullPath, result, 'utf-8');
          modifiedFiles++;
          totalReplacements += count;
          console.log(`✅ ${fullPath} — ${count} correction(s)`);
        } else {
          console.log(`⏭️  ${fullPath} — aucun problème détecté`);
        }

        if (notFound.length > 0) {
          allNotFound.push({ file: fullPath, keys: notFound.slice(0, 3) });
        }
      }
    }
  }

  processDir('src/data');

  console.log('\n============================================================');
  console.log(`📄 Fichiers analysés   : ${totalFiles}`);
  console.log(`✏️  Fichiers corrigés   : ${modifiedFiles}`);
  console.log(`🔁 Corrections total   : ${totalReplacements}`);
  console.log('============================================================');

  if (allNotFound.length > 0) {
    console.log('\n⚠️  Fichiers non trouvés sur Cloudinary (non uploadés ?) :');
    allNotFound.forEach(({ file, keys }) => {
      console.log(`\n   📄 ${file}`);
      keys.forEach(k => console.log(`      → ${k}`));
    });
  }

  if (totalReplacements > 0) {
    console.log('\n🎉 Terminé ! Lance maintenant :');
    console.log('   git add src/data/');
    console.log('   git commit -m "fix: replace broken Cloudinary URLs with real URLs"');
    console.log('   git push\n');
  } else {
    console.log('\n💡 Aucune URL cassée détectée.');
    console.log('   Si des images ne s\'affichent pas, vérifie qu\'elles sont bien uploadées sur Cloudinary.\n');
  }
}

main().catch(console.error);
