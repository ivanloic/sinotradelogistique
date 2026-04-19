import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube, 
  Linkedin,
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  Send,
  CreditCard,
  Shield,
  Truck,
  HeadphonesIcon,
  ArrowRight,
  ChevronRight,
  ArrowUp
} from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setEmail('');
      }, 3000);
    }
  };

  // Gérer l'affichage du bouton scroll to top
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Liens de navigation
  const quickLinks = [
    { label: t.categories.clothing,    path: '/clothing' },
    { label: t.categories.bags,        path: '/bags' },
    { label: t.categories.hairProducts,path: '/bijou' },
    { label: t.categories.perruque,    path: '/perruque' },
    { label: t.categories.electronics, path: '/telephone_accessoires' },
    { label: t.footer.aboutUs,         path: '/' },
  ];

  const customerServiceLinks = [
    { label: t.footer.helpCenter, path: '/' },
    { label: t.footer.trackOrder, path: '/' },
    { label: t.footer.returns, path: '/' },
    { label: t.footer.shipping, path: '/' },
    { label: t.footer.faq, path: '/' },
  ];

  const legalLinks = [
    { label: t.footer.termsOfService, path: '/' },
    { label: t.footer.privacyPolicy, path: '/' },
    { label: t.footer.paymentMethods, path: '/' },
  ];

  const categories = [
    { label: t.footer.electronics, path: '/' },
    { label: t.footer.fashion, path: '/clothing' },
    { label: t.footer.beauty, path: '/' },
    { label: t.footer.sports, path: '/' },
    { label: t.footer.home, path: '/' },
  ];

  const socialLinks = [
    { icon: <Facebook className="w-5 h-5" />, url: '#', color: 'hover:bg-blue-600' },
    { icon: <Twitter className="w-5 h-5" />, url: '#', color: 'hover:bg-sky-500' },
    { icon: <Instagram className="w-5 h-5" />, url: '#', color: 'hover:bg-pink-600' },
    { icon: <Youtube className="w-5 h-5" />, url: '#', color: 'hover:bg-red-600' },
    { icon: <Linkedin className="w-5 h-5" />, url: '#', color: 'hover:bg-blue-700' },
  ];

  const paymentMethods = [
    { name: 'Visa', image: 'https://res.cloudinary.com/deuttziac/payement/visa.png' },
    { name: 'Mastercard', image: 'https://res.cloudinary.com/deuttziac/payement/mastercard.png' },
    { name: 'PayPal', image: 'https://res.cloudinary.com/deuttziac/payement/paypal.png' },
    { name: 'American Express', image: 'https://res.cloudinary.com/deuttziac/payement/amex.png' },
    { name: 'Apple Pay', image: 'https://res.cloudinary.com/deuttziac/payement/applepay.png' },
    { name: 'Orange Money', image: 'https://res.cloudinary.com/deuttziac/payement/orangemoney.png' },
    { name: 'Mobile Money', image: 'https://res.cloudinary.com/deuttziac/payement/MobileMoney.jpg' },
    { name: 'Wave', image: 'https://res.cloudinary.com/deuttziac/payement/logowave.png' },
  ];

  const features = [
    { icon: <Truck className="w-5 h-5" />, text: t.common.fastShipping },
    { icon: <Shield className="w-5 h-5" />, text: t.common.securePayment },
    { icon: <HeadphonesIcon className="w-5 h-5" />, text: t.common.support247 },
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Contenu principal du footer */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Colonne À propos */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-4">
                <img src="https://res.cloudinary.com/deuttziac/logo/logochine.png" alt="SinoTrade" className="h-20 w-auto" />
              </div>
              <p className="text-gray-400 mb-4 leading-relaxed">
                {t.footer.aboutDescription}
              </p>
            </div>

            {/* Newsletter */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <Mail className="w-5 h-5 mr-2 text-blue-400" />
                {t.footer.newsletter}
              </h3>
              <p className="text-gray-400 text-sm mb-3">{t.footer.newsletterText}</p>
              <form onSubmit={handleSubscribe} className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.footer.emailPlaceholder}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-500"
                  required
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors flex items-center space-x-1"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
              {subscribed && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-green-400 text-sm mt-2"
                >
                  ✓ {t.common.success}
                </motion.p>
              )}
            </div>

            {/* Réseaux sociaux */}
            <div>
              <h3 className="text-sm font-semibold mb-3 text-gray-300">{t.footer.followUs}</h3>
              <div className="flex space-x-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`bg-gray-800 p-2 rounded-lg transition-all duration-300 ${social.color} hover:scale-110`}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Liens rapides */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <ChevronRight className="w-5 h-5 text-blue-400" />
              {t.footer.quickLinks}
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => navigate(link.path)}
                    className="text-gray-400 hover:text-blue-400 transition-colors flex items-center group"
                  >
                    <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Service client */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <ChevronRight className="w-5 h-5 text-blue-400" />
              {t.footer.customerService}
            </h3>
            <ul className="space-y-2">
              {customerServiceLinks.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => navigate(link.path)}
                    className="text-gray-400 hover:text-blue-400 transition-colors flex items-center group"
                  >
                    <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <ChevronRight className="w-5 h-5 text-blue-400" />
              {t.footer.contactUs}
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3 text-gray-400">
                <Phone className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-300">{t.footer.phone}</p>
                  <p className="text-sm">+8 441 476 564</p>
                </div>
              </li>
              <li className="flex items-start space-x-3 text-gray-400">
                <Mail className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-300">{t.footer.email}</p>
                  <p className="text-sm">sinotradelogistics@gmail.com</p>
                </div>
              </li>
              <li className="flex items-start space-x-3 text-gray-400">
                <MapPin className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-300">{t.footer.address}</p>
                  <p className="text-sm">wuhan, chine</p>
                </div>
              </li>
              <li className="flex items-start space-x-3 text-gray-400">
                <Clock className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-300">{t.footer.workingHours}</p>
                  <p className="text-sm">{t.footer.mondayFriday}</p>
                  <p className="text-sm">{t.footer.saturday}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Méthodes de paiement */}
        <div className="border-t border-gray-700 pt-8 mb-8">
          <div className="flex flex-col items-start">
            <p className="text-gray-400 text-sm flex items-center mb-4">
              <CreditCard className="w-5 h-5 mr-2 text-blue-400" />
              {t.footer.paymentMethods}
            </p>
            <div className="flex flex-wrap gap-2 items-center w-full mb-4">
              {paymentMethods.map((payment, index) => (
                <div 
                  key={index} 
                  className="bg-white p-1.5 rounded shadow-sm hover:shadow-md transition-shadow duration-300 flex items-center justify-center"
                  style={{ minWidth: '50px', height: '32px' }}
                >
                  <img 
                    src={payment.image} 
                    alt={payment.name} 
                    className="max-h-5 w-auto object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.style.display = 'none';
                    }}
                  />
                </div>
              ))}
            </div>
            <div className="flex items-center space-x-2 text-green-400">
              <Shield className="w-5 h-5" />
              <span className="text-sm font-medium">{t.footer.securePayment}</span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-4 mb-4 md:mb-0">
              <p className="text-gray-400 text-sm">
                © {new Date().getFullYear()} {t.footer.companyName}. {t.footer.allRightsReserved}.
              </p>
              {/* Lien admin discret */}
              <button
                onClick={() => navigate('/admin')}
                className="text-gray-700 hover:text-gray-500 text-xs transition-colors opacity-30 hover:opacity-50"
                title="Admin"
              >
                admin
              </button>
            </div>
            <div className="flex space-x-6">
              {legalLinks.map((link, index) => (
                <button
                  key={index}
                  onClick={() => navigate(link.path)}
                  className="text-gray-400 hover:text-blue-400 text-sm transition-colors"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Badge "Made with ❤️" */}
      <div className="bg-gray-950 py-3">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-500 text-xs">
            {t.footer.sustainabilityDescription} | Made with ❤️ for Africa
          </p>
        </div>
      </div>

      {/* Bouton Scroll to Top flottant */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-50 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-2xl hover:shadow-blue-500/50 hover:scale-110 transition-all duration-300 group"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-6 h-6 group-hover:animate-bounce" />
          </motion.button>
        )}
      </AnimatePresence>
    </footer>
  );
};

export default Footer;
