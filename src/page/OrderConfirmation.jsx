import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle, XCircle, Clock, Truck, Shield,
  Copy, MessageCircle, ExternalLink, Package, ArrowLeft, Loader2
} from 'lucide-react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import { usePrice } from '../hooks/usePrice';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';

// ─────────────────────────────────────────────────────────────
// Moneroo redirige vers :
// /Confirmation?paymentId=py_xxx&paymentStatus=success
// ─────────────────────────────────────────────────────────────

const OrderConfirmation = () => {
  const { t } = useTranslation();
  const location  = useLocation();
  const navigate  = useNavigate();
  const [searchParams] = useSearchParams();
  const { format: formatPrice } = usePrice();

  const [orderData, setOrderData]   = useState(null);
  const [copied, setCopied]         = useState(false);

  // ── Statut Moneroo depuis l'URL ──────────────────────────
  const monerooPaymentId     = searchParams.get('paymentId');
  const monerooPaymentStatus = searchParams.get('paymentStatus'); // success | failed | pending

  // ── Récupération des données commande ───────────────────
  useEffect(() => {
    if (location.state?.order) {
      setOrderData(location.state.order);
    } else {
      try {
        const saved = localStorage.getItem('lastOrder');
        if (saved) setOrderData(JSON.parse(saved));
        else navigate('/');
      } catch {
        navigate('/');
      }
    }
  }, [location.state, navigate]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ── Loader ───────────────────────────────────────────────
  if (!orderData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Chargement de votre commande…</p>
        </div>
      </div>
    );
  }

  const order = {
    number:       orderData.orderNumber,
    date:         orderData.date,
    items:        orderData.items ?? [],
    subtotal:     orderData.totals?.subtotal  ?? 0,
    shippingCost: orderData.totals?.shipping  ?? 0,
    tax:          orderData.totals?.tax       ?? 0,
    total:        orderData.totals?.total     ?? orderData.total ?? 0,
    customer: {
      name:  orderData.billingAddress?.name
          ?? `${orderData.billingAddress?.firstName ?? ''} ${orderData.billingAddress?.lastName ?? ''}`.trim(),
      email: orderData.contact?.email ?? orderData.billingAddress?.email ?? '',
      phone: orderData.contact?.phone ?? '',
    },
    shipping: {
      address: [
        orderData.shippingAddress?.address,
        orderData.shippingAddress?.city,
        orderData.shippingAddress?.country,
      ].filter(Boolean).join(', '),
    },
  };

  // ── Déduction du statut ──────────────────────────────────
  const isSuccess = monerooPaymentStatus === 'success';
  const isFailed  = monerooPaymentStatus === 'failed';
  const isPending = !monerooPaymentStatus || monerooPaymentStatus === 'pending';

  // ── Config visuelle selon statut ─────────────────────────
  const statusConfig = {
    success: {
      icon:    <CheckCircle className="w-12 h-12 text-white" />,
      bg:      'from-green-400 to-emerald-500',
      badge:   'bg-green-100 text-green-800',
      label:   '✅ Paiement confirmé',
      title:   'Commande confirmée !',
      message: 'Votre paiement a été reçu avec succès. Nous préparons votre commande.',
    },
    failed: {
      icon:    <XCircle className="w-12 h-12 text-white" />,
      bg:      'from-red-400 to-rose-500',
      badge:   'bg-red-100 text-red-800',
      label:   '❌ Paiement échoué',
      title:   'Paiement non abouti',
      message: 'Votre paiement n\'a pas pu être traité. Veuillez réessayer.',
    },
    pending: {
      icon:    <Clock className="w-12 h-12 text-white" />,
      bg:      'from-orange-400 to-amber-500',
      badge:   'bg-orange-100 text-orange-800',
      label:   '⌛ Paiement en attente',
      title:   'Paiement en cours de vérification',
      message: 'Votre paiement est en cours de traitement. Vous recevrez une confirmation par email.',
    },
  };

  const status = isSuccess ? 'success' : isFailed ? 'failed' : 'pending';
  const cfg    = statusConfig[status];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 ">
      <Header />

      <div className="max-w-5xl mx-auto px-4 pt-8">

        {/* ── Bouton retour ── */}
        <motion.button
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-gray-500 hover:text-blue-600 mb-8 px-3 py-2 rounded-lg hover:bg-blue-50 transition-all"
          whileHover={{ x: -4 }}
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Retour à l'accueil</span>
        </motion.button>

        {/* ── Bandeau statut ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className={`inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r ${cfg.bg} rounded-full mb-5 shadow-xl`}>
            {cfg.icon}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{cfg.title}</h1>
          <p className="text-gray-600 text-lg max-w-xl mx-auto">{cfg.message}</p>

          {/* Badge statut */}
          <span className={`inline-block mt-4 px-4 py-1.5 rounded-full text-sm font-semibold ${cfg.badge}`}>
            {cfg.label}
          </span>

          {/* ID de paiement Moneroo */}
          {monerooPaymentId && (
            <div className="mt-3 text-xs text-gray-400 font-mono">
              ID paiement : {monerooPaymentId}
            </div>
          )}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ══════════════════════════════════════════
              COLONNE GAUCHE — Commande + Livraison
          ══════════════════════════════════════════ */}
          <div className="lg:col-span-2 space-y-6">

            {/* Numéro de commande */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Package className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Détails de la commande</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-gray-500 mb-1">Numéro de commande</div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-blue-600">{order.number}</span>
                    <button
                      onClick={() => copyToClipboard(order.number)}
                      className="text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    {copied && <span className="text-green-600 text-xs">Copié !</span>}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-gray-500 mb-1">Date</div>
                  <div className="font-medium">{order.date}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-gray-500 mb-1">Client</div>
                  <div className="font-medium">{order.customer.name}</div>
                  <div className="text-gray-500">{order.customer.email}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-gray-500 mb-1">Adresse de livraison</div>
                  <div className="font-medium">{order.shipping.address || '—'}</div>
                </div>
              </div>
            </motion.div>

            {/* Articles commandés */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
                <h2 className="text-lg font-semibold text-gray-900">Articles commandés</h2>
              </div>

              <div className="p-6 space-y-4">
                {order.items.map((item, i) => (
                  <div key={i} className="flex space-x-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 line-clamp-2">{item.name}</h4>
                      <div className="flex justify-between items-center mt-1 text-sm">
                        <span className="text-gray-500">{item.quantity} × {formatPrice(item.price)}</span>
                        <span className="font-semibold">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Totaux */}
                <div className="border-t pt-4 space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Sous-total</span><span>{formatPrice(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Livraison</span><span>{formatPrice(order.shippingCost)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Taxes</span><span>{formatPrice(order.tax)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-base border-t pt-3">
                    <span>Total payé</span>
                    <span className="text-green-600 text-lg">{formatPrice(order.total)}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Prochaines étapes (uniquement si succès ou pending) */}
            {!isFailed && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                {[
                  { icon: <Clock className="w-6 h-6 text-blue-600" />,   bg: 'bg-blue-100',   title: 'Préparation',   desc: '1-2 jours ouvrés' },
                  { icon: <Truck className="w-6 h-6 text-green-600" />,  bg: 'bg-green-100',  title: 'Expédition',    desc: '7-15 jours' },
                  { icon: <MessageCircle className="w-6 h-6 text-purple-600" />, bg: 'bg-purple-100', title: 'Suivi', desc: 'Notification par email' },
                ].map((step, i) => (
                  <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
                    <div className={`w-12 h-12 ${step.bg} rounded-full flex items-center justify-center mx-auto mb-3`}>
                      {step.icon}
                    </div>
                    <h4 className="font-semibold text-gray-900">{step.title}</h4>
                    <p className="text-sm text-gray-500 mt-1">{step.desc}</p>
                  </div>
                ))}
              </motion.div>
            )}

            {/* Si paiement échoué — bouton réessayer */}
            {isFailed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-red-50 border border-red-200 rounded-xl p-6 text-center"
              >
                <p className="text-red-700 mb-4">
                  Le paiement a échoué. Vous pouvez retourner au checkout et réessayer.
                </p>
                <button
                  onClick={() => navigate('/checkout')}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-8 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  Réessayer le paiement
                </button>
              </motion.div>
            )}
          </div>

          {/* ══════════════════════════════════════════
              COLONNE DROITE — Contact & Sécurité
          ══════════════════════════════════════════ */}
          <div className="space-y-6">

            {/* Contact support */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
            >
              <div className="p-5 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-green-600" />
                  Besoin d'aide ?
                </h3>
              </div>
              <div className="p-5 space-y-3">
                <p className="text-sm text-gray-600">
                  Notre équipe est disponible 24/7 pour toute question sur votre commande.
                </p>

                {/* WhatsApp */}
                <button
                  onClick={() => {
                    if (window.Tawk_API?.maximize) {
                      try { window.Tawk_API.maximize(); } catch (_) {}
                    }
                  }}
                  className="w-full bg-green-500 hover:bg-green-600 text-white p-3 rounded-lg flex items-center space-x-3 transition-colors"
                >
                  <span className="text-xl">💬</span>
                  <div className="text-left">
                    <div className="font-semibold text-sm">WhatsApp</div>
                    <div className="text-xs opacity-90">+8 78 89 88 89</div>
                  </div>
                </button>

                {/* Telegram */}
                <a
                  href="https://t.me/chinatradehub"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg flex items-center space-x-3 transition-colors"
                >
                  <span className="text-xl">✈️</span>
                  <div className="text-left">
                    <div className="font-semibold text-sm">Telegram</div>
                    <div className="text-xs opacity-90">@SinoTrade</div>
                  </div>
                  <ExternalLink className="w-4 h-4 ml-auto" />
                </a>

                <p className="text-xs text-gray-500 text-center pt-1">
                  Mentionnez votre numéro de commande :<br />
                  <span className="font-mono font-bold text-blue-600">{order.number}</span>
                </p>
              </div>
            </motion.div>

            {/* Garanties */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-5"
            >
              <h3 className="font-semibold text-blue-900 flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-blue-600" />
                Nos garanties
              </h3>
              <ul className="space-y-2.5 text-sm text-blue-800">
                {[
                  'Paiement 100% sécurisé via Moneroo',
                  'Retour sous 30 jours',
                  'Support client 24/7',
                  'Livraison internationale suivie',
                  'Produits vérifiés et certifiés',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Bouton retour accueil */}
            <motion.button
              onClick={() => navigate('/')}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <CheckCircle className="w-5 h-5" />
              Retour à l'accueil
            </motion.button>
          </div>
        </div>
      </div>

      <div className="h-24" />
      <Footer />
    </div>
  );
};

export default OrderConfirmation;