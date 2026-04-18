import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, X, ShoppingCart, Heart, ArrowLeft, Tag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useTranslations } from '../data/translations';
import { useLanguage } from '../context/LanguageContext';
import { usePrice } from '../hooks/usePrice';
import { chaussure }            from '../data/chaussure';
import { vetement_homme }       from '../data/vetement_homme';
import { vetement_femme }       from '../data/vetement_femme';
import { vetement_enfant }      from '../data/vetement_enfant';
import { bijoux_accessoires }   from '../data/bijoux_accessoires';
import { sacs }                 from '../data/sacs';
import { telephone_accessoires }from '../data/telephone_accessoires';
import { perruque }             from '../data/perruque';
import Header from '../Components/Header';
import Footer from '../Components/Footer';

// ─── Moteur de recherche (même logique que SearchAutocomplete) ────────────────

const normalize = (str) =>
  (str || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/['\-]/g, ' ')
    .trim();

const scoreProduct = (product, tokens) => {
  if (!tokens.length) return 0;

  const f = {
    name:     normalize(product.name),
    brand:    normalize(product.brand),
    cat:      normalize(product.categoryName || product.category),
    subCat:   normalize(product.subCategory),
    desc:     normalize(product.description),
    features: normalize(Array.isArray(product.features) ? product.features.join(' ') : product.features),
    colors:   normalize(Array.isArray(product.colors)   ? product.colors.join(' ')   : product.colors),
  };
  const nameWords = f.name.split(/\s+/);

  let total = 0;
  let matched = 0;

  for (const tok of tokens) {
    if (!tok || tok.length < 1) continue;
    let s = 0;

    if      (f.name === tok)                              s += 100;
    else if (nameWords.some(w => w === tok))              s +=  80;
    else if (nameWords.some(w => w.startsWith(tok)))      s +=  60;
    else if (f.name.startsWith(tok))                      s +=  50;
    else if (nameWords.some(w => w.includes(tok)))        s +=  35;
    else if (f.name.includes(tok))                        s +=  25;

    if      (f.brand === tok)       s += 40;
    else if (f.brand.includes(tok)) s += 20;

    if (f.cat.includes(tok) || f.subCat.includes(tok)) s += 15;
    if (f.colors.includes(tok))                        s += 10;
    if (f.features.includes(tok) || f.desc.includes(tok)) s += 5;

    if (s > 0) { total += s; matched++; }
  }

  if (matched === tokens.length && tokens.length > 1) total += 30;
  return total;
};

/** Met en surbrillance les tokens dans le texte */
const HighlightText = ({ text, query }) => {
  if (!query || !query.trim()) return <>{text}</>;
  try {
    const tokens = query.trim().split(/\s+/).filter(t => t.length >= 1);
    const pattern = tokens.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
    if (!pattern) return <>{text}</>;
    const re = new RegExp(`(${pattern})`, 'gi');
    const parts = text.split(re);
    return (
      <>
        {parts.map((part, i) =>
          re.test(part)
            ? <mark key={i} className="bg-yellow-200 text-gray-900 rounded-sm not-italic font-semibold">{part}</mark>
            : part
        )}
      </>
    );
  } catch {
    return <>{text}</>;
  }
};

// ─── Catalogue complet ────────────────────────────────────────────────────────

const CATALOG = [
  ...chaussure.map(p =>            ({ ...p, category: 'chaussure',            categoryName: 'Chaussures'              })),
  ...vetement_homme.map(p =>       ({ ...p, category: 'homme',                categoryName: 'Vêtements Homme'         })),
  ...vetement_femme.map(p =>       ({ ...p, category: 'femme',                categoryName: 'Vêtements Femme'         })),
  ...vetement_enfant.map(p =>      ({ ...p, category: 'enfant',               categoryName: 'Vêtements Enfant'        })),
  ...bijoux_accessoires.map(p =>   ({ ...p, category: 'bijoux',               categoryName: 'Bijoux & Accessoires'    })),
  ...sacs.map(p =>                 ({ ...p, category: 'sacs',                 categoryName: 'Sacs'                    })),
  ...telephone_accessoires.map(p =>({ ...p, category: 'telephone_accessoires',categoryName: 'Téléphones & Accessoires'})),
  ...perruque.map(p =>             ({ ...p, category: 'perruque',             categoryName: 'Perruque & Cheveux'       })),
];

const CATEGORIES = [
  { value: 'all',                   label: 'Toutes catégories' },
  { value: 'chaussure',             label: 'Chaussures'              },
  { value: 'homme',                 label: 'Vêtements Homme'         },
  { value: 'femme',                 label: 'Vêtements Femme'         },
  { value: 'enfant',                label: 'Vêtements Enfant'        },
  { value: 'bijoux',                label: 'Bijoux & Accessoires'    },
  { value: 'sacs',                  label: 'Sacs'                    },
  { value: 'telephone_accessoires', label: 'Téléphones & Accessoires'},
  { value: 'perruque',              label: 'Perruque & Cheveux'       },
];

// ─── Page ────────────────────────────────────────────────────────────────────

const SearchResults = () => {
  const location  = useLocation();
  const navigate  = useNavigate();
  const { language } = useLanguage();
  const t = useTranslations(language);
  const { addToCart } = useCart();
  const { format: formatPrice } = usePrice();

  const urlParams = new URLSearchParams(location.search);
  const query     = urlParams.get('q') || '';

  const [searchTerm,       setSearchTerm]       = useState(query);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange,       setPriceRange]        = useState('all');
  const [sortBy,           setSortBy]            = useState('relevance');

  // Sync avec URL
  useEffect(() => { setSearchTerm(query); }, [query]);

  // Recherche scorée
  const filteredProducts = useMemo(() => {
    const trimmed = searchTerm.trim();
    if (!trimmed) return [];

    const tokens = normalize(trimmed).split(/\s+/).filter(t => t.length >= 1);

    let results = CATALOG
      .map(p => ({ product: p, score: scoreProduct(p, tokens) }))
      .filter(({ score }) => score > 0);

    // Filtre catégorie
    if (selectedCategory !== 'all') {
      results = results.filter(({ product: p }) => p.category === selectedCategory);
    }

    // Filtre prix
    if (priceRange !== 'all') {
      const [min, max] = priceRange.split('-').map(Number);
      results = results.filter(({ product: p }) =>
        max ? p.price >= min && p.price <= max : p.price >= min
      );
    }

    // Tri
    switch (sortBy) {
      case 'price-asc':   results.sort((a, b) => a.product.price - b.product.price); break;
      case 'price-desc':  results.sort((a, b) => b.product.price - a.product.price); break;
      case 'name':        results.sort((a, b) => a.product.name.localeCompare(b.product.name)); break;
      default:            results.sort((a, b) => b.score - a.score); break; // pertinence
    }

    return results.map(({ product }) => product);
  }, [searchTerm, selectedCategory, priceRange, sortBy]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
  };

  const clearFilters = () => {
    setSelectedCategory('all');
    setPriceRange('all');
    setSortBy('relevance');
  };

  const hasActiveFilters = selectedCategory !== 'all' || priceRange !== 'all' || sortBy !== 'relevance';

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* ── Barre de recherche ── */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="bg-white rounded-2xl shadow-lg p-5">
            <form onSubmit={handleSearch} className="flex gap-3 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Rechercher un produit, une marque, une catégorie…"
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors text-sm"
                />
                {searchTerm && (
                  <button type="button" onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    <X size={16} />
                  </button>
                )}
              </div>
              <button type="submit"
                className="px-7 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg text-sm">
                Rechercher
              </button>
            </form>

            <div className="flex items-center justify-between">
              <button onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors text-sm">
                <ArrowLeft size={18} />
                Retour
              </button>
              {searchTerm && (
                <p className="text-sm text-gray-600">
                  <span className="font-bold text-blue-600 text-base">{filteredProducts.length}</span>{' '}
                  résultat{filteredProducts.length !== 1 ? 's' : ''} pour{' '}
                  <span className="font-semibold text-gray-800">&ldquo;{searchTerm}&rdquo;</span>
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* ── Filtres ── */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg px-5 py-4 mb-6">
          <div className="flex flex-wrap gap-3 items-center">
            <Filter size={16} className="text-gray-400 shrink-0" />

            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-colors bg-white">
              {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>

            <select value={priceRange} onChange={(e) => setPriceRange(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-colors bg-white">
              <option value="all">Tous les prix</option>
              <option value="0-5000">0 – 5 000 XAF</option>
              <option value="5000-15000">5 000 – 15 000 XAF</option>
              <option value="15000-50000">15 000 – 50 000 XAF</option>
              <option value="50000-999999">50 000+ XAF</option>
            </select>

            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-colors bg-white">
              <option value="relevance">Pertinence</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
              <option value="name">Nom A–Z</option>
            </select>

            {hasActiveFilters && (
              <button onClick={clearFilters}
                className="flex items-center gap-1.5 px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg text-sm transition-colors">
                <X size={14} />
                Effacer les filtres
              </button>
            )}
          </div>
        </motion.div>

        {/* ── Résultats ── */}
        {filteredProducts.length > 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={`${product.category}-${product.id}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(index * 0.03, 0.4) }}
                className="bg-white rounded-xl shadow hover:shadow-lg transition-all duration-300 group cursor-pointer overflow-hidden"
                onClick={() => navigate(`/product/${product.category}/${product.id}`)}
              >
                {/* Image */}
                <div className="relative overflow-hidden aspect-square bg-gray-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/300?text=?'; }}
                  />
                  {product.originalPrice > product.price && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-1.5 py-0.5 rounded text-xs font-bold">
                      -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                    </div>
                  )}
                  <button onClick={(e) => e.stopPropagation()}
                    className="absolute top-2 left-2 p-1.5 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-all opacity-0 group-hover:opacity-100">
                    <Heart size={14} className="text-red-400" />
                  </button>
                </div>

                {/* Infos */}
                <div className="p-3">
                  {/* Catégorie badge */}
                  <div className="flex items-center gap-1 mb-1.5">
                    <Tag size={10} className="text-blue-400 shrink-0" />
                    <span className="text-xs text-blue-500 font-medium truncate">{product.categoryName}</span>
                  </div>

                  {/* Nom avec surbrillance */}
                  <h3 className="font-medium text-gray-800 text-sm leading-5 line-clamp-2 mb-1 h-10 overflow-hidden group-hover:text-blue-600 transition-colors">
                    <HighlightText text={product.name} query={searchTerm} />
                  </h3>

                  {/* Marque */}
                  {product.brand && (
                    <p className="text-xs text-gray-400 mb-2 truncate">
                      <HighlightText text={product.brand} query={searchTerm} />
                    </p>
                  )}

                  {/* Prix + panier */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-blue-600 truncate">{formatPrice(product.price)}</p>
                      {product.originalPrice > product.price && (
                        <p className="text-xs text-gray-400 line-through">{formatPrice(product.originalPrice)}</p>
                      )}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart({ ...product, selectedColor: product.colors?.[0], selectedSize: product.sizes?.[0] });
                      }}
                      className="shrink-0 p-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow hover:shadow-lg"
                    >
                      <ShoppingCart size={15} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <Search size={56} className="mx-auto text-gray-200 mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">
              {searchTerm ? 'Aucun résultat trouvé' : 'Tapez un mot pour rechercher'}
            </h3>
            <p className="text-gray-500 text-sm mb-6">
              {searchTerm
                ? `Aucun produit ne correspond à "${searchTerm}". Essayez d'autres mots.`
                : 'Entrez un nom de produit, une marque ou une catégorie.'}
            </p>
            {searchTerm && (
              <button
                onClick={() => { setSearchTerm(''); navigate('/search'); }}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
              >
                Effacer la recherche
              </button>
            )}
          </motion.div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default SearchResults;
