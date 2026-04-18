import { useState, useEffect, useMemo, useRef, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Filter, Grid, List, Star, Heart, ShoppingCart, ChevronDown,
  Sliders, Truck, Shield, Clock, Users, TrendingUp, Check, Eye, X,
  Zap, Crown, Sparkles, LayoutGrid, Baby, Shirt, Dumbbell, Briefcase, Wind
} from 'lucide-react';
import SubCategoryNav from '../Components/SubCategoryNav';
import { vetement_homme } from '../data/vetement_homme';
import { vetement_femme } from '../data/vetement_femme';
import { vetement_enfant } from '../data/vetement_enfant';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import { useCart } from '../context/CartContext';
import { usePrice } from '../hooks/usePrice';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import { translateProductName } from '../data/translations';


const CLOTHING_ICONS = {
  all:        <LayoutGrid className="w-4 h-4" />,
  men:        <Users      className="w-4 h-4" />,
  women:      <Heart      className="w-4 h-4" />,
  child:      <Baby       className="w-4 h-4" />,
  maillot:    <Zap        className="w-4 h-4" />,
  tshirts:    <Shirt      className="w-4 h-4" />,
  shirts:     <Shirt      className="w-4 h-4" />,
  pants:      <Briefcase  className="w-4 h-4" />,
  dresses:    <Crown      className="w-4 h-4" />,
  sportswear: <Dumbbell   className="w-4 h-4" />,
  suits:      <Briefcase  className="w-4 h-4" />,
  jackets:    <Wind       className="w-4 h-4" />,
};

