import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const projectRoot = path.resolve(__dirname, '..', '..')
const imagesDir = path.join(projectRoot, 'public', 'telephone_accessoires')
const outFile = path.join(projectRoot, 'src', 'data', 'telephone_accessoires.js')

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
  iphone:           { priceMin: 80_000,  priceMax: 500_000, moMin: 1, moMax: 3  },
  samsung:          { priceMin: 50_000,  priceMax: 450_000, moMin: 1, moMax: 3  },
  google_pixel:     { priceMin: 70_000,  priceMax: 450_000, moMin: 1, moMax: 3  },
  telephone:        { priceMin: 15_000,  priceMax: 120_000, moMin: 1, moMax: 5  },
  enceinte:         { priceMin: 3_000,   priceMax: 55_000,  moMin: 2, moMax: 8  },
  casque:           { priceMin: 2_500,   priceMax: 80_000,  moMin: 2, moMax: 10 },
  ecouteur_filaire: { priceMin: 500,     priceMax: 8_000,   moMin: 5, moMax: 20 },
  ecouteur_tws:     { priceMin: 1_500,   priceMax: 35_000,  moMin: 2, moMax: 10 },
  montre_connectee: { priceMin: 3_500,   priceMax: 55_000,  moMin: 1, moMax: 5  },
  accessoire:       { priceMin: 300,     priceMax: 15_000,  moMin: 5, moMax: 20 },
}

// ─── CONFIGURATION PAR CATÉGORIE ──────────────────────────────────────────────

const CATEGORY_CONFIG = {
  iphone: {
    label: 'iPhone',
    ...INTERVALS.iphone,
    tags: ['iphone', 'apple', 'smartphone', 'téléphone', 'ios'],
  },
  samsung: {
    label: 'Samsung Galaxy',
    ...INTERVALS.samsung,
    tags: ['samsung', 'galaxy', 'android', 'smartphone', 'téléphone'],
  },
  google_pixel: {
    label: 'Google Pixel',
    ...INTERVALS.google_pixel,
    tags: ['google', 'pixel', 'android', 'smartphone', 'téléphone'],
  },
  telephone: {
    label: 'Smartphone',
    ...INTERVALS.telephone,
    tags: ['smartphone', 'téléphone', 'android', 'mobile'],
  },
  enceinte: {
    label: 'Enceinte / Haut-Parleur',
    ...INTERVALS.enceinte,
    tags: ['enceinte', 'haut-parleur', 'bluetooth', 'audio', 'son', 'speaker'],
  },
  casque: {
    label: 'Casque Audio',
    ...INTERVALS.casque,
    tags: ['casque', 'audio', 'sans-fil', 'bluetooth', 'hifi', 'musique'],
  },
  ecouteur_filaire: {
    label: 'Écouteurs Filaires',
    ...INTERVALS.ecouteur_filaire,
    tags: ['écouteurs', 'filaire', 'intra-auriculaire', 'jack', 'type-c', 'audio'],
  },
  ecouteur_tws: {
    label: 'Écouteurs Sans Fil (TWS)',
    ...INTERVALS.ecouteur_tws,
    tags: ['écouteurs', 'tws', 'sans-fil', 'bluetooth', 'intra-auriculaire', 'audio'],
  },
  montre_connectee: {
    label: 'Montre Connectée',
    ...INTERVALS.montre_connectee,
    tags: ['montre', 'smartwatch', 'connectée', 'sport', 'fitness', 'bluetooth'],
  },
  accessoire: {
    label: 'Accessoire Téléphone',
    ...INTERVALS.accessoire,
    tags: ['accessoire', 'téléphone', 'coque', 'chargeur', 'câble', 'protection'],
  },
}

// ══════════════════════════════════════════════════════════════════════════════
//  INFÉRENCE DE CATÉGORIE
// ══════════════════════════════════════════════════════════════════════════════

