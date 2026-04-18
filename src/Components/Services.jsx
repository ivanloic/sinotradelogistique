import { motion } from 'framer-motion';
import { ShoppingCart, Shield, MessageCircle, Truck, CheckCircle, Users, Globe, HeadphonesIcon } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

const Services = () => {
  const { t } = useTranslation();
  
  const services = [
    {
      icon: <ShoppingCart className="w-8 h-8" />,
      title: t.services.commercial.title,
      subtitle: t.services.commercial.subtitle,
      description: t.services.commercial.description,
      features: t.services.commercial.features,
      cta: t.services.viewMore,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      delay: 0.1
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: t.services.audited.title,
      subtitle: t.services.audited.subtitle,
      description: t.services.audited.description,
      features: t.services.audited.features,
      cta: t.services.viewMore,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      delay: 0.2
    },
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: t.services.messenger.title,
      subtitle: t.services.messenger.subtitle,
      description: t.services.messenger.description,
      features: t.services.messenger.features,
      cta: t.services.viewMore,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      delay: 0.3
    },
    {
      icon: <Truck className="w-8 h-8" />,
      title: t.services.logistics.title,
      subtitle: t.services.logistics.subtitle,
      description: t.services.logistics.description,
      features: t.services.logistics.features,
      cta: t.services.viewMore,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      delay: 0.4
    },
    {
      icon: <HeadphonesIcon className="w-8 h-8" />,
      title: t.services.support.title,
      subtitle: t.services.support.subtitle,
      description: t.services.support.description,
      features: t.services.support.features,
      cta: t.services.viewMore,
      color: "from-red-500 to-red-600",
      bgColor: "bg-red-50",
      delay: 0.5
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: t.services.intelligence.title,
      subtitle: t.services.intelligence.subtitle,
      description: t.services.intelligence.description,
      features: t.services.intelligence.features,
      cta: t.services.viewMore,
      color: "from-indigo-500 to-indigo-600",
      bgColor: "bg-indigo-50",
      delay: 0.6
    }
  ];

  const stats = [
    { number: "50K+", label: t.services.stats.suppliers },
    { number: "150+", label: t.services.stats.countries },
    { number: "10M+", label: t.services.stats.products },
    { number: "24/7", label: t.services.stats.support }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const cardVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    },
    hover: {
      y: -10,
      scale: 1.02,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50/30">
      <div className="max-w-7xl mx-auto px-4">
        {/* En-tête de section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {t.services.title}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t.services.subtitle}
          </p>
        </motion.div>

        {/* Statistiques */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="text-center bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
            >
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600 font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Grille des services */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover="hover"
              className={`bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden group cursor-pointer ${service.bgColor} hover:shadow-2xl transition-all duration-300`}
            >
              {/* En-tête de la carte */}
              <div className={`p-6 bg-gradient-to-r ${service.color} text-white`}>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                    {service.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{service.title}</h3>
                    <p className="text-blue-100 font-medium">{service.subtitle}</p>
                  </div>
                </div>
              </div>

              {/* Contenu de la carte */}
              <div className="p-6">
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {service.description}
                </p>

                {/* Liste des fonctionnalités */}
                <ul className="space-y-3 mb-6">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Bouton d'action */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-full bg-gradient-to-r ${service.color} hover:shadow-lg text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 group-hover:bg-gradient-to-l`}
                >
                  <span>{service.cta}</span>
                  <svg 
                    className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </motion.button>
              </div>

              {/* Effet de bordure animée */}
              <div className={`h-1 bg-gradient-to-r ${service.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />
            </motion.div>
          ))}
        </motion.div>

        {/* Bannière d'avantages */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-white relative overflow-hidden"
        >
          {/* Éléments décoratifs */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -translate-x-24 translate-y-24" />
          
          <div className="relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              <h3 className="text-3xl font-bold mb-4">
                {t.services.whyChoose.title}
              </h3>
              <p className="text-xl mb-8 opacity-90">
                {t.services.whyChoose.subtitle}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center space-x-3 justify-center">
                  <Users className="w-8 h-8 text-blue-200" />
                  <div className="text-left">
                    <div className="font-semibold">{t.services.whyChoose.globalNetwork}</div>
                    <div className="text-sm opacity-80">{t.services.whyChoose.globalNetworkDesc}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 justify-center">
                  <Shield className="w-8 h-8 text-blue-200" />
                  <div className="text-left">
                    <div className="font-semibold">{t.services.whyChoose.totalSecurity}</div>
                    <div className="text-sm opacity-80">{t.services.whyChoose.totalSecurityDesc}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 justify-center">
                  <Truck className="w-8 h-8 text-blue-200" />
                  <div className="text-left">
                    <div className="font-semibold">{t.services.whyChoose.guaranteedDelivery}</div>
                    <div className="text-sm opacity-80">{t.services.whyChoose.guaranteedDeliveryDesc}</div>
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-8 bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-shadow"
              >
                {t.services.whyChoose.startNow}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;