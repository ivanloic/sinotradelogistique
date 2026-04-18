import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Heart, Share2, Truck, Shield, Check, Star, ArrowLeft, Minus, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import ContactModal from '../Components/ContactModal';
import { useCart } from '../context/CartContext';
import { usePrice } from '../hooks/usePrice';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { vetement_homme } from '../data/vetement_homme';
import { vetement_femme } from '../data/vetement_femme';
import { vetement_enfant } from '../data/vetement_enfant';
import { chaussure } from '../data/chaussure';
import { sacs } from '../data/sacs';
import { bijoux_accessoires } from '../data/bijoux_accessoires';
import { telephone_accessoires } from '../data/telephone_accessoires';
import { perruque } from '../data/perruque';

const SPEC_LABELS = {
  stockage: 'Stockage', ram: 'RAM', ecran: 'Écran',
  processeur: 'Processeur', batterie: 'Batterie',
  camera_arriere: 'Caméra arrière', camera_avant: 'Caméra avant',
  sim: 'SIM', connectivite: 'Connectivité', etat: 'État',
  puissance: 'Puissance', bluetooth: 'Bluetooth',
  autonomie: 'Autonomie', autonomie_ecouteurs: 'Autonomie écouteurs',
  autonomie_totale: 'Autonomie totale (avec étui)',
  interfaces: 'Interfaces', etancheite: 'Étanchéité',
  eclairage: 'Éclairage', type_connexion: 'Connexion',
  reduction_bruit: 'Réduction de bruit', driver: 'Driver',
  charge: 'Charge', gaming: 'Gaming', microphone: 'Microphone',
  connecteur: 'Connecteur', longueur_cable: 'Longueur câble',
  qualite_audio: 'Qualité audio', affichage: 'Affichage',
  compatibilite: 'Compatibilité', fonctions_sante: 'Fonctions santé',
}

