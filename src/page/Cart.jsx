import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, Minus, Truck, Plane, Ship, Clock, MapPin, Shield, CreditCard, ShoppingBag, ArrowRight, Package, Tag } from 'lucide-react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { usePrice } from '../hooks/usePrice';
import { useTranslation } from '../hooks/useTranslation';

const Cart = () => {
  const { cartItems, removeItem, updateQuantity, clearCart, shippingOption, setShippingOption } = useCart();
  const { format: formatPrice } = usePrice();
  const { t } = useTranslation();

  // Scroll vers le haut au chargement de la page
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const selectedShipping = shippingOption;
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [destination, setDestination] = useState('ci');
  const [removingItem, setRemovingItem] = useState(null);
  const navigate = useNavigate();

  const applyCoupon = () => {
    setCouponError('');
    if (couponCode.toUpperCase() === 'ST3467') {
      setCouponApplied(true);
    } else {
      setCouponError(t.cart.invalidCoupon);
    }
  };

  // Options de transport
  const shippingOptions = [
    {
      id: 'air',
      name: t.cart.airTransport,
      icon: <Plane className="w-6 h-6" />,
      description: t.cart.airDesc,
      price: 12000,
      deliveryTime: '7-15 ' + t.home.days,
      features: [t.cart.realTimeTracking, t.cart.insuranceIncluded, t.cart.customsClearance],
      weightLimit: t.cart.weightLimit + ' 30kg',
      reliability: '95%'
    },
    {
      id: 'sea',
      name: t.cart.seaTransport,
      icon: <Ship className="w-6 h-6" />,
      description: t.cart.seaDesc,
      price: 8500,
      deliveryTime: '30-45 ' + t.home.days,
      features: [t.cart.economical, t.cart.idealBulk, t.cart.customsClearance],
      weightLimit: t.cart.unlimited,
      reliability: '98%'
    },
    {
      id: 'express',
      name: t.cart.expressTransport,
      icon: <Truck className="w-6 h-6" />,
      description: t.cart.expressDesc,
      price: 20000,
      deliveryTime: '5-10 ' + t.home.days,
      features: [t.cart.priorityDelivery, t.cart.premiumInsurance, t.cart.dedicatedSupport],
      weightLimit: t.cart.weightLimit + ' 50kg',
      reliability: '99%'
    }
  ];


  // updateQuantity and removeItem are provided by context; we adapt usage below

  // Calculs
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingCost = shippingOptions.find(opt => opt.id === selectedShipping)?.price || 0;
  const taxAmount = cartItems.reduce((sum, item) => {
    return item.taxType === 'ht' ? sum + (item.price * item.quantity * 0.18) : sum;
  }, 0);
  // Si un coupon est appliqué, on applique une réduction de 10% sur le sous-total
  const discount = couponApplied ? Math.round(subtotal * 0.10) : 0;
  const totalAfterDiscount = subtotal - discount + shippingCost + taxAmount;
  const total = totalAfterDiscount;

  const selectedShippingOption = shippingOptions.find(opt => opt.id === selectedShipping);

  // Calcule une estimation de délai en fonction du mode et de la destination
  const getDeliveryEstimate = (optionId, destCode, baseStr) => {
    if (!baseStr) return '';

    // Parse le délai de base (ex: "7-15 jours" ou "5-10 jours")
    const nums = baseStr.match(/(\d+)\s*-\s*(\d+)/);
    let min = null, max = null;
    if (nums) {
      min = parseInt(nums[1], 10);
      max = parseInt(nums[2], 10);
    } else {
      const single = baseStr.match(/(\d+)/);
      if (single) {
        min = parseInt(single[1], 10);
        max = min;
      }
    }
    if (min === null) return baseStr;

    // Groupes de destination
    const group = ['ci','sn','cm','ml'].includes(destCode) ? 'regional' : (destCode === 'fr' ? 'europe' : (destCode === 'us' ? 'usa' : 'other'));

    // Offsets par mode et groupe (en jours)
    const offsets = {
      regional: { air: -2, sea: -7, express: -2 },
      europe: { air: 3, sea: 10, express: 2 },
      usa: { air: 5, sea: 15, express: 3 },
      other: { air: 2, sea: 10, express: 3 }
    };

    const offset = (offsets[group] && offsets[group][optionId]) || 0;

    let newMin = Math.max(1, min + offset);
    let newMax = Math.max(newMin, max + offset);

    // Formatage final
    return newMin === newMax ? `${newMin} jours` : `${newMin}-${newMax} jours`;
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, x: -100, transition: { duration: 0.2 } }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {/* En-tête avec animation */}
        <motion.div 
          className="mb-10 pt-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center space-x-3 mb-3">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2.5 rounded-xl shadow-lg">
              <ShoppingBag className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{t.cart.title}</h1>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-gray-600 flex items-center space-x-2">
              <Package className="w-4 h-4" />
              <span>{cartItems.length} {cartItems.length > 1 ? t.cart.items : t.cart.item}</span>
            </p>
            
          </div>
        </motion.div>

        {cartItems.length === 0 ? (
          <motion.div 
            className="text-center py-20"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div 
              className="inline-block mb-6"
              animate={{ 
                y: [0, -10, 0],
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              <div className="text-8xl mb-4">🛒</div>
            </motion.div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t.cart.empty}</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg">
              {t.home.popularDescription}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                onClick={() => navigate('/')}
                className="bg-[#6819ce] text-white font-semibold py-4 px-10 rounded-xl hover:bg-[#5614a8] transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>{t.cart.continueShopping}</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
              <motion.button
                onClick={() => navigate('/')}
                className="border-2 border-[#6819ce] text-[#6819ce] font-semibold py-4 px-10 rounded-xl hover:bg-[#6819ce] hover:text-white transition-all duration-300 flex items-center justify-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>{t.common.back}</span>
              </motion.button>
            </div>
          </motion.div>
        ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne gauche - Articles et livraison */}
          <div className="lg:col-span-2 space-y-6">
            {/* Articles du panier */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Package className="w-5 h-5 text-blue-600" />
                  {t.cart.items}
                </h2>
              {cartItems.length > 0 && (
              <button
                onClick={() => clearCart()}
                className="text-sm text-red-600 border border-red-200 hover:bg-red-50 px-3 py-1 rounded-md transition-colors"
              >
                {t.cart.remove}
              </button>
            )}
              </div>
              
              <div className="divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-6"
                  >
                    <div className="flex space-x-4">
                      {/* Image */}
                      <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Détails */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 mb-1 line-clamp-2">
                          {item.name}
                        </h3>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                          <span>Min: {item.minOrder}</span>
                          <span className={item.taxType === 'ttc' ? 'text-green-600' : 'text-orange-600'}>
                            {item.taxType === 'ttc' ? 'TTC' : 'HT'}
                          </span>
                        </div>

                        {/* Prix et quantité */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center border border-gray-300 rounded-lg">
                              <button
                                onClick={() => updateQuantity(item._key, item.quantity - 1)}
                                disabled={item.quantity <= item.minOrder}
                                className="p-2 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="px-3 py-1 min-w-12 text-center font-medium">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item._key, item.quantity + 1)}
                                className="p-2 hover:bg-gray-100"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                            
                            <span className="font-semibold text-gray-900">
                              {formatPrice(item.price * item.quantity)}
                            </span>
                          </div>

                          <button
                            onClick={() => removeItem(item._key)}
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Options de transport */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-blue-600" />
                  {t.cart.shippingOptions}
                </h2>
                <p className="text-sm text-gray-600 mt-2">
                  Sélectionnez votre mode de livraison
                </p>
              </div>
              
              <div className="p-6 space-y-4">
                {shippingOptions.map((option) => (
                  <motion.div
                    key={option.id}
                    onClick={() => setShippingOption(option.id)}
                    className={`border rounded-xl p-4 cursor-pointer transition-all ${
                      selectedShipping === option.id
                        ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 shadow-md'
                        : 'border-gray-200 hover:border-blue-300 hover:shadow-sm'
                    }`}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className={`p-3 rounded-lg ${
                          selectedShipping === option.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {option.icon}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold text-gray-900">{option.name}</h3>
                            <span className="text-sm font-medium text-blue-600">
                              {formatPrice(option.price)}
                            </span>
                          </div>
                          
                          <p className="text-gray-600 mb-3">{option.description}</p>
                          
                          <div className="flex items-center space-x-6 text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>{getDeliveryEstimate(option.id, destination, option.deliveryTime)}</span>
                            </div>
                            <span>{t.cart.reliability}: {option.reliability}</span>
                            <span>{option.weightLimit}</span>
                          </div>

                          {/* Features */}
                          <div className="flex flex-wrap gap-2 mt-3">
                            {option.features.map((feature, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                              >
                                {feature}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedShipping === option.id
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-300'
                      }`}>
                        {selectedShipping === option.id && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Méthode de paiement */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            {/* Informations supplémentaires */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 space-y-3 text-sm border border-blue-100">
              <h3 className="font-semibold text-blue-900 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Informations importantes
              </h3>
              <ul className="space-y-2.5 text-blue-800">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">✓</span>
                  <span>Les délais de livraison commencent après confirmation de paiement</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">✓</span>
                  <span>Suivi en temps réel disponible</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">✓</span>
                  <span>Assistance dédouanement incluse</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">✓</span>
                  <span>Assurance transport selon le mode choisi</span>
                </li>
              </ul>
            </div>
            </div>
          </div>

          {/* Colonne droite - Récapitulatif */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-xl border border-gray-100 sticky top-8 overflow-hidden">
              <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  {t.checkout.orderSummary}
                </h2>
              </div>
              
              <div className="p-6 space-y-4">
                {/* Détails de la commande */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{t.cart.subtotal}</span>
                    <span className="font-medium">{formatPrice(subtotal)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{t.cart.shipping}</span>
                    <span className="font-medium">{formatPrice(shippingCost)}</span>
                  </div>
                  
                  {taxAmount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{t.cart.taxes}</span>
                      <span className="font-medium">{formatPrice(taxAmount)}</span>
                    </div>
                  )}
                                        {/* Code promo */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">{t.cart.couponCode}</label>
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            placeholder={t.cart.couponCode}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6819ce] focus:border-transparent transition-all duration-300"
                            disabled={couponApplied}
                          />
                          <button
                            onClick={applyCoupon}
                            disabled={couponApplied || !couponCode}
                            className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                          >
                            {t.cart.applyCoupon}
                          </button>
                        </div>
                        {couponError && (
                          <p className="text-red-500 text-sm">{couponError}</p>
                        )}
                        {couponApplied && (
                          <p className="text-green-500 text-sm">{t.common.success}</p>
                        )}
                      </div>

                        {/* Affichage de la réduction si présente */}
                        {discount > 0 && (
                          <div className="flex justify-between text-sm text-green-700 mt-2">
                            <span>{t.cart.discount} (10%)</span>
                            <span className="font-medium">-{formatPrice(discount)}</span>
                          </div>
                        )}

                        <div className="border-t pt-3">
                          <div className="flex justify-between text-lg font-semibold">
                            <span>{t.cart.total}</span>
                            <span className="text-blue-600">{formatPrice(total)}</span>
                          </div>
                        </div>
                </div>

                {/* Informations livraison */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 space-y-2 text-sm border border-blue-100">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 flex items-center gap-1">
                      <Clock className="w-4 h-4 text-blue-600" />
                      {t.home.estimatedDelivery}:
                    </span>
                    <span className="font-semibold text-blue-700">{getDeliveryEstimate(selectedShippingOption?.id, destination, selectedShippingOption?.deliveryTime)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 flex items-center gap-1">
                      <Truck className="w-4 h-4 text-blue-600" />
                      {t.cart.shippingOptions}:
                    </span>
                    <span className="font-semibold text-blue-700">{selectedShippingOption?.name}</span>
                  </div>
                </div>

                {/* Bouton de commande */}
                <motion.button 
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
                  onClick={() => navigate(`/Checkout`)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Shield className="w-5 h-5" />
                  <span>{t.cart.checkout}</span>
                  <ArrowRight className="w-5 h-5" />
                </motion.button>

                {/* Garanties */}
                <div className="text-center space-y-2 text-sm text-gray-600">
                  <div className="flex items-center justify-center space-x-4">
                    <span>🔒 Paiement sécurisé</span>
                    <span>🛡️ Garantie satisfait</span>
                  </div>
                  <div>📞 Support 24/7</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        )}
      </div>
      
      {/* Espacement avant le footer */}
      <div className="h-24"></div>
      
      <Footer />
    </div>
  );
};

export default Cart;
