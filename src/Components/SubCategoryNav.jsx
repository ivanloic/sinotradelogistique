import { forwardRef } from 'react';
import { motion } from 'framer-motion';

/**
 * Barre de sous-catégories sticky et partagée entre toutes les pages catégories.
 *
 * Props :
 *  - items        : [{ id, name, count }]
 *  - active       : string — id de la sous-catégorie active
 *  - onChange     : (id) => void
 *  - iconMap      : { [id]: <ReactElement> }  — icône lucide pour chaque id
 *  - scrolled     : bool — passage en fixed quand l'utilisateur scrolle
 *  - headerHeight : number — hauteur du header pour le positionnement sticky
 */
const SubCategoryNav = forwardRef(function SubCategoryNav(
  { items = [], active, onChange, iconMap = {}, scrolled = false, headerHeight = 64 },
  ref
) {
  return (
    <div
      ref={ref}
      className={`bg-white/95 backdrop-blur-md border-b border-gray-100 z-40
        transition-all duration-300
        ${scrolled
          ? 'fixed left-0 right-0 shadow-lg'
          : 'sticky shadow-sm'
        }`}
      style={{ top: `${headerHeight}px` }}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex overflow-x-auto py-3 gap-2 scrollbar-hide">
          {items.map((item) => {
            const isActive = active === item.id;
            const icon     = iconMap[item.id];

            return (
              <motion.button
                key={item.id}
                onClick={() => onChange(item.id)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl
                  font-medium text-sm whitespace-nowrap border transition-all duration-200
                  ${isActive
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white border-transparent shadow-md shadow-blue-500/20'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700'
                  }`}
              >
                {/* Icône */}
                {icon && (
                  <span className={`flex-shrink-0 ${isActive ? 'opacity-100' : 'opacity-50'}`}>
                    {icon}
                  </span>
                )}

                {/* Label */}
                <span>{item.name}</span>

                {/* Badge compteur */}
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold min-w-[22px] text-center
                  ${isActive
                    ? 'bg-white/25 text-white'
                    : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {item.count}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Ligne décorative en bas */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-20" />
    </div>
  );
});

export default SubCategoryNav;
