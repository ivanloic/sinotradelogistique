import { useState, useEffect, useMemo, useRef, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Filter, Grid, List, Heart, ShoppingCart, Eye, X,
  Crown, Sparkles, LayoutGrid, Tag
} from 'lucide-react';
import { vetement_femme } from '../data/vetement_femme';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import { useCart } from '../context/CartContext';
import { usePrice } from '../hooks/usePrice';
import { useNavigate } from 'react-router-dom';

// ─── Sous-catégories ──────────────────────────────────────────────────────────

const SUB_CATS = [
  { id: 'all',         label: 'Tout',               icon: <LayoutGrid className="w-4 h-4" /> },
  { id: 'robe',        label: 'Robes',               icon: <Crown      className="w-4 h-4" /> },
  { id: 'ensemble',    label: 'Ensembles',            icon: <Sparkles   className="w-4 h-4" /> },
  { id: 'jupe',        label: 'Jupes',               icon: <Tag        className="w-4 h-4" /> },
  { id: 'pantalon',    label: 'Pantalons',            icon: <Tag        className="w-4 h-4" /> },
  { id: 'jean',        label: 'Jeans',               icon: <Tag        className="w-4 h-4" /> },
  { id: 'short',       label: 'Shorts',              icon: <Tag        className="w-4 h-4" /> },
  { id: 'blouse',      label: 'Blouses',             icon: <Tag        className="w-4 h-4" /> },
  { id: 'tshirt',      label: 'T-Shirts',            icon: <Tag        className="w-4 h-4" /> },
  { id: 'chemise',     label: 'Chemises',            icon: <Tag        className="w-4 h-4" /> },
  { id: 'combinaison', label: 'Combinaisons',         icon: <Tag        className="w-4 h-4" /> },
  { id: 'veste',       label: 'Vestes & Doudounes',  icon: <Tag        className="w-4 h-4" /> },
  { id: 'sweat',       label: 'Sweats & Hoodies',    icon: <Tag        className="w-4 h-4" /> },
  { id: 'lingerie',    label: 'Lingerie & Nuisettes', icon: <Heart      className="w-4 h-4" /> },
  { id: 'clothing',    label: 'Autres',              icon: <Tag        className="w-4 h-4" /> },
];

const PAGE_SIZE = 12;

