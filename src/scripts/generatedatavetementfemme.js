import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const projectRoot = path.resolve(__dirname, '..', '..')
const imagesDir = path.join(projectRoot, 'public', 'vetement_femme')
const outFile = path.join(projectRoot, 'src', 'data', 'vetement_femme.js')

// ─── HELPERS ────────────────────────────────────────────────────────────────

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

// ══════════════════════════════════════════════════════════════════════════
//  ⚙  INTERVALLES DE PRIX ET QUANTITÉ MINIMALE — MODIFIER ICI
//
//  priceMin / priceMax : fourchette de prix en FCFA (tirage aléatoire)
//  moMin    / moMax    : fourchette de quantité minimale de commande
// ══════════════════════════════════════════════════════════════════════════

const INTERVALS = {
  robe:        { priceMin: 1800, priceMax: 4000, moMin: 3,  moMax: 8  },
  jupe:        { priceMin: 1200, priceMax: 3000, moMin: 5,  moMax: 10 },
  ensemble:    { priceMin: 2500, priceMax: 6500, moMin: 2,  moMax: 5  },
  combinaison: { priceMin: 2000, priceMax: 4500, moMin: 3,  moMax: 7  },
  blouse:      { priceMin: 1500, priceMax: 3000, moMin: 5,  moMax: 10 },
  tshirt:      { priceMin:  800, priceMax: 2000, moMin: 10, moMax: 20 },
  chemise:     { priceMin: 1200, priceMax: 2800, moMin: 5,  moMax: 12 },
  pantalon:    { priceMin: 1500, priceMax: 3500, moMin: 5,  moMax: 10 },
  jean:        { priceMin: 2000, priceMax: 4500, moMin: 3,  moMax: 8  },
  short:       { priceMin: 1000, priceMax: 2200, moMin: 8,  moMax: 15 },
  veste:       { priceMin: 2500, priceMax: 6000, moMin: 2,  moMax: 6  },
  manteau:     { priceMin: 3000, priceMax: 7000, moMin: 2,  moMax: 5  },
  sweat:       { priceMin: 1500, priceMax: 3500, moMin: 5,  moMax: 10 },
  lingerie:    { priceMin: 1000, priceMax: 2500, moMin: 5,  moMax: 12 },
  clothing:    { priceMin: 1500, priceMax: 3500, moMin: 5,  moMax: 10 },
}

// ─── CONFIGURATION PAR CATÉGORIE ──────────────────────────────────────────
//
//    sizes        : tailles disponibles
//    tags         : mots-clés associés
//    descriptions : phrases descriptives aléatoires

