/**
 * EXEMPLE DE MISE À JOUR D'UNE PAGE AVEC LES TRADUCTIONS
 * 
 * Ce fichier montre comment transformer un composant existant
 * pour supporter le multilingue
 */

// ============================================
// AVANT (Sans traduction)
// ============================================

// import React from 'react';
// 
// const CartExample = () => {
//   return (
//     <div>
//       <h1>Mon Panier</h1>
//       <button>Passer la commande</button>
//       <p>Votre panier est vide</p>
//       <span>Continuer les achats</span>
//     </div>
//   );
// };

// ============================================
// APRÈS (Avec traduction)
// ============================================

import React from 'react';
import { useTranslation } from '../hooks/useTranslation';

const CartExample = () => {
  // Étape 1: Importer le hook
  const { t } = useTranslation();

  return (
    <div>
      {/* Étape 2: Remplacer les textes statiques par t.section.key */}
      <h1>{t.cart.title}</h1>
      <button>{t.cart.checkout}</button>
      <p>{t.cart.empty}</p>
      <span>{t.cart.continueShopping}</span>
    </div>
  );
};

// ============================================
// EXEMPLE AVEC COMPOSANTS COMPLEXES
// ============================================

const ProductExample = () => {
  const { t, language } = useTranslation();
  const product = { name: 'Produit', price: 1000 };

  return (
    <div>
      <h2>{product.name}</h2>
      
      {/* Utilisation dans les attributs */}
      <input 
        placeholder={t.header.searchPlaceholder}
        aria-label={t.common.search}
      />
      
      {/* Utilisation avec des conditions */}
      <p>
        {product.inStock ? t.product.inStock : t.product.outOfStock}
      </p>
      
      {/* Utilisation dans les boutons */}
      <button>{t.product.addToCart}</button>
      <button>{t.product.buyNow}</button>
      
      {/* Affichage conditionnel selon la langue */}
      {language === 'fr' ? (
        <p>Contenu spécifique en français</p>
      ) : (
        <p>English specific content</p>
      )}
    </div>
  );
};

// ============================================
// EXEMPLE AVEC DES LISTES
// ============================================

const CategoriesExample = () => {
  const { t } = useTranslation();

  // Les catégories sont maintenant traduites
  const categories = [
    t.categories.clothing,
    t.categories.electronics,
    t.categories.sports,
    t.categories.toys
  ];

  return (
    <ul>
      {categories.map((category, index) => (
        <li key={index}>{category}</li>
      ))}
    </ul>
  );
};

// ============================================
// EXEMPLE AVEC FORMULAIRES
// ============================================

const CheckoutExample = () => {
  const { t } = useTranslation();

  return (
    <form>
      <h2>{t.checkout.title}</h2>
      
      <label>
        {t.checkout.firstName}
        <input type="text" />
      </label>
      
      <label>
        {t.checkout.email}
        <input type="email" />
      </label>
      
      <button type="submit">
        {t.checkout.placeOrder}
      </button>
    </form>
  );
};

// ============================================
// EXEMPLE AVEC MESSAGES DYNAMIQUES
// ============================================

const OrderConfirmationExample = () => {
  const { t } = useTranslation();
  const orderNumber = '12345';
  const userEmail = 'user@example.com';

  return (
    <div>
      <h1>{t.orderConfirmation.thankYou}</h1>
      <p>
        {t.orderConfirmation.orderNumber}: {orderNumber}
      </p>
      <p>
        {t.orderConfirmation.confirmationSent} {userEmail}
      </p>
    </div>
  );
};

// ============================================
// CHECKLIST DE CONVERSION
// ============================================

/**
 * Pour convertir un composant existant :
 * 
 * 1. ✅ Importer le hook
 *    import { useTranslation } from '../hooks/useTranslation';
 * 
 * 2. ✅ Utiliser le hook dans le composant
 *    const { t } = useTranslation();
 * 
 * 3. ✅ Remplacer TOUS les textes français par des clés de traduction
 *    "Mon Panier" → {t.cart.title}
 * 
 * 4. ✅ Vérifier les placeholders d'inputs
 *    placeholder="Rechercher..." → placeholder={t.header.searchPlaceholder}
 * 
 * 5. ✅ Vérifier les attributs aria et title
 *    aria-label="Fermer" → aria-label={t.common.close}
 * 
 * 6. ✅ Tester le changement de langue dans le Header
 * 
 * 7. ✅ Ajouter de nouvelles traductions si nécessaire dans translations.js
 */

export { CartExample, ProductExample, CategoriesExample, CheckoutExample, OrderConfirmationExample };
