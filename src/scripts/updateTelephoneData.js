import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..', '..')
const dataFile = path.join(projectRoot, 'src', 'data', 'telephone_accessoires.js')
const generatorScript = path.join(projectRoot, 'src', 'scripts', 'generatedate6.js')

function extractArrayFromExportedFile(content) {
  const m = content.match(/export\s+const\s+telephone_accessoires\s*=\s*(\[[\s\S]*\])\s*;?\s*$/m)
  if (!m) return null
  try {
    return JSON.parse(m[1])
  } catch (e) {
    // if JSON.parse fails, try to repair trailing commas
    const repaired = m[1].replace(/,\s*\n\s*([}\]])/g, '$1')
    return JSON.parse(repaired)
  }
}

function normalizeName(s) {
  return String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '')
}

async function run() {
  if (!fs.existsSync(dataFile)) {
    console.error('Data file not found:', dataFile)
    process.exit(1)
  }

  // backup original
  const backup = dataFile + '.bak'
  fs.copyFileSync(dataFile, backup)
  console.log('Backup created at', backup)

  // import original data by dynamic import (works because project type=module)
  let original = []
  try {
    const fileUrl = 'file://' + dataFile
    const mod = await import(fileUrl + '?v=' + Date.now())
    original = mod.telephone_accessoires || []
    console.log('Loaded original products:', original.length)
  } catch (e) {
    console.warn('Could not import original module, will attempt to parse backup file', e.message)
    const raw = fs.readFileSync(backup, 'utf8')
    const parsed = extractArrayFromExportedFile(raw)
    if (parsed) original = parsed
    console.log('Parsed original products from backup:', original.length)
  }

  // run generator to create a fresh generated data file
  console.log('Running generator script:', generatorScript)
  try {
    execSync(`node "${generatorScript}"`, { stdio: 'inherit' })
  } catch (e) {
    console.error('Generator failed:', e.message)
    process.exit(1)
  }

  // read generated file content and extract array
  const generatedRaw = fs.readFileSync(dataFile, 'utf8')
  const generated = extractArrayFromExportedFile(generatedRaw)
  if (!generated) {
    console.error('Failed to parse generated data file')
    process.exit(1)
  }
  console.log('Generated products:', generated.length)

  // build lookup by normalized name for original
  const origMap = new Map()
  for (const p of original) {
    origMap.set(normalizeName(p.name), p)
  }

  // Merge: for each generated product, try to find matching original by name
  // If found, update fields: id, price, originalPrice, category, image, images, minOrder, taxType
  // If not found, append generated product to original list
  let updatedCount = 0
  const usedGenerated = new Set()

  for (const g of generated) {
    const key = normalizeName(g.name)
    const orig = origMap.get(key)
    if (orig) {
      orig.id = g.id
      orig.price = g.price
      orig.originalPrice = g.originalPrice
      orig.category = g.category
      // orig.image = g.image
      // orig.images = g.images
      orig.minOrder = g.minOrder
      orig.taxType = g.taxType
      orig.specifications = g.specifications || orig.specifications
      updatedCount++
      usedGenerated.add(g.id)
    }
  }

  // For any generated product not matched, append to original
  const toAppend = generated.filter(g => !usedGenerated.has(g.id))
  for (const g of toAppend) {
    original.push(g)
  }

  // Reassign sequential ids to keep consistency (optional) — we'll keep original ids for items kept, but ensure unique ids
  const seenIds = new Set()
  let nextId = 1
  for (const p of original) {
    if (!p.id || seenIds.has(p.id)) {
      while (seenIds.has(nextId)) nextId++
      p.id = nextId
      seenIds.add(nextId)
    } else {
      seenIds.add(p.id)
    }
  }

  // write merged file
  const out = 'export const telephone_accessoires = ' + JSON.stringify(original, null, 2) + '\n'
  fs.writeFileSync(dataFile, out, 'utf8')
  console.log('Updated data file written:', dataFile)
  console.log('Products updated:', updatedCount, 'Appended new products:', toAppend.length)
  console.log('Done.')
}

run().catch(err => {
  console.error(err)
  process.exit(1)
})
