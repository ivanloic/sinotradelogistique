import React, { createContext, useContext, useState, useEffect } from 'react';

const CurrencyContext = createContext(null);

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

// Taux de conversion (Base: XAF = 1)
// Les prix dans les données sont déjà en FCFA
const EXCHANGE_RATES = {
  XAF: 1,           // Base: Franc CFA
  EUR: 0.001524,    // 1 FCFA = 0.001524 EUR (1 EUR = 655.957 FCFA)
  USD: 0.0018     // 1 FCFA = 0.0018 USD (1 USD = 602.2 FCFA)
};

// Symboles des devises
const CURRENCY_SYMBOLS = {
  EUR: '€',
  USD: '$',
  XAF: 'FCFA'
};

const STORAGE_KEY = 'sino_trade_currency_v1';

export const CurrencyProvider = ({ children }) => {
  // Charger la devise depuis localStorage ou utiliser XAF par défaut
  const [currency, setCurrency] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved && ['EUR', 'USD', 'XAF'].includes(saved) ? saved : 'XAF';
    } catch (e) {
      return 'XAF';
    }
  });

  // Sauvegarder dans localStorage quand la devise change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, currency);
    } catch (e) {
      console.warn('Failed to persist currency', e);
    }
  }, [currency]);

  // Fonction pour convertir un montant d'une devise à une autre
  const convertAmount = (amount, fromCurrency = 'XAF', toCurrency = currency) => {
    if (!amount || isNaN(amount)) return 0;
    
    // Convertir d'abord en XAF (notre base)
    const amountInXAF = amount / EXCHANGE_RATES[fromCurrency];
    
    // Puis convertir vers la devise cible
    const convertedAmount = amountInXAF * EXCHANGE_RATES[toCurrency];
    
    return convertedAmount;
  };

  // Fonction pour formater un prix avec la devise actuelle
  const formatPrice = (amount, fromCurrency = 'XAF') => {
    const converted = convertAmount(amount, fromCurrency, currency);
    const symbol = CURRENCY_SYMBOLS[currency];
    
    // Formater selon la devise
    if (currency === 'XAF') {
      // Pour le Franc CFA, afficher sans décimales
      return `${Math.round(converted).toLocaleString('fr-FR')} ${symbol}`;
    } else if (currency === 'EUR') {
      // Pour l'Euro, le symbole avant
      return `${symbol}${converted.toFixed(2)}`;
    } else {
      // Pour le Dollar, le symbole avant
      return `${symbol}${converted.toFixed(2)}`;
    }
  };

  // Fonction pour obtenir le symbole de la devise actuelle
  const getCurrencySymbol = () => CURRENCY_SYMBOLS[currency];

  // Fonction pour obtenir le taux de conversion
  const getExchangeRate = (fromCurrency = 'XAF') => {
    return EXCHANGE_RATES[currency] / EXCHANGE_RATES[fromCurrency];
  };

  const value = {
    currency,
    setCurrency,
    convertAmount,
    formatPrice,
    getCurrencySymbol,
    getExchangeRate,
    exchangeRates: EXCHANGE_RATES,
    currencySymbols: CURRENCY_SYMBOLS
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};

export default CurrencyContext;
