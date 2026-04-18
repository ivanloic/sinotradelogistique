// Script utilitaire pour extraire tous les noms de produits uniques
// Usage: node src/scripts/extractProductNames.js

import { vetement_homme } from '../data/vetement_homme.js';
import { vetement_femme } from '../data/vetement_femme.js';
import { chaussure } from '../data/chaussure.js';
import { bijoux } from '../data/bijoux.js';

// Combiner tous les produits
const allProducts = [
  ...vetement_homme,
  ...vetement_femme,
  ...chaussure,
  ...bijoux
].filter(Boolean); // Filtrer les undefined au cas où un fichier n'existe pas

// Extraire les noms uniques
const uniqueNames = [...new Set(allProducts.map(p => p.name))].sort();

console.log('=== NOMS DE PRODUITS UNIQUES ===');
console.log(`Total: ${uniqueNames.length} produits\n`);

// Format pour translations.js
console.log('// Copier-coller dans translations.js -> en.productNames:');
console.log('productNames: {');
uniqueNames.forEach(name => {
  console.log(`  "${name}": "${name}", // À traduire`);
});
console.log('},\n');

// Format CSV pour traduction externe
console.log('=== FORMAT CSV ===');
console.log('Français,English');
uniqueNames.forEach(name => {
  console.log(`"${name}",""`);
});

// Statistiques
console.log('\n=== STATISTIQUES ===');
console.log(`Total produits: ${allProducts.length}`);
console.log(`Noms uniques: ${uniqueNames.length}`);
console.log(`Vêtements homme: ${vetement_homme.length}`);
console.log(`Vêtements femme: ${vetement_femme.length}`);
console.log(`Chaussures: ${chaussure?.length || 0}`);
console.log(`Bijoux: ${bijoux?.length || 0}`);

// Sauvegarder dans un fichier JSON
import fs from 'fs';
const output = {
  totalProducts: allProducts.length,
  uniqueNames: uniqueNames.length,
  names: uniqueNames,
  translationsTemplate: uniqueNames.reduce((acc, name) => {
    acc[name] = name; // Placeholder pour traduction
    return acc;
  }, {})
};

fs.writeFileSync(
  'product-names-to-translate.json',
  JSON.stringify(output, null, 2)
);

console.log('\n✅ Fichier "product-names-to-translate.json" créé avec succès!');