const ProductDetail = () => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const navigate = useNavigate();
  const [selectedBrands, setSelectedBrands] = useState([])
  const [allBrandsSelected, setAllBrandsSelected] = useState(false)
  const [selectedColors, setSelectedColors] = useState([])
  const [selectedSize, setSelectedSize] = useState(null)
  // for clothing (non-shoe) allow selecting multiple sizes
  const [selectedSizes, setSelectedSizes] = useState([])
  const [sizeMap, setSizeMap] = useState({})
  const [showContactModal, setShowContactModal] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const location = useLocation();
  const { category, id } = useParams(); // Récupérer depuis l'URL
  
  console.log('📍 useParams:', { category, id });
  
  // Support à la fois URL params et location.state
  const incomingId = id ? parseInt(id) : (location?.state?.productId ?? null)
  const incomingCategory = category || location?.state?.category || null
  const incomingGender = location?.state?.productGender ?? null
  const incomingProductType = location?.state?.productType ?? null // 'shoe' pour chaussures
  const incomingShoeType = location?.state?.shoeType ?? null // 'homme', 'femme', 'enfant'

  // product state
  const [product, setProduct] = useState(null);

  const { addItem } = useCart();

  // refs for thumbnail scrolling/visibility
  const thumbsRef = useRef([]);
  const thumbsContainerRef = useRef(null);

  // Fonction pour afficher le toast
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  // When navigated with a productId, try to load it from the appropriate dataset
  useEffect(() => {
    if (!incomingId) return;
    try {
      const normalizedId = incomingId?.toString();
      console.log('🔍 Recherche produit - ID:', normalizedId, 'Category:', incomingCategory, 'Gender:', incomingGender, 'Type:', incomingProductType);
      
      // Sélectionner le bon dataset selon le type de produit ou la catégorie URL
      let datasets = [];
      let resolvedCategory = incomingCategory;

      // Priorité à la catégorie depuis l'URL (depuis l'autocomplétion)
      if (incomingCategory === 'shoes' || incomingCategory === 'chaussure') {
        datasets = [chaussure]; resolvedCategory = 'chaussure';
      } else if (incomingCategory === 'men' || incomingCategory === 'homme') {
        datasets = [vetement_homme]; resolvedCategory = 'homme';
      } else if (incomingCategory === 'women' || incomingCategory === 'femme') {
        datasets = [vetement_femme]; resolvedCategory = 'femme';
      } else if (incomingCategory === 'enfant' || incomingCategory === 'child') {
        datasets = [vetement_enfant]; resolvedCategory = 'enfant';
      } else if (incomingCategory === 'bags' || incomingCategory === 'sacs' || incomingGender === 'sacs') {
        datasets = [sacs]; resolvedCategory = 'sacs';
      } else if (incomingCategory === 'jewelry' || incomingCategory === 'bijoux') {
        datasets = [bijoux_accessoires]; resolvedCategory = 'bijoux';
      } else if (incomingCategory === 'telephone_accessoires') {
        datasets = [telephone_accessoires]; resolvedCategory = 'telephone_accessoires';
      } else if (incomingCategory === 'perruque') {
        datasets = [perruque]; resolvedCategory = 'perruque';
      } else if (incomingProductType === 'shoe') {
        datasets = [chaussure]; resolvedCategory = 'chaussure';
      } else {
        // Fallback: use gender hints if available
        if (incomingGender === 'women') {
          datasets = [vetement_femme, vetement_homme]; resolvedCategory = 'femme';
        } else if (incomingGender === 'men') {
          datasets = [vetement_homme, vetement_femme]; resolvedCategory = 'homme';
        } else {
          datasets = [vetement_homme, vetement_femme];
        }
      }

      console.log('📦 Datasets à rechercher:', datasets.length, 'dataset(s)');
      
      let found = null;
      for (const dataSet of datasets) {
        found = dataSet.find(p => p.id?.toString() === normalizedId);
        if (found) {
          console.log('✅ Produit trouvé:', found.name, 'ID:', found.id, 'Catégorie:', found.category);
          break;
        }
      }
      
      if (!found) {
        console.log('❌ Produit non trouvé avec ID:', normalizedId);
      }

      if (found) {
        // Tri des images : l'image sans numéro entre parenthèses vient en premier
        const rawImages = found.images || (found.image ? [found.image] : ['/placeholder-product.jpg']);
        const hasNumberedSuffix = (imgPath) => {
          const filename = imgPath.split('/').pop() || imgPath;
          return /\(\d+\)\.[^.]+$/.test(filename);
        };
        const cleanImgs = rawImages.filter(img => !hasNumberedSuffix(img));
        const numberedImgs = rawImages.filter(img => hasNumberedSuffix(img));
        const sortedImages = cleanImgs.length > 0 ? [...cleanImgs, ...numberedImgs] : rawImages;

        const normalized = {
          id: found.id,
          name: found.name || found.title || 'Produit',
          category: found.category || found.subCategory || (
            incomingProductType === 'shoe' ? 'Chaussures' : 
            incomingCategory === 'jewelry' ? 'Bijoux' :
            incomingCategory === 'bags' ? 'Sacs' :
            incomingCategory === 'telephone_accessoires' ? 'Téléphones & Accessoires' : 'Vêtements'
          ),
          price: found.price || found.cost || 0,
          originalPrice: found.originalPrice || found.price || found.cost || 0,
          minOrder: found.minOrder || found.min || 1,
          taxType: found.taxType || 'ttc',
          rating: found.rating || 4.0,
          reviews: found.reviews || 0,
          stock: found.stock || 0,
          sold: found.sold || 0,
          shipping: found.shipping || '',
          warranty: found.warranty || '12 mois',
          badge: found.badge || null,
          images: sortedImages,
          specifications: found.specifications || (incomingProductType === 'shoe' ? {
            'Type': found.shoeType === 'homme' ? 'Chaussures Homme' : found.shoeType === 'femme' ? 'Chaussures Femme' : 'Chaussures Enfant',
            'Marque': found.brand || 'Various',
            'Catégorie': found.category || 'Chaussures',
            'Pointures': found.sizes ? `${found.sizes[0]} - ${found.sizes[found.sizes.length - 1]}` : 'Multiples',
            'Couleurs': found.colors ? found.colors.join(', ') : 'Variées'
          } : {}),
          description: found.description || (found.features ? found.features.join(' • ') : 
            incomingProductType === 'shoe' 
              ? `Découvrez ces chaussures de qualité supérieure. Confort et style garantis. Disponibles en plusieurs pointures et couleurs.`
              : `Produit de qualité premium. Découvrez cet article exceptionnel.`),
          features: found.features || [],
          colors: found.colors || [],
          sizes: found.sizes || [],
          clothbrands: found.clothbrands || found.clothBrands || found.shoebrands || [],
          categoryLabel: found.categoryLabel || null,
          tags: found.tags || [],
          shoeType: found.shoeType || incomingShoeType || null, // homme, femme, enfant
          productType: incomingProductType || 'clothing',
          _sourceCategory: resolvedCategory   // identifie le dataset source sans ambiguïté
        };
        setProduct(normalized);
        return;
      }
    } catch (e) {
      console.warn('Failed to load product by id', incomingId, e)
    }
    // Si aucun produit n'est trouvé, rediriger vers l'accueil
    if (!incomingId) {
      console.log('⚠️ Aucun ID de produit fourni, redirection vers l\'accueil');
      navigate('/');
    }
  }, [incomingId, incomingCategory, incomingGender, incomingProductType, incomingShoeType, navigate]);

  // Produits similaires - Dynamiques basés sur le dataset réel
  const similarProducts = (() => {
    if (!product) return [];

    // Utiliser _sourceCategory en priorité (fiable) puis les params d'URL/state
    const srcCat = product._sourceCategory || incomingCategory;
    let sourceDataset = [];

    if (incomingProductType === 'shoe' || srcCat === 'chaussure' || srcCat === 'shoes') {
      sourceDataset = chaussure;
    } else if (srcCat === 'sacs' || srcCat === 'bags') {
      sourceDataset = sacs;
    } else if (srcCat === 'bijoux' || srcCat === 'jewelry' || srcCat === 'bijoux_accessoires') {
      sourceDataset = bijoux_accessoires;
    } else if (srcCat === 'telephone_accessoires') {
      sourceDataset = telephone_accessoires;
    } else if (srcCat === 'perruque') {
      sourceDataset = perruque;
    } else if (srcCat === 'homme' || srcCat === 'men' || incomingGender === 'men') {
      sourceDataset = vetement_homme;
    } else if (srcCat === 'femme' || srcCat === 'women' || incomingGender === 'women') {
      sourceDataset = vetement_femme;
    } else if (srcCat === 'enfant' || srcCat === 'child') {
      sourceDataset = vetement_enfant;
    } else {
      sourceDataset = [...vetement_homme, ...vetement_femme];
    }

    // Filtrer pour exclure le produit actuel et obtenir 4 produits aléatoires
    const filtered = sourceDataset
      .filter(p => p.id !== product.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 4);

    return filtered;
  })();

  const { format: formatPrice } = usePrice();

  // Helper pour déterminer la catégorie d'un produit
  // Utilise l'égalité de référence (===) car similarProducts renvoie des objets bruts
  // du dataset source — évite les faux positifs dus aux IDs identiques entre datasets.
  const getProductCategory = (prod) => {
    if (prod._sourceCategory) return prod._sourceCategory;
    if (telephone_accessoires.some(p => p === prod)) return 'telephone_accessoires';
    if (chaussure.some(p => p === prod)) return 'chaussure';
    if (sacs.some(p => p === prod)) return 'sacs';
    if (bijoux_accessoires.some(p => p === prod)) return 'bijoux';
    if (perruque.some(p => p === prod)) return 'perruque';
    if (vetement_homme.some(p => p === prod)) return 'homme';
    if (vetement_femme.some(p => p === prod)) return 'femme';
    if (vetement_enfant.some(p => p === prod)) return 'enfant';
    return 'homme';
  };

  // Helpers to convert color names (often in French) to CSS color values (hex)
  const colorNameToHexMap = {
    // Couleurs de base
    'noir': '#1a1a1a',
    'blanc': '#ffffff',
    'rouge': '#e53935',
    'bleu': '#1976d2',
    'vert': '#2e7d32',
    'jaune': '#f9a825',
    'gris': '#757575',
    'marron': '#6d4c41',
    'rose': '#e91e8c',
    'violet': '#7b1fa2',
    'beige': '#d7c4a0',
    'orange': '#ef6c00',
    'kaki': '#78866b',
    'brown': '#6d4c41',
    // Couleurs supplémentaires
    'argent': '#b8b8b8',
    'argenté': '#b8b8b8',
    'argente': '#b8b8b8',
    'bordeaux': '#7b1c2e',
    'bronze': '#cd7f32',
    'camel': '#c19a6b',
    'crème': '#fffdd0',
    'creme': '#fffdd0',
    'doré': '#c9a84c',
    'dore': '#c9a84c',
    'or': '#c9a84c',
    'écru': '#f0ead6',
    'ecru': '#f0ead6',
    'lilas': '#c8a2c8',
    'marine': '#001f5b',
    'navy': '#001f5b',
    'rose gold': '#b76e79',
    'taupe': '#7a6b5a',
    'titane': '#878681',
    'titanium': '#878681',
    'turquoise': '#00897b',
    'cyan': '#00bcd4',
    'corail': '#ff6f61',
    'coral': '#ff6f61',
    'emeraude': '#009688',
    'ivoire': '#fffff0',
    'lavande': '#9575cd',
    'lavender': '#9575cd',
    'ocre': '#cc7722',
    'terracotta': '#c05c4a',
    'blanc cassé': '#f5f0e8',
  };

  const toHex = (col) => {
    if (!col) return null;
    const s = String(col).trim();
    // If already a hex or rgb/rgba value, return as-is
    if (s.startsWith('#') || s.startsWith('rgb')) return s;
    const lower = s.toLowerCase();
    if (colorNameToHexMap[lower]) return colorNameToHexMap[lower];
    // try using the string as a CSS color keyword (browser will resolve it) — fallback to null
    return lower;
  };

  // Basic luminance check for hex colors to choose icon color
  const isLightColor = (hexLike) => {
    if (!hexLike) return false;
    let hex = hexLike;
    // if rgb(...) try to estimate (very basic)
    if (hex.startsWith('rgb')) {
      const nums = hex.match(/\d+/g);
      if (!nums) return false;
      const r = +nums[0], g = +nums[1], b = +nums[2];
      const lum = (0.299*r + 0.587*g + 0.114*b) / 255;
      return lum > 0.75;
    }
    if (!hex.startsWith('#')) {
      // unknown keyword — assume dark
      return false;
    }
    // normalize #RGB to #RRGGBB
    if (hex.length === 4) {
      hex = '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
    }
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    const lum = (0.299*r + 0.587*g + 0.114*b) / 255;
    return lum > 0.75;
  };

  const calculateDiscount = () => {
    return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  };

  const totalPrice = product?.price ? product.price * quantity : 0;

  // derive if product is shoe
  const isShoe = (product?.category && /shoe|chauss|chaussure|sneaker/i.test(product.category)) || (product?.name && /shoe|chauss|chaussure|sneaker/i.test(product.name))

  // initialize brands selection if product has clothbrands
  useEffect(() => {
    if (product?.clothbrands && Array.isArray(product.clothbrands)) {
      setSelectedBrands([])
      setAllBrandsSelected(false)
    }
  }, [product?.id])

  // Ensure quantity starts at product.minOrder when a product is loaded/changed
  useEffect(() => {
    const min = product?.minOrder || 1;
    setQuantity(min);
  }, [product?.id]);

  // build a simulated size->color availability map for shoes (if not provided) - Ancien système
  useEffect(() => {
    if (!product) return;
    // Ce useEffect est pour l'ancien système de chaussures (basé sur isShoe)
    // Les nouvelles chaussures utilisent product.productType === 'shoe'
    if (!isShoe || product.productType === 'shoe') return
    const colors = product.colors && product.colors.length ? product.colors : ['Noir']
    // default shoe sizes (EU)
    const defaultSizes = [36,37,38,39,40,41,42,43,44,45]
    const map = {}
    colors.forEach((c, idx) => {
      // create a pseudo-random subset based on color index so it's stable per render
      const start = idx % (defaultSizes.length - 4)
      const count = 5 + (idx % 3) // between 5 and 7 sizes
      map[c] = defaultSizes.slice(start, Math.min(start + count, defaultSizes.length))
    })
    setSizeMap(map)
    // set default selected color(s)/size: select first color by default
    setSelectedColors([colors[0]])
    setSelectedSize(map[colors[0]] ? map[colors[0]][0] : null)
  }, [product?.id, isShoe])

  // Initialiser selectedSizes pour les nouvelles chaussures
  useEffect(() => {
    if (!product) return;
    if (product.productType === 'shoe') {
      // Pour les nouvelles chaussures, on réinitialise selectedSizes
      setSelectedSizes([]);
      setSelectedSize(null);
    }
  }, [product?.id, product?.productType]);

  // for non-shoe products, pick a default size when product changes
  useEffect(() => {
    if (!product) return;
    // for non-shoe products we clear single-size (used for shoes) and reset multi-selection
    if (isShoe || product.productType === 'shoe') return;
    if (product.sizes && product.sizes.length) {
      setSelectedSize(null);
      setSelectedSizes([]);
    } else {
      setSelectedSize(null);
      setSelectedSizes([]);
    }
  }, [product?.id, isShoe]);

  // Scroll to top when component mounts or product changes
  useEffect(() => {
    if (!product) return;
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [product?.id]);

  // when selectedImage changes ensure its thumbnail is visible in the horizontal list
  useEffect(() => {
    if (!product || !thumbsRef.current) return;
    const el = thumbsRef.current[selectedImage];
    if (el && typeof el.scrollIntoView === 'function') {
      try {
        el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      } catch (e) {
        // fallback: set scrollLeft on container
        if (thumbsContainerRef.current) {
          const container = thumbsContainerRef.current;
          const left = el.offsetLeft - (container.offsetWidth / 2) + (el.offsetWidth / 2);
          container.scrollTo({ left, behavior: 'smooth' });
        }
      }
    }
  }, [selectedImage, product?.images?.length, product]);

  // Afficher un message de chargement si le produit n'est pas encore chargé
  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement du produit...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <nav className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <button onClick={() => navigate(-1)} className="flex items-center space-x-1 hover:text-gray-900">
              <ArrowLeft className="w-4 h-4" />
              <span>Retour</span>
            </button>
            {/* <span>/</span>
            <span>{product.category}</span> */}
            <span>/</span>
            <span className="text-gray-900 truncate">{product.name}</span>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Galerie d'images */}
          <div className="flex gap-3 items-start">
            {/* Miniatures verticales à gauche */}
            <div ref={thumbsContainerRef} className="flex flex-col gap-2 overflow-y-auto" style={{maxHeight: '500px'}}>
              {product.images.map((image, index) => (
                <button
                  ref={(el) => (thumbsRef.current[index] = el)}
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-14 aspect-[3/4] bg-gray-50 rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? 'border-black' : 'border-transparent'
                  }`}
                >
                  <img
                    src={image}
                    alt={`Vue ${index + 1}`}
                    className="w-full h-full object-contain"
                  />
                </button>
              ))}
            </div>

              {/* Image principale - slider */}
              <div className="flex-1 relative aspect-[3/4] bg-gray-50 rounded-lg overflow-hidden">
                <AnimatePresence initial={false} mode="wait">
                  <motion.img
                    key={selectedImage}
                    src={product.images[selectedImage]}
                    alt={`${product.name} - vue ${selectedImage + 1}`}
                    className="w-full h-full object-contain absolute inset-0"
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -100, opacity: 0 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    onDragEnd={(e, info) => {
                      if (info.offset.x > 50) {
                        // swipe right -> previous
                        setSelectedImage((i) => (i - 1 + product.images.length) % product.images.length);
                      } else if (info.offset.x < -50) {
                        // swipe left -> next
                        setSelectedImage((i) => (i + 1) % product.images.length);
                      }
                    }}
                  />
                </AnimatePresence>

                {/* Prev / Next buttons */}
                <button
                  aria-label="Image précédente"
                  onClick={() => setSelectedImage((i) => (i - 1 + product.images.length) % product.images.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <button
                  aria-label="Image suivante"
                  onClick={() => setSelectedImage((i) => (i + 1) % product.images.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Dots inside the main image frame (center bottom) */}
                <div className="absolute left-1/2 -translate-x-1/2 bottom-3 flex items-center space-x-2 bg-black/40 px-3 py-1 rounded">
                  {product.images.map((_, idx) => (
                    <button
                      key={idx}
                      aria-label={`Aller à l'image ${idx + 1}`}
                      onClick={() => setSelectedImage(idx)}
                      className={`w-2 h-2 rounded-full ${selectedImage === idx ? 'bg-white' : 'bg-white/50'}`}
                    />
                  ))}
                </div>
              </div>
          </div>

          {/* Informations produit */}
          <div className="space-y-6">
            {/* En-tête */}
            <div>
              {/* Badge type de chaussure */}
              {product.shoeType && (
                <div className="mb-3">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                    product.shoeType === 'homme' ? 'bg-blue-100 text-blue-700' :
                    product.shoeType === 'femme' ? 'bg-pink-100 text-pink-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {product.shoeType === 'homme' ? '👨 Chaussures Homme' :
                     product.shoeType === 'femme' ? '👩 Chaussures Femme' :
                     '👶 Chaussures Enfant'}
                  </span>
                </div>
              )}

              {/* Badge catégorie spécifique — vêtements femme */}
              {product.categoryLabel && product._sourceCategory === 'femme' && (
                <div className="mb-3">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold bg-pink-50 text-pink-700 border border-pink-200">
                    👗 {product.categoryLabel}
                  </span>
                </div>
              )}
              <h1 className="text-lg font-semibold text-gray-900 mb-2">
                {product.name.toLowerCase().replace(/(^\w|\s\w)/g, c => c.toUpperCase())}
              </h1>
            </div>

            {/* Prix */}
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <span className="text-3xl font-bold text-gray-900">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice > product.price && (
                  <>
                    <span className="text-xl line-through text-gray-400">
                      {formatPrice(product.originalPrice)}
                    </span>
                    <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm font-medium">
                      -{calculateDiscount()}%
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Informations importantes */}
            <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Commande minimum:</span>
                <span className="font-medium">
                  {product.minOrder} {product.minOrder > 1 ? 'unités' : 'unité'}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Fiscalité:</span>
                <span className={`font-medium ${
                  product.taxType === 'ttc' ? 'text-green-600' : 'text-orange-600'
                }`}>
                  {product.taxType === 'ttc' ? 'TTC (Transport inclus)' : 'HT (Hors transport)'}
                </span>
              </div>

            </div>

            {/* Tags — vêtements femme uniquement */}
            {product.tags && product.tags.length > 0 && product._sourceCategory === 'femme' && (
              <div className="flex flex-wrap gap-2">
                {product.tags.map(tag => (
                  <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Multimarque */}
            {product.clothbrands && Array.isArray(product.clothbrands) && product.clothbrands.length > 0 && (
              <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">
                    {product.productType === 'shoe' ? 'Marques de chaussures disponibles' : 'Marques disponibles'}
                  </h4>
                  <button
                    onClick={() => {
                      if (allBrandsSelected) {
                        setSelectedBrands([])
                        setAllBrandsSelected(false)
                      } else {
                        setSelectedBrands(product.clothbrands.slice())
                        setAllBrandsSelected(true)
                      }
                    }}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {allBrandsSelected ? 'Tout désélectionner' : 'Tout sélectionner'}
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {product.clothbrands.map((b) => {
                    const checked = selectedBrands.includes(b)
                    return (
                      <label key={b} className="flex items-center space-x-2 p-2 border rounded hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedBrands(prev => {
                                const next = [...prev, b]
                                if (next.length === product.clothbrands.length) setAllBrandsSelected(true)
                                return next
                              })
                            } else {
                              setSelectedBrands(prev => prev.filter(x => x !== b))
                              setAllBrandsSelected(false)
                            }
                          }}
                          className="cursor-pointer"
                        />
                        <span className="text-sm">{b}</span>
                      </label>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Couleurs / Miniatures photos */}
            {getProductCategory(product) === 'telephone_accessoires' ? (
              product.images && product.images.length > 1 && (
                <div className="mt-4">
                  <label className="text-sm font-medium text-gray-900">
                    Couleur
                    {selectedColors.length > 0 && (
                      <span className="ml-2 text-blue-600 font-semibold">{selectedColors[0]}</span>
                    )}
                  </label>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {product.images.map((img, idx) => {
                      const colorForIdx = product.colors?.[idx]
                      const isSelected = selectedImage === idx
                      return (
                        <button
                          key={idx}
                          onClick={() => {
                            setSelectedImage(idx)
                            if (colorForIdx) setSelectedColors([colorForIdx])
                          }}
                          title={colorForIdx || `Photo ${idx + 1}`}
                          className={`w-14 h-14 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all duration-200 ${
                            isSelected
                              ? 'border-blue-500 ring-2 ring-blue-200 shadow-md scale-105'
                              : 'border-gray-200 hover:border-blue-300 hover:shadow-sm'
                          }`}
                        >
                          <img src={img} alt={colorForIdx || `Photo ${idx + 1}`} className="w-full h-full object-cover" />
                        </button>
                      )
                    })}
                  </div>
                </div>
              )
            ) : (
              product.colors && product.colors.length > 0 && (
                <div className="mt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <label className="text-sm font-medium text-gray-900">Couleur</label>
                    {selectedColors.length > 0 && (
                      <span className="text-sm text-blue-600 font-semibold">{selectedColors.join(', ')}</span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-3 mt-1">
                    {product.colors.map((c) => {
                      const hex = toHex(c);
                      const checked = selectedColors.includes(c);
                      const light = isLightColor(hex);
                      return (
                        <button
                          key={c}
                          onClick={() => {
                            setSelectedColors(prev => {
                              const exists = prev.includes(c);
                              let next;
                              if (exists) {
                                next = prev.filter(x => x !== c);
                              } else {
                                next = [...prev, c];
                              }
                              if (!exists && next.length === 1 && isShoe && sizeMap[c] && sizeMap[c].length) {
                                setSelectedSize(sizeMap[c][0]);
                              }
                              if (exists && next.length === 0) {
                                setSelectedSize(null);
                              }
                              return next;
                            })
                          }}
                          title={c}
                          className={`flex flex-col items-center gap-1 group focus:outline-none`}
                        >
                          <span
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                              checked
                                ? 'ring-2 ring-offset-2 ring-blue-500 scale-110 shadow-md'
                                : 'hover:scale-105 hover:shadow-sm'
                            } ${
                              light ? 'border-2 border-gray-300' : 'border border-gray-200'
                            }`}
                            style={{ backgroundColor: hex }}
                          >
                            {checked && (
                              <Check className={`w-3.5 h-3.5 ${light ? 'text-gray-800' : 'text-white'}`} />
                            )}
                          </span>
                          <span className={`text-xs leading-tight max-w-[3.5rem] text-center break-words ${
                            checked ? 'text-blue-600 font-semibold' : 'text-gray-600'
                          }`}>{c}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )
            )}

            {/* Pointures pour chaussures - Sélection multiple */}
            {product.productType === 'shoe' && product.sizes && product.sizes.length > 0 && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-gray-900 flex items-center gap-2">
                    <span>Pointures disponibles (sélection multiple)</span>
                    {product.shoeType && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-white">
                        {product.shoeType === 'homme' ? '👨 Homme (39-46)' : 
                         product.shoeType === 'femme' ? '👩 Femme (35-42)' : 
                         '👶 Enfant (24-38)'}
                      </span>
                    )}
                  </label>
                  {selectedSizes.length > 0 && (
                    <button
                      onClick={() => setSelectedSizes([])}
                      className="text-xs text-blue-600 hover:text-blue-800 underline"
                    >
                      Tout désélectionner
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {product.sizes.map(size => {
                    const isSelected = selectedSizes.includes(size);
                    return (
                      <button
                        key={size}
                        onClick={() => {
                          setSelectedSizes(prev => {
                            if (prev.includes(size)) {
                              return prev.filter(s => s !== size);
                            } else {
                              return [...prev, size];
                            }
                          });
                        }}
                        className={`px-4 py-2 border-2 rounded-lg font-semibold transition-all ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-105' 
                            : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                        }`}
                      >
                        {size}
                        {isSelected && (
                          <Check className="inline-block w-4 h-4 ml-1" />
                        )}
                      </button>
                    );
                  })}
                </div>
                {selectedSizes.length === 0 && (
                  <p className="text-sm text-orange-600 mt-2">⚠️ Veuillez sélectionner au moins une pointure</p>
                )}
                {selectedSizes.length > 0 && (
                  <div className="mt-3 p-2 bg-white rounded border border-blue-300">
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">{selectedSizes.length}</span> pointure{selectedSizes.length > 1 ? 's' : ''} sélectionnée{selectedSizes.length > 1 ? 's' : ''}: 
                      <span className="ml-2 font-medium text-blue-700">
                        {selectedSizes.sort((a, b) => Number(a) - Number(b)).join(', ')}
                      </span>
                    </p>
                  </div>
                )}
              </div>
            )}
            
            {/* Tailles pour chaussures (ancien système - liées à la couleur) */}
            {isShoe && !product.productType && selectedColors.length > 0 && (
              <div className="mt-4">
                <label className="text-sm font-medium text-gray-900">Tailles disponibles ({selectedColors[0]})</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {(sizeMap[selectedColors[0]] || []).map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-3 py-1 border rounded ${selectedSize === size ? 'bg-blue-600 text-white' : 'bg-white'} `}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Tailles pour vêtements (non-chaussures) */}
            {!isShoe && product.sizes && product.sizes.length > 0 && (
              <div className="mt-4">
                <label className="text-sm font-medium text-gray-900">Tailles</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {product.sizes.map(size => {
                    const checked = selectedSizes.includes(size);
                    return (
                      <button
                        key={size}
                        onClick={() => {
                          setSelectedSizes(prev => {
                            if (prev.includes(size)) return prev.filter(s => s !== size);
                            return [...prev, size];
                          })
                        }}
                        className={`px-3 py-1 border rounded ${checked ? 'bg-blue-600 text-white' : 'bg-white'}`}
                        aria-pressed={checked}
                      >
                        {size}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Quantité */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-900">
                Quantité:
              </label>
              <div className="flex items-center space-x-3">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(product.minOrder, quantity - 1))}
                    className={`p-3 transition-colors ${quantity <= (product?.minOrder || 1) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
                    disabled={quantity <= (product?.minOrder || 1)}
                    aria-label="Diminuer la quantité"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-2 min-w-12 text-center font-medium">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-gray-100 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-sm text-gray-600">
                  Minimum: {product.minOrder} unité{product.minOrder > 1 ? 's' : ''}
                </span>
              </div>
            </div>

            {/* Prix total */}
            <div className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-900">Total:</span>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {formatPrice(totalPrice)}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-2 flex items-center gap-2">
                <span className={`inline-block w-2 h-2 rounded-full ${product.taxType === 'ttc' ? 'bg-green-500' : 'bg-orange-500'}`}></span>
                {product.taxType === 'ttc' 
                  ? 'Prix TTC - Transport inclus' 
                  : 'Prix HT - Transport non inclus'
                }
              </p>
            </div>

            {/* Actions - Boutons améliorés */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6">
              <button
                onClick={() => {
                  // Validation pour les chaussures
                  if (product.productType === 'shoe' && selectedSizes.length === 0) {
                    showToast('⚠️ Veuillez sélectionner au moins une pointure', 'warning');
                    return;
                  }
                  
                  // Validation pour les vêtements non-chaussures
                  if (!product.productType && !isShoe && selectedSizes.length === 0 && product.sizes && product.sizes.length > 0) {
                    showToast('⚠️ Veuillez sélectionner au moins une taille', 'warning');
                    return;
                  }
                  
                  const options = {
                    brands: selectedBrands,
                    colors: selectedColors,
                    sizes: selectedSizes // Toujours utiliser selectedSizes (tableau)
                  };
                  const payload = {
                    productId: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.images && product.images[0],
                    quantity,
                    minOrder: product.minOrder,
                    taxType: product.taxType,
                    options
                  };
                  addItem(payload);
                  // quick UX feedback
                  showToast('✅ Produit ajouté au panier avec succès !', 'success');
                }}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 px-8 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2 transform hover:scale-[1.02]"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Ajouter au panier</span>
              </button>
              {/* Handler pour Acheter maintenant : ajoute au panier puis redirige vers la page de checkout */}
              <button
                onClick={() => {
                  // Validation pour les chaussures
                  if (product.productType === 'shoe' && selectedSizes.length === 0) {
                    showToast('⚠️ Veuillez sélectionner au moins une pointure', 'warning');
                    return;
                  }
                  // Validation pour les vêtements non-chaussures
                  if (!product.productType && !isShoe && selectedSizes.length === 0 && product.sizes && product.sizes.length > 0) {
                    showToast('⚠️ Veuillez sélectionner au moins une taille', 'warning');
                    return;
                  }

                  const options = {
                    brands: selectedBrands,
                    colors: selectedColors,
                    sizes: selectedSizes
                  };

                  const payload = {
                    productId: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.images && product.images[0],
                    quantity,
                    minOrder: product.minOrder,
                    taxType: product.taxType,
                    options
                  };

                  // Ajouter au panier puis rediriger vers Checkout
                  addItem(payload);
                  showToast('✅ Produit ajouté. Redirection vers le paiement...', 'success');
                  // Petit délai pour montrer le toast puis rediriger
                  setTimeout(() => {
                    navigate('/Checkout');
                  }, 500);
                }}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-4 px-8 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2 transform hover:scale-[1.02]"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Achetez et payez</span>
              </button>
            </div>

            {/* Actions secondaires */}
            <div className="flex space-x-4">
              <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors">
                <Heart className="w-5 h-5" />
                <span>Ajouter aux favoris</span>
              </button>
              
              <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors">
                <Share2 className="w-5 h-5" />
                <span>Partager</span>
              </button>
            </div>

            {/* Spécifications produit */}
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div className="mt-6 rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 bg-gray-900">
                  <span className="text-xs font-bold text-white uppercase tracking-widest">Spécifications</span>
                </div>
                <div>
                  {Object.entries(product.specifications).map(([k, v], idx) => (
                    <div
                      key={k}
                      className={`flex justify-between items-start px-4 py-2.5 text-sm ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                    >
                      <span className="text-gray-500 shrink-0 mr-4">{SPEC_LABELS[k] || k}</span>
                      <span className="font-semibold text-gray-900 text-right">{String(v)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Produits similaires */}
        {similarProducts.length > 0 && (
          <div className="mt-16 border-t border-gray-200 pt-16">
            <h3 className="text-2xl font-semibold mb-8">Produits similaires</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {similarProducts.map((similarProduct) => (
                <motion.div
                  key={similarProduct.id}
                  whileHover={{ y: -4 }}
                  className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
                  onClick={() => {
                    // Déterminer la catégorie du produit similaire
                    const category = getProductCategory(similarProduct);
                    navigate(`/product/${category}/${similarProduct.id}`);
                  }}
                >
                  <div className="aspect-square bg-gray-100">
                    <img
                      src={similarProduct.image}
                      alt={similarProduct.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  
                  <div className="p-2 sm:p-3 md:p-4">
                    <h4 className="font-medium text-gray-800 text-sm leading-5 line-clamp-2 mb-1 sm:mb-2 h-10 overflow-hidden">
                      {similarProduct.name}
                    </h4>
                    
                    <div className="flex items-center space-x-1 sm:space-x-2 mb-2 sm:mb-3">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-2 h-2 sm:w-3 sm:h-3 ${
                              i < Math.floor(similarProduct.rating || 4)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1 sm:space-y-2">
                      <div className="flex items-center space-x-1 sm:space-x-2 flex-wrap">
                        <span className="font-bold text-gray-900 text-sm sm:text-base md:text-lg">
                          {formatPrice(similarProduct.price)}
                        </span>
                        {similarProduct.originalPrice > similarProduct.price && (
                          <span className="text-xs sm:text-sm line-through text-gray-400">
                            {formatPrice(similarProduct.originalPrice)}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex flex-col sm:flex-row sm:justify-between text-xs sm:text-sm text-gray-600 gap-1">
                        <span className="truncate">Min: {similarProduct.minOrder}</span>
                        <span className={similarProduct.taxType === 'ttc' ? 'text-green-600' : 'text-orange-600'}>
                          {similarProduct.taxType === 'ttc' ? 'TTC' : 'HT'}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
      
      {/* Contact Modal */}
      <ContactModal 
        isOpen={showContactModal} 
        onClose={() => setShowContactModal(false)} 
      />

      {/* Toast Notification */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.8 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed top-8 right-8 z-[9999] max-w-md"
          >
            <div className={`
              ${toast.type === 'success' ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 
                toast.type === 'warning' ? 'bg-gradient-to-r from-orange-500 to-amber-600' : 
                'bg-gradient-to-r from-red-500 to-rose-600'}
              text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center space-x-3 backdrop-blur-sm
            `}>
              <div className="flex-shrink-0">
                {toast.type === 'success' ? (
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <Check className="w-6 h-6" />
                  </div>
                ) : (
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <ShoppingCart className="w-6 h-6" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-lg">{toast.message}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductDetail;