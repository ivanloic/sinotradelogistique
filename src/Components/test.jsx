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
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const slides = [
  {
    image: "/images/promo1.jpg",
    title: "Promo Spéciale sur les Smartphones",
    price: "À partir de 89 900 FCFA",
    description: "Des modèles récents à petit prix, livraison rapide partout en Afrique.",
  },
  {
    image: "/images/promo2.jpg",
    title: "Ordinateurs portables en solde",
    price: "Réduction jusqu’à 35%",
    description: "Performants, élégants, parfaits pour le travail et les études.",
  },
  {
    image: "/images/promo3.jpg",
    title: "Accessoires et gadgets tech",
    price: "Dès 2 500 FCFA",
    description: "Casques, chargeurs, montres connectées et plus encore.",
  },
];

export default function HeroSection() {
  const [index, setIndex] = useState(0);

  // Slider automatique
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const current = slides[index];

  return (
    <section className="relative w-full overflow-hidden bg-gray-100">
      <div className="relative h-[450px] w-full flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.image}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            <img
              src={current.image}
              alt={current.title}
              className="w-full h-full object-cover brightness-75"
            />
            <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-center text-white px-4">
              <motion.h2
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-3xl md:text-5xl font-bold mb-4"
              >
                {current.title}
              </motion.h2>
              <p className="text-lg md:text-xl mb-2">{current.price}</p>
              <p className="max-w-2xl mb-4">{current.description}</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-yellow-500 text-black font-semibold px-6 py-3 rounded-full shadow-lg hover:bg-yellow-400 transition"
              >
                Commander maintenant
              </motion.button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Indicateurs */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-3 h-3 rounded-full ${
              i === index ? "bg-yellow-400" : "bg-gray-300"
            }`}
          />
        ))}
      </div>

      {/* Section des produits */}
      <div className="grid md:grid-cols-3 gap-6 p-6 bg-white">
        {[
          {
            image: "/images/product1.jpg",
            name: "Écouteurs Bluetooth",
            price: "7 500 FCFA",
          },
          {
            image: "/images/product2.jpg",
            name: "Montre connectée",
            price: "14 900 FCFA",
          },
          {
            image: "/images/product3.jpg",
            name: "Chargeur rapide 30W",
            price: "5 000 FCFA",
          },
        ].map((product, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.2 }}
            className="rounded-2xl overflow-hidden shadow-lg hover:shadow-xl bg-gray-50 transition"
          >
            <img
              src={product.image}
              alt={product.name}
              className="h-56 w-full object-cover"
            />
            <div className="p-4 text-center">
              <h3 className="font-semibold text-lg">{product.name}</h3>
              <p className="text-yellow-600 font-bold mb-2">{product.price}</p>
              <button className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-4 py-2 rounded-full transition">
                Acheter
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
