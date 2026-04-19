// ============================================================
// sync-cloudinary-v2.mjs — Récupère les vraies URLs Cloudinary
// et met à jour tous les fichiers dans src/data/
// Gère les fichiers renommés par Cloudinary via le champ original_filename
// Usage : node sync-cloudinary-v2.mjs
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

// 📁 Dossiers Cloudinary à scanner
const CLOUD_FOLDERS = [
  'bannier',
  'bijou',
  'chaussure',
  'images',
  'logo',
  'payement',
  'perruque',
  'sac',
  'sac_femme',
  'telephone_accessoires',
  'vetement_enfant',
  'vetement_femme',
  'vetement_homme',
];

// Récupère toutes les ressources d'un dossier Cloudinary (avec pagination)
async function getAllResources(folder) {
  let resources = [];
  let nextCursor = null;

  do {
    const params = {
      type: 'upload',
      prefix: folder + '/',
      max_results: 500,
      // Important : récupère aussi le nom original du fichier
      context: true,
    };
    if (nextCursor) params.next_cursor = nextCursor;

    const result = await cloudinary.api.resources(params);
    resources = resources.concat(result.resources);
    nextCursor = result.next_cursor;
  } while (nextCursor);

  return resources;
}

// Construit une map : "nom_original_sans_extension" → "url_cloudinary"
function buildNameMap(resources) {
  const map = {};

  for (const r of resources) {
    const url = r.secure_url;
    const publicId = r.public_id; // ex: "perruque/1/n7pupveepa9gxighjk0r"

    // Clé 1 : public_id complet (cas où le nom est gardé)
    // ex: "sac/134/sac_a_dos_enfant165"
    map[publicId] = url;

    // Clé 2 : nom du fichier seul (dernier segment du public_id)
    const cloudFileName = publicId.split('/').pop();
    map[cloudFileName] = url;

    // Clé 3 : original_filename (nom avant renommage par Cloudinary)
    // C'est la clé principale pour les fichiers renommés
    if (r.original_filename) {
      map[r.original_filename] = url;

      // Clé 4 : dossier + original_filename (pour éviter les collisions)
      const parts = publicId.split('/');
      parts.pop(); // retire le nom cloudinary
      const folderPath = parts.join('/');
      map[`${folderPath}/${r.original_filename}`] = url;
    }
  }

  return map;
}

// Remplace les chemins locaux dans le contenu d'un fichier
function replaceUrls(content, urlMap) {
  let result = content;
  let count = 0;

  // Regex qui capture les chemins d'images locaux entre guillemets
  const regex = /["'](\/(?:bannier|bijou|chaussure|images|logo|payement|perruque|sac(?:_femme| femme)?|telephone_accessoires|vetement_enfant|vetement_femme|vetement_homme)\/[^"']+\.[a-zA-Z]+)["']/g;

  result = result.replace(regex, (match, localPath) => {
    const quote = match[0];

    // Normalise le chemin local
    const normalized = localPath
      .replace(/^\//, '')              // retire le slash initial
      .replace(/\.[^.]+$/, '')         // retire l'extension
      .replace(/sac femme/g, 'sac_femme'); // normalise le nom

    // Tentative 1 : public_id complet normalisé
    if (urlMap[normalized]) {
      count++;
      return `${quote}${urlMap[normalized]}${quote}`;
    }

    // Tentative 2 : nom de fichier seul (original_filename)
    const fileName = normalized.split('/').pop();
    if (urlMap[fileName]) {
      count++;
      return `${quote}${urlMap[fileName]}${quote}`;
    }

    // Tentative 3 : dossier + nom fichier
    const parts = normalized.split('/');
    if (parts.length >= 2) {
      const folderAndFile = parts.slice(0, -1).join('/') + '/' + fileName;
      if (urlMap[folderAndFile]) {
        count++;
        return `${quote}${urlMap[folderAndFile]}${quote}`;
      }
    }

    // Non trouvé → laisse tel quel
    return match;
  });

  return { result, count };
}

async function main() {
  console.log('☁️  Connexion à Cloudinary...\n');

  // Étape 1 : Récupère toutes les URLs depuis Cloudinary
  console.log('📥 Récupération des ressources depuis Cloudinary...');
  const urlMap = {};
  let totalImages = 0;

  for (const folder of CLOUD_FOLDERS) {
    process.stdout.write(`   Scan: ${folder}... `);
    try {
      const resources = await getAllResources(folder);
      const folderMap = buildNameMap(resources);
      Object.assign(urlMap, folderMap);
      totalImages += resources.length;
      console.log(`${resources.length} images`);
    } catch (err) {
      console.log(`❌ Erreur: ${err.message}`);
    }
  }

  console.log(`\n✅ Total: ${totalImages} images indexées (${Object.keys(urlMap).length} clés de recherche)\n`);

  // Étape 2 : Remplace dans tous les fichiers de src/data/
  console.log('🔄 Mise à jour des fichiers dans src/data/...\n');

  let totalFiles = 0;
  let modifiedFiles = 0;
  let totalReplacements = 0;
  let notFound = [];

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
        const { result, count } = replaceUrls(content, urlMap);

        if (count > 0) {
          writeFileSync(fullPath, result, 'utf-8');
          modifiedFiles++;
          totalReplacements += count;
          console.log(`✅ ${fullPath} — ${count} remplacement(s)`);
        } else {
          // Vérifie s'il reste des chemins locaux non remplacés
          const remaining = content.match(/["'](\/(?:perruque|sac|chaussure|vetement_femme|vetement_homme|vetement_enfant|bijou|telephone_accessoires)[^"']+)["']/g);
          if (remaining && remaining.length > 0) {
            notFound.push({ file: fullPath, examples: remaining.slice(0, 3) });
            console.log(`⚠️  ${fullPath} — ${remaining.length} chemins non remplacés`);
          } else {
            console.log(`⏭️  ${fullPath} — aucun changement`);
          }
        }
      }
    }
  }

  processDir('src/data');

  // Résumé
  console.log('\n============================================================');
  console.log(`📄 Fichiers analysés   : ${totalFiles}`);
  console.log(`✏️  Fichiers modifiés   : ${modifiedFiles}`);
  console.log(`🔁 Remplacements total : ${totalReplacements}`);
  console.log('============================================================');

  if (notFound.length > 0) {
    console.log('\n⚠️  Chemins non trouvés sur Cloudinary :');
    notFound.forEach(({ file, examples }) => {
      console.log(`\n   📄 ${file}`);
      examples.forEach(e => console.log(`      ${e}`));
    });
    console.log('\n   Ces images n\'ont peut-être pas été uploadées sur Cloudinary.');
    console.log('   Relance upload.mjs pour les dossiers manquants.\n');
  }

  if (totalReplacements > 0) {
    console.log('\n🎉 Terminé ! Lance maintenant :');
    console.log('   git add src/data/');
    console.log('   git commit -m "fix: use real Cloudinary URLs for all images"');
    console.log('   git push\n');
  }
}

main().catch(console.error);
