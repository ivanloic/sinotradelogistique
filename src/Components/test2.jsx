// Header.jsx
// React + Vite + Tailwind component
// Usage:
// 1) Place this file in src/components/Header.jsx
// 2) Ensure TailwindCSS is configured in the project (tailwind.config.js + index.css)
// 3) Import and use: import Header from './components/Header';

import React, { useState, useRef, useEffect } from 'react';

export default function Header() {
  const [lang, setLang] = useState('FR');
  const [currency, setCurrency] = useState('XAF'); // franc CFA par défaut
  const [query, setQuery] = useState('');
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showCurrMenu, setShowCurrMenu] = useState(false);
  const [activeCategory, setActiveCategory] = useState('Tous');

  const accountRef = useRef(null);
  const langRef = useRef(null);
  const currRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (accountRef.current && !accountRef.current.contains(e.target)) setShowAccountMenu(false);
      if (langRef.current && !langRef.current.contains(e.target)) setShowLangMenu(false);
      if (currRef.current && !currRef.current.contains(e.target)) setShowCurrMenu(false);
    }
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  const categories = [
    'Nouveau Départ',
    'Grande Affaire',
    "Au-delà des frontières",
    'Collection Capillaire',
    'Échantillons Disponibles',
    'Produits de premier plan',
    'Technologie',
    'Vêtement & Accessoires',
    'Sports & Loisirs',
    'Électroniques',
    'Jouets',
    "Arts & Métiers",
    'Pièces Auto & Moto',
    'Machinerie',
    'Industrie Légère',
    'Santé & Hygiène',
    'Construction',
    'Transport',
    'Équipement Industriel',
    'Sacs & Valises',
    'Emballage & Impression',
    'Meuble',
    'Plus de catégories',
  ];

  function handleSearch(e) {
    e.preventDefault();
    // Ici: appeler l'API de recherche ou rediriger l'utilisateur
    console.log('Recherche:', query, 'cat:', activeCategory, 'devise:', currency, 'lang:', lang);
  }

  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-[1200px] mx-auto px-4 py-3 flex flex-col gap-3">
        {/* Top Row: Logo | Search | Icons */}
        <div className="flex items-center gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3 mr-2">
            <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-r from-blue-600 to-teal-400 text-white rounded-lg font-bold">CN</div>
            <div>
              <h1 className="text-lg font-semibold">China2Africa</h1>
              <p className="text-xs text-gray-500">Import & Achat en gros</p>
            </div>
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1">
            <div className="flex items-center bg-gray-100 rounded-md overflow-hidden">
              <select
                aria-label="Catégorie"
                value={activeCategory}
                onChange={(e) => setActiveCategory(e.target.value)}
                className="bg-transparent px-3 py-2 text-sm border-r border-gray-200 focus:outline-none"
              >
                <option value="Tous">Tous</option>
                {categories.slice(0, 8).map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              <input
                type="text"
                placeholder={lang === 'FR' ? 'Rechercher un produit, une référence...' : 'Search product, SKU...'}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 px-3 py-2 text-sm bg-transparent focus:outline-none"
              />

              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition"
                aria-label="Rechercher"
              >
                {lang === 'FR' ? 'Rechercher' : 'Search'}
              </button>
            </div>
          </form>

          {/* Right icons: language, currency, account, cart, track */}
          <div className="flex items-center gap-3">
            {/* Language */}
            <div className="relative" ref={langRef}>
              <button
                onClick={(e) => { e.stopPropagation(); setShowLangMenu(!showLangMenu); }}
                className="text-sm px-3 py-2 rounded hover:bg-gray-100"
                aria-expanded={showLangMenu}
              >
                {lang}
              </button>
              {showLangMenu && (
                <ul className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-sm text-sm">
                  <li>
                    <button className="w-full text-left px-3 py-2 hover:bg-gray-50" onClick={() => { setLang('FR'); setShowLangMenu(false); }}>FR</button>
                  </li>
                  <li>
                    <button className="w-full text-left px-3 py-2 hover:bg-gray-50" onClick={() => { setLang('EN'); setShowLangMenu(false); }}>EN</button>
                  </li>
                </ul>
              )}
            </div>

            {/* Currency */}
            <div className="relative" ref={currRef}>
              <button
                onClick={(e) => { e.stopPropagation(); setShowCurrMenu(!showCurrMenu); }}
                className="text-sm px-3 py-2 rounded hover:bg-gray-100"
                aria-expanded={showCurrMenu}
              >
                {currency}
              </button>
              {showCurrMenu && (
                <ul className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-sm text-sm">
                  <li>
                    <button className="w-full text-left px-3 py-2 hover:bg-gray-50" onClick={() => { setCurrency('EUR'); setShowCurrMenu(false); }}>EUR — Euro</button>
                  </li>
                  <li>
                    <button className="w-full text-left px-3 py-2 hover:bg-gray-50" onClick={() => { setCurrency('USD'); setShowCurrMenu(false); }}>USD — Dollar</button>
                  </li>
                  <li>
                    <button className="w-full text-left px-3 py-2 hover:bg-gray-50" onClick={() => { setCurrency('XAF'); setShowCurrMenu(false); }}>XAF — Franc CFA</button>
                </li>
                </ul>
              )}
            </div>

            {/* Track link */}
            <a href="/track" className="hidden md:inline-flex items-center px-3 py-2 text-sm hover:bg-gray-100 rounded">
              Suivre
            </a>

            {/* Account */}
            <div className="relative" ref={accountRef}>
              <button
                onClick={(e) => { e.stopPropagation(); setShowAccountMenu(!showAccountMenu); }}
                className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100"
                aria-expanded={showAccountMenu}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 15c2.485 0 4.79.645 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-sm">Mon compte</span>
              </button>

              {showAccountMenu && (
                <ul className="absolute right-0 mt-2 w-44 bg-white border rounded shadow-sm text-sm">
                  <li><a className="block px-3 py-2 hover:bg-gray-50" href="/login">Se connecter</a></li>
                  <li><a className="block px-3 py-2 hover:bg-gray-50" href="/register">Créer un compte</a></li>
                  <li><a className="block px-3 py-2 hover:bg-gray-50" href="/dashboard">Tableau de bord</a></li>
                </ul>
              )}
            </div>

            {/* Cart */}
            <a href="/cart" className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                <path d="M16 11V3a1 1 0 00-1-1H4v2h10v7h2z" />
                <path d="M6 15a2 2 0 100 4 2 2 0 000-4zM14 15a2 2 0 100 4 2 2 0 000-4z" />
              </svg>
              <span className="text-sm">Panier</span>
            </a>
          </div>
        </div>

        {/* Category Bar */}
        <nav className="overflow-x-auto">
          <ul className="flex gap-2 items-center text-sm">
            <li>
              <button
                onClick={() => setActiveCategory('Tous')}
                className={`px-3 py-2 rounded ${activeCategory==='Tous' ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}>
                Tous
              </button>
            </li>
            {categories.map((cat) => (
              <li key={cat}>
                <button
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-2 rounded ${activeCategory===cat ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}>
                  {cat}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Optional thin helper row */}
        <div className="text-xs text-gray-500 flex justify-between">
          <div>Livraison internationale | Paiements sécurisés</div>
          <div>Devise affichée: {currency} • Langue: {lang}</div>
        </div>
      </div>
    </header>
  );
}

// HeroSection.jsx
// Section Hero avec slider d’images promotionnelles et 3 produits mis en avant
// Utilise React + TailwindCSS + Framer Motion

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function HeroSection() {
  const slides = [
    {
      id: 1,
      image: '/images/promo1.jpg',
      title: 'Promo Spéciale : Électroniques jusqu’à -30%',
      price: 'à partir de 49 900 XAF',
      description: 'Découvrez nos meilleures offres sur les produits électroniques importés directement de Chine.',
      buttonText: 'Commander maintenant',
    },
    {
      id: 2,
      image: '/images/promo2.jpg',
      title: 'Vêtements & Accessoires à petits prix',
      price: 'Dès 3 000 XAF',
      description: 'Trouvez vos styles préférés, disponibles en gros et en détail.',
      buttonText: 'Acheter maintenant',
    },
    {
      id: 3,
      image: '/images/promo3.jpg',
      title: 'Articles de maison et décoration - Jusqu’à -40%',
      price: 'Dès 5 500 XAF',
      description: 'Rendez votre espace plus accueillant avec nos produits design et abordables.',
      buttonText: 'Voir les offres',
    },
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const prevSlide = () => setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);

  const featured = [
    {
      id: 1,
      image: '/images/product1.jpg',
      name: 'Casque Bluetooth P60',
      price: '18 900 XAF',
    },
    {
      id: 2,
      image: '/images/product2.jpg',
      name: 'Montre connectée série 8',
      price: '22 500 XAF',
    },
    {
      id: 3,
      image: '/images/product3.jpg',
      name: 'Mini drone caméra HD',
      price: '45 000 XAF',
    },
  ];

  return (
    <section className="w-full bg-gradient-to-b from-[#0b0b0b] to-[#111111]">
      {/* Slider */}
      <div className="relative overflow-hidden max-w-[1200px] mx-auto rounded-xl shadow-2xl mt-8">
        <div className="relative h-[460px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={slides[current].id}
              initial={{ opacity: 0, x: 80 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -80 }}
              transition={{ duration: 0.9 }}
              className="absolute inset-0 rounded-xl overflow-hidden"
            >
              <img
                src={slides[current].image}
                alt={slides[current].title}
                className="w-full h-full object-cover brightness-60"
              />

              <div className="absolute inset-0 flex items-center px-8 md:px-12">
                <div className="max-w-xl text-white">
                  <h2 className="text-3xl md:text-5xl font-serif font-bold leading-tight mb-3 text-gold">
                    {slides[current].title}
                  </h2>
                  <p className="text-xl font-semibold mb-2 text-yellow-300">{slides[current].price}</p>
                  <p className="mb-6 text-gray-200 max-w-md">{slides[current].description}</p>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="bg-gradient-to-r from-yellow-500 to-yellow-400 text-black font-semibold px-6 py-3 rounded-full shadow-lg"
                  >
                    {slides[current].buttonText}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <button onClick={prevSlide} className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/40 text-white p-3 rounded-full hover:bg-black/60">
            ‹
          </button>
          <button onClick={nextSlide} className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/40 text-white p-3 rounded-full hover:bg-black/60">
            ›
          </button>

          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {slides.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setCurrent(i)}
                className={`w-3 h-3 rounded-full ${i === current ? 'bg-yellow-400' : 'bg-white/30'}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Featured products */}
      <div className="max-w-[1200px] mx-auto grid md:grid-cols-3 gap-6 py-10 px-4">
        {featured.map((prod) => (
          <motion.div
            key={prod.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-[#0f0f0f] border border-gray-800 rounded-xl p-4 flex flex-col items-center text-center"
          >
            <img src={prod.image} alt={prod.name} className="w-full h-48 object-cover rounded-md mb-4" />
            <h3 className="text-white font-medium mb-1">{prod.name}</h3>
            <p className="text-yellow-300 font-bold mb-3">{prod.price}</p>
            <button className="bg-gradient-to-r from-yellow-500 to-yellow-400 text-black px-4 py-2 rounded-full">Commander</button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ProductSection.jsx (Luxueux / premium theme - électroniques)
// Place this file in src/components/ProductSection.jsx

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PRODUCTS = {
  featured: [
    {
      id: 'p1',
      name: 'Smartphone Aurora X',
      image: '/images/lux-smartphone.jpg',
      price: 259000,
      promo: 229000,
      minOrder: 1,
      tax: 'TTC',
      rating: 4.7,
      stock: 120,
      badge: 'Top',
    },
    {
      id: 'p2',
      name: 'Casque Hi-Fi Diamond',
      image: '/images/lux-headset.jpg',
      price: 89000,
      promo: null,
      minOrder: 2,
      tax: 'HT',
      rating: 4.6,
      stock: 300,
      badge: 'Nouveau',
    },
    {
      id: 'p3',
      name: 'Notebook Elite 14"',
      image: '/images/lux-laptop.jpg',
      price: 459000,
      promo: 399000,
      minOrder: 1,
      tax: 'TTC',
      rating: 4.9,
      stock: 45,
      badge: 'Promo',
    },
  ],
  new: [
    {
      id: 'p4',
      name: 'Drone Pro Vision',
      image: '/images/lux-drone.jpg',
      price: 189000,
      promo: null,
      minOrder: 1,
      tax: 'HT',
      rating: 4.5,
      stock: 80,
      badge: 'Nouveau',
    },
    {
      id: 'p5',
      name: 'Caméra 4K Compact',
      image: '/images/lux-camera.jpg',
      price: 129000,
      promo: 109000,
      minOrder: 1,
      tax: 'TTC',
      rating: 4.4,
      stock: 150,
      badge: null,
    },
    {
      id: 'p6',
      name: 'Station de Charge Rapide',
      image: '/images/lux-charger.jpg',
      price: 25900,
      promo: null,
      minOrder: 5,
      tax: 'HT',
      rating: 4.3,
      stock: 500,
      badge: null,
    },
  ],
  sale: [
    {
      id: 'p7',
      name: 'Tablette Pro 11"',
      image: '/images/lux-tablet.jpg',
      price: 189000,
      promo: 149000,
      minOrder: 1,
      tax: 'TTC',
      rating: 4.6,
      stock: 60,
      badge: 'Promo',
    },
    {
      id: 'p8',
      name: 'Enceinte SmartSound',
      image: '/images/lux-speaker.jpg',
      price: 45000,
      promo: 35900,
      minOrder: 3,
      tax: 'HT',
      rating: 4.2,
      stock: 250,
      badge: null,
    },
    {
      id: 'p9',
      name: 'Accessoire Premium Kit',
      image: '/images/lux-kit.jpg',
      price: 12900,
      promo: null,
      minOrder: 10,
      tax: 'TTC',
      rating: 4.1,
      stock: 800,
      badge: null,
    },
  ],
};

const currencyFormat = (n) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF' }).format(n);

export default function ProductSection() {
  const [tab, setTab] = useState('featured');

  return (
    <section className="bg-gradient-to-b from-[#080808] via-[#0b0b0b] to-[#0f0f0f] text-white py-16">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gold">Nos Produits Électroniques</h2>
            <p className="text-gray-300 mt-2">Sélection premium importée directement de Chine — qualité garantie.</p>
          </div>

          <div className="flex items-center gap-3">
            {[
              { key: 'featured', label: 'En Vedette' },
              { key: 'new', label: 'Nouveautés' },
              { key: 'sale', label: 'Promotions' },
            ].map((t) => (
              <motion.button
                key={t.key}
                onClick={() => setTab(t.key)}
                whileTap={{ scale: 0.97 }}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  tab === t.key
                    ? 'bg-gradient-to-r from-[#b7842a] to-[#ffd36b] text-black shadow-lg'
                    : 'bg-transparent border border-gray-700 text-gray-300 hover:bg-white/5'
                }`}
              >
                {t.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Products grid */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid md:grid-cols-3 gap-6"
            >
              {PRODUCTS[tab].map((p) => (
                <motion.div
                  key={p.id}
                  whileHover={{ scale: 1.02 }}
                  className="bg-[#0b0b0b] border border-gray-800 rounded-2xl overflow-hidden shadow-xl relative"
                >
                  {/* Image */}
                  <div className="relative overflow-hidden">
                    <img src={p.image} alt={p.name} className="w-full h-56 object-cover transform transition-transform duration-500 hover:scale-105" />

                    {/* Badge */}
                    {p.badge && (
                      <div className="absolute top-3 left-3 bg-gradient-to-r from-[#b7842a] to-[#ffd36b] text-black px-3 py-1 rounded-full text-xs font-semibold">{p.badge}</div>
                    )}
                  </div>

                  {/* Body */}
                  <div className="p-4 space-y-2">
                    <h3 className="text-lg font-semibold text-gray-100">{p.name}</h3>

                    <div className="flex items-baseline gap-3">
                      {p.promo ? (
                        <>
                          <span className="text-xl font-bold text-[#ffd36b]">{currencyFormat(p.promo)}</span>
                          <span className="text-sm line-through text-gray-500">{currencyFormat(p.price)}</span>
                        </>
                      ) : (
                        <span className="text-xl font-bold text-[#ffd36b]">{currencyFormat(p.price)}</span>
                      )}

                      <span className="ml-auto text-sm text-gray-400">{p.tax}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <div>Min. commande: <span className="text-gray-200 font-medium">{p.minOrder}</span></div>
                      <div>Stock: <span className="text-gray-200 font-medium">{p.stock}</span></div>
                    </div>

                    {/* Rating + Actions */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-1 text-[#ffd36b]">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <svg key={i} xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${i < Math.round(p.rating) ? '' : 'opacity-30'}`} viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.173c.969 0 1.371 1.24.588 1.81l-3.378 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.921-.755 1.688-1.54 1.118L10 13.347l-3.378 2.455c-.784.57-1.84-.197-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.627 9.393c-.783-.57-.38-1.81.588-1.81h4.173a1 1 0 00.95-.69l1.286-3.966z" /></svg>
                        ))}
                        <span className="text-sm text-gray-300 ml-2">{p.rating.toFixed(1)}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button className="px-4 py-2 rounded-full bg-transparent border border-gray-700 text-gray-300 hover:bg-white/5">Détails</button>
                        <button className="px-4 py-2 rounded-full bg-gradient-to-r from-[#b7842a] to-[#ffd36b] text-black font-semibold hover:opacity-95">Commander</button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* CTA bottom */}
        <div className="mt-8 text-center">
          <button className="px-6 py-3 rounded-full bg-gradient-to-r from-[#b7842a] to-[#ffd36b] text-black font-semibold shadow-lg">Voir plus de produits</button>
        </div>
      </div>
    </section>
  );
}

// Styles: add to your global CSS / tailwind config
/*
  In tailwind.config.js, ensure you have added a "gold" color if you want:
  module.exports = {
    theme: {
      extend: {
        colors: {
          gold: '#d9b24a',
        },
      },
    },
  }
*/
je veux que pour cette ecran pour la confirmation l'utilsateur soit renvoye sur l'ecran OrderConfirmation et que les steps soit s'affiche coreectement sur telephone et finalement que l'etape un et deux soit separer et un s'affiche plus ameme temps