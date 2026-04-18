import { useCurrency } from '../context/CurrencyContext';

/**
 * Hook personnalisé pour gérer facilement l'affichage des prix
 * avec conversion automatique selon la devise sélectionnée
 */
export const usePrice = () => {
  const { currency, formatPrice, convertAmount, getCurrencySymbol } = useCurrency();

  /**
   * Formate un prix avec conversion automatique
   * @param {number} amount - Montant à formater
   * @param {string} fromCurrency - Devise d'origine (par défaut: 'XAF' - FCFA)
   * @returns {string} Prix formaté avec le symbole de la devise
   */
  const format = (amount, fromCurrency = 'XAF') => {
    return formatPrice(amount, fromCurrency);
  };

  /**
   * Convertit un montant sans formatage
   * @param {number} amount - Montant à convertir
   * @param {string} fromCurrency - Devise d'origine (par défaut: 'XAF' - FCFA)
   * @returns {number} Montant converti
   */
  const convert = (amount, fromCurrency = 'XAF') => {
    return convertAmount(amount, fromCurrency, currency);
  };

  /**
   * Retourne le symbole de la devise actuelle
   * @returns {string} Symbole (€, $, FCFA)
   */
  const symbol = getCurrencySymbol();

  return {
    format,
    convert,
    symbol,
    currency
  };
};

export default usePrice;
