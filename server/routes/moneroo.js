// routes/moneroo.js
// npm install express dotenv node-fetch (ou axios)

const express = require('express');
const router  = express.Router();

const MONEROO_API_URL = 'https://api.moneroo.io/v1/payments/initialize';

/**
 * POST /api/payments/initialize
 * Appelé par le frontend pour créer un lien de paiement Moneroo.
 */
router.post('/initialize', async (req, res) => {
  const {
    amount,
    currency,
    description,
    return_url,
    customer,
    metadata,
  } = req.body;

  // ── Validation minimale ──────────────────────────────────
  if (!amount || !currency || !customer?.email) {
    return res.status(400).json({ message: 'Champs requis manquants (amount, currency, customer.email).' });
  }

  try {
    const response = await fetch(MONEROO_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type':  'application/json',
        'Accept':        'application/json',
        // ✅ La clé secrète reste sur le serveur, jamais envoyée au navigateur
        'Authorization': `Bearer ${process.env.MONEROO_SECRET_KEY}`,
      },
      body: JSON.stringify({
        amount,
        currency,
        description,
        return_url,
        customer,
        metadata,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('[Moneroo] Erreur API :', data);
      return res.status(response.status).json({ message: data?.message ?? 'Erreur Moneroo.' });
    }

    // On retourne le lien de paiement au frontend
    return res.status(201).json({ checkout_url: data.data.link ?? data.data.checkout_url });

  } catch (err) {
    console.error('[Moneroo] Erreur réseau :', err);
    return res.status(500).json({ message: 'Erreur serveur lors de la connexion à Moneroo.' });
  }
});

module.exports = router;