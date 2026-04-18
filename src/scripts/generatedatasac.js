import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const projectRoot = path.resolve(__dirname, '..', '..')
const imagesDir = path.join(projectRoot, 'public', 'sac femme')
const outFile = path.join(projectRoot, 'src', 'data', 'sac_femme.js')

// ─── HELPERS ──────────────────────────────────────────────────────────────────

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

const INTERVALS = {
  sac_a_main:      { priceMin: 3_000,   priceMax: 6_000,  moMin: 1, moMax: 3  },
  sac_bandouliere: { priceMin: 1_500,   priceMax: 3_000,  moMin: 1, moMax: 3  },
  sac_a_dos:       { priceMin: 10_000,  priceMax: 60_000,  moMin: 1, moMax: 2  },
  sac_soiree:      { priceMin: 12_000,  priceMax: 70_000,  moMin: 1, moMax: 2  },
  sac_sport:       { priceMin: 3_000,   priceMax: 7_000,  moMin: 1, moMax: 3  },
  portefeuille:    { priceMin: 2_000,   priceMax: 3_000,  moMin: 2, moMax: 10 },
  pochette:        { priceMin: 3_000,   priceMax: 20_000,  moMin: 2, moMax: 10 },
  sac_voyage:      { priceMin: 4_000,  priceMax: 6_500,  moMin: 1, moMax: 2  },
}

// ─── CONFIGURATION PAR CATÉGORIE ──────────────────────────────────────────────

const CATEGORY_CONFIG = {
  sac_a_main: {
    label: 'Sac à Main',
    ...INTERVALS.sac_a_main,
    tags: ['sac à main', 'sac femme', 'main', 'feminin', 'accessoire'],
  },
  sac_bandouliere: {
    label: 'Sac Bandoulière',
    ...INTERVALS.sac_bandouliere,
    tags: ['sac bandoulière', 'bandoulière', 'sac femme', 'crossbody', 'accessoire'],
  },
  sac_a_dos: {
    label: 'Sac à Dos',
    ...INTERVALS.sac_a_dos,
    tags: ['sac à dos', 'backpack', 'sac femme', 'voyage', 'quotidien'],
  },
  sac_soiree: {
    label: 'Sac de Soirée',
    ...INTERVALS.sac_soiree,
    tags: ['sac de soirée', 'clutch', 'élégant', 'soirée', 'mariage'],
  },
  sac_sport: {
    label: 'Sac de Sport',
    ...INTERVALS.sac_sport,
    tags: ['sac de sport', 'gym', 'sport', 'fitness', 'portable'],
  },
  portefeuille: {
    label: 'Portefeuille',
    ...INTERVALS.portefeuille,
    tags: ['portefeuille', 'porte-monnaie', 'accessoire', 'femme', 'cuir'],
  },
  pochette: {
    label: 'Pochette',
    ...INTERVALS.pochette,
    tags: ['pochette', 'petit sac', 'accessoire', 'portable', 'quotidien'],
  },
  sac_voyage: {
    label: 'Sac de Voyage',
    ...INTERVALS.sac_voyage,
    tags: ['sac de voyage', 'tote bag', 'voyage', 'grand format', 'transport'],
  },
}

// ══════════════════════════════════════════════════════════════════════════════
//  INFÉRENCE DE CATÉGORIE
// ══════════════════════════════════════════════════════════════════════════════

