import { useLanguage } from '../context/LanguageContext';
import { useTranslations } from '../data/translations';

/**
 * Hook personnalisé pour faciliter l'utilisation des traductions
 * @returns {Object} Objet contenant les traductions et les fonctions utilitaires
 */
export const useTranslation = () => {
  const { language, changeLanguage, isEnglish, isFrench } = useLanguage();
  const t = useTranslations(language);

  return {
    t,
    language,
    changeLanguage,
    isEnglish,
    isFrench
  };
};
