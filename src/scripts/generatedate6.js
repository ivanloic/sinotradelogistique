import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// remonter de deux niveaux pour atteindre la racine du projet (où se trouve 'public')
const projectRoot = path.resolve(__dirname, '..', '..')
// dossier source contenant les images des téléphones et accessoires
const guitarsDir = path.join(projectRoot, 'public', 'telephone_accessoires')
const outFile = path.join(projectRoot, 'src', 'data', 'telephone_accessoires.js')

function capitalizeWords(s) {
  return s.replace(/\b\w/g, (c) => c.toUpperCase())
}

// grandes marques de téléphones et accessoires
const knownBrands = [
  'samsung','apple','iphone','xiaomi','huawei','oppo','vivo','realme','oneplus','nokia','motorola','lg','sony','google','pixel',
  'anker','baseus','ugreen','spigen','otterbox','jbl','sony','beats','airpods','samsung buds','jabra','bose','sennheiser',
  'belkin','aukey','ravpower','mophie','dbrand','casetify','tech21','lifeproof','ringke'
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
  // Téléphones
  if (ln.includes('iphone') || ln.includes('samsung') || ln.includes('xiaomi') || ln.includes('phone') || ln.includes('smartphone') || ln.includes('mobile')) return 'telephones'
  
  // Coques et protections
  if (ln.includes('coque') || ln.includes('case') || ln.includes('cover') || ln.includes('protection')) return 'coques'
  
  // Écouteurs
  if (ln.includes('ecouteur') || ln.includes('earbud') || ln.includes('airpod') || ln.includes('earphone') || ln.includes('headphone') || ln.includes('casque')) return 'ecouteurs'
  
  // Chargeurs
  if (ln.includes('chargeur') || ln.includes('charger') || ln.includes('cable') || ln.includes('usb') || ln.includes('adaptateur') || ln.includes('adapter')) return 'chargeurs'
  
  // Batteries et powerbanks
  if (ln.includes('batterie') || ln.includes('battery') || ln.includes('powerbank') || ln.includes('power bank')) return 'batteries'
  
  // Supports et accessoires
  if (ln.includes('support') || ln.includes('holder') || ln.includes('stand') || ln.includes('mount')) return 'supports'
  
  // Pochettes
  if (ln.includes('pochette') || ln.includes('pouch') || ln.includes('sacoche') || ln.includes('bag')) return 'pochettes'
  
  // Protection écran
  if (ln.includes('verre') || ln.includes('glass') || ln.includes('screen') || ln.includes('protecteur') || ln.includes('film')) return 'protections_ecran'
  
  // Selfie stick et accessoires photo
  if (ln.includes('selfie') || ln.includes('stick') || ln.includes('tripod') || ln.includes('trepied')) return 'accessoires_photo'
  
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
  // remove words that may be irrelevant
  name = name.replace(/\b(photo|image|pic|picture)\b/gi, '')
  // trim
  name = name.trim()
  // remove leading 'a' if it's the first character
  name = name.replace(/^a(?=[A-Za-z0-9\s\-_])/i, '')
  // collapse spaces
  name = name.replace(/\s+/g, ' ')
  // if filename contains 'photo' anywhere, replace full name by generic name
  if (/photo/i.test(filename)) return 'Accessoire téléphone'

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
  
  // Prix selon la catégorie
  let price = rand(500, 1500) // Prix par défaut pour accessoires
  let minOrder = rand(1, 15)
  
  // Téléphones - prix plus élevés
  if (category === 'telephones') {
    price = rand(15000, 80000)
    minOrder = rand(1, 5)
  }
  // Écouteurs et casques
  else if (category === 'ecouteurs') {
    price = rand(1500, 3500)
    minOrder = rand(5, 15)
  }
  // Batteries et powerbanks
  else if (category === 'batteries') {
    price = rand(2000, 8000)
    minOrder = rand(3, 10)
  }
  // Chargeurs
  else if (category === 'chargeurs') {
    price = rand(800, 3000)
    minOrder = rand(5, 10)
  }
  // Coques et pochettes
  else if (category === 'coques' || category === 'pochettes') {
    price = rand(500, 2000)
    minOrder = rand(10, 25)
  }
  // Protections écran
  else if (category === 'protections_ecran') {
    price = rand(300, 1500)
    minOrder = rand(20, 40)
  }
  
  let originalPrice = price + rand(Math.floor(price * 0.1), Math.floor(price * 0.3))
  const images = files.map(f => `/telephone_accessoires/${dir}/${f}`)
  const image = images[0]
  const taxType = Math.random() > 0.5 ? 'ttc' : 'ht'
  const colors = extractColorsFromName(first)
  
  

  // detect multimarque / multibrand products
  const isMultiBrand = /multi[-_\s]?marque|multimarque|multi[-_\s]?brand|compatible/i.test(name)
  let techbrands = undefined
  if (isMultiBrand) {
    // ensure we have at least 8 distinct brands
    const take = Math.min(10, knownBrands.length)
    techbrands = pickRandom(knownBrands, take).map(b => capitalizeWords(b))
    // for multibrand products, mark brand as 'Compatible'
    brand = 'Compatible'
  }

  // Spécifications techniques selon la catégorie
  let specifications = {}
  if (category === 'ecouteurs') {
    specifications = {
      type: pickRandom(['Sans fil', 'Filaire', 'Bluetooth']),
      autonomie: category === 'ecouteurs' && pickRandom(['Sans fil', 'Bluetooth']).includes('Sans fil') ? `${rand(4, 24)}h` : undefined,
      connectivite: pickRandom(['Bluetooth 5.0', 'Bluetooth 5.1', 'Bluetooth 5.2', 'USB-C', '3.5mm'])
    }
  } else if (category === 'chargeurs') {
    specifications = {
      puissance: `${pickRandom([5, 10, 15, 18, 20, 25, 30, 45, 65])}W`,
      type: pickRandom(['USB-C', 'USB-A', 'Lightning', 'Micro-USB', 'Sans fil']),
      ports: rand(1, 4)
    }
  } else if (category === 'batteries') {
    specifications = {
      capacite: `${rand(5000, 30000)} mAh`,
      sorties: pickRandom(['USB-C + USB-A', '2x USB-A', 'USB-C', 'Multiple']),
      rechargeFast: Math.random() > 0.5
    }
  } else if (category === 'telephones') {
    specifications = {
      ram: pickRandom(['4GB', '6GB', '8GB', '12GB', '16GB']),
      stockage: pickRandom(['64GB', '128GB', '256GB', '512GB', '1TB']),
      ecran: `${rand(5, 7)}.${rand(0, 9)}"`,
      systeme: pickRandom(['Android', 'iOS'])
    }
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
    minOrder,
    images,
    specifications
  }

  if (techbrands) product.techbrands = techbrands

  return product
}

function generate() {
  if (!fs.existsSync(guitarsDir)) {
    console.error('telephone_accessoires dir not found:', guitarsDir)
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
  const out = `export const telephone_accessoires = ${JSON.stringify(products, null, 2)}\n` 
  fs.writeFileSync(outFile, out, 'utf8')
  console.log('Wrote', outFile, 'with', products.length, 'products')
}

generate()
