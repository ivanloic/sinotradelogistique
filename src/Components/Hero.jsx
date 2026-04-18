import { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, ShoppingCart, Star, Truck, Shield, Clock } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { usePrice } from '../hooks/usePrice';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import ContactModal from './ContactModal';
import { vetement_homme } from '../data/vetement_homme';
import { vetement_femme } from '../data/vetement_femme';
import { chaussure } from '../data/chaussure';
import { sacs } from '../data/sacs';
import { bijoux_accessoires } from '../data/bijoux_accessoires';
import { telephone_accessoires } from '../data/telephone_accessoires';

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { t } = useTranslation();
  const { format: formatPrice } = usePrice();
  const { addItem } = useCart();
  const navigate = useNavigate();

  // Fonction pour naviguer vers le détail du produit
  const navigateToProduct = (product) => {
    const category = product.sourceCategory || 'homme';
    navigate(`/product/${category}/${product.id}`);
  };

  // État pour le modal de contact
  const [showContactModal, setShowContactModal] = useState(false);

  // Slides mettant en avant nos avantages et services
  const slides = [
    {
      id: 1,
      image: "/bannier/sac1.png",
      title: "IMPORTATION DIRECTE DE CHINE",
      subtitle: "Prix d'Usine • Sans Intermédiaire",
      description: "Économisez jusqu'à 60% en achetant directement depuis nos partenaires chinois vérifiés",
      highlight: "Économisez jusqu'à 60%",
      buttonText: "Découvrir Nos Produits",
      badge: "PRIX D'USINE",
      action: "bags", // Redirige vers la page sacs
      advantage: "💰 Meilleurs Prix Garantis"
    },
    {
      id: 2,
      image: "/bannier/montre.png",
      title: "LIVRAISON GROUPÉE",
      subtitle: "Réduisez Vos Coûts de Transport",
      description: "Profitez de notre système de groupage pour des frais de livraison réduits et optimisés",
      highlight: "Livraison Économique",
      buttonText: "En Savoir Plus",
      badge: "GROUPAGE",
      action: "contact", // Ouvre le modal de contact
      advantage: "📦 Frais de Port Réduits"
    },
    {
      id: 3,
      image: "/bannier/iphone.png",
      title: "LARGE CATALOGUE",
      subtitle: "Des Milliers de Produits Disponibles",
      description: "Mode, électronique, accessoires, bijoux... Tout ce dont vous avez besoin en un seul endroit",
      highlight: "1000+ Produits",
      buttonText: "Explorer Le Catalogue",
      badge: "NOUVEAUTÉS",
      action: "category", // Redirige vers la page catégories
      advantage: "🛍️ Choix Illimité"
    },
    {
      id: 4,
      image: "/bannier/choes.png",
      title: "ACCOMPAGNEMENT PERSONNALISÉ",
      subtitle: "Support 24/7 • Conseil d'Expert",
      description: "Notre équipe vous accompagne de la commande à la réception pour une expérience sans souci",
      highlight: "Support Dédié",
      buttonText: "Nous Contacter",
      badge: "SUPPORT PRO",
      action: "contact", // Ouvre le modal de contact
      advantage: "💬 Assistance Continue"
    }
  ];

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

  // Sélectionner 4 produits aléatoires avec les meilleures promotions
  const featuredProducts = useMemo(() => {
    const productsWithDiscount = allProducts
      .filter(p => p.originalPrice > p.price)
      .sort((a, b) => {
        const discountA = ((a.originalPrice - a.price) / a.originalPrice) * 100;
        const discountB = ((b.originalPrice - b.price) / b.originalPrice) * 100;
        return discountB - discountA;
      })
      .slice(0, 4);
    return productsWithDiscount;
  }, [allProducts]);

  // Avantages
  const features = [
    {
      icon: <Truck className="w-8 h-8" />,
      title: t.common.fastShipping,
      description: t.common.fastShippingDesc
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: t.common.securePayment,
      description: t.common.securePaymentDesc
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: t.common.support247,
      description: t.common.support247Desc
    }
  ];

  // Navigation automatique du carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <section className="relative bg-gray-50">
      {/* Carousel Hero - Hauteur responsive */}
      <div className="relative h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="relative h-full w-full">
              {/* Image de fond - Responsive */}
              <img 
                src={slide.image}
                alt={slide.title}
                className="absolute inset-0 w-full h-full object-cover object-center"
              />
              
              {/* Overlay gradient - Plus visible sur mobile */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/30 sm:from-black/70 sm:via-black/50 sm:to-black/20" />
              
              {/* Contenu - Responsive */}
              <div className="relative max-w-7xl mx-auto h-full flex items-center px-4 sm:px-6 lg:px-8">
                <div className="text-white max-w-full sm:max-w-xl lg:max-w-2xl">
                  {/* Badge - Taille responsive */}
                  <span className="inline-block bg-red-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold mb-2 sm:mb-4">
                    {slide.badge}
                  </span>
                  
                  {/* Titre - Taille responsive */}
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-4 leading-tight">
                    {slide.title}
                  </h1>
                  <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold mb-2 sm:mb-4 text-blue-300">
                    {slide.subtitle}
                  </h2>
                  
                  {/* Description - Cache sur très petit écran */}
                  <p className="hidden sm:block text-sm sm:text-base md:text-lg lg:text-xl mb-4 sm:mb-6 text-gray-200">
                    {slide.description}
                  </p>
                  
                  {/* Avantage Principal - Responsive */}
                  <div className="flex items-center gap-3 mb-4 sm:mb-6 bg-white/10 backdrop-blur-sm px-4 py-3 rounded-lg border border-white/20">
                    <div className="text-3xl sm:text-4xl">{slide.advantage.split(' ')[0]}</div>
                    <div>
                      <p className="text-base sm:text-lg lg:text-xl font-bold text-yellow-300">
                        {slide.highlight}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-300">
                        {slide.advantage.split(' ').slice(1).join(' ')}
                      </p>
                    </div>
                  </div>
                  
                  {/* Bouton d'action - Responsive avec navigation */}
                  <button 
                    onClick={() => {
                      if (slide.action === 'contact') {
                        setShowContactModal(true);
                      } else if (slide.action === 'bags') {
                        navigate('/bags');
                      } else if (slide.action === 'category') {
                        navigate('/category');
                      }
                    }}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2.5 sm:px-6 sm:py-3 lg:px-8 lg:py-4 rounded-lg font-semibold text-sm sm:text-base lg:text-lg flex items-center space-x-2 transition-all duration-300 transform hover:scale-105 shadow-xl"
                  >
                    <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="truncate">{slide.buttonText}</span>
                  </button>
                  
                  {/* Garantie de satisfaction - Responsive */}
                  <div className="mt-3 sm:mt-4 flex items-center space-x-2 text-gray-300 text-xs sm:text-sm">
                    <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
                    <span>✓ Satisfaction garantie • Support 24/7 • Paiement sécurisé</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Contrôles de navigation - Responsive */}
        <button
          onClick={prevSlide}
          className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 sm:p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 sm:p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
        
        {/* Indicateurs de slide - Responsive */}
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 sm:space-x-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-white w-6 sm:w-8' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Modal de Contact */}
      <ContactModal 
        isOpen={showContactModal} 
        onClose={() => setShowContactModal(false)} 
      />
    </section>
  );
};

export default Hero;