const CATEGORY_CONFIG = {
  robe: {
    label: 'Robe',
    ...INTERVALS.robe,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    tags: ['robe', 'femme', 'mode', 'élégance', 'tendance'],
    descriptions: [
      'Robe tendance pour femme, idéale pour toutes les occasions.',
      'Robe élégante aux finitions soignées, style et confort garantis.',
      'Belle robe femme, parfaite pour une sortie ou une soirée.',
      'Robe moderne, légère et féminine pour un look raffiné.',
    ],
  },
  jupe: {
    label: 'Jupe',
    ...INTERVALS.jupe,
    sizes: ['36', '38', '40', '42', '44', '46'],
    tags: ['jupe', 'femme', 'mode', 'tendance'],
    descriptions: [
      'Jupe femme moderne et tendance, pour un look au quotidien.',
      'Jupe élégante, coupe soignée pour un style féminin affirmé.',
      'Jupe tendance, alliant style et confort pour la femme moderne.',
      'Jupe chic, parfaite pour sublimer votre silhouette.',
    ],
  },
  ensemble: {
    label: 'Ensemble',
    ...INTERVALS.ensemble,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    tags: ['ensemble', 'femme', 'tenue', 'mode', 'lot', 'set', '2 pièces'],
    descriptions: [
      'Ensemble complet pour femme, look assorti sans effort.',
      'Set tendance 2 pièces, idéal pour un look coordonné et stylé.',
      'Ensemble femme moderne, combinaison parfaite de pièces assorties.',
      'Tenue complète assortie, élégance et praticité au quotidien.',
    ],
  },
  combinaison: {
    label: 'Combinaison',
    ...INTERVALS.combinaison,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    tags: ['combinaison', 'femme', 'jumpsuit', 'mode', 'tendance'],
    descriptions: [
      'Combinaison femme chic et tendance, pour un look épuré.',
      'Combinaison élégante, une seule pièce pour un style parfait.',
      'Jumpsuit femme moderne, confort et élégance réunis.',
      'Combinaison tendance, idéale pour toutes les occasions.',
    ],
  },
  blouse: {
    label: 'Blouse',
    ...INTERVALS.blouse,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    tags: ['blouse', 'femme', 'haut', 'mode', 'tendance'],
    descriptions: [
      'Blouse femme légère et élégante, parfaite pour le bureau ou les sorties.',
      'Blouse tendance, tissu fluide et coupe flatteuse.',
      'Belle blouse femme, finitions soignées et style affirmé.',
      'Blouse moderne, légèreté et élégance pour la femme active.',
    ],
  },
  tshirt: {
    label: 'T-Shirt',
    ...INTERVALS.tshirt,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    tags: ['t-shirt', 'femme', 'haut', 'casual', 'mode'],
    descriptions: [
      'T-shirt femme confortable et stylé, parfait pour le quotidien.',
      'T-shirt tendance, coton doux et confortable.',
      'T-shirt femme moderne, simple et chic.',
      'T-shirt basique de qualité, un indispensable de la garde-robe.',
    ],
  },
  chemise: {
    label: 'Chemise',
    ...INTERVALS.chemise,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    tags: ['chemise', 'femme', 'haut', 'mode', 'tendance'],
    descriptions: [
      'Chemise femme élégante, parfaite pour le bureau ou les sorties.',
      'Chemise tendance, coupe soignée et tissu de qualité.',
      'Belle chemise femme, style classique et moderne.',
      'Chemise chic, polyvalente pour toutes les occasions.',
    ],
  },
  pantalon: {
    label: 'Pantalon',
    ...INTERVALS.pantalon,
    sizes: ['36', '38', '40', '42', '44', '46'],
    tags: ['pantalon', 'femme', 'bas', 'mode', 'tendance'],
    descriptions: [
      'Pantalon femme tendance, alliant confort et style.',
      'Pantalon élégant pour femme, coupe flatteuse.',
      'Pantalon moderne femme, polyvalent et stylé.',
      'Pantalon de qualité pour la femme active et branchée.',
    ],
  },
  jean: {
    label: 'Jean',
    ...INTERVALS.jean,
    sizes: ['36', '38', '40', '42', '44', '46'],
    tags: ['jean', 'denim', 'femme', 'bas', 'mode'],
    descriptions: [
      'Jean femme tendance, coupe moderne et tissu denim de qualité.',
      'Jean stylé pour femme, confort et élégance au quotidien.',
      'Jean denim femme, un classique incontournable.',
      'Jean tendance, coupe slim ou droite pour sublimer la silhouette.',
    ],
  },
  short: {
    label: 'Short',
    ...INTERVALS.short,
    sizes: ['36', '38', '40', '42', '44'],
    tags: ['short', 'femme', 'bas', 'mode', 'été'],
    descriptions: [
      "Short femme tendance, léger et confortable pour l'été.",
      'Short stylé pour femme, idéal pour les journées chaudes.',
      'Short moderne femme, polyvalent et à la mode.',
      'Short tendance, parfait pour un look décontracté et chic.',
    ],
  },
  veste: {
    label: 'Veste',
    ...INTERVALS.veste,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    tags: ['veste', 'femme', 'haut', 'mode', 'tendance', 'doudoune'],
    descriptions: [
      'Veste femme élégante, parfaite pour compléter un look.',
      'Veste tendance, style et chaleur pour la femme moderne.',
      'Belle veste femme, coupe soignée et finitions de qualité.',
      'Doudoune / veste chaude femme, alliant confort et style.',
    ],
  },
  manteau: {
    label: 'Manteau',
    ...INTERVALS.manteau,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    tags: ['manteau', 'femme', 'haut', 'mode', 'hiver'],
    descriptions: [
      "Manteau femme chaud et élégant pour l'hiver.",
      'Manteau tendance, alliant chaleur et style.',
      'Beau manteau femme, parfait pour les saisons froides.',
      'Manteau de qualité, finitions soignées et tissu chaud.',
    ],
  },
  sweat: {
    label: 'Sweat / Hoodie',
    ...INTERVALS.sweat,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    tags: ['sweat', 'hoodie', 'femme', 'haut', 'casual'],
    descriptions: [
      'Sweat femme confortable, idéal pour un look casual et tendance.',
      'Hoodie femme doux et chaleureux, style urbain.',
      'Sweat tendance femme, parfait pour le quotidien.',
      'Sweatshirt femme moderne, confort et style réunis.',
    ],
  },
  lingerie: {
    label: 'Lingerie & Nuisette',
    ...INTERVALS.lingerie,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    tags: ['lingerie', 'nuisette', 'femme', 'sous-vêtements', 'mode'],
    descriptions: [
      'Lingerie femme délicate, pour un raffinement au quotidien.',
      'Nuisette élégante, tissu doux et confortable.',
      'Sous-vêtements femme de qualité, style et confort réunis.',
      'Lingerie tendance, dentelle fine et tissu soyeux.',
    ],
  },
  clothing: {
    label: 'Vêtement Femme',
    ...INTERVALS.clothing,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    tags: ['femme', 'mode', 'tendance', 'vêtement'],
    descriptions: [
      'Vêtement femme tendance, qualité et style au meilleur prix.',
      'Tenue femme moderne, pour toutes les occasions.',
      'Article mode femme, design soigné et tissu de qualité.',
      'Vêtement femme de qualité, élégance et confort garantis.',
    ],
  },
}

