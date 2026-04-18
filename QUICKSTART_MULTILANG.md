# 🌍 Quick Start - Système Multilingue

## ⚡ Utilisation Rapide

### Dans n'importe quel composant :

```jsx
import { useTranslation } from '../hooks/useTranslation';

function MonComposant() {
  const { t, language, changeLanguage } = useTranslation();
  
  return (
    <div>
      <h1>{t.header.cart}</h1>
      <p>Langue actuelle : {language}</p>
    </div>
  );
}
```

## 📖 Sections principales

| Section | Usage | Exemple |
|---------|-------|---------|
| `t.header.*` | Menu, navigation | `t.header.cart` → "Panier" / "Cart" |
| `t.categories.*` | Catégories | `t.categories.clothing` → "Vêtements & Accessoires" |
| `t.product.*` | Pages produit | `t.product.addToCart` → "Ajouter au panier" |
| `t.cart.*` | Panier | `t.cart.empty` → "Votre panier est vide" |
| `t.checkout.*` | Commande | `t.checkout.title` → "Finaliser la commande" |
| `t.auth.*` | Authentification | `t.auth.login` → "Se connecter" |
| `t.common.*` | Éléments communs | `t.common.save` → "Enregistrer" |

## 🎯 Cas d'usage courants

### 1. Boutons
```jsx
<button>{t.product.addToCart}</button>
<button>{t.cart.checkout}</button>
<button>{t.common.save}</button>
```

### 2. Titres et Labels
```jsx
<h1>{t.cart.title}</h1>
<label>{t.checkout.firstName}</label>
```

### 3. Placeholders
```jsx
<input placeholder={t.header.searchPlaceholder} />
```

### 4. Messages conditionnels
```jsx
{items.length === 0 ? t.cart.empty : t.cart.items}
```

### 5. Listes de catégories
```jsx
const categories = [
  t.categories.clothing,
  t.categories.electronics,
  t.categories.sports
];
```

## 🔄 Changement de langue

Le sélecteur de langue est déjà intégré dans le Header :
- Cliquez sur **FR** ou **EN** 
- Le changement est immédiat et persiste au rechargement

## ➕ Ajouter une traduction

1. Ouvrir `src/data/translations.js`
2. Ajouter dans les deux langues :

```javascript
fr: {
  maNouvelleSections: {
    texte1: "Mon texte en français",
    texte2: "Autre texte"
  }
}

en: {
  maNouvelleSections: {
    texte1: "My text in English",
    texte2: "Other text"
  }
}
```

3. Utiliser : `{t.maNouvelleSections.texte1}`

## ✅ Fichiers modifiés

- ✅ `App.jsx` - Provider ajouté
- ✅ `Header.jsx` - Entièrement traduit avec sélecteur fonctionnel
- ✅ `context/LanguageContext.jsx` - Nouveau
- ✅ `data/translations.js` - Nouveau
- ✅ `hooks/useTranslation.js` - Nouveau

## 🎨 Exemple complet

```jsx
import { useTranslation } from '../hooks/useTranslation';

const ExempleComplet = () => {
  const { t, language } = useTranslation();
  
  return (
    <div>
      {/* Titre */}
      <h1>{t.cart.title}</h1>
      
      {/* Recherche */}
      <input placeholder={t.header.searchPlaceholder} />
      
      {/* Boutons */}
      <button>{t.product.addToCart}</button>
      <button>{t.cart.checkout}</button>
      
      {/* Catégories */}
      <ul>
        <li>{t.categories.clothing}</li>
        <li>{t.categories.electronics}</li>
        <li>{t.categories.sports}</li>
      </ul>
      
      {/* Affichage conditionnel */}
      <p>
        {language === 'fr' 
          ? 'Contenu en français' 
          : 'Content in English'}
      </p>
    </div>
  );
};
```

## 🚀 Prochaines étapes

Pour finaliser l'intégration multilingue :

1. **Mettre à jour vos pages** (Cart, ProductDetail, Checkout, etc.)
2. **Remplacer tous les textes statiques** par les clés de traduction
3. **Ajouter de nouvelles traductions** si nécessaire dans `translations.js`
4. **Tester** en changeant la langue depuis le Header

---

**Tout est prêt ! 🎉** Vous pouvez maintenant tester en cliquant sur FR/EN dans votre Header.
