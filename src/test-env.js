// Test de lecture des variables d'environnement
console.log('🔍 Vérification des variables d\'environnement:');
console.log('VITE_EMAILJS_SERVICE_ID:', import.meta.env.VITE_EMAILJS_SERVICE_ID);
console.log('VITE_EMAILJS_TEMPLATE_ID:', import.meta.env.VITE_EMAILJS_TEMPLATE_ID);
console.log('VITE_EMAILJS_PUBLIC_KEY:', import.meta.env.VITE_EMAILJS_PUBLIC_KEY);

// Vérifier que toutes les variables sont définies
const allDefined = 
  import.meta.env.VITE_EMAILJS_SERVICE_ID && 
  import.meta.env.VITE_EMAILJS_TEMPLATE_ID && 
  import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

if (allDefined) {
  console.log('✅ Toutes les variables d\'environnement sont définies');
} else {
  console.error('❌ Certaines variables d\'environnement manquent');
  console.error('💡 Assurez-vous que le fichier .env existe à la racine du projet');
  console.error('💡 Redémarrez le serveur après avoir modifié .env');
}
