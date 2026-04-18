import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// remonter de deux niveaux pour atteindre la racine du projet (où se trouve 'public')
const projectRoot = path.resolve(__dirname, '..', '..')
// dossier source contenant les images des chaussures
const guitarsDir = path.join(projectRoot, 'public', 'chaussure')
const outFile = path.join(projectRoot, 'src', 'data', 'chaussure.js')

function capitalizeWords(s) {
  return s.replace(/\b\w/g, (c) => c.toUpperCase())
}

// grandes marques de chaussures (liste non exhaustive)
const knownBrands = [
  'nike','adidas','puma','reebok','under armour','new balance','converse','vans','timberland','gucci','prada','versace','armani','chanel','burberry','lacoste','ralph lauren','dior','givenchy','balenciaga','off-white','supreme','hermes','fendi','coach','celine','jordan','yeezy','asics','salomon','merrell','clarks','dr martens','skechers','crocs','ugg'
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
  if (ln.includes('basket') || ln.includes('sneaker') || ln.includes('running')) return 'baskets'
  if (ln.includes('boot') || ln.includes('botte')) return 'boots'
  if (ln.includes('sandal') || ln.includes('sandale')) return 'sandals'
  if (ln.includes('talon') || ln.includes('heel') || ln.includes('escarpin')) return 'heels'
  if (ln.includes('mocassin') || ln.includes('loafer')) return 'loafers'
  if (ln.includes('sport') || ln.includes('training')) return 'sport'
  if (ln.includes('enfant') || ln.includes('kid') || ln.includes('child')) return 'kids'
  return 'shoes'
}

// Déterminer le type de chaussure (homme, femme, enfant) basé sur le nom
function inferShoeType(name) {
  const ln = name.toLowerCase()
  if (ln.includes('enfant') || ln.includes('kid') || ln.includes('child') || ln.includes('bebe') || ln.includes('baby')) return 'enfant'
  if (ln.includes('femme') || ln.includes('woman') || ln.includes('women') || ln.includes('lady') || ln.includes('girl') || ln.includes('talon') || ln.includes('heel') || ln.includes('escarpin')) return 'femme'
  if (ln.includes('homme') || ln.includes('man') || ln.includes('men') || ln.includes('boy')) return 'homme'
  // Par défaut, on attribue aléatoirement
  const types = ['homme', 'femme', 'enfant']
  return types[Math.floor(Math.random() * types.length)]
}

// Générer des pointures selon le type (homme/femme/enfant)
function generateSizes(shoeType) {
  if (shoeType === 'homme') {
    // Pointures homme : 39-46
    return ['39', '40', '41', '42', '43', '44', '45', '46']
  } else if (shoeType === 'femme') {
    // Pointures femme : 35-42
    return ['35', '36', '37', '38', '39', '40', '41', '42']
  } else {
    // Pointures enfant : 24-38
    return ['24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38']
  }
}

function cleanNameFromFilename(filename) {
  // remove extension
  let name = filename.replace(/\.[a-zA-Z0-9]+$/, '')
  // remove common resolution suffixes and trailing numbers
  name = name.replace(/-\d{1,4}x\d{1,4}$/,'')
  name = name.replace(/-\d+$/,'')
  // replace dashes with spaces
  name = name.replace(/[-_]+/g, ' ')
  // remove words like 'guitar' that may be irrelevant
  name = name.replace(/\bguitar\b/gi, '')
  // trim
  name = name.trim()
  // remove leading 'a' if it's the first character (ex: 'aShirt' -> 'Shirt' or 'a tshirt' -> 'tshirt')
  name = name.replace(/^a(?=[A-Za-z0-9\s\-_])/i, '')
  // collapse spaces
  name = name.replace(/\s+/g, ' ')
  // if filename contains 'photo' anywhere, replace full name by 'Chaussures'
  if (/photo/i.test(filename)) return 'Chaussures'
  if (/img/i.test(filename)) return 'Chaussures'

  // capitalize cleaned name
  return capitalizeWords(name)
}

function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min }

