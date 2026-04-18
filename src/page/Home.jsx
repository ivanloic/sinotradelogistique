import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Send, Package, MessageCircle, ShoppingBag,
  Truck, Shield, Clock, Star, Users,
  ShoppingCart, Search, CheckCircle,
  Plane, Ship, Zap, Image as ImageIcon,
} from 'lucide-react';
import Header            from '../Components/Header';
import Hero              from '../Components/Hero';
import CategoriesSection from '../Components/CategoriesSection';
import Products          from '../Components/Products';
import Services          from '../Components/Services';
import Footer            from '../Components/Footer';
import ContactModal      from '../Components/ContactModal';

// ─────────────────────────────────────────────
// Section : Commander en 3 étapes
// ─────────────────────────────────────────────
const steps = [
  {
    number: '01',
    icon: <Search className="w-7 h-7" />,
    title: 'Parcourez le catalogue',
    desc: 'Explorez nos catégories et choisissez vos produits. Filtrez par taille, couleur ou prix.',
    color: 'from-blue-500 to-cyan-500',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
  },
  {
    number: '02',
    icon: <ShoppingCart className="w-7 h-7" />,
    title: 'Ajoutez au panier',
    desc: 'Sélectionnez vos quantités, tailles et coloris, puis ajoutez vos articles au panier.',
    color: 'from-purple-500 to-pink-500',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
  },
  {
    number: '03',
    icon: <Shield className="w-7 h-7" />,
    title: 'Payez en toute sécurité',
    desc: 'Finalisez votre commande via Moneroo : Mobile Money, carte bancaire et bien plus.',
    color: 'from-green-500 to-emerald-500',
    bg: 'bg-green-50',
    border: 'border-green-200',
  },
];

function HowToOrderSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="inline-block bg-gradient-to-r from-blue-100 to-purple-100 text-blue-600 px-5 py-2 rounded-full text-sm font-semibold mb-3">
            Simple & Rapide
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Commander en{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              3 étapes
            </span>
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            SinoTrade rend l'importation depuis la Chine aussi simple qu'un achat local.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className={`relative ${step.bg} border ${step.border} rounded-2xl p-8 text-center shadow-sm hover:shadow-lg transition-shadow duration-300`}
            >
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className={`inline-block bg-gradient-to-r ${step.color} text-white text-xs font-bold px-4 py-1.5 rounded-full shadow`}>
                  Étape {step.number}
                </span>
              </div>
              <div className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center text-white mx-auto mt-3 mb-5 shadow-lg`}>
                {step.icon}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">{step.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// Section : Statistiques
// ─────────────────────────────────────────────
function StatsSection() {
  const stats = [
    { number: '50K+', label: 'Produits',            icon: <ShoppingBag className="w-5 h-5" /> },
    { number: '10K+', label: 'Clients Satisfaits',  icon: <Users className="w-5 h-5" /> },
    { number: '99%',  label: 'Taux de Satisfaction', icon: <Star className="w-5 h-5" /> },
    { number: '24/7', label: 'Support Client',       icon: <Clock className="w-5 h-5" /> },
  ];
  return (
    <section className="py-10 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
      <div className="max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="text-center text-white"
            >
              <div className="flex justify-center mb-2 opacity-80">{s.icon}</div>
              <div className="text-3xl md:text-4xl font-bold mb-1">{s.number}</div>
              <div className="text-white/80 text-sm font-medium">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// Section : Options de livraison
// ─────────────────────────────────────────────
function ShippingSection() {
  const options = [
    {
      icon: <Ship className="w-8 h-8" />,
      name: 'Transport Maritime',
      price: '8 500 FCFA',
      delay: '30 – 45 jours',
      desc: 'Idéal pour les grosses commandes. Économique et fiable.',
      color: 'from-blue-500 to-cyan-500',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      badge: 'Économique',
      badgeColor: 'bg-blue-100 text-blue-700',
    },
    {
      icon: <Plane className="w-8 h-8" />,
      name: 'Transport Aérien',
      price: '12 000 FCFA',
      delay: '7 – 15 jours',
      desc: 'Bon compromis entre délai et prix pour les commandes courantes.',
      color: 'from-purple-500 to-indigo-500',
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      badge: 'Populaire',
      badgeColor: 'bg-purple-100 text-purple-700',
    },
    {
      icon: <Zap className="w-8 h-8" />,
      name: 'Express Premium',
      price: '20 000 FCFA',
      delay: '5 – 10 jours',
      desc: 'Pour recevoir vos articles le plus rapidement possible.',
      color: 'from-orange-500 to-amber-500',
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      badge: 'Le + Rapide',
      badgeColor: 'bg-orange-100 text-orange-700',
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="inline-block bg-gradient-to-r from-blue-100 to-purple-100 text-blue-600 px-5 py-2 rounded-full text-sm font-semibold mb-3">
            Livraison Internationale
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Choisissez votre{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              mode de livraison
            </span>
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            De l'économique à l'express, nous livrons partout dans le monde avec suivi en temps réel.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {options.map((opt, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className={`${opt.bg} border ${opt.border} rounded-2xl p-7 shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col`}
            >
              <div className="flex items-start justify-between mb-5">
                <div className={`w-14 h-14 bg-gradient-to-br ${opt.color} rounded-xl flex items-center justify-center text-white shadow-md`}>
                  {opt.icon}
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${opt.badgeColor}`}>
                  {opt.badge}
                </span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{opt.name}</h3>
              <p className="text-gray-500 text-sm mb-4 leading-relaxed flex-1">{opt.desc}</p>
              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 flex items-center gap-1.5">
                    <Clock className="w-4 h-4" /> Délai estimé
                  </span>
                  <span className="font-semibold text-gray-800">{opt.delay}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 flex items-center gap-1.5">
                    <Truck className="w-4 h-4" /> Frais de port
                  </span>
                  <span className={`font-bold text-base bg-gradient-to-r ${opt.color} bg-clip-text text-transparent`}>
                    {opt.price}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center text-gray-400 text-sm mt-6 flex items-center justify-center gap-2"
        >
          <CheckCircle className="w-4 h-4 text-green-500" />
          Tous les envois incluent un numéro de suivi. Livraison dans plus de 50 pays.
        </motion.p>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// Section : Produit sur commande
