import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Lock, Truck, MapPin, User, Mail, ArrowLeft, ShoppingBag, AlertCircle, Loader2 } from 'lucide-react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import { useNavigate } from 'react-router-dom';
import CountriesAndRegions from '../data/CountriesAndRegions';
import { useCart } from '../context/CartContext';
import { usePrice } from '../hooks/usePrice';
import { useTranslation } from '../hooks/useTranslation';

// ✅ On appelle notre propre backend Express — la clé secrète Moneroo
//    reste sur le serveur et n'est jamais exposée au navigateur.
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? 'http://localhost:3001';

const Checkout = () => {
  const { t } = useTranslation();
  const [step, setStep] = useState('information');
  const [saveInfo, setSaveInfo] = useState(false);
  const [sameAsBilling, setSameAsBilling] = useState(true);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'warning' });
  const navigate = useNavigate();

  const showToast = (message, type = 'warning') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'warning' }), 3500);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const [billingAddress, setBillingAddress] = useState({
    country: '', firstName: '', lastName: '', email: '',
    address: '', apartment: '', city: '', state: '', zipCode: '', phone: '', phoneCode: ''
  });

  const [shippingAddress, setShippingAddress] = useState({
    country: '', firstName: '', lastName: '', email: '',
    address: '', apartment: '', city: '', state: '', zipCode: '', phone: '', phoneCode: ''
  });

  const { cartItems, clearCart, shippingOption } = useCart();

  const subtotal = cartItems?.reduce((sum, item) => sum + item.price * item.quantity, 0) ?? 0;
  const tax      = cartItems?.reduce((sum, item) => item.taxType === 'ht' ? sum + item.price * item.quantity * 0.01 : sum, 0) ?? 0;

  const shippingOptions = [
    { id: 'air',     name: 'Transport Aérien',  price: 12000, deliveryTime: '7-15 jours' },
    { id: 'sea',     name: 'Transport Maritime', price: 8500,  deliveryTime: '30-45 jours' },
    { id: 'express', name: 'Express Premium',    price: 20000, deliveryTime: '5-10 jours' },
  ];

  const shipping              = cartItems?.length ? (shippingOptions.find(o => o.id === shippingOption)?.price ?? 0) : 0;
  const total                 = subtotal + shipping + tax;
  const selectedShippingOption = shippingOptions.find(o => o.id === shippingOption);

  const chosenCountry = sameAsBilling ? billingAddress.country : shippingAddress.country;
  const chosenRegion  = sameAsBilling ? billingAddress.state   : shippingAddress.state;

  const { format: formatPrice } = usePrice();

  // ── Validation ──────────────────────────────────────────────
  const validateEmail = (email) => /^\S+@\S+\.\S+$/.test(email ?? '');

  const validateInformation = () => {
    const e = {};
    if (!billingAddress.firstName?.trim()) e.firstName = t.checkout.firstName + ' *';
    if (!billingAddress.lastName?.trim())  e.lastName  = t.checkout.lastName  + ' *';
    if (!billingAddress.email?.trim())     e.email     = t.checkout.email     + ' *';
    else if (!validateEmail(billingAddress.email)) e.email = 'Email invalide';
    if (!billingAddress.phone?.trim())     e.phone     = t.checkout.phone     + ' *';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateLivraison = () => {
    if (!billingAddress.country) { showToast('Veuillez sélectionner un pays'); return false; }
    if (!billingAddress.state)   { showToast('Veuillez sélectionner une région'); return false; }
    if (!billingAddress.city?.trim())    { showToast('Veuillez entrer une ville'); return false; }
    if (!billingAddress.address?.trim()) { showToast('Veuillez entrer une adresse'); return false; }
    if (!sameAsBilling) {
      if (!shippingAddress.country) { showToast('Veuillez sélectionner un pays pour la livraison'); return false; }
      if (!shippingAddress.state)   { showToast('Veuillez sélectionner une région pour la livraison'); return false; }
      if (!shippingAddress.city?.trim())    { showToast('Veuillez entrer une ville pour la livraison'); return false; }
      if (!shippingAddress.address?.trim()) { showToast('Veuillez entrer une adresse pour la livraison'); return false; }
    }
    return true;
  };

  const handleContinueToLivraison = () => { if (validateInformation()) setStep('livraison'); };
  const handleContinueToPaiement  = () => { if (validateLivraison())   setStep('paiement'); };

  const copyBillingToShipping = () => setShippingAddress({ ...billingAddress });

  // ── Paiement Moneroo ────────────────────────────────────────
  const handlePaymentSubmit = async () => {
    if (!cartItems?.length) {
      showToast('Votre panier est vide.', 'warning');
      return;
    }

    setIsLoading(true);

    const orderNumber = `ORD-${Date.now()}`;

    // Sauvegarde locale pour la page de confirmation après retour de Moneroo
    const order = {
      orderNumber,
      date: new Date().toLocaleString(),
      total: Number(total.toFixed(2)),
      status: 'En attente de paiement',
      items: cartItems.map(i => ({
        productId: i.productId, name: i.name, price: i.price,
        quantity: i.quantity,  image: i.image, brand: i.brand,
      })),
      shippingAddress: sameAsBilling ? billingAddress : shippingAddress,
      billingAddress,
      contact: { email: billingAddress.email, phone: `${billingAddress.phoneCode}${billingAddress.phone}` },
      totals: {
        subtotal: Number(subtotal.toFixed(2)),
        discount: 0,
        shipping: Number(shipping),
        tax: Number(tax.toFixed(2)),
        total: Number(total.toFixed(2)),
      },
    };

    try {
      localStorage.setItem('lastOrder', JSON.stringify(order));
    } catch (_) {}

    // ── Appel API Moneroo ──────────────────────────────────────
    // ⚠️  En production : déplace cet appel dans ton backend
    //     pour ne pas exposer MONEROO_SECRET_KEY côté client.
    const payload = {
      amount:      Math.round(total),   // Moneroo attend un entier
      currency:    'XOF',               // Adapte selon ta devise
      description: `Commande ${orderNumber}`,
      return_url:  `${window.location.origin}/`,
      customer: {
        email:      billingAddress.email,
        first_name: billingAddress.firstName,
        last_name:  billingAddress.lastName,
        phone:      `${billingAddress.phoneCode}${billingAddress.phone}`,
        address:    billingAddress.address,
        city:       billingAddress.city,
        state:      billingAddress.state,
        country:    billingAddress.country,
        zip:        billingAddress.zipCode,
      },
      metadata: {
        order_id: orderNumber,
      },
    };

    try {
      const response = await fetch(`${BACKEND_URL}/api/payments/initialize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept':       'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Moneroo error:', data);
        showToast(data?.message ?? 'Erreur lors de l\'initialisation du paiement.', 'error');
        setIsLoading(false);
        return;
      }

      // Vider le panier avant la redirection
      try { clearCart?.(); } catch (_) {}

      // Redirection vers la page de paiement Moneroo
      window.location.href = data.checkout_url;

    } catch (err) {
      console.error('Moneroo fetch error:', err);
      showToast('Impossible de contacter le service de paiement. Vérifiez votre connexion.', 'error');
      setIsLoading(false);
    }
  };

  // ── UI ───────────────────────────────────────────────────────
  const stepOrder = ['information', 'livraison', 'paiement'];
  const currentStepIndex = stepOrder.indexOf(step);

  const stepLabels = [
    t.checkout.shippingAddress?.split(' ')[0] ?? 'Info',
    t.product?.delivery ?? 'Livraison',
    t.checkout.paymentMethod ?? 'Paiement',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />

      <div className="max-w-6xl mx-auto px-4 pb-24">

        {/* ── Header page ── */}
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
            <span className="font-medium">{t.cart?.continueShopping}</span>
          </motion.button>

          <div className="flex items-center space-x-3 mb-2">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2.5 rounded-xl shadow-lg">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {t.checkout?.title}
            </h1>
          </div>
        </div>

        {/* ── Stepper ── */}
        <div className="mb-8">
          {/* Desktop */}
          <div className="hidden md:flex justify-center mb-4">
            <div className="flex items-center space-x-8">
              {stepOrder.map((s, index) => {
                const isActive    = step === s;
                const isCompleted = currentStepIndex > index;
                return (
                  <div key={s} className="flex items-center">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full font-medium text-sm ${
                      isActive ? 'bg-blue-600 text-white' : isCompleted ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
                    }`}>
                      {isCompleted ? '✓' : index + 1}
                    </div>
                    <span className={`ml-2 font-medium ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                      {stepLabels[index]}
                    </span>
                    {index < 2 && <div className="w-12 h-0.5 bg-gray-300 ml-8" />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mobile */}
          <div className="flex md:hidden items-center justify-between px-2">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-medium">
                {currentStepIndex + 1}
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">{stepLabels[currentStepIndex]}</div>
                <div className="text-xs text-gray-500">{currentStepIndex + 1}/3</div>
              </div>
            </div>
            {step !== 'information' && (
              <button
                onClick={() => setStep(stepOrder[currentStepIndex - 1])}
                className="text-sm text-blue-600"
              >
                {t.common?.back}
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ══════════════════════════════════════════════════
              COLONNE PRINCIPALE
          ══════════════════════════════════════════════════ */}
          <div className="lg:col-span-2 space-y-6">

            {/* ── ÉTAPE 1 : Informations personnelles ── */}
            {step === 'information' && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                  <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
                      <div className="bg-blue-100 p-2 rounded-lg"><User className="w-5 h-5 text-blue-600" /></div>
                      <span>{t.orderConfirmation?.customerInfo}</span>
                    </h2>
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Prénom */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{t.checkout?.firstName} *</label>
                        <input
                          type="text"
                          value={billingAddress.firstName}
                          onChange={(e) => setBillingAddress({ ...billingAddress, firstName: e.target.value })}
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
                          placeholder={t.checkout?.firstName}
                        />
                        {errors.firstName && <p className="text-sm text-red-600 mt-1">{errors.firstName}</p>}
                      </div>
                      {/* Nom */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{t.checkout?.lastName} *</label>
                        <input
                          type="text"
                          value={billingAddress.lastName}
                          onChange={(e) => setBillingAddress({ ...billingAddress, lastName: e.target.value })}
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
                          placeholder={t.checkout?.lastName}
                        />
                        {errors.lastName && <p className="text-sm text-red-600 mt-1">{errors.lastName}</p>}
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{t.checkout?.email} *</label>
                      <div className="relative">
                        <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          value={billingAddress.email}
                          onChange={(e) => setBillingAddress({ ...billingAddress, email: e.target.value })}
                          className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                          placeholder={t.checkout?.email}
                        />
                      </div>
                      {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
                    </div>

                    {/* Téléphone */}
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Le numéro que vous saisissez sera utilisé pour vous contacter lorsque la marchandise arrivera.</p>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{t.checkout?.phone} *</label>
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
                          className={`flex-1 px-3 py-2 border rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                          placeholder="6 00 00 00 00"
                        />
                      </div>
                      {errors.phone && <p className="text-sm text-red-600 mt-1">{errors.phone}</p>}
                    </div>

                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="saveInfo" checked={saveInfo} onChange={() => setSaveInfo(!saveInfo)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded" />
                      <label htmlFor="saveInfo" className="text-sm text-gray-700">{t.common?.save}</label>
                    </div>
                  </div>
                </div>

                <motion.button
                  onClick={handleContinueToLivraison}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-6 rounded-xl font-semibold shadow-lg flex items-center justify-center space-x-2"
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                >
                  <span>{t.common?.next}</span>
                  <ArrowLeft className="w-5 h-5 rotate-180" />
                </motion.button>
              </motion.div>
            )}

            {/* ── ÉTAPE 2 : Livraison ── */}
            {step === 'livraison' && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                  <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
                      <div className="bg-blue-100 p-2 rounded-lg"><MapPin className="w-5 h-5 text-blue-600" /></div>
                      <span>{t.checkout?.shippingAddress}</span>
                    </h2>
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Pays */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">{t.checkout?.country} *</label>
                        <select
                          value={billingAddress.country}
                          onChange={(e) => {
                            const c = e.target.value;
                            const data = CountriesAndRegions.find(x => x.country === c);
                            setBillingAddress({ ...billingAddress, country: c, state: '', phoneCode: data?.indicatif ?? billingAddress.phoneCode });
                          }}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">{t.checkout?.country}</option>
                          {CountriesAndRegions.map(item => (
                            <option key={item.country} value={item.country}>{item.country}</option>
                          ))}
                        </select>
                      </div>

                      {/* Adresse */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">{t.checkout?.address} *</label>
                        <input type="text" value={billingAddress.address}
                          onChange={(e) => setBillingAddress({ ...billingAddress, address: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder={t.checkout?.address} />
                      </div>

                      {/* Appartement */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Appartement / Complément</label>
                        <input type="text" value={billingAddress.apartment}
                          onChange={(e) => setBillingAddress({ ...billingAddress, apartment: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                      </div>

                      {/* Ville */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{t.checkout?.city} *</label>
                        <input type="text" value={billingAddress.city}
                          onChange={(e) => setBillingAddress({ ...billingAddress, city: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                      </div>

                      {/* Région */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{t.checkout?.state} *</label>
                        <select value={billingAddress.state}
                          onChange={(e) => setBillingAddress({ ...billingAddress, state: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">{t.checkout?.state}</option>
                          {CountriesAndRegions.find(i => i.country === billingAddress.country)?.regions.map(r => (
                            <option key={r} value={r}>{r}</option>
                          ))}
                        </select>
                      </div>

                      {/* Code postal */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{t.checkout?.zipCode}</label>
                        <input type="text" value={billingAddress.zipCode}
                          onChange={(e) => setBillingAddress({ ...billingAddress, zipCode: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                      </div>

                      {/* Téléphone livraison */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{t.checkout?.phone}</label>
                        <div className="flex">
                          <select value={billingAddress.phoneCode}
                            onChange={(e) => setBillingAddress({ ...billingAddress, phoneCode: e.target.value })}
                            className="shrink-0 px-2 py-3 border border-r-0 rounded-l-lg bg-gray-50 text-sm border-gray-300"
                          >
                            <option value="">+?</option>
                            {CountriesAndRegions.filter(c => c.indicatif).map(item => (
                              <option key={item.country} value={item.indicatif}>{item.country} ({item.indicatif})</option>
                            ))}
                          </select>
                          <input type="tel" value={billingAddress.phone}
                            onChange={(e) => setBillingAddress({ ...billingAddress, phone: e.target.value })}
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500" />
                        </div>
                      </div>
                    </div>

                    {/* Adresse de livraison différente */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <div className="flex items-center mb-4">
                        <input type="checkbox" checked={sameAsBilling}
                          onChange={(e) => { setSameAsBilling(e.target.checked); if (e.target.checked) copyBillingToShipping(); }}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded" />
                        <label className="ml-2 text-sm text-gray-700">
                          {t.checkout?.shippingAddress} = {t.checkout?.billingAddress}
                        </label>
                      </div>

                      {!sameAsBilling && (
                        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                          <h3 className="font-semibold text-gray-900">{t.checkout?.shippingAddress}</h3>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">{t.checkout?.address} *</label>
                            <input type="text" value={shippingAddress.address}
                              onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">{t.checkout?.city} *</label>
                              <input type="text" value={shippingAddress.city}
                                onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">{t.checkout?.country} *</label>
                              <select value={shippingAddress.country}
                                onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value, state: '' })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="">{t.checkout?.country}</option>
                                {CountriesAndRegions.map(item => (
                                  <option key={item.country} value={item.country}>{item.country}</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">{t.checkout?.state} *</label>
                              <select value={shippingAddress.state}
                                onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="">{t.checkout?.state}</option>
                                {CountriesAndRegions.find(i => i.country === shippingAddress.country)?.regions.map(r => (
                                  <option key={r} value={r}>{r}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <motion.button onClick={() => setStep('information')}
                    className="px-6 py-3 rounded-xl border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 font-medium"
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  >
                    {t.common?.back}
                  </motion.button>
                  <motion.button onClick={handleContinueToPaiement}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-6 rounded-xl font-semibold shadow-lg flex items-center justify-center space-x-2"
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  >
                    <span>{t.common?.next}</span>
                    <ArrowLeft className="w-5 h-5 rotate-180" />
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* ── ÉTAPE 3 : Paiement via Moneroo ── */}
            {step === 'paiement' && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">

                {/* Info Moneroo */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                  <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <Lock className="w-5 h-5 text-blue-600" />
                      </div>
                      <span>Paiement sécurisé via Moneroo</span>
                    </h2>
                  </div>

                  <div className="p-6 space-y-4">
                    <p className="text-gray-600 text-sm leading-relaxed">
                      En cliquant sur <strong>«&nbsp;Payer maintenant&nbsp;»</strong>, vous serez redirigé vers la page de paiement
                      sécurisée Moneroo où vous pourrez choisir parmi toutes les méthodes disponibles
                      (Mobile Money, carte bancaire, etc.) selon votre pays.
                    </p>

                    {/* Récapitulatif montant */}
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 space-y-2 text-sm">
                      <div className="flex justify-between text-gray-600">
                        <span>Sous-total</span><span>{formatPrice(subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Livraison ({selectedShippingOption?.name ?? '—'})</span><span>{formatPrice(shipping)}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Taxes</span><span>{formatPrice(tax)}</span>
                      </div>
                      <div className="flex justify-between font-bold text-base pt-2 border-t border-gray-300">
                        <span>Total</span>
                        <span className="text-green-600">{formatPrice(total)}</span>
                      </div>
                    </div>

                    {/* Logos Moneroo */}
                    <div className="flex flex-wrap gap-3 items-center pt-2">
                      {['MTN', 'Orange', 'Moov', 'Wave', 'Visa', 'Mastercard'].map(brand => (
                        <span key={brand} className="text-xs font-semibold px-3 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-200">
                          {brand}
                        </span>
                      ))}
                      <span className="text-xs text-gray-500">+ d'autres via Moneroo</span>
                    </div>
                  </div>
                </div>

                {/* Sécurité */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-sm border border-green-100 p-6">
                  <div className="flex items-start space-x-3">
                    <div className="bg-green-100 p-2 rounded-lg"><Shield className="w-5 h-5 text-green-600" /></div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{t.common?.securePayment}</h3>
                      <p className="text-sm text-gray-700">{t.common?.securePaymentDesc}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <motion.button onClick={() => setStep('livraison')}
                    className="px-6 py-3 rounded-xl border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 font-medium"
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    disabled={isLoading}
                  >
                    {t.common?.back}
                  </motion.button>

                  {/* ── Bouton payer ── */}
                  <motion.button
                    onClick={handlePaymentSubmit}
                    disabled={isLoading}
                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-60 text-white py-4 px-6 rounded-xl font-semibold shadow-lg flex items-center justify-center space-x-2 transition-all duration-300"
                    whileHover={isLoading ? {} : { scale: 1.02 }}
                    whileTap={isLoading ? {} : { scale: 0.98 }}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Redirection en cours…</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-5 h-5" />
                        <span>Payer {formatPrice(total)} via Moneroo</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* ── Garanties ── */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 space-y-4 border border-blue-100 shadow-sm">
              <h3 className="font-semibold text-blue-900 flex items-center space-x-2">
                <div className="bg-blue-100 p-2 rounded-lg"><Shield className="w-5 h-5 text-blue-600" /></div>
                <span>{t.orderConfirmation?.paymentInfo}</span>
              </h3>
              <ul className="space-y-2.5 text-sm text-blue-800">
                {[t.common?.securePayment, `30 ${t.home?.days}`, t.common?.support247, t.product?.delivery, t.product?.inStock].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════
              COLONNE LATÉRALE — Récapitulatif commande
          ══════════════════════════════════════════════════ */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-xl border border-gray-100 sticky top-8 overflow-hidden">
              <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-blue-600" />
                  {t.checkout?.orderSummary}
                </h2>
              </div>

              <div className="p-6 space-y-4">
                {/* Articles */}
                <div className="space-y-3">
                  {cartItems?.length ? cartItems.map(item => (
                    <div key={item._key ?? item.productId} className="flex space-x-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 line-clamp-2">{item.name}</h4>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-sm text-gray-600">{item.quantity} × {formatPrice(item.price)}</span>
                          <span className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</span>
                        </div>
                      </div>
                    </div>
                  )) : (
                    <p className="text-sm text-gray-600">{t.cart?.empty}</p>
                  )}
                </div>

                {/* Mode de livraison */}
                <div className="border-t pt-4 bg-gradient-to-br from-blue-50 to-indigo-50 -mx-6 px-6 py-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-700 mb-1 font-medium">
                    <div className="bg-blue-100 p-1.5 rounded-lg"><Truck className="w-4 h-4 text-blue-600" /></div>
                    <span>{selectedShippingOption?.name ?? t.product?.delivery}</span>
                  </div>
                  {chosenCountry && chosenRegion && (
                    <div className="text-xs text-gray-600 ml-8">
                      {t.product?.delivery} {chosenRegion}, {chosenCountry} • {selectedShippingOption?.deliveryTime}
                    </div>
                  )}
                </div>

                {/* Totaux */}
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{t.cart?.subtotal}</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{t.cart?.shipping}</span>
                    <span>{formatPrice(shipping)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{t.cart?.taxes}</span>
                    <span>{formatPrice(tax)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg border-t pt-3 bg-gradient-to-r from-green-50 to-emerald-50 -mx-6 px-6 py-4 rounded-b-xl">
                    <span className="text-gray-900">{t.cart?.total}</span>
                    <span className="text-green-600 text-xl">{formatPrice(total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="h-24" />
      <Footer />

      {/* ── Toast ── */}
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
                : toast.type === 'error'
                ? 'bg-gradient-to-r from-red-500 to-rose-500'
                : 'bg-gradient-to-r from-orange-500 to-amber-500'
            }`}>
              <AlertCircle className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
              <p className="text-white font-medium text-sm">{toast.message}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Checkout;