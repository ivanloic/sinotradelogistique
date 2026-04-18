import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift, Sparkles, Tag, ArrowRight, Clock } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import AuthPage from './AuthPage';

const WelcomeDiscountModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { language } = useTranslation();

  const content = {
    fr: {
      badge: "Offre Exclusive",
      title: "Bienvenue sur SinoTrade !",
      subtitle: "Profitez d'une réduction exceptionnelle",
      mainText: "Obtenez",
      discount: "10% DE RÉDUCTION",
      subText: "sur votre première commande",
      description: "Inscrivez-vous maintenant et découvrez nos produits premium à prix imbattables !",
      features: [
        "✨ Livraison gratuite dès 50€",
        "🎁 Accès aux offres exclusives",
        "⚡ Support client prioritaire"
      ],
      button: "J'en profite maintenant",
      later: "Plus tard",
      limited: "Offre limitée",
      expires: "Expire dans 24h"
    },
    en: {
      badge: "Exclusive Offer",
      title: "Welcome to SinoTrade!",
      subtitle: "Enjoy an exceptional discount",
      mainText: "Get",
      discount: "10% OFF",
      subText: "on your first order",
      description: "Sign up now and discover our premium products at unbeatable prices!",
      features: [
        "✨ Free shipping over $50",
        "🎁 Access to exclusive deals",
        "⚡ Priority customer support"
      ],
      button: "Claim Now",
      later: "Later",
      limited: "Limited Offer",
      expires: "Expires in 24h"
    },
    zh: {
      badge: "独家优惠",
      title: "欢迎来到 SinoTrade！",
      subtitle: "享受特别折扣",
      mainText: "获得",
      discount: "10% 折扣",
      subText: "首次订单",
      description: "立即注册，以无与伦比的价格发现我们的优质产品！",
      features: [
        "✨ 满$50免费送货",
        "🎁 获得独家优惠",
        "⚡ 优先客户支持"
      ],
      button: "立即领取",
      later: "稍后",
      limited: "限时优惠",
      expires: "24小时内过期"
    }
  };

  const t = content[language] || content.fr;

  useEffect(() => {
    // Vérifier si le modal a déjà été affiché dans cette session
    const hasSeenModal = sessionStorage.getItem('welcomeModalShown');
    
    if (!hasSeenModal && !hasShown) {
      // Afficher le modal après 3 secondes (3000ms) - Changez à 60000 pour 1 minute
      const timer = setTimeout(() => {
        setIsOpen(true);
        setHasShown(true);
        sessionStorage.setItem('welcomeModalShown', 'true');
      }, 60000); // 1 minute

      return () => clearTimeout(timer);
    }
  }, [hasShown]);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleClaim = () => {
    // Fermer le modal de bienvenue et ouvrir le modal d'authentification
    setIsOpen(false);
    setShowAuthModal(true);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
          {/* Backdrop avec effet de flou */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0, rotateY: -15 }}
            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
            exit={{ scale: 0.8, opacity: 0, rotateY: 15 }}
            transition={{ 
              type: "spring", 
              duration: 0.6,
              bounce: 0.3
            }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl bg-gradient-to-br from-white via-white to-blue-50 rounded-3xl shadow-2xl overflow-hidden"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Bouton fermer */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-20 p-2 bg-white/80 hover:bg-white rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:rotate-90"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-gray-700" />
            </button>

            {/* Badge offre limitée */}
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="absolute top-6 left-6 z-10"
            >
              <div className="flex items-center space-x-2 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-full shadow-lg">
                <Clock className="w-4 h-4 animate-pulse" />
                <span className="text-sm font-bold">{t.limited}</span>
              </div>
            </motion.div>

            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl -z-0" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-pink-400/20 to-orange-400/20 rounded-full blur-3xl -z-0" />
            
            {/* Sparkles animées */}
            <motion.div
              animate={{ 
                rotate: 360,
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
              }}
              className="absolute top-1/4 right-1/4 text-yellow-400 opacity-60"
            >
              <Sparkles className="w-8 h-8" />
            </motion.div>
            
            <motion.div
              animate={{ 
                rotate: -360,
                scale: [1, 1.3, 1]
              }}
              transition={{ 
                rotate: { duration: 15, repeat: Infinity, ease: "linear" },
                scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
              }}
              className="absolute bottom-1/3 left-1/4 text-pink-400 opacity-60"
            >
              <Sparkles className="w-6 h-6" />
            </motion.div>

            {/* Contenu */}
            <div className="relative z-10 p-8 md:p-12">
              {/* Header avec icône cadeau */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
                className="flex justify-center mb-6"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur-xl opacity-60 animate-pulse" />
                  <div className="relative w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl transform rotate-12 hover:rotate-0 transition-transform duration-300">
                    <Gift className="w-8 h-8 text-white" />
                  </div>
                </div>
              </motion.div>

              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center mb-4"
              >
                <span className="inline-block bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                  {t.badge}
                </span>
              </motion.div>

              {/* Titre */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-2xl md:text-3xl font-black text-center bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2"
              >
                {t.title}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-gray-600 text-center text-sm mb-6"
              >
                {t.subtitle}
              </motion.p>

              {/* Discount Box */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.6, type: "spring", bounce: 0.4 }}
                className="relative mb-8"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 rounded-2xl blur-lg opacity-60 animate-pulse" />
                <div className="relative bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 rounded-2xl p-6 text-center shadow-2xl">
                  <p className="text-white text-sm font-semibold mb-1">{t.mainText}</p>
                  <h3 className="text-3xl md:text-4xl font-black text-white mb-1 drop-shadow-lg">
                    {t.discount}
                  </h3>
                  <p className="text-white text-sm font-semibold">{t.subText}</p>
                  <div className="absolute -top-3 -right-3">
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Tag className="w-8 h-8 text-white drop-shadow-lg" />
                    </motion.div>
                  </div>
                </div>
              </motion.div>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-gray-700 text-center mb-6 text-lg leading-relaxed"
              >
                {t.description}
              </motion.p>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleClaim}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center space-x-2 group"
                >
                  <span className="text-lg">{t.button}</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>

                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.3 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleClose}
                  className="sm:w-auto px-8 py-4 text-gray-600 hover:text-gray-800 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300"
                >
                  {t.later}
                </motion.button>
              </div>

              {/* Expiration notice */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4 }}
                className="mt-6 text-center"
              >
                <div className="inline-flex items-center space-x-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>{t.expires}</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Modal d'authentification */}
      {showAuthModal && (
        <motion.div
          className="fixed inset-0 z-[10001] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowAuthModal(false)} />

          <motion.div
            initial={{ y: 20, scale: 0.98, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 20, scale: 0.98, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="relative z-50 w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <AuthPage asModal={true} onClose={() => setShowAuthModal(false)} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WelcomeDiscountModal;
