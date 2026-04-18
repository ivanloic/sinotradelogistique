import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// remonter de deux niveaux pour atteindre la racine du projet (où se trouve 'public')
const projectRoot = path.resolve(__dirname, '..', '..')
// dossier source contenant les images des bijoux et accessoires
const guitarsDir = path.join(projectRoot, 'public', 'bijou')
const outFile = path.join(projectRoot, 'src', 'data', 'bijoux_accessoires.js')

function capitalizeWords(s) {
  return s.replace(/\b\w/g, (c) => c.toUpperCase())
}

// grandes marques de bijoux, montres et accessoires de beauté (liste non exhaustive)
const knownBrands = [
  // Bijouterie et joaillerie
  'cartier','tiffany','bulgari','van cleef','chopard','harry winston','boucheron','mikimoto','graff','piaget',
  // Montres
  'rolex','omega','patek philippe','audemars piguet','tag heuer','breitling','iwc','hublot','panerai','cartier','longines','tissot','seiko','casio','citizen','fossil','michael kors','daniel wellington','armani','gucci',
  // Bijoux fantaisie et accessoires
  'swarovski','pandora','thomas sabo','alex and ani','david yurman','john hardy','tiffany','bvlgari','chanel','dior','hermes','louis vuitton','versace','prada','fendi',
  // Beauté masculine et féminine
  'chanel','dior','estee lauder','lancome','ysl','givenchy','tom ford','guerlain','clarins','clinique','mac','nars','bobbi brown','shiseido','loreal','maybelline','revlon','nivea','dove','gillette','old spice','axe','hugo boss'
]

function inferBrand(name) {
  const ln = name.toLowerCase()
  for (const b of knownBrands) {
    if (ln.includes(b)) return capitalizeWords(b)
  }
  // try to get brand from parts
  const parts = ln.split(/[-_\s]+/)
  for (const p of parts) {
    if (knownBrands.includes(p)) return capitalizeWords(p)
  }
  return 'Various'
}

function inferCategory(name) {
  const ln = name.toLowerCase()
  
  // Bijoux
  if (ln.includes('collier') || ln.includes('necklace') || ln.includes('pendentif') || ln.includes('pendant')) return 'colliers'
  if (ln.includes('bracelet')) return 'bracelets'
  if (ln.includes('bague') || ln.includes('ring') || ln.includes('anneau')) return 'bagues'
  if (ln.includes('boucle') || ln.includes('earring') || ln.includes('oreille')) return 'boucles_oreilles'
  if (ln.includes('chaine') || ln.includes('chain')) return 'chaines'
  if (ln.includes('jonc') || ln.includes('manchette') || ln.includes('cuff')) return 'joncs'
  
  // Montres
  if (ln.includes('montre') || ln.includes('watch')) return 'montres'
  
  // Accessoires beauté
  if (ln.includes('parfum') || ln.includes('perfume') || ln.includes('cologne') || ln.includes('eau de toilette')) return 'parfums'
  if (ln.includes('creme') || ln.includes('cream') || ln.includes('lotion') || ln.includes('moisturizer')) return 'soins_peau'
  if (ln.includes('rouge') || ln.includes('lipstick') || ln.includes('gloss') || ln.includes('levres')) return 'maquillage_levres'
  if (ln.includes('mascara') || ln.includes('eye') || ln.includes('yeux') || ln.includes('liner')) return 'maquillage_yeux'
  if (ln.includes('fond de teint') || ln.includes('foundation') || ln.includes('poudre') || ln.includes('powder')) return 'teint'
  if (ln.includes('vernis') || ln.includes('nail') || ln.includes('ongle')) return 'ongles'
  if (ln.includes('rasoir') || ln.includes('razor') || ln.includes('shave') || ln.includes('barbe') || ln.includes('beard')) return 'rasage'
  if (ln.includes('brosse') || ln.includes('brush') || ln.includes('peigne') || ln.includes('comb')) return 'accessoires_cheveux'
  
  // Catégorie générique par genre
  if (ln.includes('homme') || ln.includes('men') || ln.includes('masculin')) return 'homme'
  if (ln.includes('femme') || ln.includes('women') || ln.includes('feminin')) return 'femme'
  
  return 'accessoires'
}

function cleanNameFromFilename(filename) {
  // remove extension
  let name = filename.replace(/\.[a-zA-Z0-9]+$/, '')
  // remove common resolution suffixes and trailing numbers
  name = name.replace(/-\d{1,4}x\d{1,4}$/,'')
  name = name.replace(/-\d+$/,'')
  // replace dashes with spaces
  name = name.replace(/[-_]+/g, ' ')
  // remove ALL digits from the name
  name = name.replace(/\d+/g, '')
  // remove words that may be irrelevant
  name = name.replace(/\b(photo|image|pic|picture)\b/gi, '')
  // trim
  name = name.trim()
  // remove leading 'a' if it's the first character
  name = name.replace(/^a(?=[A-Za-z0-9\s\-_])/i, '')
  // collapse spaces
  name = name.replace(/\s+/g, ' ')
  // if filename contains 'photo' anywhere, replace full name by generic name
  if (/photo/i.test(filename)) return 'Bijou & Accessoire'

  // capitalize cleaned name
  return capitalizeWords(name)
}

function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min }

function pickRandom(arr, n=1) {
  const shuffled = arr.slice().sort(() => 0.5 - Math.random())
  return n === 1 ? shuffled[0] : shuffled.slice(0, n)
}

