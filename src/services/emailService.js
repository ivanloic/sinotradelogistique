import emailjs from '@emailjs/browser';

// Configuration EmailJS depuis les variables d'environnement
const EMAILJS_CONFIG = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID,
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
};

/**
 * Initialise EmailJS avec votre clé publique
 */
export const initEmailJS = () => {
  console.log('🔧 Initialisation EmailJS...');
  console.log('Service ID:', EMAILJS_CONFIG.serviceId);
  console.log('Template ID:', EMAILJS_CONFIG.templateId);
  console.log('Public Key:', EMAILJS_CONFIG.publicKey ? '✅ Définie' : '❌ Manquante');
  
  if (!EMAILJS_CONFIG.publicKey) {
    console.error('❌ ERREUR: Public Key manquante dans .env');
    return;
  }
  
  emailjs.init(EMAILJS_CONFIG.publicKey);
  console.log('✅ EmailJS initialisé avec succès');
};

/**
 * Compresse et convertit une image en base64 (max 40KB pour EmailJS)
 */
const compressImageToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Créer un canvas pour la compression
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Réduire les dimensions si nécessaire (max 800px)
        const maxSize = 800;
        if (width > maxSize || height > maxSize) {
          if (width > height) {
            height = (height / width) * maxSize;
            width = maxSize;
          } else {
            width = (width / height) * maxSize;
            height = maxSize;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // Compresser avec qualité réduite jusqu'à obtenir < 40KB
        let quality = 0.7;
        let base64 = canvas.toDataURL('image/jpeg', quality);
        
        // Réduire la qualité si toujours trop gros
        while (base64.length > 40000 && quality > 0.1) {
          quality -= 0.1;
          base64 = canvas.toDataURL('image/jpeg', quality);
        }
        
        console.log(`📏 Taille image compressée: ${(base64.length / 1024).toFixed(2)} KB`);
        resolve(base64);
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Envoie un email de confirmation de commande avec capture d'écran
 */
export const sendOrderEmail = async (orderData, screenshotFile = null) => {
  try {
    console.log('📧 Début d\'envoi d\'email...');
    console.log('📦 Données commande:', orderData);
    console.log('📸 Capture d\'écran:', screenshotFile ? `✅ ${screenshotFile.name}` : '❌ Aucune');
    
    // Préparer les données pour l'email
    const templateParams = {
      // Informations de commande
      order_number: orderData.orderNumber || 'N/A',
      order_date: orderData.date || new Date().toLocaleString('fr-FR'),
      order_status: orderData.status || 'En attente de paiement',
      
      // Client
      customer_name: `${orderData.billingAddress?.firstName || ''} ${orderData.billingAddress?.lastName || ''}`.trim(),
      customer_email: orderData.billingAddress?.email || orderData.contact?.email || '',
      customer_phone: orderData.billingAddress?.phone || orderData.contact?.phone || '',
      
      // Adresse de livraison
      shipping_address: orderData.shippingAddress?.address || orderData.billingAddress?.address || '',
      shipping_city: orderData.shippingAddress?.city || orderData.billingAddress?.city || '',
      shipping_state: orderData.shippingAddress?.state || orderData.billingAddress?.state || '',
      shipping_country: orderData.shippingAddress?.country || orderData.billingAddress?.country || '',
      
      // Paiement
      payment_method: orderData.paymentMethod || 'N/A',
      
      // Articles
      items_list: orderData.items?.map((item, index) => 
        `${index + 1}. ${item.name} - Qté: ${item.quantity} - ${item.price} FCFA`
      ).join('\n') || 'Aucun article',
      items_count: orderData.items?.length || 0,
      
      // Totaux
      subtotal: orderData.totals?.subtotal?.toFixed(2) || '0.00',
      shipping_cost: orderData.totals?.shipping?.toFixed(2) || '0.00',
      tax: orderData.totals?.tax?.toFixed(2) || '0.00',
      total: orderData.totals?.total?.toFixed(2) || '0.00',
    };

    // Ajouter la capture d'écran si fournie
    if (screenshotFile) {
      try {
        console.log('🗜️ Compression de l\'image en cours...');
        const base64Screenshot = await compressImageToBase64(screenshotFile);
        templateParams.screenshot_attachment = base64Screenshot;
        templateParams.screenshot_name = screenshotFile.name;
      } catch (error) {
        console.error('Erreur conversion capture:', error);
      }
    }

    console.log('📤 Envoi en cours...');
    console.log('📋 Paramètres template:', templateParams);
    
    // Envoyer l'email
    const response = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templateId,
      templateParams
    );

    console.log('✅ Email envoyé avec succès!');
    console.log('📨 Réponse:', response);
    return { success: true, response };
  } catch (error) {
    console.error('❌ ERREUR lors de l\'envoi d\'email:');
    console.error('Message:', error.message);
    console.error('Détails:', error);
    
    // Erreurs communes
    if (error.text) {
      console.error('Text:', error.text);
    }
    if (error.status) {
      console.error('Status:', error.status);
      if (error.status === 400) {
        console.error('💡 Vérifiez que le Template ID est correct dans .env');
      }
      if (error.status === 401) {
        console.error('💡 Vérifiez votre Public Key dans .env');
      }
    }
    
    return { success: false, error };
  }
};