function inferCategory(name) {
  const ln = name.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

  // ── Coffrets / Bundles en priorité absolue ──────────────────────────────────
  if (
    ln.includes('coffret') ||
    (ln.includes('+') && (ln.includes('montre') || ln.includes('ecouteur') || ln.includes('casque')) && (ln.includes('7en1') || ln.includes('set') || ln.includes('kit')))
  ) return 'accessoire'

  // ── Montres connectées (avant enceinte, certains coffrets contiennent "montre + speaker") ──
  if (
    (ln.includes('montre') || ln.includes('smartwatch') || ln.includes('smart watch') || ln.includes('smart_watch') || ln.includes('bracelet connecte') || (ln.includes('watch') && !ln.includes('stopwatch'))) &&
    !ln.includes('speaker') && !ln.includes('baffle') && !ln.includes('haut parleur') && !ln.includes('haut-parleur')
  ) return 'montre_connectee'

  // ── Enceintes / Haut-parleurs AVANT les marques (ex: Xiaomi speaker, JBL baffle) ──
  if (
    ln.includes('enceinte') ||
    ln.includes('haut-parleur') ||
    ln.includes('haut parleur') ||
    ln.includes('speaker') ||
    ln.includes('baffle') ||
    ln.includes('caisson de basses') ||
    ln.includes('karaoké') ||
    ln.includes('karaoke') ||
    (ln.includes('subwoofer') && !ln.includes('casque') && !ln.includes('ecouteur'))
  ) return 'enceinte'

  // ── Casques audio AVANT les marques ──────────────────────────────────────────
  if (
    ln.includes('casque') ||
    ln.includes('headphone') ||
    ln.includes('headset') ||
    ln.includes('supra-auriculaire') ||
    ln.includes('circum-auriculaire') ||
    ln.includes('over-ear') ||
    ln.includes('on-ear')
  ) return 'casque'

  // ── Écouteurs filaires AVANT les marques ─────────────────────────────────────
  if (
    (ln.includes('ecouteur') || ln.includes('earpod') || ln.includes('earphone')) &&
    (
      ln.includes('filaire') ||
      ln.includes('jack') ||
      ln.includes('3,5') ||
      ln.includes('3.5') ||
      (ln.includes('lightning') && !ln.includes('tws') && !ln.includes('sans fil'))
    )
  ) return 'ecouteur_filaire'

  // ── Écouteurs sans fil TWS AVANT les marques ─────────────────────────────────
  if (
    ln.includes('tws') ||
    ln.includes('airpod') ||
    ln.includes('air pod') ||
    ln.includes('buds') ||
    ((ln.includes('ecouteur') || ln.includes('earphone')) && (ln.includes('sans fil') || ln.includes('wireless')))
  ) return 'ecouteur_tws'

  // ── Téléphones ───────────────────────────────────────────────────────────────
  if (ln.includes('iphone') || ln.includes('apple iphone')) return 'iphone'

  if (
    ln.includes('samsung galaxy') ||
    (ln.includes('samsung') && (ln.includes('galaxy') || ln.includes('s2') || ln.includes('a2') || ln.includes('note')))
  ) return 'samsung'

  if (
    ln.includes('google pixel') ||
    (ln.includes('pixel') && ln.includes('google'))
  ) return 'google_pixel'

  if (
    ln.includes('infinix') ||
    ln.includes('itel') ||
    ln.includes('tecno') ||
    ln.includes('xiaomi') ||
    ln.includes('redmi') ||
    ln.includes('oppo') ||
    ln.includes('realme') ||
    ln.includes('oneplus') ||
    ln.includes('huawei') ||
    ln.includes('motorola')
  ) return 'telephone'

  // ── Accessoires divers ─────────────────────────────────────────────────────
  if (
    ln.includes('coque') ||
    ln.includes('pochette') ||
    ln.includes('étui') ||
    ln.includes('etui') ||
    ln.includes('chargeur') ||
    ln.includes('câble') ||
    ln.includes('cable') ||
    ln.includes('support') ||
    ln.includes('coffret') ||
    ln.includes('prise') ||
    ln.includes('adaptateur')
  ) return 'accessoire'

  // Vérifier si ressemble à un smartphone générique
  if (
    ln.includes('smartphone') ||
    ln.includes('telephone') ||
    ln.includes('phone') ||
    ln.includes('mobile') ||
    ln.includes('android')
  ) return 'telephone'

  return 'accessoire'
}