function extractColorsFromName(name) {
  const colorKeywords = ['noir','blanc','bleu','rouge','vert','jaune','gris','rose','marron','orange','violet','beige','or','argent','bronze','doré','argenté','gold','silver']
  const ln = name.toLowerCase()
  const found = []
  for (const c of colorKeywords) if (ln.includes(c)) found.push(capitalizeWords(c))
  if (found.length) return Array.from(new Set(found))
  // sinon renvoyer 2-4 couleurs aléatoires pour bijoux et accessoires
  const pool = ['noir','blanc','bleu','rouge','vert','jaune','gris','rose','marron','orange','violet','beige','or','argent','bronze','doré','rose gold','argenté']
  const numColors = rand(2, 4)
  const selected = []
  for (let i = 0; i < numColors; i++) {
    selected.push(capitalizeWords(pickRandom(pool)))
  }
  return Array.from(new Set(selected))
}

function buildProduct(id, dir, files) {
  const first = files[0]
  const name = cleanNameFromFilename(first)
  let brand = inferBrand(first)
  let category = inferCategory(first)
  
  // Prix adaptés pour bijoux, montres et accessoires de beauté
  let price = rand(2500, 15000)
  let originalPrice = price + rand(500, 3000)
  
  const images = files.map(f => `/bijou/${dir}/${f}`)
  const image = images[0]
  const taxType = Math.random() > 0.5 ? 'ttc' : 'ht'
  const colors = extractColorsFromName(first)
  
  // Détection du type de produit pour ajuster les prix
  const isWatch = category === 'montres' || /montre|watch/i.test(name)
  const isJewelry = ['colliers', 'bracelets', 'bagues', 'boucles_oreilles', 'chaines', 'joncs'].includes(category)
  const isPerfume = category === 'parfums' || /parfum|perfume/i.test(name)
  const isSet = /\b(ensemble|set|kit|coffret)\b/i.test(name)
  
  // Ajustement des prix selon le type
  if (isWatch) {
    price = rand(2000, 4000)
    originalPrice = price + rand(1000, 1500)
  } else if (isJewelry) {
    price = rand(1000, 2000)
    originalPrice = price + rand(500, 1000)
  } else if (isPerfume) {
    price = rand(15000, 45000)
    originalPrice = price + rand(2000, 8000)
  } else if (isSet) {
    price = rand(12000, 35000)
    originalPrice = price + rand(2000, 7000)
  }
  
  // minOrder rule
  let minOrder = rand(3, 30)
  if (price < 1500) minOrder = rand(10, 20)
  if (isWatch || price > 3000) minOrder = rand(1, 5)

  // detect multimarque / multibrand products
  const isMultiBrand = /multi[-_\s]?marque|multimarque|multi[-_\s]?brand/i.test(name)
  let jewelrybrands = undefined
  if (isMultiBrand) {
    const take = Math.min(12, knownBrands.length)
    jewelrybrands = pickRandom(knownBrands, take).map(b => capitalizeWords(b))
    category = 'multibrands'
    brand = 'Multiple'
  }

  // Tailles adaptées aux bijoux et accessoires
  let sizes = []
  if (isJewelry) {
    if (category === 'bagues') {
      sizes = ['50', '52', '54', '56', '58', '60', '62', '64']
    } else if (category === 'bracelets' || category === 'colliers' || category === 'chaines') {
      sizes = ['40cm', '45cm', '50cm', '55cm', '60cm']
    } else {
      sizes = ['Unique']
    }
  } else if (isWatch) {
    sizes = ['38mm', '40mm', '42mm', '44mm', '46mm']
  } else {
    sizes = ['50ml', '100ml', '150ml', '200ml']
  }

  const product = {
    id,
    name,
    price,
    originalPrice,
    category,
    brand,
    image,
    taxType,
    colors,
    sizes,
    minOrder,
    images,
  }

  if (jewelrybrands) product.jewelrybrands = jewelrybrands

  return product
}

function generate() {
  if (!fs.existsSync(guitarsDir)) {
    console.error('bijoux_accessoires dir not found:', guitarsDir)
    process.exit(1)
  }
  const entries = fs.readdirSync(guitarsDir).filter(d => {
    const full = path.join(guitarsDir, d)
    return fs.statSync(full).isDirectory()
  }).sort((a,b)=>{
    const na = Number(a)
    const nb = Number(b)
    if (!isNaN(na) && !isNaN(nb)) return na - nb
    return a.localeCompare(b)
  })

  const products = []
  let idCounter = 1
  for (const dir of entries) {
    const dirFull = path.join(guitarsDir, dir)
    let files = fs.readdirSync(dirFull).filter(f => !f.startsWith('.'))
    if (files.length === 0) continue
    files.sort((a,b)=>a.localeCompare(b))
    const prod = buildProduct(idCounter, dir, files)
    products.push(prod)
    idCounter++
  }

  // Classement aléatoire des produits comme demandé
  products.sort(() => Math.random() - 0.5)
  
  // Réassigner les IDs après le mélange
  products.forEach((prod, index) => {
    prod.id = index + 1
  })

  // write file
  const out = `export const bijoux_accessoires = ${JSON.stringify(products, null, 2)}\n` 
  fs.writeFileSync(outFile, out, 'utf8')
  console.log('Wrote', outFile, 'with', products.length, 'products (classés aléatoirement)')
}

generate()
