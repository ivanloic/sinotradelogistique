import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// remonter de deux niveaux pour atteindre la racine du projet (où se trouve 'public')
const projectRoot = path.resolve(__dirname, '..', '..')
// dossier source contenant les images des sacs
const guitarsDir = path.join(projectRoot, 'public', 'sac')
const outFile = path.join(projectRoot, 'src', 'data', 'sacs.js')

function capitalizeWords(s) {
  return s.replace(/\b\w/g, (c) => c.toUpperCase())
}

// grandes marques de sacs et maroquinerie (liste non exhaustive)
const knownBrands = [
  // Marques de luxe
  'louis vuitton','lv','gucci','prada','hermes','chanel','dior','fendi','celine','givenchy','balenciaga','bottega veneta','versace','burberry','saint laurent','ysl','valentino','miu miu','loewe','jimmy choo',
  // Marques premium
  'coach','michael kors','kate spade','tory burch','furla','longchamp','marc jacobs','rebecca minkoff','fossil','mulberry','ted baker','aldo',
  // Marques sport et lifestyle
  'nike','adidas','puma','under armour','the north face','herschel','fjallraven','kanken','eastpak','jansport','kipling','samsonite','delsey',
  // Marques accessibles
  'zara','h&m','mango','pull and bear','stradivarius','bershka','topshop','asos','parfois','orsay'
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
  
  // Sacs à dos
  if (ln.includes('sac a dos') || ln.includes('backpack') || ln.includes('sac dos') || ln.includes('rucksack')) return 'sacs_a_dos'
  
  // Sacs à main
  if (ln.includes('sac a main') || ln.includes('handbag') || ln.includes('sac main') || ln.includes('cabas')) return 'sacs_a_main'
  
  // Sacs bandoulière
  if (ln.includes('bandouliere') || ln.includes('crossbody') || ln.includes('messenger') || ln.includes('besace')) return 'sacs_bandouliere'
  
  // Pochettes et clutch
  if (ln.includes('pochette') || ln.includes('clutch') || ln.includes('minaudiere')) return 'pochettes'
  
  // Sacs de voyage
  if (ln.includes('voyage') || ln.includes('travel') || ln.includes('duffle') || ln.includes('valise') || ln.includes('weekend')) return 'sacs_voyage'
  
  // Sacs business/travail
  if (ln.includes('business') || ln.includes('travail') || ln.includes('work') || ln.includes('laptop') || ln.includes('ordinateur') || ln.includes('briefcase') || ln.includes('porte-documents')) return 'sacs_business'
  
  // Sacs shopping/tote
  if (ln.includes('shopping') || ln.includes('tote') || ln.includes('fourre-tout')) return 'sacs_shopping'
  
  // Sacs sport
  if (ln.includes('sport') || ln.includes('gym') || ln.includes('fitness') || ln.includes('training')) return 'sacs_sport'
  
  // Portefeuilles
  if (ln.includes('portefeuille') || ln.includes('wallet') || ln.includes('porte-monnaie') || ln.includes('porte monnaie')) return 'portefeuilles'
  
  // Sacs banane
  if (ln.includes('banane') || ln.includes('waist') || ln.includes('belt bag') || ln.includes('fanny')) return 'sacs_banane'
  
  // Catégorie par genre
  if (ln.includes('homme') || ln.includes('men') || ln.includes('masculin')) return 'homme'
  if (ln.includes('femme') || ln.includes('women') || ln.includes('feminin')) return 'femme'
  if (ln.includes('enfant') || ln.includes('child') || ln.includes('enfent')) return 'enfant'
  
  return 'sacs'
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
  if (/photo/i.test(filename)) return 'Sac & Accessoire'

  // capitalize cleaned name
  return capitalizeWords(name)
}

function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min }

function pickRandom(arr, n=1) {
  const shuffled = arr.slice().sort(() => 0.5 - Math.random())
  return n === 1 ? shuffled[0] : shuffled.slice(0, n)
}