const ClothingCategoryPage = () => {
  const { language } = useTranslation();
  const [activeSubCategory, setActiveSubCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [priceRange, setPriceRange] = useState([0, 500000]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  // Données de la catégorie Vêtements
  const categoryData = {
    id: 'clothing',
    name: 'Vêtements & Accessoires',
    icon: '👕',
    description: 'Découvrez notre collection exclusive de vêtements et accessoires de mode directement des meilleurs fournisseurs chinois. Qualité premium, prix d\'usine.',
    bannerImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    features: [
      { icon: <Shield className="w-6 h-6" />, text: 'Qualité garantie' },
      { icon: <Truck className="w-6 h-6" />, text: 'Livraison mondiale' },
      { icon: <Clock className="w-6 h-6" />, text: 'Support 24/7' },
      { icon: <Users className="w-6 h-6" />, text: 'Fournisseurs vérifiés' }
    ]
  };

  const computedSubIds = ['all','men','women','child','maillot','tshirts','shirts','pants','dresses','sportswear','suits','jackets']

  // measure header height so the sub-categories nav can stick just below it
  const [headerHeight, setHeaderHeight] = useState(0)
  const subCategoryRef = useRef(null)
  
  useLayoutEffect(() => {
    function measure() {
      const hdr = document.querySelector('header')
      if (hdr) {
        const rect = hdr.getBoundingClientRect()
        const h = Math.ceil(rect.height)
        setHeaderHeight(h)
      }
    }
    
    // Mesurer immédiatement
    measure()
    
    // Mesurer après un court délai pour s'assurer que le header est complètement rendu
    const timeout = setTimeout(measure, 100)
    
    // Mesurer lors du resize
    window.addEventListener('resize', measure)
    
    // Mesurer lors du scroll pour corriger les variations
    window.addEventListener('scroll', measure, { passive: true })
    
    // Mesurer après le chargement complet
    window.addEventListener('load', measure)
    
    return () => {
      clearTimeout(timeout)
      window.removeEventListener('resize', measure)
      window.removeEventListener('scroll', measure)
      window.removeEventListener('load', measure)
    }
  }, [])

  // Fixer la barre de sous-catégories sous le header sur mobile dès que l'on scrolle
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerWidth < 1024) {
        setScrolled(window.scrollY > 250);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [])

  // Filtres avancés
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];
  // dériver les couleurs et marques depuis les données
  const colorPool = {
    'Noir': '#000000', 'Blanc': '#FFFFFF', 'Bleu': '#3B82F6', 'Rouge': '#EF4444',
    'Vert': '#10B981', 'Jaune': '#F59E0B', 'Rose': '#EC4899', 'Gris': '#6B7280', 'Beige': '#F5F0E1'
  }

  const colors = Object.keys(colorPool).map(name => ({ name, value: colorPool[name] }))

  // Utiliser les produits générés dans `vetement_homme` et `vetement_femme` et normaliser les champs attendus par l'UI
  const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

  const normalizeProduct = (product, gender) => {
    const brandName = (product.brand || 'Various').toString()
    const brandId = brandName.toLowerCase().replace(/\s+/g, '-')
    return {
      ...product,
      id: `${gender}-${product.id}`,
      sourceId: product.id,
      gender,
      brandId,
      brandName,
      supplier: product.supplier || 'Fournisseur',
      features: product.features || ['Produit de qualité'],
      rating: product.rating || +(3.8 + Math.random() * 1.2).toFixed(1),
      reviews: product.reviews || rand(0, 500),
      stock: product.stock || rand(0, 1000),
      sold: product.sold || rand(0, 500),
      delivery: product.delivery || '7-14 jours',
      subCategory: product.subCategory || null,
      colors: product.colors || [],
      sizes: product.sizes || ['S','M','L'],
    }
  }

  const products = [
    ...vetement_homme.map(p => normalizeProduct(p, 'men')),
    ...vetement_femme.map(p => normalizeProduct(p, 'women')),
    ...vetement_enfant.map(p => normalizeProduct(p, 'child')),
  ]

  const subCategories = computedSubIds.map(id => {
    const count = products.filter(product => {
      if (id === 'all') return true
      if (id === 'men') return product.gender === 'men'
      if (id === 'women') return product.gender === 'women'
      if (id === 'child') return product.gender === 'child'
      return (product.subCategory && product.subCategory === id) || (product.category && product.category === id)
    }).length
    return {
      id,
      name: id === 'all' ? 'Tous les vêtements' : (
        id === 'men' ? 'Vêtements Homme' :
        id === 'women' ? 'Vêtements Femme' :
        id === 'child' ? 'Vêtements Enfant' :
        id === 'maillot' ? 'Maillots de foot' :
        id === 'tshirts' ? 'T-Shirts' :
        id === 'shirts' ? 'Chemises' :
        id === 'pants' ? 'Pantalons' :
        id === 'dresses' ? 'Robes' :
        id === 'sportswear' ? 'Vêtements Sport' :
        id === 'suits' ? 'Costumes' :
        id === 'jackets' ? 'Vestes & Manteaux' : id
      ),
      count,
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=500&q=80'
    }
  })

  // marques dérivées dynamiquement (id = lowercased name)
  const brandMap = {}
  products.forEach(p => {
    const id = p.brandId || 'various'
    if (!brandMap[id]) {
      brandMap[id] = { id, name: p.brandName || 'Various', count: 0 }
    }
    brandMap[id].count++
  })
  const brands = Object.values(brandMap).sort((a,b)=>b.count-a.count)

  const filteredProducts = products.filter(product => {
    const matchesSub = (() => {
      if (activeSubCategory === 'all') return true
      if (activeSubCategory === 'men') return product.gender === 'men'
      if (activeSubCategory === 'women') return product.gender === 'women'
      if (activeSubCategory === 'child') return product.gender === 'child'
      return product.subCategory === activeSubCategory || product.category === activeSubCategory
    })()
    const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brandId)
    const matchesSize = selectedSizes.length === 0 || (product.sizes && product.sizes.some(size => selectedSizes.includes(size)))
    const matchesColor = selectedColors.length === 0 || (product.colors && product.colors.some(color => selectedColors.includes(color)))
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]
    return matchesSub && matchesBrand && matchesSize && matchesColor && matchesPrice
  })
  const navigate = useNavigate()
  const { addItem } = useCart();

  // Infinite scroll / loader
  const PAGE_SIZE = 12
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const loadMoreRef = useRef(null)

  // Pas de tri, juste retourner les produits filtrés dans leur ordre d'origine
  const orderedProducts = useMemo(() => {
    return filteredProducts
  }, [filteredProducts])

  const visibleProducts = orderedProducts.slice(0, visibleCount)

  // reset visible count when filters/subcategory change
  useEffect(() => {
    setVisibleCount(PAGE_SIZE)
    // Scroll vers le haut quand on change de filtre/catégorie
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [activeSubCategory, selectedBrands, selectedSizes, selectedColors, priceRange])

  // Utiliser orderedProducts.length au lieu de filteredProducts.length
  const totalProducts = orderedProducts.length

  useEffect(() => {
    if (!loadMoreRef.current) return
    const el = loadMoreRef.current
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && visibleCount < totalProducts) {
          setVisibleCount(prev => Math.min(prev + PAGE_SIZE, totalProducts))
        }
      })
    }, { root: null, rootMargin: '200px', threshold: 0.1 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [visibleCount, totalProducts])

  const { format: formatPrice } = usePrice();

  const toggleFilter = (filterArray, setFilterArray, value) => {
    setFilterArray(prev => 
      prev.includes(value) 
        ? prev.filter(item => item !== value)
        : [...prev, value]
    );
  };

  // Helper function to get translated product name
  const getProductName = (product) => {
    return translateProductName(product.name, language);
  };

  const currentSubCategory = subCategories.find(sub => sub.id === activeSubCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header/>
      {/* Bannière Hero */}
      <div className="relative bg-gradient-to-r from-blue-900 to-purple-800 text-white">
        <div className="absolute inset-0">
          <img
            src={categoryData.bannerImage}
            alt={categoryData.name}
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <div className="text-6xl mb-4">{categoryData.icon}</div>
              <h1 className="text-5xl font-bold mb-4">{categoryData.name}</h1>
              <p className="text-xl opacity-90 max-w-3xl mx-auto leading-relaxed">
                {categoryData.description}
              </p>
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap justify-center gap-6 mt-8"
            >
              {categoryData.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full">
                  {feature.icon}
                  <span className="text-sm">{feature.text}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

  {/* Spacer pour compenser la hauteur du nav fixe */}
  {scrolled && <div className="h-[52px] lg:hidden" />}

  {/* Navigation des sous-catégories */}
  <SubCategoryNav
    ref={subCategoryRef}
    items={subCategories}
    active={activeSubCategory}
    onChange={setActiveSubCategory}
    iconMap={CLOTHING_ICONS}
    scrolled={scrolled}
    headerHeight={headerHeight}
  />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Contenu principal */}
          <div className="flex-1">
            {/* En-tête de la sous-catégorie */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {currentSubCategory?.name}
                  </h2>
                  <p className="text-gray-600">
                    {totalProducts} produit{totalProducts > 1 ? 's' : ''} disponible{totalProducts > 1 ? 's' : ''}
                    {selectedBrands.length > 0 && ` • ${selectedBrands.length} marque${selectedBrands.length > 1 ? 's' : ''} sélectionnée${selectedBrands.length > 1 ? 's' : ''}`}
                  </p>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-lg transition-colors ${
                        viewMode === 'grid' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400'
                      }`}
                    >
                      <Grid className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-lg transition-colors ${
                        viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400'
                      }`}
                    >
                      <List className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Grille des produits - 2 colonnes sur mobile */}
            <div className={
              viewMode === 'grid' 
                ? 'grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 md:gap-6'
                : 'space-y-4'
            }>
              {visibleProducts.map(product => (
                  <div
                    key={product.id}
                    className={
                      viewMode === 'grid'
                        ? 'bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group'
                        : 'bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300'
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
                              onClick={() => navigate(`/product/${product.gender === 'men' ? 'homme' : product.gender === 'women' ? 'femme' : 'enfant'}/${product.sourceId}`)}
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
                              <span onClick={() => navigate(`/product/${product.gender === 'men' ? 'homme' : product.gender === 'women' ? 'femme' : 'enfant'}/${product.sourceId}`)} className="cursor-pointer">{getProductName(product)}</span>
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
                      // Vue liste
                      <div className="flex space-x-6">
                        <div className="w-32 h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={product.image}
                            alt={product.name}
                            onClick={() => navigate(`/product/${product.gender === 'men' ? 'homme' : product.gender === 'women' ? 'femme' : 'enfant'}/${product.sourceId}`)}
                            className="w-full h-full object-cover cursor-pointer"
                          />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="font-semibold text-gray-900 text-base leading-6 line-clamp-2 mb-1 h-12 overflow-hidden">
                                <span onClick={() => navigate(`/product/${product.gender === 'men' ? 'homme' : product.gender === 'women' ? 'femme' : 'enfant'}/${product.sourceId}`)} className="cursor-pointer">{getProductName(product)}</span>
                              </h3>
                              
                            </div>

                            <div className="text-right">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="text-2xl font-bold text-green-600">
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

                          <p className="text-gray-600 mb-4 line-clamp-2">
                            {product.features.join(' • ')}
                          </p>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-600">Couleurs:</span>
                                <div className="flex space-x-1">
                                  {product.colors.slice(0, 3).map((color, index) => (
                                    <div
                                      key={index}
                                      className="w-4 h-4 rounded-full border border-gray-300"
                                      style={{ 
                                        backgroundColor: colors.find(c => c.name === color)?.value || '#ccc' 
                                      }}
                                      title={color}
                                    />
                                  ))}
                                  {product.colors.length > 3 && (
                                    <span className="text-xs text-gray-500">
                                      +{product.colors.length - 3}
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-600">Tailles:</span>
                                <div className="flex space-x-1">
                                  {product.sizes.slice(0, 4).map((size, index) => (
                                    <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
                                      {size}
                                    </span>
                                  ))}
                                  {product.sizes.length > 4 && (
                                    <span className="text-xs text-gray-500">
                                      +{product.sizes.length - 4}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg font-semibold transition-colors flex items-center space-x-2"
                              onClick={() => addItem({ productId: product.id, name: product.name, price: product.price, image: product.image, quantity: 1, minOrder: product.minOrder, taxType: product.taxType })}
                            >
                              <ShoppingCart className="w-4 h-4" />
                              <span>Panier</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
            </div>

            {/* Infinite scroll loader */}
            <div className="flex flex-col items-center mt-8">
              {/* sentinel pour observer le scroll */}
              <div ref={loadMoreRef} className="w-full h-6" />

              {/* show a hint if all loaded */}
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
                  Essayez de modifier vos critères de recherche ou réinitialisez les filtres pour voir plus de résultats.
                </p>
                <button
                  onClick={() => {
                    setSelectedBrands([]);
                    setSelectedSizes([]);
                    setSelectedColors([]);
                    setPriceRange([0, 500000]);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 rounded-lg font-semibold transition-colors"
                >
                  Réinitialiser tous les filtres
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
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
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Contenu du quick view */}
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
                  <div>
                    <img
                      src={quickViewProduct.image}
                      alt={getProductName(quickViewProduct)}
                      className="w-full h-96 object-cover rounded-lg"
                    />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold mb-2">{getProductName(quickViewProduct)}</h4>
                    <p className="text-gray-600 mb-4">{quickViewProduct.supplier}</p>
                    
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
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>Min: {quickViewProduct.minOrder}</span>
                        <span className={quickViewProduct.taxType === 'ttc' ? 'text-green-600' : 'text-orange-600'}>
                          {quickViewProduct.taxType === 'ttc' ? 'TTC' : 'HT'}
                        </span>
                        <span>Livraison: {quickViewProduct.delivery}</span>
                      </div>

                      <button
                        onClick={() => {
                          setQuickViewProduct(null)
                          navigate(`/product/${quickViewProduct.gender === 'men' ? 'homme' : quickViewProduct.gender === 'women' ? 'femme' : 'enfant'}/${quickViewProduct.sourceId}`)
                        }}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
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

export default ClothingCategoryPage;