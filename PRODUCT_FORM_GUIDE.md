# 📦 Guide d'Installation et d'Utilisation - Formulaire d'Ajout de Produit

## 🚀 Installation

### 1. Installer les dépendances du serveur

```powershell
cd server
npm install
```

### 2. Démarrer le serveur backend

Option A - Avec le script PowerShell:
```powershell
.\start-server.ps1
```

Option B - Manuellement:
```powershell
cd server
npm start
```

Le serveur démarre sur `http://localhost:3001`

### 3. Démarrer l'application React

Dans un nouveau terminal:
```powershell
npm run dev
```

## 📋 Utilisation

### Accéder au formulaire

Ouvrez votre navigateur et allez à:
```
http://localhost:5173/admin/add-product
```

### Remplir le formulaire

1. **Sélectionner la catégorie** (Vêtements Femme, Vêtements Homme, Chaussures, Bijoux)
2. **Remplir les informations de base** (nom, prix, description en 3 langues)
3. **Ajouter les caractéristiques** (couleur, matériau, taille, etc.)
4. **Charger les images** (minimum 1 image requise)
5. **Cliquer sur "Ajouter le produit"**

## ✨ Fonctionnalités

### Gestion automatique des images
- ✅ Création automatique de dossiers numérotés
- ✅ Sauvegarde des images dans `public/{categorie}/{id}/`
- ✅ Numérotation automatique (1.jpg, 2.jpg, etc.)
- ✅ Aperçu des images avant envoi
- ✅ Possibilité de supprimer des images

### Gestion des données
- ✅ Enregistrement automatique dans les fichiers data (vetement_femme.js, etc.)
- ✅ Attribution automatique d'un ID unique
- ✅ Structure de données cohérente avec l'existant
- ✅ Support multilingue (FR, EN, ZH)

### Champs adaptés par catégorie

**Vêtements (Femme/Homme):**
- Nom, prix, description (3 langues)
- Couleur, matériau, taille
- Style, entretien
- Marque

**Chaussures:**
- Nom, prix, description (3 langues)
- Couleur, matériau, taille
- Type, hauteur du talon
- Marque, entretien

**Bijoux:**
- Nom, prix, description (3 langues)
- Couleur, matériau, type
- Pierre, poids, longueur
- Certification, emballage, entretien

## 🔧 Configuration

### Structure des dossiers

```
SinoTrade/
├── server/
│   ├── productServer.js       # Serveur backend
│   ├── package.json           # Dépendances serveur
│   └── node_modules/
├── src/
│   ├── page/
│   │   ├── AddProductForm.jsx # Composant formulaire
│   │   └── AddProductForm.css # Styles
│   ├── data/
│   │   ├── vetement_femme.js
│   │   ├── vetement_homme.js
│   │   ├── chaussure.js
│   │   └── bijou.js
│   └── App.jsx
└── public/
    ├── vetement_femme/
    ├── vetement_homme/
    ├── chaussure/
    └── bijou/
```

### Endpoints API

**POST** `/api/products/add`
- Body: FormData avec images et données produit
- Response: `{ success: true, productId: number, imagePaths: string[] }`

**GET** `/api/health`
- Response: `{ status: 'OK', message: 'Server is running' }`

## 🐛 Dépannage

### Le serveur ne démarre pas
```powershell
# Vérifier Node.js
node --version

# Réinstaller les dépendances
cd server
rm -rf node_modules
npm install
```

### Erreur CORS
Le serveur est configuré avec CORS activé. Si vous avez des problèmes:
1. Vérifiez que le serveur tourne sur le port 3001
2. Vérifiez que l'application React utilise le bon URL

### Les images ne s'enregistrent pas
1. Vérifiez les permissions du dossier `public/`
2. Vérifiez que les dossiers de catégories existent
3. Vérifiez les logs du serveur dans la console

### Les données ne sont pas sauvegardées
1. Vérifiez que les fichiers data existent dans `src/data/`
2. Vérifiez les permissions d'écriture
3. Regardez les erreurs dans la console du serveur

## 📝 Exemple d'utilisation

### Ajouter une robe

1. Catégorie: `Vêtements Femme`
2. Nom: `Robe Élégante Soirée`
3. Name EN: `Elegant Evening Dress`
4. Name ZH: `优雅晚礼服`
5. Prix: `89.99`
6. Promo: `69.99`
7. Description: `Magnifique robe de soirée...`
8. Couleur: `Noir, Rouge`
9. Matériau: `Polyester`
10. Taille: `S, M, L, XL`
11. Style: `Élégant`
12. Images: Sélectionner 3-5 images
13. Cliquer sur "Ajouter le produit"

Le produit sera créé avec l'ID suivant disponible et les images seront dans:
```
public/vetement_femme/{id}/1.jpg
public/vetement_femme/{id}/2.jpg
...
```

## 🎨 Personnalisation

### Modifier les styles
Éditez `src/page/AddProductForm.css`

### Ajouter des champs
1. Ajouter le champ dans `formData` (AddProductForm.jsx)
2. Ajouter le champ dans `getFieldsForCategory()`
3. Utiliser `renderField()` pour l'afficher
4. Le serveur l'enregistrera automatiquement

### Changer le port du serveur
Dans `server/productServer.js`, modifier:
```javascript
const PORT = 3001; // Changer ici
```

## 📞 Support

Si vous rencontrez des problèmes:
1. Vérifiez les logs du serveur
2. Vérifiez la console du navigateur (F12)
3. Assurez-vous que tous les services sont démarrés

---

✨ **Votre formulaire d'ajout de produit est prêt à l'emploi!**
