# 🚀 Démarrage Rapide - Formulaire d'Ajout de Produit

## Étapes d'installation (1 minute)

### 1️⃣ Démarrer le serveur backend
```powershell
cd server
npm start
```
✅ Le serveur démarre sur http://localhost:3001

### 2️⃣ Dans un nouveau terminal, démarrer React
```powershell
npm run dev
```
✅ L'application démarre sur http://localhost:5173

### 3️⃣ Accéder au formulaire
Ouvrez votre navigateur et allez à:
```
http://localhost:5173/admin/add-product
```

## 🎯 Utilisation

1. **Sélectionnez une catégorie** (Vêtements, Chaussures, Bijoux)
2. **Remplissez les champs** (les champs avec * sont obligatoires)
3. **Ajoutez des images** (au moins 1 image requise)
4. **Cliquez sur "Ajouter le produit"**

✨ **C'est tout !** Le produit sera automatiquement:
- Enregistré dans le fichier data correspondant
- Les images sauvegardées dans un nouveau dossier numéroté
- Prêt à être affiché sur votre site

## 📁 Où sont sauvegardées les données?

**Images:** `public/{categorie}/{id}/1.jpg, 2.jpg...`
**Données:** `src/data/{categorie}.js`

---

Pour plus de détails, consultez `PRODUCT_FORM_GUIDE.md`
