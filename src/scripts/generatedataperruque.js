import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const projectRoot = path.resolve(__dirname, '..', '..')
const imagesDir = path.join(projectRoot, 'public', 'perruque')
const outFile = path.join(projectRoot, 'src', 'data', 'perruque.js')

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function capitalizeWords(s) {
  return s.replace(/\b\w/g, (c) => c.toUpperCase())
}

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function pickRandom(arr, n = 1) {
  const shuffled = arr.slice().sort(() => 0.5 - Math.random())
  return n === 1 ? shuffled[0] : shuffled.slice(0, n)
}

// ══════════════════════════════════════════════════════════════════════════════
//  ⚙  INTERVALLES DE PRIX ET QUANTITÉ MINIMALE — MODIFIER ICI
//
//  priceMin / priceMax : fourchette de prix en FCFA (tirage aléatoire)
//  moMin    / moMax    : fourchette de quantité minimale de commande
// ══════════════════════════════════════════════════════════════════════════════

const CATEGORY_CONFIG = {
  courte: {
    label: 'Perruque Courte',
    priceMin: 3000,
    priceMax: 9000,
    moMin: 2,
    moMax: 5,
    tags: ['perruque', 'courte', 'pixie', 'cheveux', 'coiffure', 'court'],
    descriptions: [
      'Perruque courte tendance, légère et facile à porter au quotidien.',
      'Perruque courte style pixie, pour un look moderne et affirmé.',
      'Coiffure courte naturelle, confort et élégance réunis.',
      'Perruque courte de qualité, pour un style chic et décontracté.',
      'Perruque courte avec un fini naturel, idéale pour un quotidien actif.',
    ],
  },
  longue: {
    label: 'Perruque Longue',
    priceMin: 5000,
    priceMax: 16000,
    moMin: 2,
    moMax: 5,
    tags: ['perruque', 'longue', 'cheveux', 'coiffure', 'naturel', 'femme'],
    descriptions: [
      'Perruque longue naturelle, volume et brillance pour un look glamour.',
      'Perruque longue tendance, pour un style élégant et féminin.',
      'Grande perruque longue de qualité, pour compléter votre look.',
      'Perruque longue soyeuse, légèreté et confort garantis.',
      'Perruque longue à l\'aspect naturel, parfaite pour toutes les occasions.',
    ],
  },
  bresilienne: {
    label: 'Perruque Brésilienne',
    priceMin: 10000,
    priceMax: 30000,
    moMin: 1,
    moMax: 3,
    tags: ['perruque', 'brésilienne', 'bresilienne', 'cheveux', 'naturel', 'premium', 'brésil'],
    descriptions: [
      'Perruque brésilienne de haute qualité, volume et brillance naturels.',
      'Perruque 100% brésilienne, douceur et résistance exceptionnelles.',
      'Cheveux brésiliens premium, pour un look naturel et luxueux.',
      'Perruque brésilienne authentique, souplesse et longévité garanties.',
      'Perruque brésilienne dense et soyeuse, l\'excellence capillaire à votre portée.',
    ],
  },
}

// ─── INFÉRENCE DE CATÉGORIE ────────────────────────────────────────────────
//
//  Priorité : brésilienne > courte > longue (par défaut)
//  Un produit peut être brésilienne ET court → brésilienne prime

function inferCategory(name) {
  // Normaliser : minuscule + supprimer accents pour une comparaison robuste
  const ln = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

  // Brésilienne prime sur toutes les autres catégories
  if (
    ln.includes('bresilienne') ||
    ln.includes('bresilien') ||
    ln.includes('bresil')
  ) return 'bresilienne'

  // Courte : court / courte / courts / courtes / pixie / pixies
  if (
    /\bcourtes?\b/.test(ln) ||
    /\bcourts?\b/.test(ln) ||
    /\bpixies?\b/.test(ln)
  ) return 'courte'

  // Tout le reste → longue
  return 'longue'
}

// ─── EXTRACTION DES TAILLES EN POUCES ────────────────────────────────────
//
//  Cas couverts (insensible à la casse) :
//    1. Taille unique   → "14 pouces" ou "14 pouce"         → ["14 pouces"]
//    2. Intervalle tiret → "8-12 pouces"                    → ["8 pouces","10 pouces","12 pouces"]
//    3. Intervalle mot   → "8 a 12 pouces" / "8 à 12 pouces"→ idem
//    4. Aucune taille + courte                              → 8 à 14 pouces (pas de 2)
//    5. Aucune taille + longue/brésilienne                  → 12 à 34 pouces (pas de 2)

function buildRange(min, max) {
  const sizes = []
  for (let i = min; i <= max; i += 2) sizes.push(`${i} pouces`)
  return sizes
}

function getSizes(name, category) {
  const ln = name.toLowerCase()

  // Intervalle avec tiret : "8-12 pouces"
  const rangeHyphen = ln.match(/(\d+)\s*-\s*(\d+)\s*pouces?/)
  if (rangeHyphen) {
    return buildRange(parseInt(rangeHyphen[1]), parseInt(rangeHyphen[2]))
  }

  // Intervalle avec "a" ou "à" : "8 a 12 pouces" / "8 à 12 pouces"
  // On évite de capturer "1 a 2" isolés sans le mot pouces juste après
  const rangeWord = ln.match(/(\d+)\s*[aà]\s*(\d+)\s*pouces?/)
  if (rangeWord) {
    return buildRange(parseInt(rangeWord[1]), parseInt(rangeWord[2]))
  }

  // Taille unique : "14 pouces" / "14 pouce"
  const single = ln.match(/(\d+)\s*pouces?/)
  if (single) {
    return [`${single[1]} pouces`]
  }

  // Aucune taille explicite → défaut selon catégorie
  if (category === 'courte') return buildRange(8, 14)
  return buildRange(12, 34) // longue & brésilienne
}