function inferCategory(name) {
  const ln = name.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

  // Sacs de soirée (en priorité)
  if (
    ln.includes('soiree') || ln.includes('soirée') || ln.includes('ceremonie') ||
    ln.includes('mariage') || ln.includes('clutch') || ln.includes('evening') ||
    ln.includes('gala')
  ) return 'sac_soiree'

  // Sacs de voyage (gros sacs, tote)
  if (
    ln.includes('voyage') || ln.includes('tote') || ln.includes('grand') ||
    ln.includes('oversize') || ln.includes('large') || ln.includes('traveller')
  ) return 'sac_voyage'

  // Sacs de sport / gym
  if (
    ln.includes('sport') || ln.includes('gym') || ln.includes('fitness') ||
    ln.includes('training') || ln.includes('duffel') || ln.includes('holdall')
  ) return 'sac_sport'

  // Sacs à dos
  if (
    ln.includes('sac a dos') || ln.includes('sac à dos') || ln.includes('backpack') ||
    ln.includes('rucksack') || ln.includes('dos')
  ) return 'sac_a_dos'

  // Sacs bandoulière / crossbody
  if (
    ln.includes('bandouliere') || ln.includes('bandoulière') ||
    ln.includes('crossbody') || ln.includes('cross body')
  ) return 'sac_bandouliere'

  // Portefeuilles
  if (
    ln.includes('portefeuille') || ln.includes('wallet') ||
    ln.includes('porte-monnaie') || ln.includes('porte monnaie')
  ) return 'portefeuille'

  // Pochettes
  if (
    ln.includes('pochette') || ln.includes('pouch') ||
    ln.includes('petit sac') || ln.includes('minaudiere') ||
    (ln.includes('sac') && (ln.includes('petit') || ln.includes('mini')))
  ) return 'pochette'

  // Sacs à main (par défaut pour "sac")
  if (ln.includes('sac') || ln.includes('handbag') || ln.includes('bag')) {
    return 'sac_a_main'
  }

  return 'sac_a_main'
}

// ══════════════════════════════════════════════════════════════════════════════
//  EXTRACTION DES SPÉCIFICATIONS — SACS FEMME
// ══════════════════════════════════════════════════════════════════════════════

function extractBagSpecs(name) {
  const specs = {}
  const ln = name.toLowerCase()

  // Matériau principal
  const materials = []
  if (ln.includes('cuir veritable') || ln.includes('cuir véritable') || ln.includes('genuine leather')) {
    materials.push('Cuir véritable')
  } else if (ln.includes('cuir')) {
    materials.push('Cuir')
  }
  if (ln.includes('synthetique') || ln.includes('synthétique') || ln.includes('synthetic')) {
    materials.push('Synthétique')
  }
  if (ln.includes('toile') || ln.includes('canvas')) {
    materials.push('Toile')
  }
  if (ln.includes('velours') || ln.includes('velvet')) {
    materials.push('Velours')
  }
  if (ln.includes('daim') || ln.includes('suede')) {
    materials.push('Daim')
  }
  if (ln.includes('coton') || ln.includes('cotton')) {
    materials.push('Coton')
  }
  if (ln.includes('lin') || ln.includes('linen')) {
    materials.push('Lin')
  }
  if (ln.includes('paille') || ln.includes('straw')) {
    materials.push('Paille')
  }
  if (materials.length) specs.materiau = materials.join(', ')

  // Type de fermeture
  if (ln.includes('fermeture zip') || ln.includes('zip') || ln.includes('zipper')) {
    specs.fermeture = 'Fermeture éclair'
  } else if (ln.includes('magnetique') || ln.includes('magnétique') || ln.includes('magnetic snap')) {
    specs.fermeture = 'Magnétique'
  } else if (ln.includes('bouton') || ln.includes('button')) {
    specs.fermeture = 'Bouton'
  } else if (ln.includes('scratch') || ln.includes('velcro')) {
    specs.fermeture = 'Velcro'
  } else if (ln.includes('aimant')) {
    specs.fermeture = 'Aimant'
  }

  // Dimensions / Taille
  const sizeMatch = name.match(/(\d+)\s*x\s*(\d+)\s*x?\s*(\d+)?\s*(?:cm|MM|mm)/i)
  if (sizeMatch) {
    if (sizeMatch[3]) {
      specs.dimensions = `${sizeMatch[1]} × ${sizeMatch[2]} × ${sizeMatch[3]} cm`
    } else {
      specs.dimensions = `${sizeMatch[1]} × ${sizeMatch[2]} cm`
    }
  }

  // Capacité
  if (ln.includes('litre') || ln.includes('liter') || ln.includes('l')) {
    const capMatch = name.match(/(\d+(?:[.,]\d+)?)\s*l(?:itre|iter)?/i)
    if (capMatch) specs.capacite = `${capMatch[1]} L`
  }

  // Doublure
  if (ln.includes('doublure') || ln.includes('lining')) {
    specs.doublure = 'Oui'
  }

  // Nombre de compartiments
  const compartMatch = name.match(/(\d+)\s*compartiment/i)
  if (compartMatch) {
    specs.compartiments = `${compartMatch[1]} compartiment(s)`
  }

  // Poches
  if (ln.includes('poche') || ln.includes('pocket')) {
    specs.poches = 'Oui'
  }

  // Sangle réglable
  if (ln.includes('reglable') || ln.includes('réglable') || ln.includes('adjustable')) {
    specs.sangle_reglable = 'Oui'
  }

  // Doublure amovible
  if (ln.includes('doublure amovible') || ln.includes('amovible') || ln.includes('removable')) {
    specs.doublure_amovible = 'Oui'
  }

  // Étanchéité
  if (ln.includes('etanche') || ln.includes('étanche') || ln.includes('waterproof')) {
    specs.etancheite = 'Étanche'
  }

  // Poignées
  if (ln.includes('poignee courte') || ln.includes('poignée courte') || ln.includes('short handle')) {
    specs.poignee = 'Courte'
  } else if (ln.includes('poignee longue') || ln.includes('poignée longue') || ln.includes('long handle')) {
    specs.poignee = 'Longue'
  }

  // État
  const stat = name.toLowerCase()
  if (stat.includes('occasion') || stat.includes('seconde main')) {
    specs.etat = 'Occasion'
  } else if (stat.includes('reconditionn')) {
    specs.etat = 'Reconditionné'
  } else {
    specs.etat = 'Neuf'
  }

  return specs
}

