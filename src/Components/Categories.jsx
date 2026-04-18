import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Smartphone, Shirt, Heart, Car, Home, Gamepad, Gift, Camera, Watch, BookOpen, Dumbbell, ShoppingBag, MoreHorizontal } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';

const Categories = () => {
  const { t } = useTranslation();
  const scrollContainerRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollTimeoutRef = useRef(null);
  const navigate = useNavigate();

  // Catégories avec icônes
  const categories = [
    {
      id: 1,
      name: t.categoriesSection.electronics.name,
      icon: <Smartphone className="w-8 h-8" />,
      description: t.categoriesSection.electronics.description,
      products: `10K+ ${t.categoriesSection.products}`,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700"
    },
    {
      id: 2,
      name: t.categoriesSection.fashion.name,
      icon: <Shirt className="w-8 h-8" />,
      description: t.categoriesSection.fashion.description,
      products: `25K+ ${t.categoriesSection.products}`,
      color: "from-pink-500 to-pink-600",
      bgColor: "bg-pink-50",
      textColor: "text-pink-700"
    },
    {
      id: 3,
      name: t.categoriesSection.beauty.name,
      icon: <Heart className="w-8 h-8" />,
      description: t.categoriesSection.beauty.description,
      products: `8K+ ${t.categoriesSection.products}`,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-700"
    },
    {
      id: 4,
      name: t.categoriesSection.automotive.name,
      icon: <Car className="w-8 h-8" />,
      description: t.categoriesSection.automotive.description,
      products: `15K+ ${t.categoriesSection.products}`,
      color: "from-red-500 to-red-600",
      bgColor: "bg-red-50",
      textColor: "text-red-700"
    },
    {
      id: 5,
      name: t.categoriesSection.homeGarden.name,
      icon: <Home className="w-8 h-8" />,
      description: t.categoriesSection.homeGarden.description,
      products: `12K+ ${t.categoriesSection.products}`,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      textColor: "text-green-700"
    },
    {
      id: 6,
      name: t.categoriesSection.toys.name,
      icon: <Gamepad className="w-8 h-8" />,
      description: t.categoriesSection.toys.description,
      products: `7K+ ${t.categoriesSection.products}`,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      textColor: "text-orange-700"
    },
    {
      id: 7,
      name: t.categoriesSection.sportsFitness.name,
      icon: <Dumbbell className="w-8 h-8" />,
      description: t.categoriesSection.sportsFitness.description,
      products: `9K+ ${t.categoriesSection.products}`,
      color: "from-cyan-500 to-cyan-600",
      bgColor: "bg-cyan-50",
      textColor: "text-cyan-700"
    },
    {
      id: 8,
      name: t.categoriesSection.luggage.name,
      icon: <ShoppingBag className="w-8 h-8" />,
      description: t.categoriesSection.luggage.description,
      products: `6K+ ${t.categoriesSection.products}`,
      color: "from-amber-500 to-amber-600",
      bgColor: "bg-amber-50",
      textColor: "text-amber-700"
    },
    {
      id: 9,
      name: t.categoriesSection.highTech.name,
      icon: <Camera className="w-8 h-8" />,
      description: t.categoriesSection.highTech.description,
      products: `11K+ ${t.categoriesSection.products}`,
      color: "from-indigo-500 to-indigo-600",
      bgColor: "bg-indigo-50",
      textColor: "text-indigo-700"
    },
    {
      id: 10,
      name: t.categoriesSection.watchesJewelry.name,
      icon: <Watch className="w-8 h-8" />,
      description: t.categoriesSection.watchesJewelry.description,
      products: `5K+ ${t.categoriesSection.products}`,
      color: "from-rose-500 to-rose-600",
      bgColor: "bg-rose-50",
      textColor: "text-rose-700"
    },
    {
      id: 11,
      name: t.categoriesSection.booksEducation.name,
      icon: <BookOpen className="w-8 h-8" />,
      description: t.categoriesSection.booksEducation.description,
      products: `4K+ ${t.categoriesSection.products}`,
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-700"
    },
    {
      id: 12,
      name: t.categoriesSection.giftsArt.name,
      icon: <Gift className="w-8 h-8" />,
      description: t.categoriesSection.giftsArt.description,
      products: `8K+ ${t.categoriesSection.products}`,
      color: "from-fuchsia-500 to-fuchsia-600",
      bgColor: "bg-fuchsia-50",
      textColor: "text-fuchsia-700"
    }
  ];

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const prev = (currentSlide - 1 + categories.length) % categories.length;
      goToSlide(prev);
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const next = (currentSlide + 1) % categories.length;
      goToSlide(next);
    }
  };

  const goToSlide = (index) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const card = container.children[index];
    if (!card) return;
    // small offset to center a bit when there's padding
    container.scrollTo({ left: card.offsetLeft - 8, behavior: 'smooth' });
    setCurrentSlide(index);
  };

  const handleScroll = () => {
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => {
      const container = scrollContainerRef.current;
      if (!container) return;
      const children = Array.from(container.children);
      const scrollLeftPos = container.scrollLeft;
      let nearest = 0;
      let minDiff = Infinity;
      children.forEach((child, idx) => {
        const diff = Math.abs(child.offsetLeft - scrollLeftPos);
        if (diff < minDiff) { minDiff = diff; nearest = idx; }
      });
      setCurrentSlide(nearest);
    }, 120);
  };

  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

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

  const hoverStyle = { y: -8, scale: 1.05, transition: { duration: 0.3, ease: "easeOut" } };

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
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
            {t.categoriesSection.title}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t.categoriesSection.subtitle}
          </p>
        </motion.div>

        {/* Contrôles de navigation : buttons overlay centrés verticalement */}

        {/* Grille des catégories (slider) */}
        <div className="relative mb-6">
          <motion.div
            ref={scrollContainerRef}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            onScroll={handleScroll}
            className="flex gap-6 mb-12 overflow-x-auto scrollbar-hide px-2 snap-x snap-mandatory"
          >
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              variants={itemVariants}
              whileHover={hoverStyle}
              className={`relative bg-white rounded-2xl shadow-lg border border-gray-100 p-6 cursor-pointer group transition-all duration-300 ${category.bgColor} hover:shadow-2xl min-w-[220px] w-72 flex-shrink-0 snap-start ${currentSlide === index ? 'scale-105 z-10' : ''}`}
              onClick={() => navigate('/category')}
            >
              {/* Icône avec fond gradient */}
              <motion.div 
                className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${category.color} flex items-center justify-center text-white mb-4 mx-auto shadow-lg group-hover:shadow-xl transition-shadow`}
                whileHover={{ rotate: [0, -5, 5, 0] }}
                transition={{ duration: 0.5 }}
              >
                {category.icon}
              </motion.div>

              {/* Nom de la catégorie */}
              <h3 className="text-lg font-semibold text-center text-gray-900 mb-2">
                {category.name}
              </h3>

              {/* Description */}
              <p className="text-sm text-gray-600 text-center mb-3">
                {category.description}
              </p>

              {/* Nombre de produits */}
              <div className="text-xs font-medium text-center text-gray-500">
                {category.products}
              </div>

              {/* Effet de surbrillance au hover */}
              <div className={`absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r ${category.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

              {/* Indicateur de hover */}
              <motion.div 
                className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gradient-to-r ${category.color} rounded-full opacity-0 group-hover:opacity-100 transition-opacity`}
                layoutId="activeIndicator"
              />
            </motion.div>
          ))}
          </motion.div>

          {/* Buttons overlay centrés verticalement */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={scrollLeft}
            aria-label="Précédent"
            className="absolute left-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white shadow-lg border border-gray-200 text-gray-600 hover:text-blue-600 hover:border-blue-600 transition-colors z-20"
          >
            <ChevronLeft className="w-6 h-6" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={scrollRight}
            aria-label="Suivant"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white shadow-lg border border-gray-200 text-gray-600 hover:text-blue-600 hover:border-blue-600 transition-colors z-20"
          >
            <ChevronRight className="w-6 h-6" />
          </motion.button>
        </div>

        {/* Bannière promotionnelle */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-white text-center relative overflow-hidden"
        >
          {/* Éléments décoratifs */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-16 -translate-y-16" />
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/10 rounded-full translate-x-24 translate-y-24" />
          
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="relative z-10"
          >
            <h3 className="text-3xl font-bold mb-4">
              {t.categoriesSection.banner.title}
            </h3>
            <p className="text-xl mb-6 opacity-90">
              {t.categoriesSection.banner.subtitle}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-shadow"
              onClick={() => navigate(`/category`)}
            >
              <MoreHorizontal className="w-5 h-5 inline mr-2" />
              {t.categoriesSection.banner.button}
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      {/* Styles pour masquer la scrollbar */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default Categories;