function pickRandom(arr, n=1) {
  const shuffled = arr.slice().sort(() => 0.5 - Math.random())
  return n === 1 ? shuffled[0] : shuffled.slice(0, n)
}

function extractColorsFromName(name) {
  const colorKeywords = ['noir','blanc','bleu','rouge','vert','jaune','gris','rose','marron','orange','violet','beige']
  const ln = name.toLowerCase()
  const found = []
  for (const c of colorKeywords) if (ln.includes(c)) found.push(capitalizeWords(c))
  if (found.length) return Array.from(new Set(found))
  // sinon renvoyer 1-2 couleurs aléatoires
  const pool = ['noir','blanc','bleu','rouge','vert','jaune','gris','rose','marron','orange','violet','beige']
  const c1 = pickRandom(pool)
  const c2 = pickRandom(pool)
  const c3 = pickRandom(pool)
  const c4 = pickRandom(pool)
  const c5 = pickRandom(pool)
  const c6 = pickRandom(pool)
  const c7 = pickRandom(pool)
  const c8 = pickRandom(pool)
  return Array.from(new Set([capitalizeWords(c1), capitalizeWords(c2), capitalizeWords(c3), capitalizeWords(c4), capitalizeWords(c5), capitalizeWords(c6)], capitalizeWords(c7), capitalizeWords(c8)))
}

function buildProduct(id, dir, files) {
  const first = files[0]
  const name = cleanNameFromFilename(first)
  let brand = inferBrand(first)
  let category = inferCategory(first)
  const shoeType = inferShoeType(first) // Déterminer homme/femme/enfant
  const price = rand(1500, 4500)
  const originalPrice = price + rand(50, 500)
  const images = files.map(f => `/chaussure/${dir}/${f.replace(/%/g, '%25').replace(/#/g, '%23')}`)
  const image = images[0]
  const taxType = Math.random() > 0.5 ? 'ttc' : 'ht'
  const colors = extractColorsFromName(first)
  // minOrder rule: if price < 1500 then minOrder must be > 15 (but not the inverse)
  let minOrder = rand(5, 10)
  if (price < 1500) minOrder = rand(5, 12)

  // Générer les pointures appropriées selon le type de chaussure
  const sizes = generateSizes(shoeType)

  // detect multimarque / multibrand products and add a shoebrands category with at least 10 brands
  const isMultiBrand = /multi[-_\s]?marque|multimarque|multi[-_\s]?brand/i.test(name)
  let shoebrands = undefined
  if (isMultiBrand) {
    // ensure we have at least 10 distinct brands
    const take = Math.min(10, knownBrands.length)
    shoebrands = pickRandom(knownBrands, take).map(b => capitalizeWords(b))
    category = 'shoebrands'
    // for multibrand products, mark brand as 'Multiple'
    brand = 'Multiple'
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
    sizes, // Pointures adaptées (homme/femme/enfant)
    shoeType, // Ajout du type de chaussure
    minOrder,
    images,
  }

  if (shoebrands) product.shoebrands = shoebrands

  return product
}

function generate() {
  if (!fs.existsSync(guitarsDir)) {
    console.error('chaussure dir not found:', guitarsDir)
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
    files.sort((a,b)=>{
      const aHasNum = /\(\d+\)\s*\.[^.]+$/.test(a)
      const bHasNum = /\(\d+\)\s*\.[^.]+$/.test(b)
      if (!aHasNum && bHasNum) return -1
      if (aHasNum && !bHasNum) return 1
      return a.localeCompare(b)
    })
    const prod = buildProduct(idCounter, dir, files)
    products.push(prod)
    idCounter++
  }

  // write file
  const out = `export const chaussure = ${JSON.stringify(products, null, 2)}\n` 
  fs.writeFileSync(outFile, out, 'utf8')
  console.log('Wrote', outFile, 'with', products.length, 'products')
  
  // Afficher les statistiques par type
  const stats = products.reduce((acc, p) => {
    acc[p.shoeType] = (acc[p.shoeType] || 0) + 1
    return acc
  }, {})
  console.log('Statistiques par type:', stats)
}

generate()
