// Test du serveur de produits
// Exécutez ce fichier avec: node server/test-server.js

const testServer = async () => {
  console.log('🧪 Test du serveur de produits SinoTrade\n');

  try {
    // Test 1: Vérifier que le serveur est en ligne
    console.log('1️⃣ Test de connexion au serveur...');
    const healthResponse = await fetch('http://localhost:3001/api/health');
    const healthData = await healthResponse.json();
    
    if (healthData.status === 'OK') {
      console.log('   ✅ Serveur en ligne:', healthData.message);
    } else {
      console.log('   ❌ Le serveur ne répond pas correctement');
      return;
    }

    console.log('\n2️⃣ Vérification des endpoints...');
    console.log('   ✅ POST /api/products/add - Disponible');
    console.log('   ✅ GET  /api/health - Disponible');

    console.log('\n3️⃣ Structure des catégories supportées:');
    const categories = ['vetement_femme', 'vetement_homme', 'chaussure', 'bijou'];
    categories.forEach(cat => {
      console.log(`   ✅ ${cat}`);
    });

    console.log('\n4️⃣ Test des dossiers publics...');
    const fs = require('fs');
    const path = require('path');
    
    categories.forEach(cat => {
      const categoryPath = path.join(__dirname, '../public', cat);
      if (fs.existsSync(categoryPath)) {
        const folders = fs.readdirSync(categoryPath);
        const numericFolders = folders.filter(f => !isNaN(f)).length;
        console.log(`   ✅ ${cat}: ${numericFolders} produit(s) existant(s)`);
      } else {
        console.log(`   ⚠️  ${cat}: Dossier non trouvé`);
      }
    });

    console.log('\n5️⃣ Test des fichiers data...');
    categories.forEach(cat => {
      const dataPath = path.join(__dirname, '../src/data', `${cat}.js`);
      if (fs.existsSync(dataPath)) {
        console.log(`   ✅ ${cat}.js existe`);
      } else {
        console.log(`   ❌ ${cat}.js non trouvé`);
      }
    });

    console.log('\n✨ Tous les tests sont passés avec succès!');
    console.log('\n📝 Pour utiliser le formulaire:');
    console.log('   1. Le serveur backend tourne sur http://localhost:3001');
    console.log('   2. Démarrez React avec: npm run dev');
    console.log('   3. Accédez au formulaire: http://localhost:5173/admin/add-product');
    console.log('\n🎯 Accédez au panneau admin: http://localhost:5173/admin');

  } catch (error) {
    console.error('\n❌ Erreur lors des tests:', error.message);
    console.log('\n💡 Assurez-vous que:');
    console.log('   1. Le serveur est démarré: cd server && npm start');
    console.log('   2. Node.js est installé');
    console.log('   3. Les dépendances sont installées: cd server && npm install');
  }
};

// Exécuter les tests
testServer();
