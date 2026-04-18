import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle, Send } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { useState, useEffect } from 'react';

const ContactModal = ({ isOpen, onClose }) => {
  const { language } = useTranslation();
  const [showSmartsupp, setShowSmartsupp] = useState(false);

  const content = {
    fr: {
      title: "Parlons de votre projet",
      subtitle: "Notre équipe est à votre écoute 24/7 pour répondre à toutes vos questions",
      description: "Choisissez votre plateforme préférée et contactez-nous instantanément. Nous sommes là pour vous accompagner !",
      whatsapp: {
        title: "WhatsApp",
        description: "Réponse immédiate garantie",
        button: "Discuter sur WhatsApp"
      },
      telegram: {
        title: "Telegram",
        description: "Support ultra-rapide",
        button: "Discuter sur Telegram"
      },
      close: "Fermer"
    },
    en: {
      title: "Let's Talk About Your Project",
      subtitle: "Our team is available 24/7 to answer all your questions",
      description: "Choose your preferred platform and contact us instantly. We're here to support you!",
      whatsapp: {
        title: "WhatsApp",
        description: "Instant response guaranteed",
        button: "Chat on WhatsApp"
      },
      telegram: {
        title: "Telegram",
        description: "Ultra-fast support",
        button: "Chat on Telegram"
      },
      close: "Close"
    },
  };

  const t = content[language] || content.fr;

  // Remplacez ces numéros par vos vrais numéros
  const whatsappNumber = "+237123456789"; // Votre numéro WhatsApp au format international
  // Lien Telegram direct vers le username fourni par l'utilisateur
  // Utilisateur: @mark_johnson901\ (sans le @ pour l'URL)
  const telegramLink = 'https://t.me/mark_johnson901';

  const handleWhatsApp = () => {
    // Charger et ouvrir le widget Tawk.to
    setShowSmartsupp(true);

    // Si Tawk est déjà présent, l'ouvrir directement
    setTimeout(() => {
      if (window.Tawk_API && typeof window.Tawk_API.maximize === 'function') {
        try { window.Tawk_API.maximize(); } catch (e) {}
      } else if (window.Tawk_API && typeof window.Tawk_API.toggle === 'function') {
        try { window.Tawk_API.toggle(); } catch (e) {}
      }
    }, 1000);
  };

  const handleTelegram = () => {
    // Ouvre le lien Telegram dans un nouvel onglet
    try {
      window.open(telegramLink, '_blank');
    } catch (e) {
      // Fallback: utiliser location.assign si window.open est bloqué
      window.location.assign(telegramLink);
    }
  };

  // Charger le script Tawk.to uniquement quand showSmartsupp est true
  useEffect(() => {
    const loadTawk = () => {
      if (window.Tawk_API) return; // déjà chargé

      window.Tawk_API = window.Tawk_API || {};
      window.Tawk_LoadStart = new Date();

      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.charset = 'UTF-8';
      script.async = true;
      script.src = 'https://embed.tawk.to/6963b526d00da4197cacc860/1jemnn8j9';
      script.setAttribute('crossorigin', '*');

      const firstScript = document.getElementsByTagName('script')[0];
      if (firstScript && firstScript.parentNode) {
        firstScript.parentNode.insertBefore(script, firstScript);
      } else {
        document.head.appendChild(script);
      }

      script.onload = () => {
        // Ouvrir le widget si possible
        if (window.Tawk_API && typeof window.Tawk_API.maximize === 'function') {
          try { window.Tawk_API.maximize(); } catch (e) {}
        } else if (window.Tawk_API && typeof window.Tawk_API.toggle === 'function') {
          try { window.Tawk_API.toggle(); } catch (e) {}
        }
      };
    };

    if (showSmartsupp) {
      if (!window.Tawk_API) loadTawk();
      else {
        // Si déjà chargé, maximiser
        if (window.Tawk_API && typeof window.Tawk_API.maximize === 'function') {
          try { window.Tawk_API.maximize(); } catch (e) {}
        }
      }
    }

    // Note: on ne tente pas d'écouter un événement 'close' précis ici (Tawk fournit des hooks côté widget si besoin)
  }, [showSmartsupp]);

  // Cacher l'icône Smartsupp tant qu'on n'a pas cliqué sur WhatsApp et la placer derrière le bouton scroll
  useEffect(() => {
    const style = document.createElement('style');
    style.id = 'tawk-hide-style';
    style.innerHTML = `
      /* Masque/contrôle du widget Tawk tant que l'utilisateur n'a pas cliqué */
      div[id^="tawk"],
      div[class*="tawk"],
      iframe[id*="tawk"],
      #tawkchat-minified,
      #tawkIframe {
        display: ${showSmartsupp ? 'block' : 'none'} !important;
        z-index: 45 !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      const existingStyle = document.getElementById('tawk-hide-style');
      if (existingStyle) existingStyle.remove();
    };
  }, [showSmartsupp]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Gradient Header */}
            <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 p-8 text-white overflow-hidden">
              {/* Animated Background Circles */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse delay-75" />
              
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors z-10"
                aria-label={t.close}
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative z-10">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 mx-auto"
                >
                  <MessageCircle className="w-8 h-8" />
                </motion.div>
                
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl font-bold text-center mb-2"
                >
                  {t.title}
                </motion.h2>
                
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-white/90 text-center text-sm"
                >
                  {t.subtitle}
                </motion.p>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-gray-600 text-center mb-8 leading-relaxed"
              >
                {t.description}
              </motion.p>

              <div className="space-y-4">
                {/* WhatsApp Button */}
                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleWhatsApp}
                  className="group w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <MessageCircle className="w-6 h-6" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-bold text-lg">{t.whatsapp.title}</h3>
                      <p className="text-green-100 text-sm">{t.whatsapp.description}</p>
                    </div>
                  </div>
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </motion.div>
                </motion.button>

                {/* Telegram Button */}
                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleTelegram}
                  className="group w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Send className="w-6 h-6" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-bold text-lg">{t.telegram.title}</h3>
                      <p className="text-blue-100 text-sm">{t.telegram.description}</p>
                    </div>
                  </div>
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, delay: 0.3 }}
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </motion.div>
                </motion.button>
              </div>

              {/* Trust Badge */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100"
              >
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-700">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="font-medium">
                      {language === 'fr' ? 'En ligne maintenant' : language === 'zh' ? '现在在线' : 'Online now'}
                    </span>
                  </div>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-600">
                    {language === 'fr' ? 'Temps de réponse < 2 min' : language === 'zh' ? '响应时间 < 2分钟' : 'Response time < 2 min'}
                  </span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ContactModal;