// ─────────────────────────────────────────────
function CustomOrderSection({ onContact }) {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-3xl shadow-2xl overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
            {/* Texte */}
            <div className="p-8 lg:p-12 text-white">
              <span className="inline-block bg-white/20 text-white px-4 py-2 rounded-full text-sm font-semibold mb-5">
                Service Personnalisé
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                Vous ne trouvez pas<br />ce que vous cherchez ?
              </h2>
              <p className="text-white/85 text-lg mb-8 leading-relaxed">
                Envoyez-nous le nom ou une photo du produit. Nous le sourceons directement
                en Chine et vous proposons le meilleur prix sous 24h.
              </p>
              <div className="space-y-3 mb-8">
                {[
                  { icon: <Search className="w-4 h-4" />,      text: 'Envoyez le nom ou une photo du produit' },
                  { icon: <Package className="w-4 h-4" />,     text: 'Nous trouvons le fournisseur en Chine' },
                  { icon: <CheckCircle className="w-4 h-4" />, text: 'Devis personnalisé sous 24h' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-white/90 text-sm">
                    <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      {item.icon}
                    </div>
                    {item.text}
                  </div>
                ))}
              </div>
              <motion.button
                onClick={onContact}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="bg-white text-blue-600 hover:bg-blue-50 font-bold py-4 px-8 rounded-xl shadow-xl transition-all duration-300 flex items-center gap-3"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Contactez-nous maintenant</span>
                <Send className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Illustration */}
            <div className="relative h-64 lg:h-full min-h-[320px] flex items-center justify-center p-8">
              <div className="absolute inset-0 bg-black/10" />
              <motion.div
                animate={{ y: [0, -16, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="relative z-10 text-center"
              >
                <div className="w-28 h-28 bg-white/20 backdrop-blur rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-2xl border border-white/30">
                  <ImageIcon className="w-14 h-14 text-white" />
                </div>
                <p className="text-white font-bold text-xl">Envoyez une image</p>
                <p className="text-white/80 text-sm mt-1">Nous identifions et sourceons le produit</p>
              </motion.div>
              <div className="absolute top-8 right-8 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
              <div className="absolute bottom-8 left-8 w-36 h-36 bg-white/5 rounded-full blur-3xl" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// Page Home
// ─────────────────────────────────────────────
function Home() {
  const [showContactModal, setShowContactModal] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* 1. Hero — slider produits mis en avant */}
      <Hero />

      {/* 2. Catégories détaillées */}
      <CategoriesSection />

      {/* 3. Guide de commande en 3 étapes */}
      <HowToOrderSection />



      {/* 5. Produits phares */}
      <Products />

      {/* 6. Options de livraison */}
      <ShippingSection />

      {/* 7. Produit sur commande */}
      <CustomOrderSection onContact={() => setShowContactModal(true)} />

      {/* 8. Services détaillés */}
      <Services />

      <Footer />

      <ContactModal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
      />
    </div>
  );
}

export default Home;
