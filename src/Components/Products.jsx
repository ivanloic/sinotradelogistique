import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Heart, Star, Truck, Shield, Zap, Clock, Eye, CheckCircle, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { usePrice } from '../hooks/usePrice';
import { useTranslation } from '../hooks/useTranslation';
import { vetement_homme } from '../data/vetement_homme';
import { vetement_femme } from '../data/vetement_femme';
import { chaussure } from '../data/chaussure';
import { sacs } from '../data/sacs';
import { bijoux_accessoires } from '../data/bijoux_accessoires';
import { telephone_accessoires } from '../data/telephone_accessoires';

const Products = () => {
  const [activeTab, setActiveTab] = useState('featured');
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ show: false, product: null });
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { t } = useTranslation();

  // Combiner tous les produits avec des IDs uniques
  const allProducts = useMemo(() => {
    const addCategory = (products, categoryName) => 
      products.map(p => ({ ...p, uniqueId: `${categoryName}_${p.id}`, sourceCategory: categoryName }));
    
    return [
      ...addCategory(vetement_homme, 'homme'),
      ...addCategory(vetement_femme, 'femme'),
      ...addCategory(chaussure, 'chaussure'),
      ...addCategory(sacs, 'sacs'),
      ...addCategory(bijoux_accessoires, 'bijoux'),
      ...addCategory(telephone_accessoires, 'telephone_accessoires')
    ];
  }, []);

  // Fonction pour sélectionner des produits aléatoires
  const getRandomProducts = (count) => {
    const shuffled = [...allProducts].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  };

  // Fonction pour obtenir les produits avec les meilleures promotions
  const getBestDeals = (count) => {
    const productsWithDiscount = allProducts
      .filter(p => p.originalPrice > p.price)
      .sort((a, b) => {
        const discountA = ((a.originalPrice - a.price) / a.originalPrice) * 100;
        const discountB = ((b.originalPrice - b.price) / b.originalPrice) * 100;
        return discountB - discountA;
      });
    return productsWithDiscount.slice(0, count);
  };

  // Générer les produits pour chaque catégorie (regénéré à chaque rendu pour être aléatoire)
  const products = useMemo(() => ({
    featured: getRandomProducts(8),
    new: getRandomProducts(8),
    sale: getBestDeals(8)
  }), [allProducts]);

  const { format: formatPrice } = usePrice();

  // Fonction pour naviguer vers le détail du produit
  const navigateToProduct = (product) => {
    const category = product.sourceCategory || 'homme';
    navigate(`/product/${category}/${product.id}`);
  };

  const calculateDiscount = (price, originalPrice) => {
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  };

  const handleAddToCart = (product) => {
    addItem({ 
      productId: product.id, 
      name: product.name, 
      price: product.price, 
      image: product.image, 
      quantity: 1, 
      minOrder: product.minOrder, 
      taxType: product.taxType 
    });
    setConfirmModal({ show: true, product });
    setTimeout(() => setConfirmModal({ show: false, product: null }), 8000);
  };

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
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <section className="py-6 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* En-tête de section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {t.home.popularProducts}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t.home.fromChina}
          </p>
        </motion.div>

        {/* Onglets de navigation */}
        <div className="flex justify-center mb-6 sm:mb-8 md:mb-12 px-2">
          <div className="bg-gray-100 rounded-xl sm:rounded-2xl p-1 sm:p-2 flex space-x-1 sm:space-x-2 w-full max-w-md sm:max-w-none sm:w-auto">
            {[
              { id: 'featured', label: t.product.featured, icon: <Star className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" /> },
              { id: 'new', label: t.product.newArrivals, icon: <Zap className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" /> },
              { id: 'sale', label: t.product.promotions, icon: <Clock className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center justify-center gap-1 sm:gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 md:px-6 md:py-3 rounded-lg sm:rounded-xl font-semibold transition-all duration-300 flex-1 sm:flex-initial text-[10px] sm:text-xs md:text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-600 shadow-lg'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Grille des produits */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 md:gap-6 lg:gap-8"
          >
            {products[activeTab].map((product) => (
              <motion.div
                key={product.id}
                variants={itemVariants}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 group"
                onMouseEnter={() => setHoveredProduct(product.id)}
                onMouseLeave={() => setHoveredProduct(null)}
              >
            

                {/* Contenu du produit */}
                <div className="p-2 sm:p-3 md:p-4">
                  {/* Image et badges */}
                  <div className="relative mb-2 sm:mb-3 md:mb-4">
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        onClick={() => navigateToProduct(product)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                      />
                    </div>

                    {/* Actions rapides - Masqué sur mobile */}
                    <div className="absolute top-2 right-2 hidden sm:flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50">
                        <Heart className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => navigateToProduct(product)}
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
                        <span onClick={() => navigateToProduct(product)} className="cursor-pointer hover:text-blue-600 transition-colors">{product.name}</span>
                      </h3>
                      {product.brand && (
                        <p className="text-xs text-gray-500">{product.brand}</p>
                      )}
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
                      onClick={() => handleAddToCart(product)}
                    >
                      <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">Ajouter au panier</span>
                      <span className="sm:hidden">Panier</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Bouton Voir Plus */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <button
            onClick={() => navigate('/category')}
            className="bg-gray-900 hover:bg-black text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors duration-300 flex items-center space-x-2 mx-auto">
            <span>{t.home.allProducts}</span>
          </button>
        </motion.div>
      </div>

      {/* Modal de confirmation */}
      <AnimatePresence>
        {confirmModal.show && confirmModal.product && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] px-4"
            onClick={() => setConfirmModal({ show: false, product: null })}
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Bouton fermer */}
              <button
                onClick={() => setConfirmModal({ show: false, product: null })}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Icône de succès */}
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
              </div>

              {/* Titre */}
              <h3 className="text-2xl font-bold text-gray-900 text-center mb-4">
                Produit ajouté au panier !
              </h3>

              {/* Détails du produit */}
              <div className="flex items-center space-x-4 mb-6 bg-gray-50 p-4 rounded-xl">
                <img
                  src={confirmModal.product.image}
                  alt={confirmModal.product.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 line-clamp-2 mb-1">
                    {confirmModal.product.name}
                  </h4>
                  <p className="text-lg font-bold text-green-600">
                    {formatPrice(confirmModal.product.price)}
                  </p>
                </div>
              </div>

              {/* Boutons d'action */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setConfirmModal({ show: false, product: null })}
                  className="flex-1 border-2 border-gray-300 hover:border-gray-400 text-gray-700 py-3 px-4 rounded-xl font-semibold transition-all duration-300"
                >
                  Continuer mes achats
                </button>
                <button
                  onClick={() => {
                    setConfirmModal({ show: false, product: null });
                    navigate('/cart');
                  }}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Voir le panier</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Products;