// ══════════════════════════════════════════════════════════════════════════════
//  EXTRACTION DES SPÉCIFICATIONS — TÉLÉPHONES
// ══════════════════════════════════════════════════════════════════════════════

function extractPhoneSpecs(name) {
  const specs = {}

  // Stockage : 128 Go, 256 Go, 512 Go, 1 To, 1To…
  const storageMatch = name.match(/(\d+)\s*(Go|To|GB|TB)\b(?:\s*[-–])?\s*(?!RAM)/i)
  if (storageMatch) {
    specs.stockage = `${storageMatch[1]} ${storageMatch[2].toUpperCase()}`
  }

  // RAM : 8Go RAM, 6 Go RAM, 12 Go de RAM…
  const ramMatch = name.match(/(\d+)\s*[GgMm][oO]\s*(?:de\s+)?RAM\b/i)
  if (ramMatch) {
    specs.ram = `${ramMatch[1]} Go RAM`
  }

  // Taille d'écran : 6,1_, 6.7_, 6,9_ (le _ est un artefact de troncature de ")
  const screenMatch = name.match(/(\d+[,.]?\d*)\s*[_"'']\s*(?:Super Retina|AMOLED|OLED|LCD)?/i)
  if (!screenMatch) {
    // essai alternatif
    const altScreen = name.match(/(\d+[,.]?\d+)[_"'']\s/)
    if (altScreen) specs.ecran = `${altScreen[1].replace(',', '.')} pouces`
  } else {
    specs.ecran = `${screenMatch[1].replace(',', '.')} pouces`
  }

  // Processeur : Apple A18, Apple A19 Pro, Snapdragon, Exynos, Dimensity…
  const cpuPatterns = [
    /Apple\s+A\d+\s*(?:Pro|Bionic)?/i,
    /Snapdragon\s+[\w\d]+/i,
    /Exynos\s+[\w\d]+/i,
    /Dimensity\s+[\w\d]+/i,
    /Helio\s+[\w\d]+/i,
    /Tensor\s+G\d+/i,
    /Kirin\s+[\w\d]+/i,
  ]
  for (const pat of cpuPatterns) {
    const m = name.match(pat)
    if (m) { specs.processeur = m[0].trim(); break }
  }

  // Batterie : 3561 mAh, 4832 mAh…
  const battMatch = name.match(/(\d[\d\s]*)\s*mAh/i)
  if (battMatch) {
    specs.batterie = `${battMatch[1].replace(/\s/g, '')} mAh`
  }

  // Appareils photo (format : 48MP+12MP_12MP où _ sépare arrière / avant)
  const cameraMatch = name.match(/([\d+\s]+MP[\d+\s*MP]*)[_\/]([\d]+\s*MP)/i)
  if (cameraMatch) {
    specs.camera_arriere = cameraMatch[1].trim()
    specs.camera_avant = cameraMatch[2].trim()
  } else {
    // Format simplifié : 48MP
    const simpleCamera = name.match(/(\d+)\s*MP/i)
    if (simpleCamera) specs.camera_arriere = `${simpleCamera[1]} MP`
  }

  // Type SIM
  if (/Nano-SIM\s*\+\s*eSIM/i.test(name)) {
    specs.sim = 'Nano-SIM + eSIM'
  } else if (/Dual\s+eSIM/i.test(name)) {
    specs.sim = 'Dual eSIM'
  } else if (/eSIM/i.test(name)) {
    specs.sim = 'eSIM'
  } else if (/2\s+Nano\s+SIM/i.test(name)) {
    specs.sim = 'Double Nano-SIM'
  } else if (/Nano\s+SIM/i.test(name)) {
    specs.sim = 'Nano-SIM'
  }

  // Connectivité 5G
  if (/\b5G\b/i.test(name)) specs.connectivite = '5G'
  else if (/\b4G\b/i.test(name)) specs.connectivite = '4G'

  // État (occasion / reconditionné)
  const ln = name.toLowerCase()
  if (ln.includes('occasion') || ln.includes('seconde main')) specs.etat = 'Occasion'
  else if (ln.includes('reconditionn')) specs.etat = 'Reconditionné'
  else specs.etat = 'Neuf'

  return specs
}

// ══════════════════════════════════════════════════════════════════════════════
//  EXTRACTION DES SPÉCIFICATIONS — ENCEINTES / HAUT-PARLEURS
// ══════════════════════════════════════════════════════════════════════════════

function extractSpeakerSpecs(name) {
  const specs = {}
  const ln = name.toLowerCase()

  // Puissance : 30W, 13W, 3 Watts
  const powerMatch = name.match(/(\d+)\s*[Ww]atts?/) || name.match(/Puissance[^:_\-]*[:_\-]\s*(\d+)\s*W/i)
  if (powerMatch) specs.puissance = `${powerMatch[1]} W`

  // Version Bluetooth
  const btMatch = name.match(/Bluetooth\s+([\d.]+)/i)
  if (btMatch) specs.bluetooth = `Bluetooth ${btMatch[1]}`
  else if (ln.includes('bluetooth')) specs.bluetooth = 'Bluetooth'

  // Capacité batterie
  const battMatch = name.match(/(\d[\d\s]*)\s*mAh/i)
  if (battMatch) specs.batterie = `${battMatch[1].replace(/\s/g, '')} mAh`

  // Autonomie
  const autoMatch = name.match(/(?:Autonomie|Longue\s+dur)[^0-9]*(\d+)\s*[–à-]\s*(\d+)\s*h/i)
    || name.match(/(\d+)\s*[–à-]\s*(\d+)\s*h(?:eure)?/i)
    || name.match(/(\d+)\s*h(?:eure)?s?\s+(?:de\s+)?(?:lecture|autonomie)/i)
  if (autoMatch) {
    if (autoMatch[2]) specs.autonomie = `${autoMatch[1]}–${autoMatch[2]} h`
    else specs.autonomie = `${autoMatch[1]} h`
  }

  // Interfaces / Connectivité
  const interfaces = []
  if (/\bUSB\b/i.test(name)) interfaces.push('USB')
  if (/\bAux\b/i.test(name) || /3[,.]5\s*mm/i.test(name)) interfaces.push('AUX')
  if (/\bTF\b|\bmicro.?SD\b/i.test(name)) interfaces.push('Carte TF')
  if (/USB[-\s]?C|Type[-\s]?C/i.test(name)) interfaces.push('USB-C')
  if (/radio\s*FM|FM/i.test(name)) interfaces.push('Radio FM')
  if (interfaces.length) specs.interfaces = interfaces.join(', ')

  // Etanchéité
  const ipxMatch = name.match(/IPX?\s*(\d+)/i)
  if (ipxMatch) specs.etancheite = `IPX${ipxMatch[1]}`
  else if (ln.includes('étanche') || ln.includes('waterproof')) specs.etancheite = 'Étanche'

  // Eclairage RGB
  if (ln.includes('rgb') || ln.includes('led')) specs.eclairage = 'LED / RGB'

  // Type
  if (ln.includes('sans fil') || ln.includes('bluetooth') || ln.includes('wireless')) {
    specs.type_connexion = 'Sans fil (Bluetooth)'
  } else {
    specs.type_connexion = 'Filaire'
  }

  return specs
}

// ══════════════════════════════════════════════════════════════════════════════
//  EXTRACTION DES SPÉCIFICATIONS — CASQUES AUDIO
// ══════════════════════════════════════════════════════════════════════════════

function extractHeadphoneSpecs(name) {
  const specs = {}
  const ln = name.toLowerCase()

  // Connexion : filaire ou sans fil
  if (ln.includes('filaire') || (ln.includes('usb-c') && !ln.includes('sans fil')) || (ln.includes('jack') && !ln.includes('sans fil'))) {
    specs.type_connexion = 'Filaire'
  } else if (ln.includes('sans fil') || ln.includes('bluetooth') || ln.includes('wireless')) {
    specs.type_connexion = 'Sans fil (Bluetooth)'
  } else {
    specs.type_connexion = 'Bluetooth / Filaire'
  }

  // Version Bluetooth
  const btMatch = name.match(/Bluetooth\s+([\d.]+)/i)
  if (btMatch) specs.bluetooth = `Bluetooth ${btMatch[1]}`
  else if (ln.includes('bluetooth') || ln.includes('sans fil')) specs.bluetooth = 'Bluetooth'

  // Réduction de bruit
  if (ln.includes('anc') || ln.includes('réduction active') || ln.includes('reduction active') || ln.includes('suppression') || ln.includes('noise cancel')) {
    specs.reduction_bruit = 'ANC (Réduction Active du Bruit)'
  } else if (ln.includes('enc')) {
    specs.reduction_bruit = 'ENC (Microphone)'
  }

  // Taille du driver
  const driverMatch = name.match(/(\d+(?:[,.]\d+)?)\s*mm\b/i)
  if (driverMatch) specs.driver = `${driverMatch[1]} mm`

  // Autonomie
  const autoMatch = name.match(/(\d+)\s*[hH](?:eure)?s?\s*(?:d[e']?\s*)?(?:lecture|autonomie|batterie|play)/i)
    || name.match(/autonomie\s*[:\-]?\s*(\d+)\s*[hH]/i)
    || name.match(/(\d+)\s*h\b/)
  if (autoMatch) specs.autonomie = `${autoMatch[1]} h`

  // Type de port
  if (/USB[-\s]?C|Type[-\s]?C/i.test(name)) specs.charge = 'USB-C'
  else if (/micro[-\s]?USB/i.test(name)) specs.charge = 'Micro-USB'

  // Gaming
  if (ln.includes('gaming') || ln.includes('jeu') || ln.includes('game') || ln.includes('pubg') || ln.includes('esport')) {
    specs.gaming = 'Oui'
  }

  // RGB
  if (ln.includes('rgb') || ln.includes('led')) specs.eclairage = 'LED / RGB'

  // Microphone
  if (ln.includes('micro') || ln.includes('microphone') || ln.includes('mic')) {
    specs.microphone = 'Oui'
  }

  return specs
}

// ══════════════════════════════════════════════════════════════════════════════
//  EXTRACTION DES SPÉCIFICATIONS — ÉCOUTEURS FILAIRES
// ══════════════════════════════════════════════════════════════════════════════

function extractWiredEarphoneSpecs(name) {
  const specs = {}
  const ln = name.toLowerCase()

  specs.type_connexion = 'Filaire'

  // Type de connecteur
  if (/USB[-\s]?C|Type[-\s]?C/i.test(name)) {
    specs.connecteur = 'USB-C'
  } else if (/lightning/i.test(name)) {
    specs.connecteur = 'Lightning'
  } else if (/3[,.]5\s*mm|jack/i.test(name)) {
    specs.connecteur = 'Jack 3,5 mm'
  } else {
    specs.connecteur = 'Jack 3,5 mm'
  }

  // Taille du driver
  const driverMatch = name.match(/(\d+(?:[,.]\d+)?)\s*mm\b/i)
  if (driverMatch) specs.driver = `${driverMatch[1]} mm`

  // Longueur du câble
  const cableMatch = name.match(/(\d+[,.]?\d*)\s*m\b(?!\w)/i)
  if (cableMatch && parseFloat(cableMatch[1]) < 5) {
    specs.longueur_cable = `${cableMatch[1]} m`
  }

  // Microphone
  if (ln.includes('micro') || ln.includes('microphone') || ln.includes('mic')) {
    specs.microphone = 'Oui'
  }

  // Etanchéité
  const ipxMatch = name.match(/IP[Xx]?\s*(\d+)/i)
  if (ipxMatch) specs.etancheite = `IP${ipxMatch[1]}`

  // Hi-Fi
  if (ln.includes('hi-fi') || ln.includes('hi fi') || ln.includes('hifi') || ln.includes('hi-res') || ln.includes('haute fideli')) {
    specs.qualite_audio = 'Hi-Fi'
  }

  return specs
}

// ══════════════════════════════════════════════════════════════════════════════
//  EXTRACTION DES SPÉCIFICATIONS — ÉCOUTEURS SANS FIL (TWS)
// ══════════════════════════════════════════════════════════════════════════════

function extractTWSSpecs(name) {
  const specs = {}
  const ln = name.toLowerCase()

  specs.type_connexion = 'Sans fil (Bluetooth)'

  // Version Bluetooth
  const btMatch = name.match(/Bluetooth\s+([\d.]+)/i) || name.match(/BT\s+([\d.]+)/i) || name.match(/V?\s*([\d.]+)\s*(?:BT|Bluetooth)/i)
  if (btMatch) specs.bluetooth = `Bluetooth ${btMatch[1]}`
  else specs.bluetooth = 'Bluetooth'

  // Réduction de bruit
  if (ln.includes('anc') || ln.includes('réduction active') || ln.includes('noise cancel')) {
    specs.reduction_bruit = 'ANC (Réduction Active du Bruit)'
  } else if (ln.includes('enc')) {
    specs.reduction_bruit = 'ENC (Micro Suppression Bruit)'
  }

  // Driver
  const driverMatch = name.match(/(\d+(?:[,.]\d+)?)\s*mm\b/i)
  if (driverMatch) specs.driver = `${driverMatch[1]} mm`

  // Etanchéité
  const ipxMatch = name.match(/IPX?\s*(\d+)/i)
  if (ipxMatch) specs.etancheite = `IPX${ipxMatch[1]}`
  else if (ln.includes('étanche') || ln.includes('waterproof')) specs.etancheite = 'Étanche'

  // Autonomie (intervalle : durée par charge → durée totale avec étui)
  const autoMatch = name.match(/(\d+)\s*[hH](?:eure)?s?\s*(?:de\s+)?(?:lecture|autonomie|play)/i)
    || name.match(/autonomie[^0-9]*(\d+)\s*h/i)
  if (autoMatch) {
    const base = parseInt(autoMatch[1])
    if (base > 0 && base < 200) {
      const maxPer = base + rand(1, 3)
      const caseMin = base * rand(4, 5)
      const caseMax = caseMin + rand(5, 10)
      specs.autonomie_ecouteurs = `${base}–${maxPer} h`
      specs.autonomie_totale   = `${caseMin}–${caseMax} h (avec étui de charge)`
    }
  } else {
    // Intervalle aléatoire réaliste si non trouvé dans le nom
    const perMin = rand(4, 6)
    const perMax = perMin + rand(1, 3)
    const caseMin = perMin * rand(4, 5)
    const caseMax = caseMin + rand(5, 10)
    specs.autonomie_ecouteurs = `${perMin}–${perMax} h`
    specs.autonomie_totale   = `${caseMin}–${caseMax} h (avec étui de charge)`
  }

  // Gaming / basse latence
  if (ln.includes('gaming') || ln.includes('latence') || ln.includes('faible latence') || ln.includes('low latency') || ln.includes('game')) {
    specs.gaming = 'Faible latence gaming'
  }

  // Affichage LED
  if (ln.includes('led') || ln.includes('affichage')) specs.affichage = 'LED'

  // Charge
  if (/USB[-\s]?C|Type[-\s]?C/i.test(name)) specs.charge = 'USB-C'

  return specs
}

// ══════════════════════════════════════════════════════════════════════════════
//  EXTRACTION DES SPÉCIFICATIONS — MONTRES CONNECTÉES
// ══════════════════════════════════════════════════════════════════════════════

function extractSmartwatchSpecs(name) {
  const specs = {}
  const ln = name.toLowerCase()

  // Type d'écran
  if (ln.includes('amoled')) specs.ecran = 'AMOLED'
  else if (ln.includes('oled')) specs.ecran = 'OLED'
  else if (ln.includes('lcd')) specs.ecran = 'LCD'
  else if (ln.includes('ips')) specs.ecran = 'IPS'

  // Batterie
  const battMatch = name.match(/(\d+[\d\s]*)\s*mAh/i)
  if (battMatch) specs.batterie = `${battMatch[1].replace(/\s/g, '')} mAh`

  // Autonomie
  const autoMatch = name.match(/(\d+)\s*(?:jours?|day)/i)
  if (autoMatch) {
    const days = parseInt(autoMatch[1])
    if (days > 0 && days < 100) specs.autonomie = `${days} jours`
  }

  // Étanchéité
  const ipxMatch = name.match(/IPX?\s*(\d+)/i) || name.match(/IP\s*(\d+\w?)/i)
  if (ipxMatch) specs.etancheite = `IP${ipxMatch[1]}`
  else if (ln.includes('étanche') || ln.includes('waterproof')) specs.etancheite = 'Étanche'

  // Fonctions santé
  const healthFeatures = []
  if (ln.includes('cardiaque') || ln.includes('cardio') || ln.includes('heart') || ln.includes('frequence')) healthFeatures.push('Fréquence cardiaque')
  if (ln.includes('spo2') || ln.includes('oxymètre') || ln.includes('oxymetre') || ln.includes('oxygene')) healthFeatures.push('SpO2')
  if (ln.includes('gps')) healthFeatures.push('GPS')
  if (ln.includes('sommeil') || ln.includes('sleep')) healthFeatures.push('Suivi sommeil')
  if (ln.includes('podometre') || ln.includes('podomètre') || ln.includes('pas')) healthFeatures.push('Podomètre')
  if (healthFeatures.length) specs.fonctions_sante = healthFeatures.join(', ')

  // Bluetooth
  const btMatch = name.match(/Bluetooth\s+([\d.]+)/i)
  if (btMatch) specs.bluetooth = `Bluetooth ${btMatch[1]}`
  else specs.bluetooth = 'Bluetooth'

  // Compatibilité
  if (ln.includes('ios') && ln.includes('android')) specs.compatibilite = 'iOS & Android'
  else if (ln.includes('android')) specs.compatibilite = 'Android'
  else if (ln.includes('ios') || ln.includes('apple')) specs.compatibilite = 'iOS'
  else specs.compatibilite = 'iOS & Android'

  return specs
}

// ══════════════════════════════════════════════════════════════════════════════
//  EXTRACTION SPECS SELON LA CATÉGORIE
// ══════════════════════════════════════════════════════════════════════════════

function buildSpecifications(category, name) {
  switch (category) {
    case 'iphone':
    case 'samsung':
    case 'google_pixel':
    case 'telephone':
      return extractPhoneSpecs(name)
    case 'enceinte':
      return extractSpeakerSpecs(name)
    case 'casque':
      return extractHeadphoneSpecs(name)
    case 'ecouteur_filaire':
      return extractWiredEarphoneSpecs(name)
    case 'ecouteur_tws':
      return extractTWSSpecs(name)
    case 'montre_connectee':
      return extractSmartwatchSpecs(name)
    default:
      return {}
  }
}

// ─── INFÉRENCE DE MARQUE ──────────────────────────────────────────────────────

const KNOWN_BRANDS = [
  'apple', 'samsung', 'google', 'xiaomi', 'redmi', 'oppo', 'realme',
  'oneplus', 'huawei', 'motorola', 'infinix', 'itel', 'tecno', 'nokia',
  'sony', 'lg', 'htc',
  'jbl', 'bose', 'sony', 'sennheiser', 'jabra', 'beats', 'anker',
  'oraimo', 'hoco', 'kisonli', 'logitech', 'marshall',
  'amazfit', 'garmin', 'fitbit', 'huawei',
]

function inferBrand(name) {
  const ln = name.toLowerCase()
  for (const brand of KNOWN_BRANDS) {
    if (ln.includes(brand)) return capitalizeWords(brand)
  }
  // Essai sur premier mot (ex: "Cyboris S1 …")
  const firstWord = ln.split(/[\s\-_]+/)[0]
  if (firstWord && firstWord.length > 2 && !/^(le|la|les|un|une|des|nouveau|nouvelle|mini|grand)$/.test(firstWord)) {
    return capitalizeWords(firstWord)
  }
  return 'Various'
}

// ─── COULEURS ──────────────────────────────────────────────────────────────────

const ALL_COLORS = [
  'Noir', 'Blanc', 'Bleu', 'Rouge', 'Vert', 'Jaune', 'Gris', 'Rose',
  'Marron', 'Orange', 'Violet', 'Beige', 'Argent', 'Or', 'Titane',
]

const COLOR_KEYWORDS = [
  'noir', 'blanc', 'bleu', 'rouge', 'vert', 'jaune', 'gris', 'rose',
  'marron', 'orange', 'violet', 'beige', 'argent', 'or', 'titane',
  'black', 'white', 'blue', 'red', 'green', 'gold', 'silver',
  'graphite', 'starlight', 'midnight', 'purple', 'pink',
]

const COLOR_MAP = {
  black: 'Noir', white: 'Blanc', blue: 'Bleu', red: 'Rouge',
  green: 'Vert', gold: 'Or', silver: 'Argent', graphite: 'Graphite',
  starlight: 'Starlight', midnight: 'Midnight', purple: 'Violet',
  pink: 'Rose',
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

  // Supprimer suffixes de résolution (-800x600)
  name = name.replace(/-\d{3,4}x\d{3,4}$/, '')

  // Nettoyer les espaces multiples
  name = name.replace(/\s+/g, ' ').trim()

  return name
}

// ─── CONSTRUCTION D'UN PRODUIT ─────────────────────────────────────────────

function buildProduct(id, dir, files) {
  const first = files[0]
  const name = cleanNameFromFilename(first)
  const category = inferCategory(name)
  const config = CATEGORY_CONFIG[category] || CATEGORY_CONFIG.accessoire

  const price = rand(config.priceMin, config.priceMax)
  const originalPrice = price + rand(Math.floor(price * 0.05), Math.floor(price * 0.30))
  const minOrder = rand(config.moMin, config.moMax)
  const tags = [...config.tags]
  const taxType = Math.random() > 0.5 ? 'ttc' : 'ht'
  const brand = inferBrand(name)
  const colors = extractColors(name)
  const specifications = buildSpecifications(category, name)

  const images = files.map(f =>
    `/telephone_accessoires/${dir}/${f.replace(/%/g, '%25').replace(/#/g, '%23')}`
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
    console.error('  → Crée le dossier public/telephone_accessoires/ et place-y les sous-dossiers numérotés.\n')
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

    // Nettoyer les '#' dans les noms de fichiers (problème URL)
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

  const out = `export const telephone_accessoires = ${JSON.stringify(products, null, 2)}\n`
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
