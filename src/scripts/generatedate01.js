import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// remonter de deux niveaux pour atteindre la racine du projet (où se trouve 'public')
const projectRoot = path.resolve(__dirname, '..', '..')
// dossier source contenant les images des vêtements
const guitarsDir = path.join(projectRoot, 'public', 'vetement_enfant')
const outFile = path.join(projectRoot, 'src', 'data', 'vetement_enfant.js')

function capitalizeWords(s) {
  return s.replace(/\b\w/g, (c) => c.toUpperCase())
}

// grandes marques de vêtements (liste non exhaustive)
const knownBrands = [
  'nike','adidas','puma','reebok','under armour','new balance','levis','tommy','tommy hilfiger','h&m','hm','zara','gucci','prada','versace','armani','chanel','burberry','lacoste','ralph lauren','dior','givenchy','balenciaga','off-white','supreme','hermes','fendi','coach','celine'
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
  if (ln.includes('tshirt') || ln.includes('t-shirt') || ln.includes('tee')) return 'tshirts'
  if (ln.includes('pantalon') || ln.includes('jean') || ln.includes('jeans') || ln.includes('pant')) return 'pants'
  if (ln.includes('veste') || ln.includes('jacket') || ln.includes('coat')) return 'jackets'
  if (ln.includes('robe') || ln.includes('dress')) return 'dresses'
  if (ln.includes('sweat') || ln.includes('hoodie')) return 'sweatshirts'
  if (ln.includes('short')) return 'shorts'
  if (ln.includes('chaussure') || ln.includes('shoe') || ln.includes('boot')) return 'shoes'
  return 'men'
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
  if (/photo/i.test(filename)) return 'Vêtement enfant'

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
  let price = rand(1500, 2500)
  let originalPrice = price + rand(50, 500)
  const images = files.map(f => `/vetement_enfant/${dir}/${f}`)
  const image = images[0]
  const taxType = Math.random() > 0.5 ? 'ttc' : 'ht'
  const colors = extractColorsFromName(first)
  const isEnsemble = /\bensemble\b/i.test(name)
  // minOrder rule: if price < 1500 then minOrder must be > 15 (but not the inverse)
  let minOrder = rand(5, 20)
  if (price < 1500) minOrder = rand(5, 25)

  if (isEnsemble) {
    price = rand(2000, 3000)
    originalPrice = price + rand(100, 600)
    minOrder = rand(1, 11)
  }
  
  

  // detect multimarque / multibrand products and add a clothbrands category with at least 10 brands
  const isMultiBrand = /multi[-_\s]?marque|multimarque|multi[-_\s]?brand/i.test(name)
  let clothbrands = undefined
  if (isMultiBrand) {
    // ensure we have at least 10 distinct brands
    const take = Math.min(12, knownBrands.length)
    clothbrands = pickRandom(knownBrands, take).map(b => capitalizeWords(b))
    category = 'clothbrands'
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
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    minOrder,
    images,
  }

  if (clothbrands) product.clothbrands = clothbrands

  return product
}

function generate() {
  if (!fs.existsSync(guitarsDir)) {
    console.error('vetement_enfant dir not found:', guitarsDir)
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

  // write file
  const out = `export const vetement_enfant = ${JSON.stringify(products, null, 2)}\n` 
  fs.writeFileSync(outFile, out, 'utf8')
  console.log('Wrote', outFile, 'with', products.length, 'products')
}

generate()