function extractColorsFromName(name) {
  const colorKeywords = ['noir','blanc','bleu','rouge','vert','jaune','gris','rose','marron','orange','violet','beige','camel','taupe','bordeaux','navy','kaki','turquoise']
  const ln = name.toLowerCase()
  const found = []
  for (const c of colorKeywords) if (ln.includes(c)) found.push(capitalizeWords(c))
  if (found.length) return Array.from(new Set(found))
  // sinon renvoyer 2-3 couleurs aléatoires pour les sacs
  const pool = ['noir','blanc','bleu','rouge','vert','jaune','gris','rose','marron','orange','violet','beige','camel','taupe','bordeaux','navy','kaki','turquoise']
  const numColors = rand(4, 8)
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
  
  // Prix adaptés pour les sacs selon le type
  let price = rand(3500, 12000)
  let originalPrice = price + rand(500, 2500)
  
  const images = files.map(f => `/sac/${dir}/${f}`)
  const image = images[0]
  const taxType = Math.random() > 0.5 ? 'ttc' : 'ht'
  const colors = extractColorsFromName(first)
  
  // Détection du type de sac pour ajuster les prix
  const isBackpack = category === 'sacs_a_dos' || /dos|backpack/i.test(name)
  const isHandbag = category === 'sacs_a_main' || /main|handbag/i.test(name)
  const isTravel = category === 'sacs_voyage' || /voyage|travel|valise/i.test(name)
  const isBusiness = category === 'sacs_a_dos_enfant' || /business|laptop|ordinateur/i.test(name)
  const isClutch = category === 'pochettes' || /pochette|clutch/i.test(name)
  const isWallet = category === 'portefeuilles' || /portefeuille|wallet/i.test(name)
  const isSet = /\b(ensemble|set|kit|lot)\b/i.test(name)
  
  // Ajustement des prix selon le type de sac
  if (isHandbag) {
    price = rand(2500, 4700)
    originalPrice = price + rand(1000, 2500)
  } else if (isBackpack) {
    price = rand(2500, 4800)
    originalPrice = price + rand(800, 1000)
  } else if (isTravel) {
    price = rand(12000, 45000)
    originalPrice = price + rand(2000, 10000)
  } else if (isBusiness) {
    price = rand(2000, 3400)
    originalPrice = price + rand(500, 1000)
  } else if (isClutch) {
    price = rand(3000, 15000)
    originalPrice = price + rand(500, 3000)
  } else if (isWallet) {
    price = rand(2000, 10000)
    originalPrice = price + rand(300, 2000)
  } else if (isSet) {
    price = rand(2000, 4500)
    originalPrice = price + rand(500, 1000)
  }
  
  // minOrder rule
  let minOrder = rand(3, 25)
  if (price < 5000) minOrder = rand(10, 25)
  if (price > 20000) minOrder = rand(1, 8)
  if (isSet) minOrder = rand(1, 5)

  // detect multimarque / multibrand products
  const isMultiBrand = /multi[-_\s]?marque|multimarque|multi[-_\s]?brand/i.test(name)
  let bagbrands = undefined
  if (isMultiBrand) {
    const take = Math.min(12, knownBrands.length)
    bagbrands = pickRandom(knownBrands, take).map(b => capitalizeWords(b))
    category = 'multibrands'
    brand = 'Multiple'
  }

  // Tailles adaptées aux sacs
  let sizes = []
  if (isWallet || isClutch) {
    sizes = ['Petit', 'Moyen', 'Grand']
  } else if (isBackpack || isTravel) {
    sizes = ['Unique']
  } else if (isHandbag) {
    sizes = ['Mini', 'Small', 'Medium', 'Large', 'XL']
  } else {
    sizes = ['Unique']
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

  if (bagbrands) product.bagbrands = bagbrands

  return product
}

function generate() {
  if (!fs.existsSync(guitarsDir)) {
    console.error('sacs dir not found:', guitarsDir)
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
  const out = `export const sacs = ${JSON.stringify(products, null, 2)}\n` 
  fs.writeFileSync(outFile, out, 'utf8')
  console.log('Wrote', outFile, 'with', products.length, 'sacs (classés aléatoirement)')
}

generate()