// ─── INFÉRENCE DE CATÉGORIE ───────────────────────────────────────────────
//
//  Règle prioritaire : si le nom (brut ou nettoyé) contient le chiffre "2"
//  ET le signe "+" → catégorie "ensemble" (ex: "ensemble 2+short")

function inferCategory(rawFilename, cleanedName) {
  // Règle ensemble : chiffre 2 + signe + dans le nom
  if (/2/.test(rawFilename) && /\+/.test(rawFilename)) return 'ensemble'
  if (/2/.test(cleanedName) && /\+/.test(cleanedName)) return 'ensemble'

  const ln = cleanedName.toLowerCase()

  // Vérifier les mots-clés d'ensemble en premier (avant robe/jupe)
  if (
    ln.includes('ensemble') ||
    ln.includes('tenue') ||
    /\bset\b/.test(ln) ||
    /\blot\b/.test(ln)
  ) return 'ensemble'

  // Combinaison avant robe (pour éviter de confondre)
  if (
    ln.includes('combinaison') ||
    ln.includes('jumpsuit') ||
    ln.includes('combi')
  ) return 'combinaison'

  // Robe
  if (ln.includes('robe') || ln.includes('dress')) return 'robe'

  // Jupe
  if (ln.includes('jupe') || ln.includes('skirt')) return 'jupe'

  // Blouse (avant chemise)
  if (ln.includes('blouse')) return 'blouse'

  // Jean / denim (avant pantalon, car "pantalon en jeans" → jean)
  if (
    ln.includes('jean') ||
    ln.includes('jeans') ||
    ln.includes('denim')
  ) return 'jean'

  // Pantalon
  if (
    ln.includes('pantalon') ||
    ln.includes('pentalon') ||
    ln.includes('pant') ||
    ln.includes('trouser')
  ) return 'pantalon'

  // Chemise (doit venir après blouse et jean pour éviter faux positifs)
  if (
    ln.includes('chemise') ||
    (ln.includes('shirt') && !ln.includes('t-shirt') && !ln.includes('tshirt'))
  ) return 'chemise'

  // T-shirt
  if (
    ln.includes('tshirt') ||
    ln.includes('t-shirt') ||
    ln.includes('t shirt') ||
    /\btee\b/.test(ln) ||
    ln.includes('mini t')
  ) return 'tshirt'

  // Short
  if (ln.includes('short')) return 'short'

  // Doudoune → veste
  if (ln.includes('doudoune')) return 'veste'

  // Veste
  if (
    ln.includes('veste') ||
    ln.includes('jacket') ||
    ln.includes('blazer')
  ) return 'veste'

  // Manteau
  if (
    ln.includes('manteau') ||
    ln.includes('coat') ||
    ln.includes('parka')
  ) return 'manteau'

  // Sweat
  if (
    ln.includes('sweat') ||
    ln.includes('hoodie') ||
    ln.includes('sweatshirt') ||
    /\bpull\b/.test(ln) ||
    ln.includes('sweater')
  ) return 'sweat'

  // Lingerie / sous-vêtements
  if (
    ln.includes('nuisette') ||
    ln.includes('lingerie') ||
    ln.includes('sous') ||
    ln.includes('soutien')
  ) return 'lingerie'

  return 'clothing'
}

// ─── COULEURS ─────────────────────────────────────────────────────────────