const WomanClothing = () => {
  const [activeSubCat, setActiveSubCat]       = useState('all');
  const [viewMode, setViewMode]               = useState('grid');
  const [priceRange, setPriceRange]           = useState([0, 100000]);
  const [selectedSizes, setSelectedSizes]     = useState([]);
  const [selectedColors, setSelectedColors]   = useState([]);
  const [showFilters, setShowFilters]         = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [visibleCount, setVisibleCount]       = useState(PAGE_SIZE);
  const [headerHeight, setHeaderHeight]       = useState(0);

  const navigate    = useNavigate();
  const { addItem } = useCart();
  const { format: formatPrice } = usePrice();

  const loadMoreRef = useRef(null);

  // ── Mesure la hauteur du header pour le positionnement sticky ───────────
  useLayoutEffect(() => {
    const measure = () => {
      const h = document.querySelector('header')?.offsetHeight ?? 0;
      setHeaderHeight(h);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  // ── Filtre produits ──────────────────────────────────────────────────────
  const filteredProducts = useMemo(() => {
    return vetement_femme.filter(p => {
      const matchesCat   = activeSubCat === 'all' || p.category === activeSubCat;
      const matchesSize  = selectedSizes.length === 0  || (p.sizes  && p.sizes.some(s => selectedSizes.includes(s)));
      const matchesColor = selectedColors.length === 0 || (p.colors && p.colors.some(c => selectedColors.includes(c)));
      const matchesPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
      return matchesCat && matchesSize && matchesColor && matchesPrice;
    });
  }, [activeSubCat, selectedSizes, selectedColors, priceRange]);

  const visibleProducts = filteredProducts.slice(0, visibleCount);

  // reset visible count on filter change
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeSubCat, selectedSizes, selectedColors, priceRange]);

  // Infinite scroll
  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && visibleCount < filteredProducts.length) {
          setVisibleCount(prev => Math.min(prev + PAGE_SIZE, filteredProducts.length));
        }
      });
    }, { rootMargin: '200px' });
    obs.observe(el);
    return () => obs.disconnect();
  }, [visibleCount, filteredProducts.length]);

  // ── Couleurs & tailles disponibles ──────────────────────────────────────
  const allSizes  = [...new Set(vetement_femme.flatMap(p => p.sizes || []))].sort();
  const allColors = [...new Set(vetement_femme.flatMap(p => p.colors || []))].sort();

  const toggleFilter = (arr, setArr, val) =>
    setArr(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]);

  // ── Comptages par sous-catégorie ─────────────────────────────────────────
  const subCatsWithCount = SUB_CATS.map(sub => ({
    ...sub,
    count: sub.id === 'all'
      ? vetement_femme.length
      : vetement_femme.filter(p => p.category === sub.id).length,
  })).filter(sub => sub.id === 'all' || sub.count > 0);

  // ── Titre courant ────────────────────────────────────────────────────────
  const currentLabel = SUB_CATS.find(s => s.id === activeSubCat)?.label || 'Tout';

  // ── Helper nom produit ───────────────────────────────────────────────────
  const displayName = name =>
    name.toLowerCase().replace(/(^\w|\s\w)/g, c => c.toUpperCase());

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* ── Bannière ── */}
      <div className="relative bg-gradient-to-r from-pink-600 to-rose-500 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=2070&q=40')] bg-cover bg-center opacity-15" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-14 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <div className="text-5xl mb-3">👗</div>
            <h1 className="text-4xl font-bold mb-3">Vêtements Femme</h1>
            <p className="text-lg opacity-90 max-w-2xl mx-auto">
              {vetement_femme.length} articles — robes, ensembles, jupes, lingerie et bien plus encore.
            </p>
          </motion.div>
        </div>
      </div>

      {/* ── Barre de sous-catégories ── */}
      <div className="sticky z-30 bg-white shadow-sm border-b border-gray-200" style={{ top: headerHeight }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-1 overflow-x-auto py-2 scrollbar-hide">
            {subCatsWithCount.map(sub => (
              <button
                key={sub.id}
                onClick={() => setActiveSubCat(sub.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  activeSubCat === sub.id
                    ? 'bg-pink-600 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-pink-50 hover:text-pink-600'
                }`}
              >
                {sub.icon}
                <span>{sub.label}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  activeSubCat === sub.id ? 'bg-white/20' : 'bg-gray-100'
                }`}>
                  {sub.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Contenu ── */}
      <div className="max-w-7xl mx-auto px-4 py-6">

        {/* En-tête avec contrôles */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{currentLabel}</h2>
            <p className="text-sm text-gray-500">
              {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Bouton filtres */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                showFilters ? 'bg-pink-600 text-white border-pink-600' : 'border-gray-300 text-gray-700 hover:border-pink-400'
              }`}
            >
              <Filter className="w-4 h-4" />
              Filtres
              {(selectedSizes.length + selectedColors.length) > 0 && (
                <span className="bg-white text-pink-600 text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {selectedSizes.length + selectedColors.length}
                </span>
              )}
            </button>

            {/* Vue grille / liste */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded transition-colors ${viewMode === 'grid' ? 'bg-white text-pink-600 shadow-sm' : 'text-gray-400'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded transition-colors ${viewMode === 'list' ? 'bg-white text-pink-600 shadow-sm' : 'text-gray-400'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ── Panneau de filtres ── */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-white border border-gray-200 rounded-xl p-5 mb-5 grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Prix */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Prix (FCFA)</h3>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={e => setPriceRange([+e.target.value, priceRange[1]])}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                      placeholder="Min"
                    />
                    <span className="text-gray-400">–</span>
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={e => setPriceRange([priceRange[0], +e.target.value])}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                      placeholder="Max"
                    />
                  </div>
                </div>

                {/* Tailles */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Tailles</h3>
                  <div className="flex flex-wrap gap-2">
                    {allSizes.map(s => (
                      <button
                        key={s}
                        onClick={() => toggleFilter(selectedSizes, setSelectedSizes, s)}
                        className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                          selectedSizes.includes(s)
                            ? 'bg-pink-600 text-white border-pink-600'
                            : 'border-gray-300 text-gray-600 hover:border-pink-400'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Couleurs */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Couleurs</h3>
                  <div className="flex flex-wrap gap-2">
                    {allColors.map(c => (
                      <button
                        key={c}
                        onClick={() => toggleFilter(selectedColors, setSelectedColors, c)}
                        className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                          selectedColors.includes(c)
                            ? 'bg-pink-600 text-white border-pink-600'
                            : 'border-gray-300 text-gray-600 hover:border-pink-400'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Réinitialiser */}
              {(selectedSizes.length + selectedColors.length > 0 || priceRange[0] > 0 || priceRange[1] < 100000) && (
                <button
                  onClick={() => { setSelectedSizes([]); setSelectedColors([]); setPriceRange([0, 100000]); }}
                  className="mb-5 text-sm text-pink-600 hover:underline"
                >
                  Réinitialiser les filtres
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Grille / Liste produits ── */}
        {visibleProducts.length > 0 ? (
          <>
            <div className={
              viewMode === 'grid'
                ? 'grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4'
                : 'space-y-4'
            }>
              {visibleProducts.map(product => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={
                    viewMode === 'grid'
                      ? 'bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300 group'
                      : 'bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-all duration-300 flex gap-5'
                  }
                >
                  {viewMode === 'grid' ? (
                    /* ── Vue grille ── */
                    <div className="p-2 sm:p-3">
                      {/* Image portrait */}
                      <div className="relative aspect-[3/4] bg-gray-50 rounded-lg overflow-hidden mb-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          onClick={() => navigate(`/product/femme/${product.id}`)}
                          className="w-full h-full object-contain cursor-pointer group-hover:scale-105 transition-transform duration-300"
                        />
                        {/* Actions rapides */}
                        <div className="absolute top-2 right-2 hidden sm:flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-1.5 bg-white rounded-full shadow hover:bg-gray-50">
                            <Heart className="w-3.5 h-3.5 text-gray-500" />
                          </button>
                          <button
                            onClick={() => setQuickViewProduct(product)}
                            className="p-1.5 bg-white rounded-full shadow hover:bg-gray-50"
                          >
                            <Eye className="w-3.5 h-3.5 text-gray-500" />
                          </button>
                        </div>
                        {/* Badge catégorie */}
                        {product.categoryLabel && (
                          <div className="absolute top-2 left-2 bg-pink-600 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                            {product.categoryLabel}
                          </div>
                        )}
                        {/* Promo */}
                        {product.originalPrice > product.price && (
                          <div className="absolute bottom-2 left-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded font-bold">
                            -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                          </div>
                        )}
                      </div>

                      {/* Infos */}
                      <h3
                        onClick={() => navigate(`/product/femme/${product.id}`)}
                        className="text-xs sm:text-sm font-medium text-gray-800 line-clamp-2 mb-1.5 cursor-pointer hover:text-pink-600 transition-colors h-9 overflow-hidden"
                      >
                        {displayName(product.name)}
                      </h3>

                      {/* Prix */}
                      <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                        <span className="text-sm sm:text-base font-bold text-green-600">
                          {formatPrice(product.price)}
                        </span>
                        {product.originalPrice > product.price && (
                          <span className="text-xs line-through text-gray-400">
                            {formatPrice(product.originalPrice)}
                          </span>
                        )}
                      </div>

                      <div className="flex justify-between text-xs text-gray-500 mb-2">
                        <span>Min: {product.minOrder}</span>
                        <span className={product.taxType === 'ttc' ? 'text-green-600' : 'text-orange-500'}>
                          {product.taxType === 'ttc' ? 'TTC 🚚' : 'HT 📦'}
                        </span>
                      </div>

                      <button
                        onClick={() => addItem({ productId: `femme-${product.id}`, name: product.name, price: product.price, image: product.image, quantity: 1, minOrder: product.minOrder, taxType: product.taxType })}
                        className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-1.5"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Ajouter au panier</span>
                        <span className="sm:hidden">Panier</span>
                      </button>
                    </div>
                  ) : (
                    /* ── Vue liste ── */
                    <>
                      <div
                        className="w-28 sm:w-36 aspect-[3/4] bg-gray-50 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer"
                        onClick={() => navigate(`/product/femme/${product.id}`)}
                      >
                        <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
                      </div>

                      <div className="flex-1 min-w-0 py-1">
                        <div className="flex items-start gap-2 mb-1">
                          {product.categoryLabel && (
                            <span className="bg-pink-50 text-pink-600 border border-pink-200 text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap">
                              {product.categoryLabel}
                            </span>
                          )}
                        </div>

                        <h3
                          onClick={() => navigate(`/product/femme/${product.id}`)}
                          className="font-semibold text-gray-900 text-sm sm:text-base line-clamp-2 mb-1 cursor-pointer hover:text-pink-600 transition-colors"
                        >
                          {displayName(product.name)}
                        </h3>

                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg font-bold text-green-600">{formatPrice(product.price)}</span>
                          {product.originalPrice > product.price && (
                            <span className="text-sm line-through text-gray-400">{formatPrice(product.originalPrice)}</span>
                          )}
                        </div>

                        <div className="text-xs text-gray-500 mb-2">
                          Min: {product.minOrder} pcs &nbsp;•&nbsp;
                          <span className={product.taxType === 'ttc' ? 'text-green-600' : 'text-orange-500'}>
                            {product.taxType === 'ttc' ? 'TTC' : 'HT'}
                          </span>
                        </div>

                        {product.tags && product.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {product.tags.slice(0, 4).map(tag => (
                              <span key={tag} className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}

                        <button
                          onClick={() => addItem({ productId: `femme-${product.id}`, name: product.name, price: product.price, image: product.image, quantity: 1, minOrder: product.minOrder, taxType: product.taxType })}
                          className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white py-2 px-5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          Panier
                        </button>
                      </div>
                    </>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Infinite scroll sentinel */}
            <div ref={loadMoreRef} className="w-full h-8 mt-6" />
            {visibleCount >= filteredProducts.length && (
              <p className="text-center text-sm text-gray-400 mt-2">Tous les produits affichés</p>
            )}
          </>
        ) : (
          /* Aucun résultat */
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <div className="text-6xl mb-4">👗</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Aucun produit trouvé</h3>
            <p className="text-gray-500 mb-6">Modifiez vos filtres pour voir plus de résultats.</p>
            <button
              onClick={() => { setActiveSubCat('all'); setSelectedSizes([]); setSelectedColors([]); setPriceRange([0, 100000]); }}
              className="bg-pink-600 hover:bg-pink-700 text-white py-2.5 px-8 rounded-lg font-semibold transition-colors"
            >
              Réinitialiser
            </button>
          </motion.div>
        )}
      </div>

      {/* ── Quick View Modal ── */}
      <AnimatePresence>
        {quickViewProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setQuickViewProduct(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-5">
                  <h3 className="text-xl font-bold text-gray-900">Aperçu rapide</h3>
                  <button onClick={() => setQuickViewProduct(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="aspect-[3/4] bg-gray-50 rounded-xl overflow-hidden">
                    <img
                      src={quickViewProduct.image}
                      alt={quickViewProduct.name}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="flex flex-col justify-between py-2">
                    <div>
                      {quickViewProduct.categoryLabel && (
                        <span className="inline-block bg-pink-50 text-pink-600 border border-pink-200 text-xs px-2 py-0.5 rounded-full font-medium mb-3">
                          {quickViewProduct.categoryLabel}
                        </span>
                      )}
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">
                        {displayName(quickViewProduct.name)}
                      </h4>
                      <p className="text-gray-600 text-sm mb-4">{quickViewProduct.description}</p>

                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl font-bold text-green-600">{formatPrice(quickViewProduct.price)}</span>
                        {quickViewProduct.originalPrice > quickViewProduct.price && (
                          <span className="text-base line-through text-gray-400">{formatPrice(quickViewProduct.originalPrice)}</span>
                        )}
                      </div>

                      <div className="text-sm text-gray-500 mb-4">
                        Commande min.: {quickViewProduct.minOrder} pcs &nbsp;•&nbsp;
                        <span className={quickViewProduct.taxType === 'ttc' ? 'text-green-600' : 'text-orange-500'}>
                          {quickViewProduct.taxType === 'ttc' ? 'TTC' : 'HT'}
                        </span>
                      </div>

                      {quickViewProduct.tags && quickViewProduct.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {quickViewProduct.tags.map(tag => (
                            <span key={tag} className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 mt-4">
                      <button
                        onClick={() => { setQuickViewProduct(null); navigate(`/product/femme/${quickViewProduct.id}`); }}
                        className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white py-2.5 rounded-lg font-semibold transition-all"
                      >
                        Voir les détails complets
                      </button>
                      <button
                        onClick={() => addItem({ productId: `femme-${quickViewProduct.id}`, name: quickViewProduct.name, price: quickViewProduct.price, image: quickViewProduct.image, quantity: 1, minOrder: quickViewProduct.minOrder, taxType: quickViewProduct.taxType })}
                        className="w-full border border-pink-500 text-pink-600 hover:bg-pink-50 py-2.5 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        Ajouter au panier
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default WomanClothing;
