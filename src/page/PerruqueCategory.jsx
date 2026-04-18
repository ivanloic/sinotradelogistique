import { useState, useEffect, useMemo, useRef, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Filter, Grid, List, Heart, ShoppingCart,
  Truck, Shield, Clock, Crown, Eye, X,
  Sparkles, LayoutGrid, Scissors,
} from 'lucide-react';
import SubCategoryNav from '../Components/SubCategoryNav';
import { perruque as perruqueData } from '../data/perruque';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import { useCart } from '../context/CartContext';
import { usePrice } from '../hooks/usePrice';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import { translateProductName } from '../data/translations';

// ─── Icônes des sous-catégories ──────────────────────────────────────────────
const PERRUQUE_ICONS = {
  all:         <LayoutGrid className="w-4 h-4" />,
  courte:      <Scissors   className="w-4 h-4" />,
  longue:      <Sparkles   className="w-4 h-4" />,
  bresilienne: <Crown      className="w-4 h-4" />,
};

const SUB_IDS = ['all', 'courte', 'longue', 'bresilienne'];

const SUB_LABELS = {
  all:         'Toutes les perruques',
  courte:      'Perruques Courtes',
  longue:      'Perruques Longues',
  bresilienne: 'Perruques Brésiliennes',
};

// ─── Composant principal ──────────────────────────────────────────────────────
const PerruqueCategory = () => {
  const { language } = useTranslation();
  const navigate = useNavigate();

  const [activeSubCategory, setActiveSubCategory] = useState('all');
  const [viewMode, setViewMode]           = useState('grid');
  const [priceRange, setPriceRange]       = useState([0, 500000]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [scrolled, setScrolled]           = useState(false);
  const [headerHeight, setHeaderHeight]   = useState(0);
  const subCategoryRef = useRef(null);
  const loadMoreRef    = useRef(null);

  // ── Navigation vers la fiche produit ────────────────────────────────────────
  const handleProductClick = (product) => {
    navigate(`/product/perruque/${product.sourceId}`);
  };

  // ── Données de présentation de la catégorie ──────────────────────────────────
  const categoryData = {
    name: 'Perruque & Cheveux',
    icon: '💇',
    description:
      'Découvrez notre collection de perruques naturelles et synthétiques — courtes pixie, longues volumineuses ou brésiliennes premium — directement depuis les meilleurs fournisseurs.',
    features: [
      { icon: <Shield className="w-6 h-6" />, text: 'Qualité garantie' },
      { icon: <Truck  className="w-6 h-6" />, text: 'Livraison mondiale' },
      { icon: <Clock  className="w-6 h-6" />, text: 'Support 24/7' },
      { icon: <Crown  className="w-6 h-6" />, text: 'Articles premium' },
    ],
  };

  // ── Mesure dynamique de la hauteur du header ─────────────────────────────────
  useLayoutEffect(() => {
    function measure() {
      const hdr = document.querySelector('header');
      if (hdr) setHeaderHeight(Math.ceil(hdr.getBoundingClientRect().height));
    }
    measure();
    const timer = setTimeout(measure, 100);
    window.addEventListener('resize', measure);
    window.addEventListener('scroll', measure, { passive: true });
    window.addEventListener('load',   measure);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', measure);
      window.removeEventListener('scroll', measure);
      window.removeEventListener('load',   measure);
    };
  }, []);

  // ── Sub-nav fixe en bas du header sur mobile ──────────────────────────────────
  useEffect(() => {
    const onScroll = () =>
      setScrolled(window.innerWidth < 1024 && window.scrollY > 250);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  // ── Normalisation des produits ────────────────────────────────────────────────
  const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  const normalizeProduct = (p) => ({
    ...p,
    id:        `perruque-${p.id}`,
    sourceId:  p.id,
    brandId:   'various',
    brandName: 'Various',
    supplier:  'Fournisseur Premium',
    features:  [
      `Longueurs : ${(p.sizes || []).slice(0, 3).join(', ')}${(p.sizes || []).length > 3 ? '…' : ''}`,
      'Qualité premium',
    ],
    rating:   +(4.0 + Math.random() * 1.0).toFixed(1),
    reviews:  rand(5, 200),
    stock:    rand(20, 300),
    sold:     rand(10, 250),
    delivery: '7-21 jours',
    subCategory: p.category || null,
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const products = useMemo(() => perruqueData.map(normalizeProduct), []);

  // ── Sous-catégories + compteurs ───────────────────────────────────────────────
  const subCategories = SUB_IDS.map((id) => ({
    id,
    name: SUB_LABELS[id],
    count: products.filter((p) =>
      id === 'all' || p.subCategory === id || p.category === id
    ).length,
  }));

  // ── Filtrage ──────────────────────────────────────────────────────────────────
  const filteredProducts = products.filter((p) => {
    const matchesSub =
      activeSubCategory === 'all' ||
      p.subCategory === activeSubCategory ||
      p.category    === activeSubCategory;
    const matchesSize =
      selectedSizes.length === 0 ||
      (p.sizes && p.sizes.some((s) => selectedSizes.includes(s)));
    const matchesPrice =
      p.price >= priceRange[0] && p.price <= priceRange[1];
    return matchesSub && matchesSize && matchesPrice;
  });

  // ── Infinite scroll ───────────────────────────────────────────────────────────
  const PAGE_SIZE = 12;
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeSubCategory, selectedSizes, priceRange]);

  const orderedProducts  = useMemo(() => filteredProducts, [filteredProducts]);
  const visibleProducts  = orderedProducts.slice(0, visibleCount);
  const totalProducts    = orderedProducts.length;

  useEffect(() => {
    if (!loadMoreRef.current) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && visibleCount < totalProducts)
            setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, totalProducts));
        });
      },
      { rootMargin: '200px', threshold: 0.1 }
    );
    obs.observe(loadMoreRef.current);
    return () => obs.disconnect();
  }, [visibleCount, totalProducts]);

  // ── Tailles uniques pour le filtre sidebar ────────────────────────────────────
  const allSizes = useMemo(() => {
    const set = new Set();
    products.forEach((p) => (p.sizes || []).forEach((s) => set.add(s)));
    return Array.from(set).sort((a, b) => {
      const na = parseInt(a), nb = parseInt(b);
      return isNaN(na) || isNaN(nb) ? a.localeCompare(b) : na - nb;
    });
  }, [products]);

  const toggleSize = (s) =>
    setSelectedSizes((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );

  const { addItem }          = useCart();
  const { format: formatPrice } = usePrice();

  const getProductName = (product) => translateProductName(product.name, language);
  const currentSub     = subCategories.find((s) => s.id === activeSubCategory);

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* ── Bannière Hero ─────────────────────────────────────────────────────── */}
      <div className="relative bg-gradient-to-r from-purple-900 to-fuchsia-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/90 via-fuchsia-700/60 to-pink-500/30 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <div className="text-6xl mb-4">{categoryData.icon}</div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{categoryData.name}</h1>
              <p className="text-lg md:text-xl opacity-90 max-w-3xl mx-auto leading-relaxed">
                {categoryData.description}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap justify-center gap-4 md:gap-6 mt-8"
            >
              {categoryData.features.map((f, i) => (
                <div
                  key={i}
                  className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full"
                >
                  {f.icon}
                  <span className="text-sm">{f.text}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* spacer mobile quand sub-nav est fixé */}
      {scrolled && <div className="h-[52px] lg:hidden" />}

      {/* ── Navigation sous-catégories ─────────────────────────────────────────── */}
      <SubCategoryNav
        ref={subCategoryRef}
        items={subCategories}
        active={activeSubCategory}
        onChange={setActiveSubCategory}
        iconMap={PERRUQUE_ICONS}
        scrolled={scrolled}
        headerHeight={headerHeight}
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* ── Sidebar filtres (desktop) ──────────────────────────────────────── */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 sticky top-24 space-y-6">

              {/* Prix */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Prix (FCFA)</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <span>{priceRange[0].toLocaleString()}</span>
                  <span>—</span>
                  <span>{priceRange[1].toLocaleString()}</span>
                </div>
                <input
                  type="range" min={0} max={500000} step={1000}
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                  className="w-full accent-purple-600"
                />
              </div>

              {/* Longueur (pouces) */}
              {allSizes.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Longueur</h3>
                  <div className="flex flex-wrap gap-2 max-h-52 overflow-y-auto pr-1">
                    {allSizes.map((s) => (
                      <button
                        key={s}
                        onClick={() => toggleSize(s)}
                        className={`text-xs px-2.5 py-1.5 rounded-lg border transition-colors ${
                          selectedSizes.includes(s)
                            ? 'bg-purple-600 text-white border-purple-600'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-purple-400'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Réinitialiser */}
              {(selectedSizes.length > 0 || priceRange[1] < 500000) && (
                <button
                  onClick={() => { setSelectedSizes([]); setPriceRange([0, 500000]); }}
                  className="w-full text-sm text-purple-600 hover:underline"
                >
                  Réinitialiser les filtres
                </button>
              )}
            </div>
          </aside>

          {/* ── Contenu principal ──────────────────────────────────────────────── */}
          <div className="flex-1">

            {/* En-tête sous-catégorie active */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {currentSub?.name}
                  </h2>
                  <p className="text-gray-600">
                    {totalProducts} produit{totalProducts > 1 ? 's' : ''} disponible{totalProducts > 1 ? 's' : ''}
                  </p>
                </div>

                {/* Bascule grille / liste */}
                <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'grid' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-400'
                    }`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'list' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-400'
                    }`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* ── Grille / Liste ─────────────────────────────────────────────── */}
            <div className={
              viewMode === 'grid'
                ? 'grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 md:gap-6'
                : 'space-y-4'
            }>
              {visibleProducts.map((product) => (
                <div
                  key={product.id}
                  className={
                    viewMode === 'grid'
                      ? 'bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group'
                      : 'bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300'
                  }
                >
                  {/* ── Vue grille ── */}
                  {viewMode === 'grid' ? (
                    <div className="p-2 sm:p-3 md:p-4">
                      {/* Image + badges */}
                      <div className="relative mb-2 sm:mb-3 md:mb-4">
                        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src={product.image}
                            alt={product.name}
                            onClick={() => handleProductClick(product)}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                          />
                        </div>

                        {/* Actions rapides — desktop seulement */}
                        <div className="absolute top-2 right-2 hidden sm:flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <button className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50">
                            <Heart className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setQuickViewProduct(product)}
                            className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Badge promo */}
                        {product.originalPrice > product.price && (
                          <div className="absolute bottom-2 left-2 bg-red-500 text-white px-1.5 py-0.5 sm:px-2 sm:py-1 rounded text-xs sm:text-sm font-bold">
                            -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                          </div>
                        )}
                      </div>

                      {/* Informations produit */}
                      <div className="space-y-2 sm:space-y-3">
                        <h3 className="font-medium text-gray-800 text-sm leading-5 line-clamp-2 mb-1 h-10 overflow-hidden">
                          <span
                            onClick={() => handleProductClick(product)}
                            className="cursor-pointer"
                          >
                            {getProductName(product)}
                          </span>
                        </h3>

                        {/* Longueurs disponibles */}
                        {product.sizes && product.sizes.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {product.sizes.slice(0, 3).map((s, i) => (
                              <span
                                key={i}
                                className="text-xs bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded"
                              >
                                {s}
                              </span>
                            ))}
                            {product.sizes.length > 3 && (
                              <span className="text-xs text-gray-400">
                                +{product.sizes.length - 3}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Prix */}
                        <div className="flex items-center space-x-1 sm:space-x-2 flex-wrap">
                          <span className="text-sm sm:text-lg md:text-xl font-bold text-green-600">
                            {formatPrice(product.price)}
                          </span>
                          {product.originalPrice > product.price && (
                            <span className="text-xs sm:text-sm line-through text-gray-400">
                              {formatPrice(product.originalPrice)}
                            </span>
                          )}
                        </div>

                        <div className="flex flex-col sm:flex-row sm:justify-between text-xs sm:text-sm text-gray-600 gap-1">
                          <span>Min: {product.minOrder}</span>
                          <span className={product.taxType === 'ttc' ? 'text-green-600' : 'text-orange-600'}>
                            {product.taxType === 'ttc' ? 'TTC 🚚' : 'HT 📦'}
                          </span>
                        </div>

                        <button
                          className="w-full bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white py-2 sm:py-2.5 md:py-3 px-2 sm:px-3 md:px-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-1 sm:space-x-2 text-xs sm:text-sm"
                          onClick={() =>
                            addItem({
                              productId: product.id,
                              name:      product.name,
                              price:     product.price,
                              image:     product.image,
                              quantity:  1,
                              minOrder:  product.minOrder,
                              taxType:   product.taxType,
                            })
                          }
                        >
                          <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="hidden sm:inline">Ajouter au panier</span>
                          <span className="sm:hidden">Panier</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* ── Vue liste ── */
                    <div className="flex space-x-6">
                      <div className="w-32 h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={product.image}
                          alt={product.name}
                          onClick={() => handleProductClick(product)}
                          className="w-full h-full object-cover cursor-pointer"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-semibold text-gray-900 text-base leading-6 line-clamp-2 mb-1 h-12 overflow-hidden">
                            <span
                              onClick={() => handleProductClick(product)}
                              className="cursor-pointer"
                            >
                              {getProductName(product)}
                            </span>
                          </h3>

                          <div className="text-right ml-4 flex-shrink-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-xl font-bold text-green-600">
                                {formatPrice(product.price)}
                              </span>
                              {product.originalPrice > product.price && (
                                <span className="text-sm line-through text-gray-400">
                                  {formatPrice(product.originalPrice)}
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-gray-600">
                              Min: {product.minOrder} • {product.taxType === 'ttc' ? 'TTC' : 'HT'}
                            </div>
                          </div>
                        </div>

                        <p className="text-gray-600 mb-3 text-sm line-clamp-1">
                          {product.description}
                        </p>

                        {/* Longueurs — vue liste */}
                        {product.sizes && product.sizes.length > 0 && (
                          <div className="flex items-center gap-2 mb-4">
                            <span className="text-sm text-gray-600 flex-shrink-0">Longueurs :</span>
                            <div className="flex flex-wrap gap-1">
                              {product.sizes.slice(0, 5).map((s, i) => (
                                <span
                                  key={i}
                                  className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded"
                                >
                                  {s}
                                </span>
                              ))}
                              {product.sizes.length > 5 && (
                                <span className="text-xs text-gray-400">
                                  +{product.sizes.length - 5}
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        <button
                          className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-6 rounded-lg font-semibold transition-colors flex items-center space-x-2"
                          onClick={() =>
                            addItem({
                              productId: product.id,
                              name:      product.name,
                              price:     product.price,
                              image:     product.image,
                              quantity:  1,
                              minOrder:  product.minOrder,
                              taxType:   product.taxType,
                            })
                          }
                        >
                          <ShoppingCart className="w-4 h-4" />
                          <span>Panier</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Infinite scroll sentinel */}
            <div className="flex flex-col items-center mt-8">
              <div ref={loadMoreRef} className="w-full h-6" />
              {visibleCount >= totalProducts && totalProducts > 0 && (
                <div className="text-sm text-gray-500 mt-4">Tous les produits affichés</div>
              )}
            </div>

            {/* Aucun résultat */}
            {totalProducts === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
              >
                <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Filter className="w-16 h-16 text-gray-400" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                  Aucun produit trouvé
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Modifiez vos critères de recherche ou réinitialisez les filtres.
                </p>
                <button
                  onClick={() => { setSelectedSizes([]); setPriceRange([0, 500000]); }}
                  className="bg-purple-600 hover:bg-purple-700 text-white py-3 px-8 rounded-lg font-semibold transition-colors"
                >
                  Réinitialiser les filtres
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* ── Quick View Modal ───────────────────────────────────────────────────── */}
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
              animate={{ scale: 1,   opacity: 1 }}
              exit={{ scale: 0.9,    opacity: 0 }}
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">Aperçu rapide</h3>
                  <button
                    onClick={() => setQuickViewProduct(null)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <img
                    src={quickViewProduct.image}
                    alt={getProductName(quickViewProduct)}
                    className="w-full h-96 object-cover rounded-lg"
                  />

                  <div>
                    <h4 className="text-xl font-semibold mb-2">
                      {getProductName(quickViewProduct)}
                    </h4>
                    <p className="text-gray-600 mb-4 text-sm">
                      {quickViewProduct.description}
                    </p>

                    {/* Longueurs disponibles */}
                    {quickViewProduct.sizes && quickViewProduct.sizes.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          Longueurs disponibles :
                        </p>
                        <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto">
                          {quickViewProduct.sizes.map((s, i) => (
                            <span
                              key={i}
                              className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-green-600">
                          {formatPrice(quickViewProduct.price)}
                        </span>
                        {quickViewProduct.originalPrice > quickViewProduct.price && (
                          <span className="text-lg line-through text-gray-400">
                            {formatPrice(quickViewProduct.originalPrice)}
                          </span>
                        )}
                      </div>

                      <div className="text-sm text-gray-600">
                        Min: {quickViewProduct.minOrder} •{' '}
                        {quickViewProduct.taxType === 'ttc' ? 'TTC' : 'HT'} •{' '}
                        Livraison: {quickViewProduct.delivery}
                      </div>

                      <button
                        onClick={() => {
                          setQuickViewProduct(null);
                          handleProductClick(quickViewProduct);
                        }}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
                      >
                        Voir les détails complets
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

export default PerruqueCategory;
