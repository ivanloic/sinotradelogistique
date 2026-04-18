import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, Grid, List, Star, Heart, ShoppingCart, ChevronDown, Sliders, X, Eye } from 'lucide-react';
import { vetement_homme } from '../data/vetement_homme';
import { vetement_femme } from '../data/vetement_femme';
import { vetement_enfant } from '../data/vetement_enfant';
import { chaussure } from '../data/chaussure';
import { sacs } from '../data/sacs';
import { bijoux_accessoires } from '../data/bijoux_accessoires';
import { telephone_accessoires } from '../data/telephone_accessoires';
import { perruque } from '../data/perruque';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import { useCart } from '../context/CartContext';
import { usePrice } from '../hooks/usePrice';
import { useNavigate } from 'react-router-dom';

const CategoryPage = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('clothing');
  const [activeSubCategory, setActiveSubCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [priceRange, setPriceRange] = useState([0, 500000]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [scrolled, setScrolled] = useState(false);
  
  // États pour l'infinite scroll
  const PAGE_SIZE = 12;
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const loadMoreRef = useRef(null);

  // Fonction pour naviguer vers le détail du produit
  const handleProductClick = (product) => {
    let category = 'homme';
    if (product.gender === 'men') category = 'homme';
    else if (product.gender === 'women') category = 'femme';
    else if (product.gender === 'children') category = 'enfant';
    else if (product.category === 'shoes') category = 'chaussure';
    else if (product.category === 'bags') category = 'sacs';
    else if (product.category === 'jewelry') category = 'bijoux';
    else if (product.category === 'phone') category = 'telephone_accessoires';
    else if (product.category === 'perruque') category = 'perruque';
    
    navigate(`/product/${category}/${product.sourceId}`);
  };

  // Détecter le scroll pour masquer le header sur mobile
  useEffect(() => {
    let lastScrollY = window.scrollY;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Sur mobile uniquement
      if (window.innerWidth < 1024) {
        if (currentScrollY > 100 && currentScrollY > lastScrollY) {
          // Scroll vers le bas
          setScrolled(true);
        } else if (currentScrollY < lastScrollY) {
          // Scroll vers le haut
          setScrolled(false);
        }
      } else {
        setScrolled(false);
      }
      
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  // Normaliser les produits
  const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  
  const normalizeProduct = (product, category, gender = null) => {
    const brandName = (product.brand || 'Various').toString();
    const brandId = brandName.toLowerCase().replace(/\s+/g, '-');
    return {
      ...product,
      id: `${category}-${product.id}`,
      sourceId: product.id,
      category,
      gender,
      brandId,
      brandName,
      rating: product.rating || +(3.8 + Math.random() * 1.2).toFixed(1),
      reviews: product.reviews || rand(0, 500),
      stock: product.stock || rand(0, 1000),
      sold: product.sold || rand(0, 500),
      features: product.features || ['Produit de qualité'],
      colors: product.colors || [],
      sizes: product.sizes || ['S', 'M', 'L'],
      subCategory: product.gender || product.subCategory,
    };
  };

  // Combiner tous les produits réels
  const products = [
    ...vetement_homme.map(p => normalizeProduct(p, 'clothing', 'men')),
    ...vetement_femme.map(p => normalizeProduct(p, 'clothing', 'women')),
    ...vetement_enfant.map(p => normalizeProduct(p, 'clothing', 'children')),
    ...chaussure.map(p => normalizeProduct(p, 'shoes')),
    ...sacs.map(p => normalizeProduct(p, 'bags')),
    ...bijoux_accessoires.map(p => normalizeProduct(p, 'jewelry')),
    ...telephone_accessoires.map(p => normalizeProduct(p, 'phone')),
    ...perruque.map(p => normalizeProduct(p, 'perruque')),
  ];

  // Catégories principales avec counts dynamiques
  const categories = useMemo(() => [
    {
      id: 'clothing',
      name: 'Vêtements & Accessoires',
      icon: '👕',
      subCategories: [
        { id: 'all', name: 'Tous les vêtements' },
        { id: 'men', name: 'Vêtements Homme' },
        { id: 'women', name: 'Vêtements Femme' },
        { id: 'children', name: 'Vêtements Enfant' },
      ]
    },
    {
      id: 'shoes',
      name: 'Chaussures',
      icon: '👟',
      subCategories: [
        { id: 'all', name: 'Toutes les chaussures' },
      ]
    },
    {
      id: 'bags',
      name: 'Sacs',
      icon: '👜',
      subCategories: [
        { id: 'all', name: 'Tous les sacs' },
      ]
    },
    {
      id: 'jewelry',
      name: 'Bijoux & Accessoires',
      icon: '💎',
      subCategories: [
        { id: 'all', name: 'Tous les bijoux' },
      ]
    },
    {
      id: 'phone',
      name: 'Téléphones & Accessoires',
      icon: '📱',
      subCategories: [
        { id: 'all', name: 'Tous les produits' },
      ]
    },
    {
      id: 'perruque',
      name: 'Perruque & Cheveux',
      icon: '💇',
      subCategories: [
        { id: 'all',         name: 'Toutes les perruques'   },
        { id: 'courte',      name: 'Perruques Courtes'       },
        { id: 'longue',      name: 'Perruques Longues'       },
        { id: 'bresilienne', name: 'Perruques Brésiliennes'  },
      ]
    }
  ], []);

  // Fonction pour calculer les counts dynamiquement
  const getCategoryCount = (categoryId) => {
    return products.filter(p => p.category === categoryId).length;
  };

  const getSubCategoryCount = (categoryId, subCategoryId) => {
    if (subCategoryId === 'all') {
      return products.filter(p => p.category === categoryId).length;
    }
    return products.filter(p => p.category === categoryId && p.gender === subCategoryId).length;
  };

  const getBrandCount = (brandId) => {
    return products.filter(p => 
      p.category === activeCategory &&
      (activeSubCategory === 'all' || p.gender === activeSubCategory) &&
      p.brandId === brandId &&
      p.price >= priceRange[0] && p.price <= priceRange[1]
    ).length;
  };

  // Marques populaires extraites dynamiquement des produits
  const brands = useMemo(() => {
    const brandMap = new Map();
    products.forEach(product => {
      if (!brandMap.has(product.brandId)) {
        brandMap.set(product.brandId, {
          id: product.brandId,
          name: product.brandName
        });
      }
    });
    return Array.from(brandMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [products]);

  const currentCategory = categories.find(cat => cat.id === activeCategory);
  
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Filtre par catégorie
      if (product.category !== activeCategory) return false;
      
      // Filtre par sous-catégorie
      if (activeSubCategory !== 'all' && product.gender !== activeSubCategory) return false;
      
      // Filtre par marque
      if (selectedBrands.length > 0 && !selectedBrands.includes(product.brandId)) return false;
      
      // Filtre par prix
      if (product.price < priceRange[0] || product.price > priceRange[1]) return false;
      
      return true;
    });
  }, [products, activeCategory, activeSubCategory, selectedBrands, priceRange]);

  // Produits ordonnés (pas de tri, ordre d'origine)
  const orderedProducts = useMemo(() => filteredProducts, [filteredProducts]);
  
  // Produits visibles avec infinite scroll
  const visibleProducts = orderedProducts.slice(0, visibleCount);
  const totalProducts = orderedProducts.length;

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeCategory, activeSubCategory, selectedBrands, priceRange]);

  // Infinite scroll observer
  useEffect(() => {
    if (!loadMoreRef.current) return;
    const el = loadMoreRef.current;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && visibleCount < totalProducts) {
          setVisibleCount(prev => Math.min(prev + PAGE_SIZE, totalProducts));
        }
      });
    }, { root: null, rootMargin: '200px', threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [visibleCount, totalProducts]);

  // cart
  const { addItem } = useCart();
  const { format: formatPrice } = usePrice();

  const toggleBrand = (brandId) => {
    setSelectedBrands(prev => 
      prev.includes(brandId) 
        ? prev.filter(b => b !== brandId)
        : [...prev, brandId]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header/>
      {/* En-tête de la catégorie */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {currentCategory.icon} {currentCategory.name}
              </h1>
              <p className="text-gray-600 mt-2">
                Découvrez notre sélection de {currentCategory.name.toLowerCase()} de qualité supérieure
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">
                {totalProducts} produits
              </div>
              <div className="text-sm text-gray-500">
                disponibles
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Drawer Overlay */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[60] lg:hidden"
            onClick={() => setShowFilters(false)}
          />
        )}
      </AnimatePresence>

      {/* Drawer Filtres - Slide from left */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed left-0 top-0 bottom-0 w-80 bg-white z-[70] lg:hidden overflow-y-auto shadow-2xl"
          >
            {/* Header du drawer */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 flex items-center justify-between shadow-md z-10">
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5" />
                <h2 className="text-lg font-semibold">Filtres</h2>
              </div>
              <button
                onClick={() => setShowFilters(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contenu du drawer */}
            <div className="p-4 space-y-6">
              {/* Catégories */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100">
                  <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wide">Catégories</h3>
                </div>
                <div className="p-3 space-y-1">
                  {categories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`w-full text-left px-3 py-2.5 rounded-xl transition-all duration-200 flex items-center justify-between ${
                        activeCategory === category.id
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                          : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'
                      }`}
                    >
                      <span className="text-sm font-medium">{category.icon} {category.name}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                        activeCategory === category.id ? 'bg-white/25 text-white' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {getCategoryCount(category.id)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sous-catégories */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100">
                  <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wide">Sous-catégories</h3>
                </div>
                <div className="p-3 space-y-0.5 max-h-64 overflow-y-auto">
                  {currentCategory.subCategories.map(subCat => (
                    <button
                      key={subCat.id}
                      onClick={() => setActiveSubCategory(subCat.id)}
                      className={`w-full text-left px-3 py-2 rounded-xl transition-all duration-200 flex items-center justify-between border-l-2 ${
                        activeSubCategory === subCat.id
                          ? 'border-blue-600 bg-blue-50 text-blue-700 font-semibold'
                          : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300'
                      }`}
                    >
                      <span className="text-sm">{subCat.name}</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                        activeSubCategory === subCat.id ? 'bg-blue-100 text-blue-700 font-semibold' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {getSubCategoryCount(activeCategory, subCat.id)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Filtre par prix */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900">Fourchette de prix</h3>
                </div>
                <div className="p-4">
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{formatPrice(priceRange[0])}</span>
                      <span>{formatPrice(priceRange[1])}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="500000"
                      step="1000"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setPriceRange([0, 50000])}
                        className="text-xs px-2 py-1 border border-gray-300 rounded hover:border-blue-500"
                      >
                        Moins de 50k
                      </button>
                      <button
                        onClick={() => setPriceRange([50000, 100000])}
                        className="text-xs px-2 py-1 border border-gray-300 rounded hover:border-blue-500"
                      >
                        50k - 100k
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Filtre par marque */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900">Marques</h3>
                </div>
                <div className="p-4 space-y-2">
                  {brands.map(brand => (
                    <label key={brand.id} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand.id)}
                        onChange={() => toggleBrand(brand.id)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{brand.name}</span>
                      <span className="text-xs text-gray-500 ml-auto">({getBrandCount(brand.id)})</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Bouton Appliquer */}
              <button
                onClick={() => setShowFilters(false)}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                Appliquer les filtres
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar - Filtres Desktop */}
          <div className="hidden lg:block lg:w-80 space-y-6">
            {/* Catégories */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100">
                <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wide">Catégories</h3>
              </div>
              <div className="p-3 space-y-1">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl transition-all duration-200 flex items-center justify-between ${
                      activeCategory === category.id
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                        : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'
                    }`}
                  >
                    <span className="text-sm font-medium">{category.icon} {category.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                      activeCategory === category.id ? 'bg-white/25 text-white' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {getCategoryCount(category.id)}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Sous-catégories */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100">
                <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wide">Sous-catégories</h3>
              </div>
              <div className="p-3 space-y-0.5 max-h-96 overflow-y-auto">
                {currentCategory.subCategories.map(subCat => (
                  <button
                    key={subCat.id}
                    onClick={() => setActiveSubCategory(subCat.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl transition-all duration-200 flex items-center justify-between border-l-2 ${
                      activeSubCategory === subCat.id
                        ? 'border-blue-600 bg-blue-50 text-blue-700 font-semibold'
                        : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-sm">{subCat.name}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                      activeSubCategory === subCat.id ? 'bg-blue-100 text-blue-700 font-semibold' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {getSubCategoryCount(activeCategory, subCat.id)}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Filtre par prix */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">Fourchette de prix</h3>
              </div>
              <div className="p-4">
                <div className="space-y-4">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{formatPrice(priceRange[0])}</span>
                    <span>{formatPrice(priceRange[1])}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="500000"
                    step="1000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setPriceRange([0, 50000])}
                      className="text-xs px-2 py-1 border border-gray-300 rounded hover:border-blue-500"
                    >
                      Moins de 50k
                    </button>
                    <button
                      onClick={() => setPriceRange([50000, 100000])}
                      className="text-xs px-2 py-1 border border-gray-300 rounded hover:border-blue-500"
                    >
                      50k - 100k
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Filtre par marque */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">Marques</h3>
              </div>
              <div className="p-4 space-y-2">
                {brands.map(brand => (
                  <label key={brand.id} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand.id)}
                      onChange={() => toggleBrand(brand.id)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="flex-1 text-sm text-gray-700">{brand.name}</span>
                    <span className="text-xs text-gray-500">({getBrandCount(brand.id)})</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Contenu principal */}
          <div className="flex-1">
            {/* Espace pour compenser le fixed position */}
            {scrolled && <div className="h-16 sm:h-20 lg:hidden" />}
            
            {/* Barre d'outils - Toujours visible sur desktop, sticky en haut quand scrolled sur mobile */}
            <div className={`bg-white/95 backdrop-blur-md shadow-md border border-gray-200 p-3 sm:p-4 mb-6 transition-all duration-300 ${
              scrolled 
                ? 'fixed top-0 left-0 right-0 z-50 rounded-none shadow-lg animate-slideDown lg:static lg:rounded-lg lg:shadow-sm lg:bg-white' 
                : 'sticky top-0 z-30 rounded-lg'
            }`}>
              <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 ${scrolled ? 'max-w-7xl mx-auto lg:max-w-none' : ''}`}>
                {/* Bouton Filtres + Sélecteur de tri */}
                <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg font-medium"
                  >
                    <Filter className="w-4 h-4" />
                    <span className="text-sm sm:text-base">Filtres</span>
                  </button>
                </div>

                {/* Sélecteur de vue */}
                <div className="flex items-center space-x-2">
                  <span className="text-xs sm:text-sm text-gray-600 hidden sm:inline">Vue:</span>
                  <div className="flex items-center bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-lg transition-all ${
                        viewMode === 'grid' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'
                      }`}
                    >
                      <Grid className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-lg transition-all ${
                        viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'
                      }`}
                    >
                      <List className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Suppression de l'ancien bloc filtres mobiles */}
            <div className="hidden">
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 pt-4 border-t border-gray-200 lg:hidden"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Prix max</h4>
                        <input
                          type="range"
                          className="w-full"
                          value={priceRange[1]}
                          onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                        />
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Marques</h4>
                        <div className="space-y-1">
                          {brands.slice(0, 3).map(brand => (
                            <label key={brand.id} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={selectedBrands.includes(brand.id)}
                                onChange={() => toggleBrand(brand.id)}
                                className="w-4 h-4"
                              />
                              <span className="text-sm">{brand.name}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Grille des produits */}
            <div className={
              viewMode === 'grid' 
                ? 'grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6'
                : 'space-y-4'
            }>
              {visibleProducts.map(product => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={
                    viewMode === 'grid'
                      ? 'bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow'
                      : 'bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow'
                  }
                >
                  {viewMode === 'grid' ? (
                      <div className="p-2 sm:p-3 md:p-4">
                        {/* Image et badges */}
                        <div className="relative mb-2 sm:mb-3 md:mb-4">
                          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                            <img
                              src={product.image}
                              alt={product.name}
                              onClick={() => handleProductClick(product)}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                            />
                          </div>

                          {/* Actions rapides - Masqué sur mobile */}
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

                          {/* Promotion */}
                          {product.originalPrice > product.price && (
                            <div className="absolute bottom-2 left-2 bg-red-500 text-white px-1.5 py-0.5 sm:px-2 sm:py-1 rounded text-xs sm:text-sm font-bold">
                              -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                            </div>
                          )}
                        </div>

                        {/* Informations produit */}
                        <div className="space-y-2 sm:space-y-3">
                          <div>
                            <h3 className="font-medium text-gray-800 text-sm leading-5 line-clamp-2 mb-1 h-10 overflow-hidden">
                              <span onClick={() => handleProductClick(product)} className="cursor-pointer">{product.name}</span>
                            </h3>
                          </div>
                          {/* Prix */}
                          <div className="space-y-1">
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
                              <span className="truncate">Min: {product.minOrder}</span>
                              <span className={product.taxType === 'ttc' ? 'text-green-600' : 'text-orange-600'}>
                                {product.taxType === 'ttc' ? 'TTC 🚚' : 'HT 📦'}
                              </span>
                            </div>
                          </div>

                          {/* Bouton d'action */}
                          <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-2 sm:py-2.5 md:py-3 px-2 sm:px-3 md:px-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-1 sm:space-x-2 text-xs sm:text-sm"
                            onClick={() => addItem({ productId: product.id, name: product.name, price: product.price, image: product.image, quantity: 1, minOrder: product.minOrder, taxType: product.taxType })}
                          >
                            <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span className="hidden sm:inline">Ajouter au panier</span>
                            <span className="sm:hidden">Panier</span>
                          </button>
                        </div>
                      </div>
                  ) : (
                    <div className="flex space-x-4">
                      <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-base leading-6 line-clamp-2 mb-1 h-12 overflow-hidden">
                          {product.name}
                        </h3>
                        
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${
                                  i < Math.floor(product.rating)
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-gray-600">({product.reviews})</span>
                        </div>

                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                          {product.features.join(' • ')}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <span className="text-lg font-bold text-green-600">
                                {formatPrice(product.price)}
                              </span>
                              {product.originalPrice > product.price && (
                                <span className="text-sm line-through text-gray-400">
                                  {formatPrice(product.originalPrice)}
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-gray-600">
                              Min: {product.minOrder} • {product.taxType === 'ttc' ? 'TTC' : 'HT'}
                            </div>
                          </div>

                          <button
                            onClick={() => addItem({
                              productId: product.id,
                              name: product.name,
                              price: product.price,
                              image: product.image,
                              quantity: 1,
                              minOrder: product.minOrder,
                              taxType: product.taxType,
                              options: {}
                            })}
                            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center space-x-2"
                          >
                            <ShoppingCart className="w-4 h-4" />
                            <span>Panier</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Infinite Scroll Loader */}
            <div className="flex flex-col items-center mt-8">
              {/* Sentinel pour observer le scroll */}
              <div ref={loadMoreRef} className="w-full h-6" />

              {/* Loader pendant le chargement */}
              {visibleCount < totalProducts && totalProducts > 0 && (
                <div className="flex flex-col items-center space-y-3">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                  <p className="text-sm text-gray-500">Chargement de plus de produits...</p>
                </div>
              )}

              {/* Message quand tous les produits sont affichés */}
              {visibleCount >= totalProducts && totalProducts > 0 && (
                <div className="text-sm text-gray-500 mt-4">Tous les produits affichés ({totalProducts})</div>
              )}
            </div>

            {/* Aucun résultat */}
            {totalProducts === 0 && (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Filter className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Aucun produit trouvé
                </h3>
                <p className="text-gray-600 mb-4">
                  Essayez de modifier vos filtres pour voir plus de résultats
                </p>
                <button
                  onClick={() => {
                    setSelectedBrands([]);
                    setPriceRange([0, 500000]);
                    setActiveSubCategory('all');
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg font-medium"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CategoryPage;