// ─── NETTOYAGE DU NOM ─────────────────────────────────────────────────────

function cleanNameFromFilename(filename) {
  let name = filename

  // Supprimer l'extension
  name = name.replace(/\.[a-zA-Z0-9]+$/, '')

  // Supprimer suffixes de résolution (-800x600)
  name = name.replace(/-\d{1,4}x\d{1,4}$/, '')

  // Supprimer suffixes numériques finaux isolés (-2, _3…)
  name = name.replace(/[-_]\d+$/, '')

  // Remplacer tirets et underscores par des espaces
  name = name.replace(/[-_]+/g, ' ')

  // Supprimer le préfixe "A" majuscule utilisé par convention dans les noms de fichiers
  // ex: "Aperruque_courte" → "perruque courte"
  name = name.replace(/^[aA](?=[A-Za-zÀ-öø-ÿ])/, '')

  // Supprimer les suffixes numérotés entre parenthèses : (1), (2), (12)…
  name = name.replace(/\s*\(\d+\)\s*$/, '')

  // Nettoyer les espaces multiples
  name = name.replace(/\s+/g, ' ').trim()

  // Nom générique pour les fichiers IMG / WhatsApp / photo
  if (/^(img|IMG|WhatsApp|photo)/i.test(filename)) {
    return 'Perruque'
  }

  return capitalizeWords(name)
}

// ─── CONSTRUCTION D'UN PRODUIT ────────────────────────────────────────────

function buildProduct(id, dir, files) {
  const first = files[0]
  const name = cleanNameFromFilename(first)
  const category = inferCategory(name)
  const config = CATEGORY_CONFIG[category]

  const price = rand(config.priceMin, config.priceMax)
  const originalPrice = price + rand(500, 2500)
  const minOrder = rand(config.moMin, config.moMax)
  const description = pickRandom(config.descriptions)
  const tags = [...config.tags]
  const taxType = Math.random() > 0.5 ? 'ttc' : 'ht'

  const images = files.map(f => `/perruque/${dir}/${f.replace(/%/g, '%25').replace(/#/g, '%23')}`)
  const image = images[0]

  const sizes = getSizes(name, category)

  return {
    id,
    name,
    category,
    categoryLabel: config.label,
    description,
    price,
    originalPrice,
    taxType,
    gender: 'femme',
    tags,
    sizes,      // tailles en pouces
    minOrder,
    image,
    images,
  }
}

// ─── GÉNÉRATION ──────────────────────────────────────────────────────────────

function generate() {
  if (!fs.existsSync(imagesDir)) {
    console.error(`\n✗ Dossier introuvable : ${imagesDir}`)
    console.error('  → Crée le dossier public/perruque/ et place-y les sous-dossiers numérotés.\n')
    process.exit(1)
  }

  const entries = fs.readdirSync(imagesDir)
    .filter(d => fs.statSync(path.join(imagesDir, d)).isDirectory())
    .sort((a, b) => {
      const na = Number(a), nb = Number(b)
      if (!isNaN(na) && !isNaN(nb)) return na - nb
      return a.localeCompare(b)
    })

  const products = []
  const stats = {}
  let idCounter = 1

  for (const dir of entries) {
    const dirFull = path.join(imagesDir, dir)
    let files = fs.readdirSync(dirFull).filter(f => !f.startsWith('.'))
    if (files.length === 0) continue

    // Renommer les fichiers dont le nom contient des caractères problématiques dans les URL
    files = files.map(f => {
      if (!f.includes('#')) return f
      const cleaned = f.replace(/\s*#\s*/g, ' ').replace(/ {2,}/g, ' ').trim()
      if (cleaned !== f) {
        try { fs.renameSync(path.join(dirFull, f), path.join(dirFull, cleaned)) } catch {}
      }
      return cleaned
    })

    // Image principale = fichier SANS (N) en fin de nom → en premier
    files.sort((a, b) => {
      const aHasNum = /\(\d+\)\s*\.[^.]+$/.test(a)
      const bHasNum = /\(\d+\)\s*\.[^.]+$/.test(b)
      if (!aHasNum && bHasNum) return -1
      if (aHasNum && !bHasNum) return 1
      return a.localeCompare(b)
    })

    const prod = buildProduct(idCounter, dir, files)
    products.push(prod)
    stats[prod.category] = (stats[prod.category] || 0) + 1
    idCounter++
  }

  const out = `export const perruque = ${JSON.stringify(products, null, 2)}\n`
  fs.writeFileSync(outFile, out, 'utf8')

  console.log(`\n✓ ${products.length} produits écrits dans ${outFile}`)
  console.log('\nRépartition par catégorie :')
  Object.entries(stats)
    .sort((a, b) => b[1] - a[1])
    .forEach(([cat, count]) => {
      const label = (CATEGORY_CONFIG[cat] || {}).label || cat
      console.log(`  ${label.padEnd(26)} ${String(count).padStart(3)} produit(s)`)
    })

  // Récapitulatif des tailles générées (échantillon du premier produit de chaque catégorie)
  console.log('\nExemple de tailles générées par catégorie :')
  const seen = new Set()
  for (const p of products) {
    if (!seen.has(p.category)) {
      seen.add(p.category)
      const config = CATEGORY_CONFIG[p.category]
      console.log(`  ${config.label} → [${p.sizes.join(', ')}]`)
    }
  }
}

generate()
