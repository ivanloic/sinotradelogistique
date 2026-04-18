import { useState, useEffect, useRef, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ContactModal from './ContactModal';
import { vetement_enfant } from '../data/vetement_enfant';
import { chaussure } from '../data/chaussure';
import { vetement_homme } from '../data/vetement_homme';
import { vetement_femme } from '../data/vetement_femme';
import { bijoux_accessoires } from '../data/bijoux_accessoires';
import { sacs } from '../data/sacs';
import { telephone_accessoires } from '../data/telephone_accessoires';
import { perruque } from '../data/perruque';
import { usePrice } from '../hooks/usePrice';

// ─── Moteur de recherche ──────────────────────────────────────────────────────

/** Supprime les accents et normalise le texte pour la comparaison */
const normalize = (str) =>
  (str || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // é→e, à→a, ü→u …
    .replace(/['\-]/g, ' ')
    .trim();

/**
 * Score un produit par rapport à une liste de tokens normalisés.
 * Retourne 0 si aucun token ne correspond.
 *
 * Pondération :
 *   - Nom exact               → 100
 *   - Mot exact dans le nom   →  80
 *   - Mot du nom commence par →  60
 *   - Nom contient le token   →  35
 *   - Marque exacte           →  40  / contient →  20
 *   - Catégorie / sous-cat    →  15
 *   - Couleur                 →  10
 *   - Description / features  →   5
 * Bonus si tous les tokens correspondent → +30
 */
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

    // ── Nom ──
    if (f.name === tok)                                   s += 100;
    else if (nameWords.some(w => w === tok))              s +=  80;
    else if (nameWords.some(w => w.startsWith(tok)))      s +=  60;
    else if (f.name.startsWith(tok))                      s +=  50;
    else if (nameWords.some(w => w.includes(tok)))        s +=  35;
    else if (f.name.includes(tok))                        s +=  25;

    // ── Marque ──
    if      (f.brand === tok)       s += 40;
    else if (f.brand.includes(tok)) s += 20;

    // ── Catégorie ──
    if (f.cat.includes(tok) || f.subCat.includes(tok)) s += 15;

    // ── Couleurs ──
    if (f.colors.includes(tok)) s += 10;

    // ── Description / features ──
    if (f.features.includes(tok) || f.desc.includes(tok)) s += 5;

    if (s > 0) { total += s; matched++; }
  }

  // Bonus : tous les tokens ont matché
  if (matched === tokens.length && tokens.length > 1) total += 30;

  return total;
};

/** Met en surbrillance les portions du texte qui correspondent aux tokens */
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

// ─── Composant ───────────────────────────────────────────────────────────────

const SearchAutocomplete = ({ placeholder, className, isMobile = false }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showContactModal, setShowContactModal] = useState(false);
  const navigate = useNavigate();
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);
  const { format: formatPrice } = usePrice();

  // Construction du catalogue complet — mémorisé une seule fois
  const allProducts = useMemo(() => [
    ...chaussure.map(p =>            ({ ...p, category: 'chaussure',            categoryName: 'Chaussures',            categoryPath: '/shoes'  })),
    ...vetement_homme.map(p =>       ({ ...p, category: 'homme',                categoryName: 'Vêtements Homme',       categoryPath: '/clothing'})),
    ...vetement_femme.map(p =>       ({ ...p, category: 'femme',                categoryName: 'Vêtements Femme',       categoryPath: '/woman-clothing'})),
    ...vetement_enfant.map(p =>      ({ ...p, category: 'enfant',               categoryName: 'Vêtements Enfant',      categoryPath: '/clothing'})),
    ...bijoux_accessoires.map(p =>   ({ ...p, category: 'bijoux',               categoryName: 'Bijoux & Accessoires',  categoryPath: '/bijou'  })),
    ...sacs.map(p =>                 ({ ...p, category: 'sacs',                 categoryName: 'Sacs',                  categoryPath: '/bags'   })),
    ...telephone_accessoires.map(p =>({ ...p, category: 'telephone_accessoires',categoryName: 'Téléphones & Accessoires', categoryPath: '/phone'})),
    ...perruque.map(p =>             ({ ...p, category: 'perruque',             categoryName: 'Perruque & Cheveux',       categoryPath: '/perruque'})),
  ], []);

  // Recherche en temps réel avec scoring
  useEffect(() => {
    const q = searchQuery.trim();
    if (q.length < 1) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    const tokens = normalize(q).split(/\s+/).filter(t => t.length >= 1);

    const scored = allProducts
      .map(p => ({ product: p, score: scoreProduct(p, tokens) }))
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
      .map(({ product }) => product);

    setSuggestions(scored);
    setIsOpen(true);
    setSelectedIndex(-1);
  }, [searchQuery, allProducts]);

  // Fermer au clic extérieur
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Navigation clavier
  const handleKeyDown = (e) => {
    if (!isOpen) return;
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, suggestions.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, -1));
        break;
      case 'Enter':
        e.preventDefault();
        handleSubmit(e);
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
      const p = suggestions[selectedIndex];
      navigate(`/product/${p.category}/${p.id}`);
    } else if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleProductClick = (product) => {
    navigate(`/product/${product.category}/${product.id}`);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleViewAll = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative w-full group">
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => { if (suggestions.length > 0) setIsOpen(true); }}
          placeholder={placeholder}
          className={`w-full ${isMobile ? 'pl-5 pr-14 py-3.5' : 'px-5 py-3.5'} bg-white/10 backdrop-blur-sm border-2 border-white/20 text-white placeholder-white/60 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent focus:bg-white/20 transition-all duration-300`}
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => { setSearchQuery(''); setSuggestions([]); setIsOpen(false); inputRef.current?.focus(); }}
            className={`absolute ${isMobile ? 'right-12' : 'right-20'} top-1/2 -translate-y-1/2 p-2 text-white/60 hover:text-white transition-colors`}
          >
            <X size={18} />
          </button>
        )}
        <button
          type="submit"
          className={`absolute ${isMobile ? 'right-2' : 'right-2'} top-1/2 -translate-y-1/2 ${isMobile ? 'p-2' : 'px-6 py-2'} bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-blue-500/50`}
        >
          <Search size={isMobile ? 18 : 20} />
        </button>
      </form>

      {/* Dropdown suggestions */}
      <AnimatePresence>
        {isOpen && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50"
          >
            <div className="max-h-[480px] overflow-y-auto divide-y divide-gray-50">
              {suggestions.map((product, index) => (
                <motion.div
                  key={`${product.category}-${product.id}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  onClick={() => handleProductClick(product)}
                  className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${
                    selectedIndex === index ? 'bg-blue-50' : 'hover:bg-gray-50'
                  }`}
                >
                  {/* Image */}
                  <div className="flex-shrink-0 w-14 h-14 bg-gray-100 rounded-xl overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/56?text=?'; }}
                    />
                  </div>

                  {/* Infos */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm line-clamp-1 mb-0.5">
                      <HighlightText text={product.name} query={searchQuery} />
                    </p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-xs font-medium">
                        {product.categoryName}
                      </span>
                      {product.brand && (
                        <span className="text-xs text-gray-400">
                          <HighlightText text={product.brand} query={searchQuery} />
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Prix */}
                  <div className="flex-shrink-0 text-right">
                    <p className="text-sm font-bold text-green-600">{formatPrice(product.price)}</p>
                    {product.originalPrice > product.price && (
                      <p className="text-xs text-gray-400 line-through">{formatPrice(product.originalPrice)}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Footer "Voir tous" */}
            <div className="border-t border-gray-100 bg-gray-50">
              <button
                onClick={handleViewAll}
                className="w-full px-4 py-3 text-center text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center justify-center gap-2 transition-colors hover:bg-blue-50"
              >
                <Search size={16} />
                Voir tous les résultats pour &ldquo;{searchQuery}&rdquo;
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Aucun résultat */}
      <AnimatePresence>
        {isOpen && searchQuery.trim().length >= 1 && suggestions.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 z-50 text-center"
          >
            <Search size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-800 font-bold mb-1">Aucun produit trouvé</p>
            <p className="text-gray-500 text-sm mb-4">
              Le produit &ldquo;{searchQuery}&rdquo; n&apos;est pas encore dans notre catalogue.
            </p>
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mb-3">
              <p className="text-blue-700 text-sm font-medium">Contactez-nous pour passer une commande spéciale !</p>
            </div>
            <button
              onClick={() => { setIsOpen(false); setShowContactModal(true); }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300"
            >
              Nous Contacter
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <ContactModal isOpen={showContactModal} onClose={() => setShowContactModal(false)} />
    </div>
  );
};

export default SearchAutocomplete;
