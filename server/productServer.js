require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const express        = require('express');
const multer         = require('multer');
const fs             = require('fs').promises;
const path           = require('path');
const cors           = require('cors');
const monerooRouter  = require('./routes/moneroo');

const app  = express();
const PORT = process.env.PORT ?? 3001;

app.use(cors({
  origin: process.env.FRONTEND_URL ?? 'http://localhost:5173',
}));
app.use(express.json());

// ── Routes paiement Moneroo ──────────────────────────────────
app.use('/api/payments', monerooRouter);

// Configuration de multer pour la gestion des fichiers
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Fonction pour obtenir le prochain numéro de dossier
async function getNextFolderId(category) {
  const categoryPath = path.join(__dirname, '../public', category);
  
  try {
    const folders = await fs.readdir(categoryPath);
    const numericFolders = folders
      .filter(folder => !isNaN(folder))
      .map(folder => parseInt(folder));
    
    if (numericFolders.length === 0) return 1;
    return Math.max(...numericFolders) + 1;
  } catch (error) {
    console.error('Error reading category folder:', error);
    return 1;
  }
}

// Fonction pour sauvegarder les images
async function saveImages(category, folderId, images) {
  const folderPath = path.join(__dirname, '../public', category, folderId.toString());
  
  // Créer le dossier s'il n'existe pas
  await fs.mkdir(folderPath, { recursive: true });
  
  const imagePaths = [];
  for (let i = 0; i < images.length; i++) {
    const image = images[i];
    const ext = path.extname(image.originalname);
    const filename = `${i + 1}${ext}`;
    const imagePath = path.join(folderPath, filename);
    
    await fs.writeFile(imagePath, image.buffer);
    imagePaths.push(`/${category}/${folderId}/${filename}`);
  }
  
  return imagePaths;
}

// Fonction pour mettre à jour le fichier data
async function updateDataFile(category, productData) {
  const dataFilePath = path.join(__dirname, '../src/data', `${category}.js`);
  
  try {
    // Lire le contenu actuel
    let fileContent = await fs.readFile(dataFilePath, 'utf-8');
    
    // Extraire le nom de la variable (plus flexible)
    const varNameMatch = fileContent.match(/export\s+const\s+(\w+)\s*=/);
    if (!varNameMatch) {
      throw new Error('Could not find export statement in file');
    }
    
    const variableName = varNameMatch[1];
    
    // Extraire le tableau - chercher le premier [ jusqu'au dernier ]
    const arrayStartIndex = fileContent.indexOf('[');
    const arrayEndIndex = fileContent.lastIndexOf(']');
    
    if (arrayStartIndex === -1 || arrayEndIndex === -1) {
      throw new Error('Could not find array in file');
    }
    
    const arrayContent = fileContent.substring(arrayStartIndex, arrayEndIndex + 1);
    
    // Parser le tableau JSON avec une approche plus tolérante
    let dataArray;
    try {
      // Nettoyer le contenu pour enlever les commentaires et trailing commas
      const cleanedContent = arrayContent
        .replace(/\/\/.*$/gm, '') // Enlever les commentaires //
        .replace(/\/\*[\s\S]*?\*\//g, '') // Enlever les commentaires /* */
        .replace(/,(\s*[}\]])/g, '$1'); // Enlever les trailing commas
      
      dataArray = JSON.parse(cleanedContent);
    } catch (e) {
      console.error('JSON parsing failed:', e.message);
      console.error('Trying to load module directly...');
      
      // Fallback: charger le module directement
      try {
        const moduleContent = require(dataFilePath);
        dataArray = moduleContent[variableName] || moduleContent.default || moduleContent;
        if (!Array.isArray(dataArray)) {
          throw new Error('Loaded data is not an array');
        }
      } catch (moduleError) {
        console.error('Module loading also failed:', moduleError.message);
        throw new Error('Could not parse existing data array. File may be corrupted.');
      }
    }
    
    // Ajouter le nouveau produit
    dataArray.push(productData);
    
    // Reconstruire le contenu du fichier avec une indentation propre
    const newArrayContent = JSON.stringify(dataArray, null, 2);
    const newFileContent = `export const ${variableName} = ${newArrayContent};\n\nexport default ${variableName};\n`;
    
    // Écrire le fichier mis à jour
    await fs.writeFile(dataFilePath, newFileContent, 'utf-8');
    
    console.log(`✅ Product added to ${category}.js with ID: ${productData.id}`);
    return true;
  } catch (error) {
    console.error('Error updating data file:', error);
    throw error;
  }
}

