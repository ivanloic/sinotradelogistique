# 📧 Guide de Configuration EmailJS - SinoTrade

## ✅ Configuration Terminée !

Vos clés EmailJS sont déjà configurées dans `.env` :
- Service ID: `service_f9x0qpk`
- Template ID: `template_aut64ll`
- Public Key: `ZqS1GRrdMXsMspOFd`

---

## 🎯 Comment ça fonctionne

Quand un client :
1. Passe une commande
2. Upload une capture d'écran de paiement
3. Clique sur "Confirmer l'envoi du paiement"

**→ Vous recevez automatiquement un email avec :**
- ✅ Nom du client
- ✅ Email et téléphone
- ✅ Adresse de livraison
- ✅ Liste des articles commandés
- ✅ Montant total
- ✅ **La capture d'écran du paiement**

---

## 🚀 Pour tester

1. **Redémarrez votre serveur** (important après modification de .env) :
```bash
npm run dev
```

2. **Passez une commande test** :
   - Ajoutez des produits au panier
   - Allez à la page de paiement
   - Complétez la commande
   - Uploadez une image (n'importe laquelle)
   - Cliquez sur "Confirmer l'envoi du paiement"

3. **Vérifiez votre email !** 📬

---

## 📋 Template EmailJS

Le template HTML est dans le fichier : **`email-template.html`**

### Pour l'utiliser :

1. Allez sur [https://dashboard.emailjs.com/](https://dashboard.emailjs.com/)
2. Cliquez sur **"Email Templates"**
3. Trouvez le template avec l'ID : `template_aut64ll`
4. Ouvrez le fichier **`email-template.html`**
5. **Copiez tout le contenu**
6. **Collez-le** dans l'éditeur de template EmailJS
7. **Sauvegardez**

---

## 🔧 Variables utilisées dans le template

Ces variables sont automatiquement remplies par le code :

| Variable | Description |
|----------|-------------|
| `{{order_number}}` | Numéro de commande (ex: ORD-1234567890) |
| `{{customer_name}}` | Nom complet du client |
| `{{customer_email}}` | Email du client |
| `{{customer_phone}}` | Téléphone du client |
| `{{order_date}}` | Date et heure de la commande |
| `{{shipping_address}}` | Adresse de livraison |
| `{{shipping_city}}` | Ville |
| `{{shipping_country}}` | Pays |
| `{{payment_method}}` | Mode de paiement (Orange Money, etc.) |
| `{{order_status}}` | Statut de la commande |
| `{{items_list}}` | Liste des produits commandés |
| `{{items_count}}` | Nombre d'articles |
| `{{subtotal}}` | Sous-total |
| `{{shipping_cost}}` | Frais de livraison |
| `{{tax}}` | Taxes |
| `{{total}}` | Montant total |
| `{{screenshot_attachment}}` | Image de la capture (en base64) |
| `{{screenshot_name}}` | Nom du fichier uploadé |

---

## 🐛 Dépannage

### ❌ L'email n'arrive pas

**Vérifiez :**
1. Console du navigateur (F12) pour voir les erreurs
2. Que le serveur a été redémarré après modification du `.env`
3. EmailJS Dashboard → Email History pour voir les tentatives

### ❌ Erreur "Invalid public key"

- Vérifiez que la Public Key dans `.env` est correcte
- Copiez-la depuis EmailJS Dashboard → Account → General

### ❌ La capture d'écran n'apparaît pas

**Causes possibles :**
- Image trop volumineuse (max 5MB)
- Format non supporté (utilisez JPG, PNG, GIF ou WEBP)
- EmailJS limite les attachements base64 à environ 50KB

**Solution :** Compressez l'image avant de l'uploader

---

## 💡 Conseils

### Sécurité
1. **Ne partagez jamais** votre fichier `.env`
2. Le fichier `.env` est déjà dans `.gitignore`
3. Dans EmailJS Dashboard → Account → Security :
   - Ajoutez votre domaine autorisé
   - Activez la limitation de taux (50 emails/heure recommandé)

### Personnalisation
- Modifiez le template HTML dans `email-template.html`
- Changez les couleurs, ajoutez votre logo, etc.
- Copiez le nouveau code dans EmailJS

### Limites
- **Plan gratuit :** 200 emails/mois
- Si vous dépassez, passez au plan payant (15€/mois pour 10,000 emails)

---

## ✅ Checklist de vérification

- [x] `.env` créé avec les 3 clés
- [x] Package `@emailjs/browser` installé
- [x] Service email créé (`emailService.js`)
- [x] Intégration dans `OrderConfirmation.jsx`
- [x] Template HTML créé (`email-template.html`)
- [ ] Template copié dans EmailJS Dashboard
- [ ] Serveur redémarré
- [ ] Test effectué avec une commande
- [ ] Email reçu avec succès

---

## 🎉 C'est prêt !

Dès que vous redémarrez le serveur, le système est opérationnel.

**Bon commerce ! 🚀**
