import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Eye, EyeOff, Mail, Lock, User, Phone, Gift, Copy, Check, 
  Star, Shield, Truck, Clock, Sparkles, X
} from 'lucide-react';
import Confetti from 'react-confetti';
import { useTranslation } from '../hooks/useTranslation';

const AuthPage = ({ asModal = false, onClose } = {}) => {
  const { t } = useTranslation();
  const [isLogin, setIsLogin] = useState(true);
  const [registerStep, setRegisterStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);
  const [promoCode, setPromoCode] = useState(null);
  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [bonusPhone, setBonusPhone] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
    newsletter: true
  });

  const generatePromoCode = () => {
    setIsGeneratingCode(true);
    
    // Simulation de génération
    setTimeout(() => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let code = 'ST';
      for (let i = 0; i < 4; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      setPromoCode(code);
      setIsGeneratingCode(false);
    }, 1500);
  };

  const copyToClipboard = () => {
    if (promoCode) {
      navigator.clipboard.writeText(promoCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCreateAccount = () => {
    setIsCreatingAccount(true);
    
    // Simulation du loader pendant 5 secondes
    setTimeout(() => {
      setIsCreatingAccount(false);
      setShowSuccess(true);
      setShowConfetti(true);
      
      // Arrêter les confettis après 5 secondes
      setTimeout(() => {
        setShowConfetti(false);
      }, 10000);
      
    }, 10000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logique de soumission / navigation entre étapes
    if (isLogin) {
      // login flow (placeholder)
      console.log('Login submitted:', formData);
      return;
    }

    // Inscription en 3 étapes
    setRegisterError('');
    if (registerStep === 1) {
      // validation minimale pour l'étape 1
      if (!formData.firstName || !formData.lastName || !formData.phone) {
        setRegisterError('Veuillez remplir le prénom, nom et téléphone.');
        return;
      }
      setRegisterStep(2);
      return;
    }

    if (registerStep === 2) {
      // validation de l'étape 2 (email + mots de passe) avant d'aller à l'étape 3
      if (!formData.email || !formData.password || !formData.confirmPassword) {
        setRegisterError('Veuillez remplir email et mot de passe.');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setRegisterError('Les mots de passe ne correspondent pas.');
        return;
      }
      setRegisterStep(3);
      return;
    }

    // étape 3 : validation finale (conditions, etc.)
    if (!formData.acceptTerms) {
      setRegisterError('Vous devez accepter les conditions d\'utilisation.');
      return;
    }

    // Déclencher le loader et l'effet de succès
    handleCreateAccount();
  };

  // Extraire le contenu du formulaire pour pouvoir le réutiliser en modal
  const FormContent = (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 md:p-8 relative overflow-hidden"
    >
      {/* Loader pendant la création du compte */}
      <AnimatePresence>
        {isCreatingAccount && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-white bg-opacity-90 rounded-3xl flex flex-col items-center justify-center z-10"
          >
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Création de votre compte</h3>
              <p className="text-gray-600">Veuillez patienter pendant que nous finalisons votre inscription...</p>
              <div className="mt-4 w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 5, ease: 'linear' }}
                  className="h-full bg-gradient-to-r from-blue-600 to-purple-600"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Message de succès avec confettis */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 bg-white rounded-3xl flex flex-col items-center justify-center z-20 p-8 text-center"
          >
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6">
              <Check className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Création de compte effectuée !
            </h3>
            <p className="text-gray-700 mb-2">
              Votre compte a été créé avec succès.
            </p>
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white py-3 px-6 rounded-xl font-bold text-lg mb-4">
              CODE PROMO : ST3467
            </div>
            <p className="text-gray-700 font-semibold">
              utilisez ce code pour obtenir 10% de réduction sur vos achats
            </p>
            <button
              onClick={() => {
                setShowSuccess(false);
                if (typeof onClose === 'function') onClose();
              }}
              className="mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 rounded-xl font-semibold transition-colors"
            >
              Commencer mes achats
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* En-tête avec effet gradient */}
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          {isLogin ? t.authPage.welcomeBack : t.authPage.createAccount}
        </h1>
        <p className="text-sm sm:text-base text-gray-600 px-4">
          {isLogin ? t.authPage.loginSubtitle : t.authPage.registerSubtitle}
        </p>
      </div>

      {/* Toggle connexion/inscription - Responsive */}
      <div className="flex bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl sm:rounded-2xl p-1 mb-4 sm:mb-6 shadow-inner">
        <button
          onClick={() => setIsLogin(true)}
          className={`flex-1 py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold transition-all duration-300 ${
            isLogin 
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md transform scale-105' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          {t.authPage.login}
        </button>
        <button
          onClick={() => setIsLogin(false)}
          className={`flex-1 py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold transition-all duration-300 ${
            !isLogin 
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md transform scale-105' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          {t.authPage.register}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 md:space-y-6">
        {/* --- Login flow --- */}
        {isLogin ? (
          <>
            {/* Email */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">{t.authPage.email} *</label>
              <div className="relative">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder={t.authPage.emailPlaceholder}
                />
              </div>
            </div>

            {/* Mot de passe */}
            <div>
              <div className="flex justify-between items-center mb-1.5 sm:mb-2">
                <label className="block text-xs sm:text-sm font-medium text-gray-700">{t.authPage.password} *</label>
                <a href="#" className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium">{t.authPage.forgotPassword}</a>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="w-full pl-9 sm:pl-10 pr-10 sm:pr-12 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder={t.authPage.passwordPlaceholder}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                </button>
              </div>
            </div>
          </>
        ) : (
          /* --- Registration: two steps --- */
          <>
            <div className="flex items-center justify-between mb-4">
              <div className="text-xs sm:text-sm font-medium text-gray-600">{t.authPage.step} {registerStep}/3</div>
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <motion.div 
                  animate={{ scale: registerStep===1 ? 1.2 : 1 }}
                  className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${registerStep>=1 ? 'bg-gradient-to-r from-blue-500 to-purple-500' : 'bg-gray-300'}`}
                />
                <div className={`w-8 sm:w-10 h-0.5 transition-all duration-300 ${registerStep>=2 ? 'bg-gradient-to-r from-blue-500 to-purple-500' : 'bg-gray-300'}`} />
                <motion.div 
                  animate={{ scale: registerStep===2 ? 1.2 : 1 }}
                  className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${registerStep>=2 ? 'bg-gradient-to-r from-blue-500 to-purple-500' : 'bg-gray-300'}`}
                />
                <div className={`w-8 sm:w-10 h-0.5 transition-all duration-300 ${registerStep>=3 ? 'bg-gradient-to-r from-blue-500 to-purple-500' : 'bg-gray-300'}`} />
                <motion.div 
                  animate={{ scale: registerStep===3 ? 1.2 : 1 }}
                  className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${registerStep>=3 ? 'bg-gradient-to-r from-blue-500 to-purple-500' : 'bg-gray-300'}`}
                />
              </div>
            </div>

            <AnimatePresence mode="wait">
              {registerStep === 1 ? (
                <motion.div
                  key="register-step-1"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  {/* Nom et Prénom */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">{t.authPage.firstName} *</label>
                      <div className="relative">
                        <User className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          value={formData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder={t.authPage.firstNamePlaceholder}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">{t.authPage.lastName} *</label>
                      <div className="relative">
                        <User className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          value={formData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder={t.authPage.lastNamePlaceholder}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Téléphone */}
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">{t.authPage.phone} *</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder={t.authPage.phonePlaceholder}
                      />
                    </div>
                  </div>
                </motion.div>
              ) : registerStep === 2 ?  (
                <>
                  <motion.div
                    key="register-step-2"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{t.authPage.email} *</label>
                      <div className="relative">
                        <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder={t.authPage.emailPlaceholder}
                        />
                      </div>
                    </div>

                    {/* Mot de passe */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{t.authPage.password} *</label>
                      <div className="relative">
                        <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={formData.password}
                          onChange={(e) => handleInputChange('password', e.target.value)}
                          className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder={t.authPage.passwordPlaceholder}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    {/* Confirmation mot de passe */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{t.authPage.confirmPassword} *</label>
                      <div className="relative">
                        <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          required
                          value={formData.confirmPassword}
                          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                          className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder={t.authPage.confirmPasswordPlaceholder}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                  </motion.div>

                </>
              ) : (<>
                {/* Step 3: options + promo */}
                  <motion.div
                    key="register-step-3"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <div className="space-y-4">
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.newsletter}
                          onChange={(e) => handleInputChange('newsletter', e.target.checked)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{t.authPage.newsletter}</span>
                      </label>

                      <label className="flex items-start space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          required
                          checked={formData.acceptTerms}
                          onChange={(e) => handleInputChange('acceptTerms', e.target.checked)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5"
                        />
                        <span className="text-sm text-gray-700">
                          {t.authPage.acceptTerms}{' '}
                          <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">{t.authPage.termsOfUse}</a>{' '}
                          {t.authPage.and}{' '}
                          <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">{t.authPage.privacyPolicy}</a>
                        </span>
                      </label>
                    </div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-6"
                    >
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center">
                          <Gift className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{t.authPage.referralCode}</h3>
                          <p className="text-sm text-gray-600">{t.authPage.referralDesc}</p>
                        </div>
                      </div>

                      {!promoCode ? (
                        <button
                          type="button"
                          onClick={generatePromoCode}
                          disabled={isGeneratingCode}
                          className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50"
                        >
                          {isGeneratingCode ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              <span>{t.authPage.generating}</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-5 h-5" />
                              <span>{t.authPage.generatePromo}</span>
                            </>
                          )}
                        </button>
                      ) : (
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
                          <div className="mb-4">
                            <div className="text-sm text-gray-600 mb-2">{t.authPage.yourPersonalCode}</div>
                            <div className="flex items-center justify-center space-x-3">
                              <div className="bg-white border-2 border-yellow-300 rounded-xl px-6 py-3">
                                <span className="text-2xl font-bold text-gray-900 tracking-wider">{promoCode}</span>
                              </div>
                              <button onClick={copyToClipboard} className="p-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl transition-colors">
                                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                              </button>
                            </div>
                            {copied && (
                              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-green-600 text-sm mt-2">
                                {t.authPage.codeCopied}
                              </motion.div>
                            )}
                          </div>
                          <div className="bg-white/50 rounded-lg p-4 border border-yellow-200 mb-4">
                            <p className="text-sm text-gray-700"><strong>{t.authPage.bonusText}</strong> {t.authPage.bonusDesc} <strong>10 000 FCFA</strong> {t.authPage.credited}</p>
                          </div>

                          {/* Partage du lien */}
                          <div className="bg-white rounded-lg p-4 border border-yellow-200 mb-3">
                            <p className="text-sm font-semibold text-gray-900 mb-3">Partagez ce lien pour inviter les gens à nous rejoindre :</p>
                            <div className="flex items-center space-x-2">
                              <div className="flex-1 bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 overflow-x-auto whitespace-nowrap">
                                http://www.sinotradelogistics.vercel.app
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  navigator.clipboard.writeText('http://www.sinotrade.trechx.com');
                                  setLinkCopied(true);
                                  setTimeout(() => setLinkCopied(false), 2000);
                                }}
                                className="p-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex-shrink-0"
                              >
                                {linkCopied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                              </button>
                            </div>
                            {linkCopied && (
                              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-green-600 text-xs mt-2">
                                Lien copié !
                              </motion.div>
                            )}
                          </div>

                          {/* Numéro de téléphone pour recevoir le bonus */}
                          <div className="bg-white rounded-lg p-4 border border-yellow-200">
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                              Entrez votre numéro où nous enverrons votre bonus :
                            </label>
                            <div className="relative">
                              <Phone className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                              <input
                                type="tel"
                                value={bonusPhone}
                                onChange={(e) => setBonusPhone(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                                placeholder="+237 6XX XXX XXX"
                              />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  </motion.div>
              </>)
              }
            </AnimatePresence>
          </>
        )}

        {/* Erreur d'inscription */}
        {registerError && (
          <div className="text-red-600 text-sm font-medium">{registerError}</div>
        )}

        {/* Boutons de navigation / soumission */}
        {isLogin ? (
          <motion.button 
            type="submit" 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 sm:py-4 px-6 rounded-xl font-semibold text-base sm:text-lg transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            {t.authPage.signIn}
          </motion.button>
        ) : (
          <div className="flex items-center space-x-3">
            {registerStep > 1 && (
              <button type="button" onClick={() => setRegisterStep(prev => Math.max(1, prev - 1))} className="flex-1 py-3 px-4 rounded-xl border border-gray-200 font-medium hover:bg-gray-50">{t.authPage.previous}</button>
            )}
            {registerStep < 3 ? (
              <button type="button" onClick={() => {
                // tentative d'avancer — utilise la même validation que le submit handler
                // on déclenche handleSubmit sans e pour valider puis avancer
                setRegisterError('');
                if (registerStep === 1) {
                  if (!formData.firstName || !formData.lastName || !formData.phone) {
                    setRegisterError('Veuillez remplir le prénom, nom et téléphone.');
                    return;
                  }
                  setRegisterStep(2);
                  return;
                }
                if (registerStep === 2) {
                  if (!formData.email || !formData.password || !formData.confirmPassword) {
                    setRegisterError('Veuillez remplir email et mot de passe.');
                    return;
                  }
                  if (formData.password !== formData.confirmPassword) {
                    setRegisterError('Les mots de passe ne correspondent pas.');
                    return;
                  }
                  setRegisterStep(3);
                }
              }} className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-4 rounded-xl font-semibold transition-all">{t.authPage.next}</button>
            ) : (
              <button 
                type="submit" 
                disabled={isCreatingAccount}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-4 rounded-xl font-semibold transition-all disabled:opacity-50"
              >
                {isCreatingAccount ? t.authPage.creatingAccount : t.authPage.createAccount}
              </button>
            )}
          </div>
        )}

        {/* Lien de basculement */}
        <div className="text-center pt-4 border-t border-gray-100">
          <p className="text-xs sm:text-sm text-gray-600">
            {isLogin ? t.authPage.noAccount : t.authPage.alreadyAccount}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-600 hover:text-blue-700 font-semibold underline decoration-2 underline-offset-2"
            >
              {isLogin ? t.authPage.signUp : t.authPage.signIn}
            </button>
          </p>
        </div>

      </form>
    </motion.div>
  );

  if (asModal) {
    return (
      <div className="w-full max-w-md sm:max-w-lg md:max-w-2xl mx-auto p-2 sm:p-4">
        <div className="relative">
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 z-50 transition-transform hover:scale-110"
          >
            ✕
          </button>
          <div
            className="overflow-y-auto"
            style={{ maxHeight: '90vh' }}
          >
            {FormContent}
          </div>
        </div>
        {showConfetti && <Confetti />}
      </div>
    );
  }

  // Si c'est un modal, on affiche juste le contenu sans backdrop (le backdrop est géré par le parent)
  if (asModal) {
    return (
      <div className="w-full max-h-[90vh] overflow-y-auto bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-3xl shadow-2xl p-6">
        {/* Bouton fermer */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2 bg-white/80 hover:bg-white rounded-full shadow-lg transition-all duration-300 hover:scale-110"
        >
          <motion.div whileHover={{ rotate: 90 }} transition={{ duration: 0.3 }}>
            <X className="w-5 h-5 text-gray-700" />
          </motion.div>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center">
          {/* Colonne gauche - Illustration/Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="hidden lg:flex flex-col justify-center space-y-4"
          >
            <div className="text-center lg:text-left">
              <h2 className="text-3xl xl:text-4xl font-bold text-gray-900 mb-3">
                Bienvenue chez <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">SinoTrade</span>
              </h2>
              <p className="text-base text-gray-600 mb-6">
                Votre partenaire de confiance pour l'importation directe depuis la Chine
              </p>
            </div>

            <div className="space-y-3">
              {[
                { icon: <Shield className="w-5 h-5" />, title: "Paiements sécurisés", desc: "Transactions 100% protégées" },
                { icon: <Truck className="w-5 h-5" />, title: "Livraison rapide", desc: "Expédition mondiale sous 7-15 jours" },
                { icon: <Star className="w-5 h-5" />, title: "Qualité garantie", desc: "Produits vérifiés par nos experts" },
                { icon: <Clock className="w-5 h-5" />, title: "Support 24/7", desc: "Assistance disponible à tout moment" }
              ].map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + idx * 0.1 }}
                  className="flex items-start space-x-3 bg-white rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm mb-1">{feature.title}</h3>
                    <p className="text-xs text-gray-600">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Colonne droite - Formulaire */}
          <div>
            {FormContent}
          </div>
        </div>
        {showConfetti && <Confetti />}
      </div>
    );
  }

  // Affichage normal (pleine page)
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-4 sm:py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
          {/* Colonne gauche - Illustration/Info (masquée sur mobile) */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="hidden lg:flex flex-col justify-center space-y-6"
          >
            <div className="text-center lg:text-left">
              <h2 className="text-4xl xl:text-5xl font-bold text-gray-900 mb-4">
                Bienvenue chez <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">SinoTrade</span>
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Votre partenaire de confiance pour l'importation directe depuis la Chine
              </p>
            </div>

            <div className="space-y-4">
              {[
                { icon: <Shield className="w-6 h-6" />, title: "Paiements sécurisés", desc: "Transactions 100% protégées" },
                { icon: <Truck className="w-6 h-6" />, title: "Livraison rapide", desc: "Expédition mondiale sous 7-15 jours" },
                { icon: <Star className="w-6 h-6" />, title: "Qualité garantie", desc: "Produits vérifiés par nos experts" },
                { icon: <Clock className="w-6 h-6" />, title: "Support 24/7", desc: "Assistance disponible à tout moment" }
              ].map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + idx * 0.1 }}
                  className="flex items-start space-x-4 bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                    <p className="text-sm text-gray-600">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Colonne droite - Formulaire */}
          <div>
            {FormContent}
          </div>
        </div>
      </div>
      {showConfetti && <Confetti />}
    </div>
  );
};

export default AuthPage;