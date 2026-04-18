import { motion } from 'framer-motion';
import { Home, Search, ArrowLeft, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl w-full text-center"
        >
          {/* Illustration 404 */}
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="mb-8"
          >
            <div className="relative inline-block">
              <h1 className="text-[150px] sm:text-[200px] md:text-[250px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 leading-none">
                404
              </h1>
              <motion.div
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 3,
                  ease: "easeInOut"
                }}
                className="absolute -top-8 -right-8 sm:-right-12"
              >
                <div className="w-16 h-16 sm:w-24 sm:h-24 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                  <Search className="w-8 h-8 sm:w-12 sm:h-12 text-yellow-900" />
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Message d'erreur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Oups ! Page introuvable
            </h2>
            <p className="text-base sm:text-lg text-gray-600 mb-2">
              La page que vous recherchez n'existe pas ou a été déplacée.
            </p>
            <p className="text-sm sm:text-base text-gray-500">
              Vérifiez l'URL ou retournez à l'accueil pour continuer vos achats.
            </p>
          </motion.div>

          {/* Boutons d'action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
          >
            <button
              onClick={() => navigate('/')}
              className="group w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2 transform hover:scale-105"
            >
              <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>Retour à l'Accueil</span>
            </button>

            <button
              onClick={() => navigate(-1)}
              className="group w-full sm:w-auto border-2 border-gray-300 hover:border-blue-600 text-gray-700 hover:text-blue-600 px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 transform hover:scale-105"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span>Page Précédente</span>
            </button>
          </motion.div>

          {/* Suggestions de catégories */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="bg-white rounded-2xl shadow-xl p-6 sm:p-8"
          >
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center justify-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-blue-600" />
              <span>Découvrez nos catégories</span>
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {[
                { name: 'Vêtements', path: '/clothing', emoji: '👕', color: 'from-pink-500 to-rose-500' },
                { name: 'Chaussures', path: '/shoes', emoji: '👟', color: 'from-blue-500 to-cyan-500' },
                { name: 'Sacs', path: '/bags', emoji: '👜', color: 'from-purple-500 to-pink-500' },
                { name: 'Bijoux', path: '/bijou', emoji: '💎', color: 'from-yellow-500 to-orange-500' }
              ].map((category, index) => (
                <motion.button
                  key={category.path}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  onClick={() => navigate(category.path)}
                  className="group relative overflow-hidden bg-gradient-to-br hover:shadow-lg transition-all duration-300 rounded-xl p-4 sm:p-6 transform hover:scale-105"
                  style={{ 
                    background: `linear-gradient(to bottom right, var(--tw-gradient-stops))` 
                  }}
                  whileHover={{ y: -4 }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-90`} />
                  <div className="relative z-10">
                    <div className="text-3xl sm:text-4xl mb-2 group-hover:scale-110 transition-transform">
                      {category.emoji}
                    </div>
                    <p className="text-white font-semibold text-sm sm:text-base">
                      {category.name}
                    </p>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Message d'assistance */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-8 text-gray-500 text-sm"
          >
            <p>
              Besoin d'aide ? {' '}
              <button 
                onClick={() => navigate('/')}
                className="text-blue-600 hover:text-blue-700 font-semibold underline"
              >
                Contactez notre support
              </button>
            </p>
          </motion.div>
        </motion.div>
    </div>
  );
};

export default NotFound;
