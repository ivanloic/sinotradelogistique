// Méthodes de paiement avec images et détails
export const paymentMethods = [
  {
    id: 'card',
    name: 'Carte de Crédit',
    icon: 'card',
    description: 'Visa, Mastercard, American Express',
    logos: ['/payement/visa.png', '/payement/mastercard.png', '/payement/amex.png'],
    steps: [
      "Entrez le numéro de votre carte",
      "Renseignez la date d'expiration",
      "Saisissez le code CVV",
      "Validez le paiement sécurisé"
    ],
    details: {
      type: "Paiement par carte bancaire",
      value: "Cryptage SSL 256 bits",
      name: "Paiement 100% sécurisé"
    }
  },
  {
    id: 'paypal',
    name: 'PayPal',
    icon: 'PP',
    description: 'Paiement sécurisé PayPal',
    logos: ['/payement/paypal.png'],
    steps: [
      "Cliquez sur le lien PayPal: https://www.paypal.me/Fxstudio712",
      "Connectez-vous à votre compte PayPal",
      "Entrez le montant: {amount}",
      "Confirmez la transaction"
    ],
    details: {
      type: "Lien PayPal",
      value: "paypal.me/Fxstudio712",
      name: "FXSTUDIO"
    }
  },
  {
    id: 'orange',
    name: 'Orange Money',
    icon: 'OM',
    description: 'Paiement mobile Orange',
    logos: ['/payement/orangemoney.png'],
    steps: [
      "Entrez le numéro: 6 96 27 85 95",
      "Montant: {amount} FCFA",
      'Nom du Compte : ARNAUD SALVADOR',
      "Validez le paiement"
    ],
    details: {
      type: "Numéro Orange Money",
      value: "6 96 27 85 95",
      name: "Orange Money"
    }
  },
  {
    id: 'mtn',
    name: 'MTN Money',
    icon: 'MM',
    description: 'Paiement mobile MTN',
    logos: ['/payement/MobileMoney.jpg'],
    steps: [
      "Entrez le numéro: 6 81 30 86 10",
      "Montant: {amount} FCFA",
      'Nom du Compte : ANNIK LAURE NDJEN',
      "Validez avec votre code PIN"
    ],
    details: {
      type: "Numéro MTN Money",
      value: "6 81 30 86 10",
      name: "MTN Money"
    }
  },
  {
    id: 'wave',
    name: 'Wave',
    icon: 'WV',
    description: 'Paiement mobile Wave',
    logos: ['/payement/logowave.png'],
    steps: [
      "Ouvrez l'application Wave",
      "Entrez le numéro: 696 18 47 62",
      "Montant: {amount} FCFA",
      "Référence: {orderNumber}",
      "Confirmez l'envoi"
    ],
    details: {
      type: "Numéro Wave",
      value: "696 18 47 62",
    }
  },
  // {
  //   id: 'apple',
  //   name: 'Apple Pay',
  //   icon: 'AP',
  //   description: 'Paiement Apple sécurisé',
  //   logos: ['/payement/applepay.png'],
  //   steps: [
  //     "Cliquez sur le bouton Apple Pay",
  //     "Authentifiez-vous avec Face ID ou Touch ID",
  //     "Vérifiez le montant et les détails",
  //     "Confirmez le paiement"
  //   ],
  //   details: {
  //     type: "Apple Pay",
  //     value: "Paiement instantané",
  //     name: "CHINA TRADE HUB"
  //   }
  // }
];

// Fonction pour obtenir une méthode de paiement par ID
export const getPaymentMethod = (id) => {
  return paymentMethods.find(method => method.id === id);
};

// Fonction pour formater les étapes avec les données dynamiques
export const formatPaymentSteps = (methodId, orderNumber, amount) => {
  const method = getPaymentMethod(methodId);
  if (!method) return [];
  
  return method.steps.map(step => 
    step
      .replace('{orderNumber}', orderNumber)
      .replace('{amount}', amount)
  );
};

export default paymentMethods;