// ══════════════════════════════════════════════════════════════════════════════
//  EXTRACTION SPECS SELON LA CATÉGORIE
// ══════════════════════════════════════════════════════════════════════════════

function buildSpecifications(category, name) {
  // Tous les sacs utilisent la même fonction d'extraction
  return extractBagSpecs(name)
}

// ─── INFÉRENCE DE MARQUE ──────────────────────────────────────────────────────

const KNOWN_BRANDS = [
  'gucci', 'louis vuitton', 'dior', 'chanel', 'hermes', 'prada', 'fendi',
  'balenciaga', 'celine', 'loewe', 'longchamp', 'goyard', 'bottega veneta',
  'coach', 'michael kors', 'kate spade', 'fossil', 'tommy hilfiger',
  'calvin klein', 'gap', 'zara', 'mango', 'h&m', 'forever 21',
  'desigual', 'guess', 'aldo', 'clarks', 'timberland',
  'samsonite', 'delsey', 'american tourister',
  'lacoste', 'polo', 'esprit', 'diesel',
  'apple', 'samsung', 'sony',
]

function inferBrand(name) {
  const ln = name.toLowerCase()
  for (const brand of KNOWN_BRANDS) {
    if (ln.includes(brand)) return capitalizeWords(brand)
  }
  // Essai sur premier mot
  const firstWord = ln.split(/[\s\-_]+/)[0]
  if (firstWord && firstWord.length > 2 && !/^(le|la|les|un|une|des|nouveau|nouvelle|mini|grand|sac)$/.test(firstWord)) {
    return capitalizeWords(firstWord)
  }
  return 'Various'
}

// ─── COULEURS ──────────────────────────────────────────────────────────────────

const ALL_COLORS = [
  'Noir', 'Blanc', 'Bleu', 'Rouge', 'Vert', 'Jaune', 'Gris', 'Rose',
  'Marron', 'Orange', 'Violet', 'Beige', 'Argent', 'Or', 'Nude',
  'Camel', 'Bordeaux', 'Kaki', 'Taupe', 'Crème',
]

const COLOR_KEYWORDS = [
  'noir', 'blanc', 'bleu', 'rouge', 'vert', 'jaune', 'gris', 'rose',
  'marron', 'orange', 'violet', 'beige', 'argent', 'or', 'nude',
  'camel', 'bordeaux', 'kaki', 'taupe', 'creme', 'crème',
  'black', 'white', 'blue', 'red', 'green', 'gold', 'silver',
  'tan', 'brown', 'pink', 'purple', 'gray', 'grey',
]