const ALL_COLORS = [
  'Noir', 'Blanc', 'Bleu', 'Rouge', 'Vert', 'Jaune', 'Gris', 'Rose',
  'Marron', 'Orange', 'Violet', 'Beige', 'Bordeaux', 'Camel', 'Kaki',
  'Turquoise', 'Lilas', 'Crème', 'Marine', 'Écru',
]

const COLOR_KEYWORDS = [
  'noir', 'blanc', 'bleu', 'rouge', 'vert', 'jaune', 'gris', 'rose',
  'marron', 'orange', 'violet', 'beige', 'bordeaux', 'camel', 'kaki',
  'turquoise', 'lilas', 'crème', 'marine', 'écru',
]

function extractColorsFromName(name) {
  const ln = name.toLowerCase()
  const found = []
  for (const c of COLOR_KEYWORDS) {
    if (ln.includes(c)) found.push(capitalizeWords(c))
  }
  // Toujours inclure Noir et Blanc, compléter avec 3 couleurs aléatoires
  const base = Array.from(new Set(['Noir', 'Blanc', ...found]))
  const extras = ALL_COLORS.filter(c => !base.includes(c))
  return Array.from(new Set([...base, ...pickRandom(extras, 3)]))
}

// ─── NETTOYAGE DU NOM ─────────────────────────────────────────────────────

function cleanNameFromFilename(filename) {
  let name = filename

  // Supprimer l'extension
  name = name.replace(/\.[a-zA-Z0-9]+$/, '')

  // Supprimer suffixes de résolution (-800x600)
  name = name.replace(/-\d{1,4}x\d{1,4}$/, '')

  // Supprimer suffixes numériques finaux (-2, _3…)
  name = name.replace(/[-_]\d+$/, '')

  // Remplacer tirets et underscores par des espaces
  name = name.replace(/[-_]+/g, ' ')

  // Supprimer le préfixe "A" majuscule utilisé par convention dans les noms de fichiers
  // ex: "Arobe moulante" → "robe moulante"
  name = name.replace(/^[aA](?=[A-Za-zÀ-öø-ÿ])/, '')

  // Supprimer les suffixes numérotés entre parenthèses : (1), (2), (12), etc.
  name = name.replace(/\s*\(\d+\)\s*$/, '')

  // Nettoyer les espaces multiples
  name = name.replace(/\s+/g, ' ').trim()

  // Si le fichier est de type img/WhatsApp/photo → nom générique
  if (/^(img|IMG|WhatsApp|photo)/i.test(filename)) {
    return 'Vêtement Femme'
  }

  return capitalizeWords(name)
}

// ─── CONSTRUCTION D'UN PRODUIT ────────────────────────────────────────────

function buildProduct(id, dir, files) {
  // Le premier fichier (trié alphabétiquement) porte le nom du produit
  const first = files[0]
  const name = cleanNameFromFilename(first)
  const category = inferCategory(first, name)
  const config = CATEGORY_CONFIG[category] || CATEGORY_CONFIG.clothing

  const price = rand(config.priceMin, config.priceMax)
  const originalPrice = price + rand(200, 1000)

  const images = files.map(f => `/vetement_femme/${dir}/${f.replace(/%/g, '%25').replace(/#/g, '%23')}`)
  const image = images[0]

  const colors = extractColorsFromName(first)
  const minOrder = rand(config.moMin, config.moMax)
  const description = pickRandom(config.descriptions)
  const tags = [...config.tags]
  const taxType = Math.random() > 0.5 ? 'ttc' : 'ht'

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
    colors,
    sizes: config.sizes,
    minOrder,
    image,
    images,
  }
}

// ─── GÉNÉRATION ──────────────────────────────────────────────────────────

function generate() {
  if (!fs.existsSync(imagesDir)) {
    console.error('Dossier introuvable :', imagesDir)
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

  const out = `export const vetement_femme = ${JSON.stringify(products, null, 2)}\n`
  fs.writeFileSync(outFile, out, 'utf8')

  console.log(`\n✓ ${products.length} produits écrits dans ${outFile}`)
  console.log('\nRépartition par catégorie :')
  Object.entries(stats)
    .sort((a, b) => b[1] - a[1])
    .forEach(([cat, count]) => {
      const label = (CATEGORY_CONFIG[cat] || {}).label || cat
      console.log(`  ${label.padEnd(22)} ${String(count).padStart(3)} produit(s)`)
    })
}

generate()
