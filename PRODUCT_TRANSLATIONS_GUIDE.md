# Guide pour ajouter les traductions de noms de produits

## Comment ça fonctionne

Le système de traduction des noms de produits permet d'afficher les noms en français ou en anglais automatiquement selon la langue sélectionnée par l'utilisateur.

## Où ajouter les traductions

Fichier : `src/data/translations.js`

Dans la section `en.productNames`, ajoutez les traductions comme ceci :

```javascript
productNames: {
  // Format: "Nom en français": "English Name",
  
  // Vêtements Homme
  "Ensemble Nike": "Nike Set",
  "Ensemble Longue Manche Palm Angels": "Palm Angels Long Sleeve Set",
  "T-Shirt Basique": "Basic T-Shirt",
  "Chemise Formelle": "Formal Shirt",
  "Pantalon Cargo": "Cargo Pants",
  "Costume 3 Pièces": "3-Piece Suit",
  "Veste En Cuir": "Leather Jacket",
  
  // Vêtements Femme
  "Robe Moulante": "Bodycon Dress",
  "Jupe En Jeans Femme": "Women's Denim Skirt",
  "Robe D'Été": "Summer Dress",
  "Chemisier Élégant": "Elegant Blouse",
  "Pantalon Taille Haute": "High Waist Pants",
  "Veste Blazer": "Blazer Jacket",
  
  // Chaussures
  "Baskets Sport": "Sport Sneakers",
  "Chaussures De Ville": "Dress Shoes",
  "Sandales D'Été": "Summer Sandals",
  
  // Bijoux
  "Collier En Or": "Gold Necklace",
  "Bracelet Argent": "Silver Bracelet",
  "Boucles D'Oreilles": "Earrings",
  
  // Et ainsi de suite...
}
```

## Comment générer automatiquement les traductions

Si vous avez beaucoup de produits à traduire, vous pouvez :

1. **Extraire tous les noms uniques** :
```javascript
// Script à exécuter dans la console du navigateur
const allProducts = [...vetement_homme, ...vetement_femme, ...chaussure];
const uniqueNames = [...new Set(allProducts.map(p => p.name))].sort();
console.log(JSON.stringify(uniqueNames, null, 2));
```

2. **Utiliser un service de traduction API** (Google Translate API, DeepL, etc.) pour traduire automatiquement la liste.

3. **Ou créer un fichier CSV** et le remplir manuellement :
```csv
Français,English
Ensemble Nike,Nike Set
Robe Moulante,Bodycon Dress
...
```

## Comment ça s'applique dans le code

Le code utilise la fonction `getProductName(product)` qui :
- Retourne le nom original (français) si la langue est "fr"
- Retourne la traduction anglaise si elle existe
- Retourne le nom original si aucune traduction n'est trouvée

```javascript
// Exemple d'utilisation
<h3>{getProductName(product)}</h3>
```

## Avantages

✅ **Automatique** : Les noms changent automatiquement avec la langue  
✅ **Centralisé** : Toutes les traductions au même endroit  
✅ **Fallback** : Si une traduction manque, le nom français est affiché  
✅ **Facile à maintenir** : Ajoutez simplement une ligne dans `translations.js`

## Exemple complet

```javascript
// Dans translations.js
en: {
  productNames: {
    "Ensemble Nike": "Nike Set",
    "Robe Moulante": "Bodycon Dress",
    "Jupe En Jeans Femme": "Women's Denim Skirt",
    // ... ajoutez plus de traductions
  }
}
```

```jsx
// Dans votre composant
const { language } = useTranslation();

// La fonction getProductName() traduit automatiquement
<h3>{getProductName(product)}</h3>
// Si language = 'fr' → "Ensemble Nike"
// Si language = 'en' → "Nike Set"
```

## Pour les nouveaux produits

Quand vous ajoutez de nouveaux produits, pensez à ajouter leur traduction dans `translations.js` :

```javascript
"Nouveau Produit Français": "New English Product",
```

## Notes importantes

- Les noms de produits dans les fichiers `vetement_homme.js` et `vetement_femme.js` restent en français (langue source)
- Seules les traductions anglaises sont ajoutées dans `translations.js`
- Le système est extensible pour d'autres langues si nécessaire
