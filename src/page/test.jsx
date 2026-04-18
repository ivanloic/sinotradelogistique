import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Lock, Truck, CreditCard, MapPin, User, Mail, ArrowLeft, ShoppingBag, AlertCircle } from 'lucide-react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import { useNavigate, useLocation } from 'react-router-dom';
import CountriesAndRegions from '../data/CountriesAndRegions';
import { useCart } from '../context/CartContext';
import { usePrice } from '../hooks/usePrice';
import { paymentMethods, formatPaymentSteps } from '../data/payments';
import { useTranslation } from '../hooks/useTranslation';

const Checkout = () => {
  const { t } = useTranslation();
  const [step, setStep] = useState('information');
  const [selectedPayment, setSelectedPayment] = useState('card');
  const [saveInfo, setSaveInfo] = useState(false);
  const [sameAsBilling, setSameAsBilling] = useState(true);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({ show: false, message: '', type: 'warning' });
  const navigate = useNavigate();

  // Fonction pour afficher les toasts
  const showToast = (message, type = 'warning') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'warning' }), 3000);
  };

  // Scroll vers le haut au chargement de la page
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const [billingAddress, setBillingAddress] = useState({
    country: '',
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    phoneCode: ''
  });

    const [shippingAddress, setShippingAddress] = useState({
    country: '',
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    phoneCode: ''
  });

  const { cartItems, clearCart, shippingOption } = useCart();

  // Calculs basiques à partir du panier
  const subtotal = cartItems && cartItems.length > 0
    ? cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    : 0;

  const tax = cartItems && cartItems.length > 0
    ? cartItems.reduce((sum, item) => item.taxType === 'ht' ? sum + (item.price * item.quantity * 0.01) : sum, 0)
    : 0;

  // shipping cost based on selected option from cart (fallback 0)
  const shippingOptions = [
    // Avion (Transport Aérien)
    { id: 'air', name: 'Transport Aérien', price: 12000, deliveryTime: '7-15 jours' },
    // Bateau (Transport Maritime)
    { id: 'sea', name: 'Transport Maritime', price: 8500, deliveryTime: '30-45 jours' },
    // Express
    { id: 'express', name: 'Express Premium', price: 20000, deliveryTime: '5-10 jours' }
  ];

  const shipping = cartItems && cartItems.length > 0
    ? (shippingOptions.find(opt => opt.id === shippingOption)?.price || 0)
    : 0;

  const total = subtotal + shipping + tax;

  const chosenCountry = sameAsBilling ? billingAddress.country : shippingAddress.country;
  const chosenRegion = sameAsBilling ? billingAddress.state : shippingAddress.state;

  const selectedShippingOption = shippingOptions.find(opt => opt.id === shippingOption);


const handlePaymentSubmit = (e) => {
    e.preventDefault();

    // Construire l'objet de commande à transmettre
    const orderNumber = `ORD-${Date.now()}`;
    const order = {
      orderNumber,
      date: new Date().toLocaleString(),
      total: Number(total.toFixed(2)),
      paymentMethod: selectedPayment,
      status: 'En attente de paiement',
      items: cartItems.map(i => ({ productId: i.productId, name: i.name, price: i.price, quantity: i.quantity, image: i.image, brand: i.brand })),
      shippingAddress: {
        name: `${shippingAddress.firstName || ''} ${shippingAddress.lastName || ''}`.trim(),
        ...shippingAddress
      },
      billingAddress: {
        name: `${billingAddress.firstName || ''} ${billingAddress.lastName || ''}`.trim(),
        ...billingAddress
      },
      contact: { email: billingAddress.email, phone: `${billingAddress.phoneCode}${billingAddress.phone}` },
      totals: { subtotal: Number(subtotal.toFixed(2)), discount: Number((0).toFixed(2)), shipping: Number(shipping), tax: Number(tax.toFixed(2)), total: Number(total.toFixed(2)) }
    };

    // Sauvegarder une copie locale pour robustesse (rafraîchissement de la page confirmation)
    try {
      localStorage.setItem('lastOrder', JSON.stringify(order));
    } catch (err) {
      console.warn('Impossible de sauvegarder la commande localement', err);
    }

    // Simulation de traitement du paiement puis navigation vers la page de confirmation
    setTimeout(() => {
      navigate('/confirmation', { state: { order } });
      // Vider le panier après navigation
      try {
        clearCart && clearCart();
      } catch (err) {
        console.warn('Erreur en vidant le panier', err);
      }
    }, 1200);
  };

  const copyBillingToShipping = () => {
    setShippingAddress({ ...billingAddress });
  };

  const validateEmail = (email) => {
    return /^\S+@\S+\.\S+$/.test(email || '');
  }

  const validateInformation = () => {
    const newErrors = {};
    if (!billingAddress.firstName || billingAddress.firstName.trim() === '') newErrors.firstName = t.checkout.firstName + ' *';
    if (!billingAddress.lastName || billingAddress.lastName.trim() === '') newErrors.lastName = t.checkout.lastName + ' *';
    if (!billingAddress.email || billingAddress.email.trim() === '') newErrors.email = t.checkout.email + ' *';
    else if (!validateEmail(billingAddress.email)) newErrors.email = 'Email invalide';
    if (!billingAddress.phone || billingAddress.phone.trim() === '') newErrors.phone = t.checkout.phone + ' *';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const validateLivraison = () => {
    // Vérifier pays et région avec des toasts
    if (!billingAddress.country) {
      showToast('Veuillez sélectionner un pays', 'warning');
      return false;
    }
    if (!billingAddress.state) {
      showToast('Veuillez sélectionner une région', 'warning');
      return false;
    }
    if (!billingAddress.city || billingAddress.city.trim() === '') {
      showToast('Veuillez entrer une ville', 'warning');
      return false;
    }
    if (!billingAddress.address || billingAddress.address.trim() === '') {
      showToast('Veuillez entrer une adresse', 'warning');
      return false;
    }

    if (!sameAsBilling) {
      if (!shippingAddress.country) {
        showToast('Veuillez sélectionner un pays pour la livraison', 'warning');
        return false;
      }
      if (!shippingAddress.state) {
        showToast('Veuillez sélectionner une région pour la livraison', 'warning');
        return false;
      }
      if (!shippingAddress.city || shippingAddress.city.trim() === '') {
        showToast('Veuillez entrer une ville pour la livraison', 'warning');
        return false;
      }
      if (!shippingAddress.address || shippingAddress.address.trim() === '') {
        showToast('Veuillez entrer une adresse pour la livraison', 'warning');
        return false;
      }
    }

    return true;
  }

  const handleContinueToLivraison = () => {
    if (validateInformation()) {
      setStep('livraison');
    }
  }

  const handleContinueToPaiement = () => {
    if (validateLivraison()) {
      setStep('paiement');
    }
  }

  // Pas de données d'exemple — on affiche uniquement les produits et totaux provenant du panier
  const displaySubtotal = subtotal;
  const displayShipping = shipping;
  const displayTax = tax;
  const displayTotal = total;

  const { format: formatPrice } = usePrice();

  // Générer le numéro de commande
  const orderNumber = `ORD-${Date.now()}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      <div className="max-w-6xl mx-auto px-4 pb-24">
        {/* En-tête et navigation */}
        <div className="mb-10 pt-8">
          <motion.button 
            onClick={() => navigate('/cart')}
            className="group flex items-center space-x-2 text-gray-600 hover:text-blue-600 mb-6 px-4 py-2.5 rounded-xl hover:bg-blue-50 transition-all duration-300 border border-transparent hover:border-blue-200"
            whileHover={{ x: -5, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="bg-gray-100 group-hover:bg-blue-100 p-1.5 rounded-lg transition-colors duration-300">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <span className="font-medium">{t.cart.continueShopping}</span>
          </motion.button>
          
          <div className="flex items-center space-x-3 mb-2">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2.5 rounded-xl shadow-lg">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{t.checkout.title}</h1>
          </div>
          
          <p className="text-gray-600 text-sm ml-14">{t.checkout.title}</p>
        </div>

  {/* Étapes - desktop full and mobile compact (3 étapes) */}
        <div className="mb-8">
          {/* Desktop: full stepper */}
          <div className="hidden md:flex justify-center mb-4">
            <div className="flex items-center space-x-8">
              {[
                { id: 'information', label: t.checkout.shippingAddress.split(' ')[0] || 'Info' },
                { id: 'livraison', label: t.product.delivery },
                { id: 'paiement', label: t.checkout.paymentMethod }
              ].map((stepItem, index) => {
                const stepOrder = ['information', 'livraison', 'paiement'];
                const currentIndex = stepOrder.indexOf(step);
                const itemIndex = stepOrder.indexOf(stepItem.id);
                const isActive = step === stepItem.id;
                const isCompleted = currentIndex > itemIndex;
                return (
                  <div key={stepItem.id} className="flex items-center">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                      isActive ? 'bg-blue-600 text-white' : isCompleted ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
                    }`}>
                      {isCompleted ? '✓' : itemIndex + 1}
                    </div>
                    <span className={`ml-2 font-medium ${
                      isActive ? 'text-blue-600' : 'text-gray-600'
                    }`}>
                      {stepItem.label}
                    </span>
                    {index < 2 && <div className="w-12 h-0.5 bg-gray-300 ml-8" />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mobile: compact header showing current step */}
          <div className="flex md:hidden items-center justify-between px-2">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-medium">
                {step === 'information' ? 1 : step === 'livraison' ? 2 : 3}
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">
                  {step === 'information' && t.checkout.shippingAddress.split(' ')[0]}
                  {step === 'livraison' && t.product.delivery}
                  {step === 'paiement' && t.checkout.paymentMethod}
                </div>
                <div className="text-xs text-gray-500">{step === 'information' ? 1 : step === 'livraison' ? 2 : 3}/3</div>
              </div>
            </div>
            <div>
              {step !== 'information' && (
                <button onClick={() => setStep(prev => prev === 'livraison' ? 'information' : prev === 'paiement' ? 'livraison' : prev)} className="text-sm text-blue-600">{t.common.back}</button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne principale - Formulaire */}
          <div className="lg:col-span-2 space-y-6">
            {step === 'information' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                {/* Informations personnelles */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <span>{t.orderConfirmation.customerInfo}</span>
                    </h2>
                  </div>
                  
                  <div className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t.checkout.firstName} *
                        </label>
                        <input
                          type="text"
                          value={billingAddress.firstName}
                          onChange={(e) => setBillingAddress({ ...billingAddress, firstName: e.target.value })}
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.firstName ? 'border-red-500 focus:ring-red-300' : 'border-gray-300'}`}
                          placeholder={t.checkout.firstName}
                        />
                        {errors.firstName && <p className="text-sm text-red-600 mt-1">{errors.firstName}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t.checkout.lastName} *
                        </label>
                        <input
                          type="text"
                          value={billingAddress.lastName}
                          onChange={(e) => setBillingAddress({ ...billingAddress, lastName: e.target.value })}
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.lastName ? 'border-red-500 focus:ring-red-300' : 'border-gray-300'}`}
                          placeholder={t.checkout.lastName}
                        />
                        {errors.lastName && <p className="text-sm text-red-600 mt-1">{errors.lastName}</p>}
                      </div>
                    </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t.checkout.email} *
                        </label>
                        <div className="relative">
                          <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                          <input
                            type="email"
                            value={billingAddress.email}
                            onChange={(e) => setBillingAddress({ ...billingAddress, email: e.target.value })}
                            className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.email ? 'border-red-500 focus:ring-red-300' : 'border-gray-300'}`}
                            placeholder={t.checkout.email}
                          />
                          {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t.checkout.phone} *
                        </label>
                        <div className="flex">
                          <select
                            value={billingAddress.phoneCode}
                            onChange={(e) => setBillingAddress({ ...billingAddress, phoneCode: e.target.value })}
                            className={`shrink-0 px-2 py-2 border border-r-0 rounded-l-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                          >
                            <option value="">+?</option>
                            {CountriesAndRegions.filter(c => c.indicatif).map((item) => (
                              <option key={item.country} value={item.indicatif}>
                                {item.country} ({item.indicatif})
                              </option>
                            ))}
                          </select>
                          <input
                            type="tel"
                            value={billingAddress.phone}
                            onChange={(e) => setBillingAddress({ ...billingAddress, phone: e.target.value })}
                            className={`flex-1 px-3 py-2 border rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.phone ? 'border-red-500 focus:ring-red-300' : 'border-gray-300'}`}
                            placeholder="07 00 00 00 00"
                          />
                        </div>
                        {errors.phone && <p className="text-sm text-red-600 mt-1">{errors.phone}</p>}
                      </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="saveInfo"
                        checked={saveInfo}
                        onChange={() => setSaveInfo(!saveInfo)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="saveInfo" className="text-sm text-gray-700">
                        {t.common.save}
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <motion.button
                    onClick={handleContinueToLivraison}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span>{t.common.next}</span>
                    <ArrowLeft className="w-5 h-5 rotate-180" />
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Etape Livraison */}
            {step === 'livraison' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <MapPin className="w-5 h-5 text-blue-600" />
                      </div>
                      <span>{t.checkout.shippingAddress}</span>
                    </h2>
                  </div>
                  
                <form className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t.checkout.country} *
                      </label>
                      <select
                        required
                        value={billingAddress.country}
                        onChange={(e) => {
                          const selectedCountry = e.target.value;
                          const countryData = CountriesAndRegions.find(c => c.country === selectedCountry);
                          setBillingAddress({ ...billingAddress, country: selectedCountry, state: '', phoneCode: countryData?.indicatif || billingAddress.phoneCode });
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6819ce] focus:border-transparent transition-all duration-300"
                      >
                        <option value="">{t.checkout.country}</option>
                        {CountriesAndRegions.map((item) => (
                          <option key={item.country} value={item.country}>
                            {item.country}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t.checkout.firstName} *
                        </label>
                        <input
                          type="text"
                          required
                          value={billingAddress.firstName}
                          onChange={(e) => setBillingAddress({ ...billingAddress, firstName: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6819ce] focus:border-transparent transition-all duration-300"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t.checkout.lastName} *
                        </label>
                        <input
                          type="text"
                          required
                          value={billingAddress.lastName}
                          onChange={(e) => setBillingAddress({ ...billingAddress, lastName: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6819ce] focus:border-transparent transition-all duration-300"
                        />
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t.checkout.address} *
                      </label>
                      <input
                        type="text"
                        required
                        value={billingAddress.address}
                        onChange={(e) => setBillingAddress({ ...billingAddress, address: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6819ce] focus:border-transparent transition-all duration-300"
                        placeholder={t.checkout.address}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <button type="button" className="text-[#6819ce] hover:text-[#13336d]">
                          +
                        </button>
                      </label>
                      <input
                        type="text"
                        value={billingAddress.apartment}
                        onChange={(e) => setBillingAddress({ ...billingAddress, apartment: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6819ce] focus:border-transparent transition-all duration-300"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t.checkout.city} *
                      </label>
                      <input
                        type="text"
                        required
                        value={billingAddress.city}
                        onChange={(e) => setBillingAddress({ ...billingAddress, city: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6819ce] focus:border-transparent transition-all duration-300"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t.checkout.state} *
                      </label>
                      <select
                        required
                        value={billingAddress.state}
                        onChange={(e) => setBillingAddress({ ...billingAddress, state: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6819ce] focus:border-transparent transition-all duration-300"
                      >
                        <option value="">{t.checkout.state}</option>
                        {CountriesAndRegions.find((item) => item.country === billingAddress.country)?.regions.map((region) => (
                          <option key={region} value={region}>
                            {region}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t.checkout.zipCode}
                      </label>
                      <input
                        type="text"
                        value={billingAddress.zipCode}
                        onChange={(e) => setBillingAddress({ ...billingAddress, zipCode: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6819ce] focus:border-transparent transition-all duration-300"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t.checkout.phone}
                      </label>
                      <div className="flex">
                        <select
                          value={billingAddress.phoneCode}
                          onChange={(e) => setBillingAddress({ ...billingAddress, phoneCode: e.target.value })}
                          className="shrink-0 px-2 py-3 border border-r-0 rounded-l-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#6819ce] text-sm border-gray-300"
                        >
                          <option value="">+?</option>
                          {CountriesAndRegions.filter(c => c.indicatif).map((item) => (
                            <option key={item.country} value={item.indicatif}>
                              {item.country} ({item.indicatif})
                            </option>
                          ))}
                        </select>
                        <input
                          type="tel"
                          value={billingAddress.phone}
                          onChange={(e) => setBillingAddress({ ...billingAddress, phone: e.target.value })}
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-[#6819ce] focus:border-transparent transition-all duration-300"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Adresse de livraison différente */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex items-center mb-4">
                      <input
                        type="checkbox"
                        checked={sameAsBilling}
                        onChange={(e) => {
                          setSameAsBilling(e.target.checked);
                          if (e.target.checked) {
                            copyBillingToShipping();
                          }
                        }}
                        className="w-4 h-4 text-[#6819ce] border-gray-300 rounded focus:ring-[#6819ce]"
                      />
                      <label className="ml-2 text-sm text-gray-700">
                        {t.checkout.shippingAddress} = {t.checkout.billingAddress}
                      </label>
                    </div>

                    {!sameAsBilling && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-gray-900 mb-4">{t.checkout.shippingAddress}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              {t.checkout.address} *
                            </label>
                            <input
                              type="text"
                              required
                              value={shippingAddress.address}
                              onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6819ce] focus:border-transparent transition-all duration-300"
                            />
                          </div>
                          {/* Ajouter les autres champs pour l'adresse de livraison */}
                        </div>
                      </div>
                    )}
                  </div>
                </form>
                </div>

                <div className="flex items-center space-x-3">
                  <motion.button 
                    onClick={() => setStep('information')} 
                    className="px-6 py-3 rounded-xl border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 font-medium"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {t.common.back}
                  </motion.button>
                  <motion.button
                    onClick={handleContinueToPaiement}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span>{t.common.next}</span>
                    <ArrowLeft className="w-5 h-5 rotate-180" />
                  </motion.button>
                </div>
              </motion.div>
            )}

            {step === 'paiement' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                {/* Méthodes de paiement */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <CreditCard className="w-5 h-5 text-blue-600" />
                      </div>
                      <span>{t.checkout.paymentMethod}</span>
                    </h2>
                  </div>
                  
                  <div className="p-6 space-y-4">
                    {paymentMethods.map((method) => (
                      <motion.div
                        key={method.id}
                        onClick={() => setSelectedPayment(method.id)}
                        className={`border rounded-xl p-4 cursor-pointer transition-all ${
                          selectedPayment === method.id
                            ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 shadow-md'
                            : 'border-gray-200 hover:border-blue-300 hover:shadow-sm'
                        }`}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                              selectedPayment === method.id ? 'bg-blue-100' : 'bg-gray-100'
                            }`}>
                              {method.icon === 'card' ? (
                                <CreditCard className="w-6 h-6 text-blue-600" />
                              ) : (
                                <span className="text-sm font-bold text-blue-600">{method.icon}</span>
                              )}
                            </div>
                            
                            <div>
                              <h3 className="font-semibold text-gray-900">{method.name}</h3>
                              <p className="text-sm text-gray-600">{method.description}</p>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {method.logos.map((logo, index) => (
                                  <div 
                                    key={index}
                                    className="h-8 px-2 bg-white rounded border border-gray-200 flex items-center justify-center"
                                  >
                                    <img 
                                      src={logo} 
                                      alt={`${method.name} logo ${index + 1}`}
                                      className="h-6 max-w-[60px] object-contain"
                                      onError={(e) => {
                                        console.error(`Erreur de chargement de l'image: ${logo}`);
                                        e.target.parentElement.style.display = 'none';
                                      }}
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                          
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            selectedPayment === method.id
                              ? 'border-blue-500 bg-blue-500'
                              : 'border-gray-300'
                          }`}>
                            {selectedPayment === method.id && (
                              <div className="w-2 h-2 bg-white rounded-full" />
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Instructions de paiement */}
                {selectedPayment && paymentMethods.find(m => m.id === selectedPayment) && (
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-lg border border-blue-100 overflow-hidden">
                    <div className="p-6 bg-gradient-to-r from-blue-100 to-purple-100 border-b border-blue-200">
                      <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        <Lock className="w-5 h-5 text-blue-600" />
                        {t.orderConfirmation.paymentInstructions} - {paymentMethods.find(m => m.id === selectedPayment)?.name}
                      </h3>
                    </div>
                    
                    <div className="p-6 space-y-4">
                      {/* Détails du destinataire */}
                      <div className="bg-white rounded-lg p-4 border border-blue-200">
                        <h4 className="font-medium text-gray-900 mb-3">{t.orderConfirmation.paymentInfo}</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">{paymentMethods.find(m => m.id === selectedPayment)?.details.type}:</span>
                            <span className="font-semibold text-blue-600">{paymentMethods.find(m => m.id === selectedPayment)?.details.value}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">{t.checkout.paymentMethod}:</span>
                            <span className="font-semibold">{paymentMethods.find(m => m.id === selectedPayment)?.details.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">{t.cart.total}:</span>
                            <span className="font-semibold text-green-600">{formatPrice(total)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">{t.orderConfirmation.orderNumber}:</span>
                            <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">{orderNumber}</span>
                          </div>
                        </div>
                      </div>

                      {/* Étapes */}
                      <div className="bg-white rounded-lg p-4 border border-blue-200">
                        <h4 className="font-medium text-gray-900 mb-3">{t.orderConfirmation.paymentInstructions}</h4>
                        <ol className="space-y-2 text-sm">
                          {formatPaymentSteps(selectedPayment, orderNumber, formatPrice(total).replace(/\s/g, ' ')).map((step, index) => (
                            <li key={index} className="flex items-start gap-3">
                              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-medium">
                                {index + 1}
                              </span>
                              <span className="text-gray-700 pt-0.5">{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>

                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <p className="text-sm text-yellow-800">
                          <strong>⚠️ {t.orderConfirmation.important}:</strong> {t.orderConfirmation.copyOrderNumber} <strong>{orderNumber}</strong>
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Détails de la carte (si carte sélectionnée) */}
                {selectedPayment === 'card' && (
                  <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
                      <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        <Lock className="w-5 h-5 text-blue-600" />
                        {t.checkout.paymentMethod}
                      </h3>
                    </div>
                    
                    <div className="p-6 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t.checkout.paymentMethod} *
                        </label>
                        <div className="relative">
                          <CreditCard className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                          <input
                            type="text"
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="1234 5678 9012 3456"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Date *
                          </label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="MM/AA"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            CVV *
                          </label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="123"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t.common.name} *
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder={t.common.name}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Confidentialité */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-sm border border-green-100">
                  <div className="p-6">
                    <div className="flex items-start space-x-3">
                      <div className="bg-green-100 p-2 rounded-lg">
                        <Shield className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">{t.common.securePayment}</h3>
                        <p className="text-sm text-gray-700">
                          {t.common.securePaymentDesc}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <motion.button
                  onClick={handlePaymentSubmit}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Lock className="w-5 h-5" />
                  <span>{t.checkout.placeOrder} {formatPrice(total)}</span>
                </motion.button>
              </motion.div>
            )}

              {/* Garanties */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 space-y-4 border border-blue-100 shadow-sm">
              <h3 className="font-semibold text-blue-900 flex items-center space-x-2">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Shield className="w-5 h-5 text-blue-600" />
                </div>
                <span>{t.orderConfirmation.paymentInfo}</span>
              </h3>
              <ul className="space-y-2.5 text-sm text-blue-800">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">✓</span>
                  <span>{t.common.securePayment}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">✓</span>
                  <span>30 {t.home.days}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">✓</span>
                  <span>{t.common.support247}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">✓</span>
                  <span>{t.product.delivery}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">✓</span>
                  <span>{t.product.inStock}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Colonne latérale - Récapitulatif */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-xl border border-gray-100 sticky top-8 overflow-hidden">
              <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-blue-600" />
                  {t.checkout.orderSummary}
                </h2>
              </div>
              
              <div className="p-6 space-y-4">
                {/* Articles */}
                <div className="space-y-3">
                  {cartItems && cartItems.length > 0 ? (
                    cartItems.map((item) => (
                      <div key={item._key || item.productId} className="flex space-x-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 line-clamp-2">
                            {item.name}
                          </h4>
                          <div className="flex justify-between items-center mt-1">
                            <span className="text-sm text-gray-600">
                              {item.quantity} × {formatPrice(item.price)}
                            </span>
                            <span className="text-sm font-medium">
                              {formatPrice(item.price * item.quantity)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-gray-600">{t.cart.empty}</div>
                  )}
                </div>

                {/* Livraison */}
                <div className="border-t pt-4 bg-gradient-to-br from-blue-50 to-indigo-50 -mx-6 px-6 py-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-700 mb-2 font-medium">
                          <div className="bg-blue-100 p-1.5 rounded-lg">
                            <Truck className="w-4 h-4 text-blue-600" />
                          </div>
                          <span>{selectedShippingOption?.name || t.product.delivery}</span>
                        </div>
                        {chosenCountry && chosenRegion && (
                          <div className="text-xs text-gray-600 ml-8">
                            {t.product.delivery} {chosenRegion}, {chosenCountry} • {selectedShippingOption?.deliveryTime}
                          </div>
                        )}
                </div>

                {/* Total */}
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{t.cart.subtotal}</span>
                    <span>{formatPrice(displaySubtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{t.cart.shipping}</span>
                    <span>{formatPrice(displayShipping)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{t.cart.taxes}</span>
                    <span>{formatPrice(displayTax)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg border-t pt-3 bg-gradient-to-r from-green-50 to-emerald-50 -mx-6 px-6 py-4 rounded-b-xl">
                    <span className="text-gray-900">{t.cart.total}</span>
                    <span className="text-green-600 text-xl">{formatPrice(displayTotal)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Espacement avant le footer */}
      <div className="h-24"></div>
      
      <Footer />

      {/* Toast Notification */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="fixed top-8 right-8 z-[9999] max-w-md"
          >
            <div className={`rounded-xl shadow-2xl p-4 flex items-start space-x-3 ${
              toast.type === 'success' 
                ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                : 'bg-gradient-to-r from-orange-500 to-amber-500'
            }`}>
              <AlertCircle className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-white font-medium text-sm">{toast.message}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Checkout;
