import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Clock } from 'lucide-react';

const CATEGORIES = [
  {
    id: 'vetement-femme',
    name: 'Vêtement Femme',
    description: 'Robes, hauts, pantalons & ensembles',
    image: '/vetement_femme/1/Vivid Eden Robe de plage à taille haute avec manches bouffantes et épaules dénudées pour femmes, été (1).webp',
    route: '/woman-clothing',
    overlay: 'from-pink-600/60 via-pink-500/30 to-transparent',
    accent: 'bg-pink-500',
    comingSoon: false,
  },
  {
    id: 'vetement-homme',
    name: 'Vêtement Homme',
    description: 'Ensembles, chemises & survêtements',
    image: '/vetement_homme/1/Ensemble nike .jpg',
    route: '/clothing',
    overlay: 'from-blue-700/65 via-blue-600/30 to-transparent',
    accent: 'bg-blue-600',
    comingSoon: false,
  },
  {
    id: 'chaussure-femme',
    name: 'Chaussure Femme',
    description: 'Escarpins, sandales & sneakers',
    image: '/chaussure/3/Achaussure_femme.jpg',
    route: '/shoes',
    overlay: 'from-rose-500/60 via-rose-400/30 to-transparent',
    accent: 'bg-rose-500',
    comingSoon: false,
  },
  {
    id: 'chaussure-homme',
    name: 'Chaussure Homme',
    description: 'Tennis, mocassins & boots',
    image: '/chaussure/7/Atenis.jpg',
    route: '/shoes',
    overlay: 'from-slate-700/65 via-slate-600/30 to-transparent',
    accent: 'bg-slate-600',
    comingSoon: false,
  },
  {
    id: 'bijou',
    name: 'Bijoux & Montres',
    description: 'Colliers, bracelets & montres de luxe',
    image: '/bijou/89/montre_de_luxe19.jpg',
    route: '/bijou',
    overlay: 'from-amber-600/65 via-amber-500/30 to-transparent',
    accent: 'bg-amber-500',
    comingSoon: false,
  },
  {
    id: 'sac',
    name: 'Sac à Main Femme',
    description: 'Sacs tendance, élégants & pratiques',
    image: '/sac/1/sac_a_main_femme_102.jpg',
    route: '/bags',
    overlay: 'from-emerald-600/65 via-emerald-500/30 to-transparent',
    accent: 'bg-emerald-500',
    comingSoon: false,
  },
  {
    id: 'perruque',
    name: 'Perruque & Cheveux',
    description: 'Coiffures naturelles & synthétiques',
    image: '/perruque/1/CEXXY Perruques Lace Front Wigs brésiliennes lisses à reflets P4_27, cheveux humains, 13x6, couleur blond miel ombré, pour femmes.webp',
    route: '/perruque',
    overlay: 'from-purple-700/80 via-fuchsia-600/50 to-transparent',
    accent: 'bg-purple-500',
    comingSoon: false,
  },
];

function CategoryCard({ cat, index }) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.07 }}
      whileHover={cat.comingSoon ? {} : { y: -5 }}
      onClick={() => !cat.comingSoon && navigate(cat.route)}
      className={`relative rounded-2xl overflow-hidden shadow-md group
        ${cat.comingSoon ? 'cursor-default opacity-90' : 'cursor-pointer hover:shadow-xl'}
        transition-shadow duration-300`}
      style={{ aspectRatio: '3/4' }}
    >
      {/* Image ou dégradé de fond */}
      {cat.image ? (
        <img
          src={cat.image}
          alt={cat.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
          style={{ transition: 'transform 0.5s ease' }}
          onError={(e) => { e.target.style.display = 'none'; }}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-purple-400 via-fuchsia-500 to-pink-400" />
      )}

      {/* Overlay dégradé bas → haut pour lisibilité du texte */}
      <div className={`absolute inset-0 bg-gradient-to-t ${cat.overlay}`} />
      {/* Couche sombre en bas toujours visible */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

      {/* Badge "Bientôt disponible" */}
      {cat.comingSoon && (
        <div className="absolute top-3 left-3">
          <span className="flex items-center gap-1 bg-white/90 text-purple-700 text-xs font-bold px-3 py-1.5 rounded-full shadow">
            <Clock className="w-3 h-3" />
            Bientôt disponible
          </span>
        </div>
      )}

      {/* Contenu bas de la carte */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        {/* Pastille couleur + nom */}
        <div className="flex items-center gap-2 mb-1">
          <span className={`w-2 h-2 rounded-full ${cat.accent} flex-shrink-0`} />
          <h3 className="text-white font-bold text-base leading-tight drop-shadow">
            {cat.name}
          </h3>
        </div>

        <p className="text-white/75 text-xs leading-snug pl-4">
          {cat.description}
        </p>

        {/* Lien "Explorer" au hover */}
        {!cat.comingSoon && (
          <motion.div
            initial={{ opacity: 0, x: -6 }}
            whileHover={{ opacity: 1, x: 0 }}
            className="mt-2.5 pl-4 flex items-center gap-1 text-white text-xs font-semibold
              opacity-0 group-hover:opacity-100 transition-all duration-300"
          >
            <span>Explorer</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export default function CategoriesSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">

        {/* En-tête */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <span className="inline-block bg-gradient-to-r from-blue-100 to-purple-100 text-blue-600 px-5 py-2 rounded-full text-sm font-semibold mb-3">
            Nos Collections
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Explorez nos{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Catégories
            </span>
          </h2>
          <p className="text-gray-500 text-base max-w-xl mx-auto">
            Des milliers de produits sélectionnés directement depuis la Chine,
            pour chaque style et chaque besoin.
          </p>
        </motion.div>

        {/* Grille des catégories */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {CATEGORIES.map((cat, i) => (
            <CategoryCard key={cat.id} cat={cat} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
