# Guide d'intégration multilingue 🌍

## ✅ Système multilingue installé avec succès !

Votre site supporte maintenant le **Français** et l'**Anglais** avec changement de langue dynamique depuis le Header.

## 📁 Fichiers créés

1. **`src/context/LanguageContext.jsx`** - Gestion globale de la langue
2. **`src/data/translations.js`** - Toutes les traductions FR/EN
3. **`src/hooks/useTranslation.js`** - Hook personnalisé pour faciliter l'usage

## 🚀 Comment utiliser les traductions dans vos composants

### Méthode 1 : Utiliser le hook `useTranslation` (Recommandé)

```jsx
import { useTranslation } from '../hooks/useTranslation';

const MonComposant = () => {
  const { t, language } = useTranslation();

  return (
    <div>
      <h1>{t.header.cart}</h1>
      <p>{t.common.loading}</p>
      <button>{t.product.addToCart}</button>
    </div>
  );
};
```

### Méthode 2 : Utiliser directement les contextes

```jsx
import { useLanguage } from '../context/LanguageContext';
import { useTranslations } from '../data/translations';

const MonComposant = () => {
  const { language } = useLanguage();
  const t = useTranslations(language);

  return (
    <div>
      <h1>{t.header.cart}</h1>
    </div>
  );
};
```

## 📝 Sections de traductions disponibles

### 1. **Header** (`t.header`)
- `searchPlaceholder` - Placeholder de recherche
- `cart` - Panier
- `account` - Compte
- `categories` - Catégories

### 2. **Categories** (`t.categories`)
- `news` - Nouveautés / New Arrivals
- `deals` - Grandes Affaires / Great Deals
- `clothing` - Vêtements & Accessoires / Clothing & Accessories
- etc.

### 3. **Product** (`t.product`)
- `addToCart` - Ajouter au panier / Add to cart
- `buyNow` - Acheter maintenant / Buy now
- `price` - Prix / Price
- etc.

### 4. **Cart** (`t.cart`)
- `title` - Mon Panier / My Cart
- `empty` - Votre panier est vide / Your cart is empty
- `checkout` - Passer la commande / Checkout
- etc.

### 5. **Auth** (`t.auth`)
- `login` - Se connecter / Login
- `register` - S'inscrire / Register
- etc.

### 6. **Common** (`t.common`)
- `loading` - Chargement... / Loading...
- `save` - Enregistrer / Save
- `cancel` - Annuler / Cancel
- etc.

## 🔧 Comment ajouter de nouvelles traductions

Ouvrez `src/data/translations.js` et ajoutez vos traductions dans les deux langues :

```javascript
export const translations = {
  fr: {
    maSection: {
      monTexte: "Mon texte en français",
      autreTexte: "Un autre texte"
    }
  },
  en: {
    maSection: {
      monTexte: "My text in English",
      autreTexte: "Another text"
    }
  }
};
```

## 📋 Composants à mettre à jour

Pour appliquer les traductions à l'ensemble de votre site, mettez à jour ces fichiers :

### Pages prioritaires :
- ✅ **Header.jsx** - DÉJÀ MIS À JOUR
- ⏳ **Home.jsx** - À faire
- ⏳ **Cart.jsx** - À faire
- ⏳ **ProductDetail.jsx** - À faire
- ⏳ **Checkout.jsx** - À faire
- ⏳ **OrderConfirmation.jsx** - À faire

### Composants :
- ⏳ **Categories.jsx** - À faire
- ⏳ **Products.jsx** - À faire
- ⏳ **Hero.jsx** - À faire
- ⏳ **AuthPage.jsx** - À faire

## 💡 Exemple complet

Voici un exemple complet pour mettre à jour la page Cart :

```jsx
import { useTranslation } from '../hooks/useTranslation';

const Cart = () => {
  const { t } = useTranslation();
  const { cartItems } = useCart();

  return (
    <div>
      <h1>{t.cart.title}</h1>
      {cartItems.length === 0 ? (
        <p>{t.cart.empty}</p>
      ) : (
        <>
          <div>{t.cart.subtotal}: {total}</div>
          <button>{t.cart.checkout}</button>
        </>
      )}
    </div>
  );
};
```

## 🎨 Changement de langue

Le changement de langue se fait automatiquement depuis le Header :
- Cliquez sur **FR** ou **EN** dans le menu langue
- La langue est sauvegardée dans le localStorage
- Tous les composants utilisant `useTranslation` sont mis à jour automatiquement

## 📱 Persistance

La langue sélectionnée est automatiquement sauvegardée et restaurée au rechargement de la page grâce au localStorage.

## ⚙️ Configuration actuelle

- **Langue par défaut** : Français (fr)
- **Langues supportées** : Français (fr), Anglais (en)
- **Sauvegarde** : localStorage
- **Context Provider** : Intégré dans App.jsx

---

**Besoin d'aide ?** Consultez les fichiers suivants :
- `src/context/LanguageContext.jsx` - Logique de gestion de langue
- `src/data/translations.js` - Toutes les traductions
- `src/Components/Header.jsx` - Exemple d'implémentation