const COLOR_MAP = {
  black: 'Noir', white: 'Blanc', blue: 'Bleu', red: 'Rouge',
  green: 'Vert', gold: 'Or', silver: 'Argent', tan: 'Camel',
  brown: 'Marron', pink: 'Rose', purple: 'Violet',
  gray: 'Gris', grey: 'Gris', orange: 'Orange', yellow: 'Jaune',
  nude: 'Nude', taupe: 'Taupe', kaki: 'Kaki', crème: 'Crème', creme: 'Crème',
  burgundy: 'Bordeaux', maroon: 'Bordeaux',
}

function extractColors(name) {
  const ln = name.toLowerCase()
  const found = []
  for (const c of COLOR_KEYWORDS) {
    if (ln.includes(c)) {
      found.push(COLOR_MAP[c] || capitalizeWords(c))
    }
  }
  const base = Array.from(new Set(['Noir', 'Blanc', ...found]))
  const extras = ALL_COLORS.filter(c => !base.includes(c))
  return Array.from(new Set([...base, ...pickRandom(extras, 2)]))
}

// ─── NETTOYAGE DU NOM ─────────────────────────────────────────────────────────

function cleanNameFromFilename(filename) {
  let name = filename

  // Supprimer l'extension
  name = name.replace(/\.[a-zA-Z0-9]+$/, '')

  // Supprimer les suffixes numérotés entre parenthèses : (1), (2)…
  name = name.replace(/\s*\(\d+\)\s*$/, '')

  // Supprimer suffixes de résolution
  name = name.replace(/-\d{3,4}x\d{3,4}$/, '')

  // Nettoyer les espaces multiples
  name = name.replace(/\s+/g, ' ').trim()

  return name
}

// ─── CONSTRUCTION D'UN PRODUIT ─────────────────────────────────────────

function buildProduct(id, dir, files) {
  const first = files[0]
  const name = cleanNameFromFilename(first)
  const category = inferCategory(name)
  const config = CATEGORY_CONFIG[category] || CATEGORY_CONFIG.sac_a_main

  const price = rand(config.priceMin, config.priceMax)
  const originalPrice = price + rand(Math.floor(price * 0.05), Math.floor(price * 0.30))
  const minOrder = rand(config.moMin, config.moMax)
  const tags = [...config.tags]
  const taxType = Math.random() > 0.5 ? 'ttc' : 'ht'
  const brand = inferBrand(name)
  const colors = extractColors(name)
  const specifications = buildSpecifications(category, name)

  const images = files.map(f =>
    `/sac femme/${dir}/${f.replace(/%/g, '%25').replace(/#/g, '%23')}`
  )
  const image = images[0]

  return {
    id,
    name,
    category,
    categoryLabel: config.label,
    brand,
    price,
    originalPrice,
    taxType,
    tags,
    colors,
    minOrder,
    specifications,
    image,
    images,
  }
}

// ─── GÉNÉRATION ────────────────────────────────────────────────────────────────

function generate() {
  if (!fs.existsSync(imagesDir)) {
    console.error(`\n✗ Dossier introuvable : ${imagesDir}`)
    console.error('  → Crée le dossier public/sac/ et place-y les sous-dossiers numérotés.\n')
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

    // Nettoyer les '#' dans les noms de fichiers
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

  const out = `export const sac = ${JSON.stringify(products, null, 2)}\n`
  fs.writeFileSync(outFile, out, 'utf8')

  console.log(`\n✓ ${products.length} produits écrits dans ${outFile}`)
  console.log('\nRépartition par catégorie :')
  Object.entries(stats)
    .sort((a, b) => b[1] - a[1])
    .forEach(([cat, count]) => {
      const label = (CATEGORY_CONFIG[cat] || {}).label || cat
      console.log(`  ${label.padEnd(30)} ${String(count).padStart(3)} produit(s)`)
    })

  // Exemple de spécifications pour un produit de chaque catégorie
  console.log('\nExemple de spécifications générées par catégorie :')
  const seen = new Set()
  for (const p of products) {
    if (!seen.has(p.category)) {
      seen.add(p.category)
      const label = (CATEGORY_CONFIG[p.category] || {}).label || p.category
      const specKeys = Object.keys(p.specifications)
      console.log(`  [${label}] "${p.name.slice(0, 60)}..."`)
      console.log(`    → Specs: ${specKeys.join(', ') || '(aucune)'}`)
    }
  }
}

generate()
