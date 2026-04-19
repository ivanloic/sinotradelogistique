import { useState, useEffect, useRef } from 'react';
import { Search, User, ShoppingCart, Heart, Globe, ChevronDown, Menu, X, Phone, Mail, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthPage from './AuthPage';
import SearchAutocomplete from './SearchAutocomplete';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { useLanguage } from '../context/LanguageContext';
import { useTranslations } from '../data/translations';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showCurrMenu, setShowCurrMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems } = useCart();
  const { currency, setCurrency } = useCurrency();
  const { language, changeLanguage } = useLanguage();
  const t = useTranslations(language);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const langRef = useRef(null);
  const currRef = useRef(null);

  // Vérifier si on est sur une page où il ne faut pas afficher les catégories
  const hideCategories = ['/cart', '/Cart', '/checkout', '/Checkout', '/Confirmation', '/confirmation', '/order-confirmation'].includes(location.pathname);

  // Gestion du scroll pour cacher les sections
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Catégories principales avec routes
  const mainCategories = [
    { name: t.categories.hairProducts, route: '/bijou' },
    { name: t.categories.perruque,     route: '/perruque' },
    { name: t.categories.clothing, route: '/clothing' },
    { name: t.categories.shoes, route: '/shoes' },
    { name: t.categories.electronics, route: '/telephone_accessoires' },
    { name: t.categories.sports, route: '/category/sports' },
    { name: t.categories.bags, route: '/bags' },
    { name: t.categories.toys, route: '/category/toys' },
  ];

  // Toutes les catégories avec routes
  const allCategories = [
    { name: t.categories.clothing,  route: '/clothing' },
    { name: t.categories.perruque,  route: '/perruque' },
    { name: t.categories.sports, route: '/category/sports' },
    { name: t.categories.toys, route: '/category/toys' },
    { name: t.categories.autoParts, route: '/category/auto-parts' },
    { name: t.categories.health, route: '/category/health' },
    { name: t.categories.transport, route: '/category/transport' },
    { name: t.categories.shoes, route: '/shoes' },
    { name: t.categories.bags, route: '/bags' },
  ];



  // Variants Framer Motion pour transitions au scroll
  const headerVariants = {
    default: { 
      backgroundColor: 'rgba(17, 24, 39, 1)',
      boxShadow: 'none',
      transition: { duration: 0.3, ease: 'easeOut' }
    },
    scrolled: { 
      backgroundColor: 'rgba(17, 24, 39, 0.95)',
      boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
      transition: { duration: 0.3, ease: 'easeOut' }
    }
  };

  const searchVariants = {
    visible: { 
      opacity: 1, 
      height: 'auto', 
      y: 0,
      transition: { duration: 0.3, ease: 'easeOut' }
    },
    hidden: { 
      opacity: 0, 
      height: 0, 
      y: -10,
      transition: { duration: 0.25, ease: 'easeIn' }
    }
  };

  const navVariants = {
    visible: { 
      opacity: 1, 
      height: 'auto',
      y: 0,
      transition: { 
        duration: 0.35, 
        ease: [0.4, 0, 0.2, 1],
        staggerChildren: 0.05
      }
    },
    hidden: { 
      opacity: 0, 
      height: 0,
      y: -8,
      transition: { 
        duration: 0.3, 
        ease: [0.4, 0, 1, 1]
      }
    }
  };

  const menuVariants = {
    open: {
      opacity: 1,
      scaleY: 1,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1],
        staggerChildren: 0.05,
        when: "beforeChildren"
      }
    },
    closed: {
      opacity: 0,
      scaleY: 0,
      transition: {
        duration: 0.25,
        ease: [0.4, 0, 1, 1],
        staggerChildren: 0.02,
        staggerDirection: -1,
        when: "afterChildren"
      }
    }
  };

  const itemVariants = {
    open: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.25,
        ease: "easeOut"
      }
    },
    closed: {
      opacity: 0,
      y: -10,
      transition: {
        duration: 0.2,
        ease: "easeIn"
      }
    }
  };

  return (
    <motion.header 
      className="sticky top-0 z-50 bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 shadow-xl"
      variants={headerVariants}
      initial="default"
      animate={isScrolled ? "scrolled" : "default"}
    >

      {/* Barre principale de navigation */}
      <div className="max-w-7xl mx-auto px-4 py-3 md:py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <motion.div 
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <img 
              src="https://res.cloudinary.com/deuttziac/logo/logochine.png" 
              alt="SinoTrade" 
              className="h-12 md:h-16 w-auto cursor-pointer"
              onClick={() => navigate('/')}
            />
          </motion.div>

          {/* Barre de recherche - Desktop avec Autocomplétion */}
          <div className="hidden lg:flex flex-1 max-w-2xl mx-8">
            <SearchAutocomplete 
              placeholder={t.header.searchPlaceholder}
              className="w-full"
            />
          </div>

          {/* Actions utilisateur */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Language - Version améliorée */}
            <div className="relative hidden md:block" ref={langRef}>
              <motion.button
                onClick={(e) => { e.stopPropagation(); setShowLangMenu(!showLangMenu); }}
                className="flex items-center gap-1.5 px-3 py-2 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-all duration-300 border border-white/20"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Globe size={18} className="text-blue-300" />
                <span className="text-sm font-semibold text-white">{language.toUpperCase()}</span>
                <ChevronDown size={16} className={`text-blue-300 transition-transform ${showLangMenu ? 'rotate-180' : ''}`} />
              </motion.button>
              <AnimatePresence>
                {showLangMenu && (
                  <motion.ul 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-20"
                  >
                    <li>
                      <button 
                        className={`w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors ${language === 'fr' ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600 font-semibold' : 'text-gray-700'}`}
                        onClick={() => { changeLanguage('fr'); setShowLangMenu(false); }}
                      >
                        🇫🇷 Français
                      </button>
                    </li>
                    <li>
                      <button 
                        className={`w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors ${language === 'en' ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600 font-semibold' : 'text-gray-700'}`}
                        onClick={() => { changeLanguage('en'); setShowLangMenu(false); }}
                      >
                        🇬🇧 English
                      </button>
                    </li>
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>

            {/* Currency - Version améliorée */}
            <div className="relative hidden md:block" ref={currRef}>
              <motion.button
                onClick={(e) => { e.stopPropagation(); setShowCurrMenu(!showCurrMenu); }}
                className="flex items-center gap-1.5 px-3 py-2 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-all duration-300 border border-white/20"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-sm font-semibold text-white">{currency}</span>
                <ChevronDown size={16} className={`text-blue-300 transition-transform ${showCurrMenu ? 'rotate-180' : ''}`} />
              </motion.button>
              <AnimatePresence>
                {showCurrMenu && (
                  <motion.ul 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-20"
                  >
                    <li>
                      <button 
                        className={`w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors ${currency === 'EUR' ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600 font-semibold' : 'text-gray-700'}`}
                        onClick={() => { setCurrency('EUR'); setShowCurrMenu(false); }}
                      >
                        💶 EUR — Euro
                      </button>
                    </li>
                    <li>
                      <button 
                        className={`w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors ${currency === 'USD' ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600 font-semibold' : 'text-gray-700'}`}
                        onClick={() => { setCurrency('USD'); setShowCurrMenu(false); }}
                      >
                        💵 USD — Dollar
                      </button>
                    </li>
                    <li>
                      <button 
                        className={`w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors ${currency === 'XAF' ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600 font-semibold' : 'text-gray-700'}`}
                        onClick={() => { setCurrency('XAF'); setShowCurrMenu(false); }}
                      >
                        🪙 XAF — Franc CFA
                      </button>
                    </li>
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
            
            {/* Panier - Version améliorée */}
            <motion.button 
              onClick={() => navigate(`/cart`)}
              className="relative flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-blue-500/50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ShoppingCart size={20} className="text-white" />
              <span className="hidden md:inline text-sm font-medium text-white">{t.header.cart}</span>
              <AnimatePresence>
                {cartItems.length > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-xs font-bold flex items-center justify-center shadow-lg border-2 border-white"
                  >
                    {cartItems.length}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Compte utilisateur - Desktop */}
            <motion.button 
              onClick={() => setShowAuthModal(true)} 
              className="hidden md:flex items-center gap-2 px-3 py-2 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-all duration-300 border border-white/20"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <User size={20} className="text-blue-300" />
              <span className="text-sm font-medium text-white">{t.header.account}</span>
              <ChevronDown size={16} className="text-blue-300" />
            </motion.button>

            {/* Menu Burger - Mobile */}
            <motion.button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-all duration-300 border border-white/20"
              whileTap={{ scale: 0.9 }}
            >
              <motion.div
                animate={isMenuOpen ? { rotate: 180 } : { rotate: 0 }}
                transition={{ duration: 0.3 }}
              >
                {isMenuOpen ? <X size={24} className="text-white" /> : <Menu size={24} className="text-white" />}
              </motion.div>
            </motion.button>
          </div>
        </div>

        {/* Barre de recherche mobile - Version améliorée avec Autocomplétion */}
        <AnimatePresence>
          {!isScrolled && (
            <motion.div 
              className="lg:hidden mt-4"
              variants={searchVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <SearchAutocomplete 
                placeholder={t.header.searchPlaceholder}
                className="w-full"
                isMobile={true}
              />
            </motion.div>
          )}
        </AnimatePresence>
        
      </div>

      {/* Navigation par catégories - Version améliorée */}
      <AnimatePresence>
        {!isScrolled && (
          <motion.nav 
            className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-md border-t border-white/20"
            variants={navVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <div className="max-w-7xl mx-auto">
              {/* Catégories principales - Desktop */}
              {!hideCategories && (
              <div className="hidden lg:flex items-center justify-between px-4 py-2">
                <div className="flex items-center space-x-6">
                  <motion.button 
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg"
                    whileHover={{ scale: 1.05, y: -2 }}
                  >
                    <Menu size={18} />
                    <span>{t.header.categories}</span>
                  </motion.button>
                  
                  {mainCategories.map((category, index) => (
                    <motion.button
                      key={index}
                      onClick={() => navigate(category.route)}
                      className="py-2 px-3 text-white/90 hover:text-white font-medium text-sm whitespace-nowrap rounded-lg hover:bg-white/10 transition-all duration-300"
                      whileHover={{ scale: 1.08, y: -2 }}
                      transition={{ duration: 0.2 }}
                    >
                      {category.name}
                    </motion.button>
                  ))}
                </div>
              </div>
              )}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Auth modal overlay */}
      <AnimatePresence>
        {showAuthModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
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
              className="relative z-50 w-full max-w-3xl p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <AuthPage asModal={true} onClose={() => setShowAuthModal(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Menu mobile - Version améliorée */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            className="lg:hidden absolute w-full bg-gradient-to-b from-gray-900 via-blue-900 to-gray-900 backdrop-blur-xl border-t border-white/10 shadow-2xl"
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            style={{ originY: 0 }}
          >
            <div className="px-4 py-6 space-y-4">
              {/* Compte utilisateur mobile */}
              <motion.button 
                onClick={() => { setShowAuthModal(true); setIsMenuOpen(false); }} 
                className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg"
                variants={itemVariants}
                whileTap={{ scale: 0.95 }}
              >
                <User size={22} />
                <span className="font-semibold text-lg">{t.header.myAccount}</span>
                <ChevronDown size={18} className="ml-auto" />
              </motion.button>

              {/* Langue et Devise mobile */}
              <div className="grid grid-cols-2 gap-3">
                <motion.div variants={itemVariants}>
                  <button
                    onClick={() => setShowLangMenu(!showLangMenu)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/10 backdrop-blur-sm text-white rounded-xl hover:bg-white/20 transition-all duration-300 border border-white/20"
                  >
                    <Globe size={20} />
                    <span className="font-medium">{language.toUpperCase()}</span>
                    <ChevronDown size={16} className={`transition-transform ${showLangMenu ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {showLangMenu && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-2 space-y-2"
                      >
                        <button 
                          className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${language === 'fr' ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold' : 'bg-white/5 text-white/80 hover:bg-white/10'}`}
                          onClick={() => { changeLanguage('fr'); setShowLangMenu(false); }}
                        >
                          🇫🇷 Français
                        </button>
                        <button 
                          className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${language === 'en' ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold' : 'bg-white/5 text-white/80 hover:bg-white/10'}`}
                          onClick={() => { changeLanguage('en'); setShowLangMenu(false); }}
                        >
                          🇬🇧 English
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <button
                    onClick={() => setShowCurrMenu(!showCurrMenu)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/10 backdrop-blur-sm text-white rounded-xl hover:bg-white/20 transition-all duration-300 border border-white/20"
                  >
                    <span className="font-medium">{currency}</span>
                    <ChevronDown size={16} className={`transition-transform ${showCurrMenu ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {showCurrMenu && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-2 space-y-2"
                      >
                        <button 
                          className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${currency === 'EUR' ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold' : 'bg-white/5 text-white/80 hover:bg-white/10'}`}
                          onClick={() => { setCurrency('EUR'); setShowCurrMenu(false); }}
                        >
                          💶 EUR
                        </button>
                        <button 
                          className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${currency === 'USD' ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold' : 'bg-white/5 text-white/80 hover:bg-white/10'}`}
                          onClick={() => { setCurrency('USD'); setShowCurrMenu(false); }}
                        >
                          💵 USD
                        </button>
                        <button 
                          className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${currency === 'XAF' ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold' : 'bg-white/5 text-white/80 hover:bg-white/10'}`}
                          onClick={() => { setCurrency('XAF'); setShowCurrMenu(false); }}
                        >
                          🪙 XAF
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>

              {/* Catégories */}
              <div className="space-y-2">
                <motion.div 
                  className="flex items-center gap-2 px-4 py-2 text-white font-bold text-lg border-b border-white/20 pb-3"
                  variants={itemVariants}
                >
                  <Menu size={20} />
                  {t.header.categories}
                </motion.div>
                
                <div className="grid grid-cols-2 gap-2">
                  {allCategories.slice(0, 8).map((category, index) => (
                    <motion.button
                      key={index}
                      onClick={() => { navigate(category.route); setIsMenuOpen(false); }}
                      className="px-4 py-3 bg-white/5 backdrop-blur-sm text-white/90 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300 text-sm font-medium text-center border border-white/10"
                      variants={itemVariants}
                      whileTap={{ scale: 0.95 }}
                    >
                      {category.name}
                    </motion.button>
                  ))}
                </div>

                <motion.div 
                  className="pt-3 border-t border-white/10"
                  variants={itemVariants}
                >
                  <a href="#" className="flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 hover:text-blue-200 font-semibold rounded-xl hover:from-blue-500/30 hover:to-purple-500/30 transition-all duration-300 border border-blue-500/30">
                    {t.header.allCategories}
                    <ChevronDown size={18} className="rotate-[-90deg]" />
                  </a>
                </motion.div>
              </div>

              {/* Badges promotionnels */}
              <div className="space-y-2 pt-2">
                <motion.a 
                  href="#" 
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-green-500/20 text-green-300 font-semibold rounded-xl hover:bg-green-500/30 transition-all duration-300 border border-green-500/30"
                  variants={itemVariants}
                  whileTap={{ scale: 0.95 }}
                >
                  🔥 {t.header.todayDeals || 'Offres du Jour'}
                </motion.a>
                <motion.a 
                  href="#" 
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-yellow-500/20 text-yellow-300 font-semibold rounded-xl hover:bg-yellow-500/30 transition-all duration-300 border border-yellow-500/30"
                  variants={itemVariants}
                  whileTap={{ scale: 0.95 }}
                >
                  ⭐ Premium
                </motion.a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.header>
  );
};

export default Header;