// Route pour ajouter un produit
app.post('/api/products/add', upload.array('images'), async (req, res) => {
  try {
    const { category, ...productFields } = req.body;
    const images = req.files;
    
    if (!category) {
      return res.status(400).json({ error: 'Category is required' });
    }
    
    if (!images || images.length === 0) {
      return res.status(400).json({ error: 'At least one image is required' });
    }
    
    // Obtenir le prochain ID
    const nextId = await getNextFolderId(category);
    
    // Sauvegarder les images
    const imagePaths = await saveImages(category, nextId, images);
    
    // Préparer les données du produit selon la structure existante
    const productData = {
      id: nextId,
      name: productFields.name || '',
      price: productFields.price ? parseFloat(productFields.price) : 0,
      image: imagePaths[0], // Première image comme image principale
      images: imagePaths,
      taxType: "ht",
      brand: productFields.brand || "Various",
      category: productFields.productCategory || category, // Utiliser productCategory si fourni, sinon category
      minOrder: 24
    };
    
    // Ajouter les champs multilingues
    if (productFields.name_en) productData.name_en = productFields.name_en;
    if (productFields.name_zh) productData.name_zh = productFields.name_zh;
    if (productFields.description) productData.description = productFields.description;
    if (productFields.description_en) productData.description_en = productFields.description_en;
    if (productFields.description_zh) productData.description_zh = productFields.description_zh;
    
    // Prix promotionnel
    if (productFields.promo) {
      productData.originalPrice = productData.price;
      productData.price = parseFloat(productFields.promo);
    }
    
    // Ajouter les couleurs si présentes (format tableau)
    if (productFields.color) {
      productData.colors = productFields.color.split(',').map(c => c.trim());
    }
    
    // Ajouter les tailles si présentes
    if (productFields.size) {
      productData.sizes = productFields.size.split(',').map(s => s.trim());
    }
    
    // Champs spécifiques aux vêtements
    if (category === 'vetement_femme' || category === 'vetement_homme') {
      if (productFields.material) productData.material = productFields.material;
      if (productFields.material_en) productData.material_en = productFields.material_en;
      if (productFields.material_zh) productData.material_zh = productFields.material_zh;
      if (productFields.style) productData.style = productFields.style;
      if (productFields.style_en) productData.style_en = productFields.style_en;
      if (productFields.style_zh) productData.style_zh = productFields.style_zh;
      if (productFields.care) productData.care = productFields.care;
      if (productFields.care_en) productData.care_en = productFields.care_en;
      if (productFields.care_zh) productData.care_zh = productFields.care_zh;
    }
    
    // Champs spécifiques aux chaussures
    if (category === 'chaussure') {
      if (productFields.type) productData.type = productFields.type;
      if (productFields.type_en) productData.type_en = productFields.type_en;
      if (productFields.type_zh) productData.type_zh = productFields.type_zh;
      if (productFields.heelHeight) productData.heelHeight = parseFloat(productFields.heelHeight);
      if (productFields.material) productData.material = productFields.material;
      if (productFields.material_en) productData.material_en = productFields.material_en;
      if (productFields.material_zh) productData.material_zh = productFields.material_zh;
      if (productFields.care) productData.care = productFields.care;
      if (productFields.care_en) productData.care_en = productFields.care_en;
      if (productFields.care_zh) productData.care_zh = productFields.care_zh;
    }
    
    // Champs spécifiques aux bijoux
    if (category === 'bijou') {
      if (productFields.type) productData.type = productFields.type;
      if (productFields.type_en) productData.type_en = productFields.type_en;
      if (productFields.type_zh) productData.type_zh = productFields.type_zh;
      if (productFields.material) productData.material = productFields.material;
      if (productFields.material_en) productData.material_en = productFields.material_en;
      if (productFields.material_zh) productData.material_zh = productFields.material_zh;
      if (productFields.stone) productData.stone = productFields.stone;
      if (productFields.stone_en) productData.stone_en = productFields.stone_en;
      if (productFields.stone_zh) productData.stone_zh = productFields.stone_zh;
      if (productFields.weight) productData.weight = parseFloat(productFields.weight);
      if (productFields.length) productData.length = parseFloat(productFields.length);
      if (productFields.certification) productData.certification = productFields.certification;
      if (productFields.packaging) productData.packaging = productFields.packaging;
      if (productFields.packaging_en) productData.packaging_en = productFields.packaging_en;
      if (productFields.packaging_zh) productData.packaging_zh = productFields.packaging_zh;
      if (productFields.care) productData.care = productFields.care;
      if (productFields.care_en) productData.care_en = productFields.care_en;
      if (productFields.care_zh) productData.care_zh = productFields.care_zh;
    }
    
    // Mettre à jour le fichier data
    await updateDataFile(category, productData);
    
    res.json({ 
      success: true, 
      message: 'Product added successfully',
      productId: nextId,
      imagePaths: imagePaths
    });
    
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ error: error.message });
  }
});

// Route de test
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 Product server running on http://localhost:${PORT}`);
  console.log(`📝 API endpoint: http://localhost:${PORT}/api/products/add`);
});
