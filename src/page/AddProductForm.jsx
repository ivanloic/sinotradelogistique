import React, { useState } from 'react';
import './AddProductForm.css';

const AddProductForm = () => {
  const [category, setCategory] = useState('');
  const [baseCategory, setBaseCategory] = useState(''); // Catégorie de base (vetement_femme, vetement_homme, etc.)
  const [formData, setFormData] = useState({
    name: '',
    name_en: '',
    price: '',
    promo: '',
    description: '',
    description_en: '',
    color: '',
    color_en: '',
    material: '',
    material_en: '',
    size: '',
    style: '',
    style_en: '',
    type: '',
    type_en: '',
    brand: '',
    heelHeight: '',
    care: '',
    care_en: '',
    weight: '',
    stone: '',
    stone_en: '',
    length: '',
    certification: '',
    packaging: '',
    packaging_en: '',
    clothingCategory: '', // Catégorie de vêtement
    minOrder: ''
  });
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const categories = [
    { value: 'vetement_femme', label: 'Vêtements Femme' },
    { value: 'vetement_homme', label: 'Vêtements Homme' },
    { value: 'vetement_enfant', label: 'Vêtements Enfant' },
    { value: 'chaussure', label: 'Chaussures' },
    { value: 'sacs', label: 'Sacs' },
    { value: 'bijou', label: 'Bijoux & Accessoires' },
    { value: 'telephone', label: 'Téléphones & Accessoires' }
  ];

  // Listes de couleurs communes
  const colorsOptions = [
    'Noir', 'Blanc', 'Gris', 'Beige', 'Marron',
    'Rouge', 'Rose', 'Orange', 'Jaune',
    'Vert', 'Bleu', 'Violet', 'Multicolore'
  ];

  // Listes de tailles communes
  const sizesOptions = {
    vetement: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
    chaussure: ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46'],
    bijou: ['XS', 'S', 'M', 'L', 'XL', 'Ajustable', 'Unique']
  };

  // Catégories spécifiques aux vêtements femme (alignées sur le script de génération)
  const vetementFemmeCategories = [
    { value: 'robe',        label: 'Robe' },
    { value: 'jupe',        label: 'Jupe' },
    { value: 'ensemble',    label: 'Ensemble (2 pièces)' },
    { value: 'combinaison', label: 'Combinaison / Jumpsuit' },
    { value: 'blouse',      label: 'Blouse' },
    { value: 'tshirt',      label: 'T-Shirt' },
    { value: 'chemise',     label: 'Chemise' },
    { value: 'pantalon',    label: 'Pantalon' },
    { value: 'jean',        label: 'Jean / Denim' },
    { value: 'short',       label: 'Short' },
    { value: 'veste',       label: 'Veste / Doudoune' },
    { value: 'manteau',     label: 'Manteau' },
    { value: 'sweat',       label: 'Sweat / Hoodie' },
    { value: 'lingerie',    label: 'Lingerie & Nuisette' },
  ];

  // Tailles dynamiques selon la catégorie de vêtement femme sélectionnée
  const getSizesForVetementFemme = () => {
    const numericCats = ['jean', 'pantalon', 'jupe', 'short'];
    if (numericCats.includes(formData.clothingCategory)) return ['34', '36', '38', '40', '42', '44', '46'];
    if (formData.clothingCategory === 'lingerie') return ['XS', 'S', 'M', 'L', 'XL'];
    return sizesOptions.vetement;
  };

  const getFieldsForCategory = (cat) => {
    const commonFields = ['name', 'name_en', 'price', 'promo', 'description', 'description_en'];
    
    // Pour les catégories de vêtements spécifiques (men, women, tshirts, etc.)
    if (['men', 'women', 'tshirts', 'shirts', 'pants', 'dresses', 'sportswear', 'suits', 'jackets'].includes(cat)) {
      return [...commonFields, 'color', 'color_en', 'material', 'material_en', 'size', 'style', 'style_en', 'care', 'care_en', 'brand'];
    }
    
    switch(cat) {
      case 'vetement_femme':
        return [...commonFields, 'color', 'color_en', 'material', 'material_en', 'size', 'style', 'style_en', 'care', 'care_en', 'clothingCategory', 'minOrder'];
      case 'vetement_homme':
      case 'vetement_enfant':
        return [...commonFields, 'color', 'color_en', 'material', 'material_en', 'size', 'style', 'style_en', 'care', 'care_en', 'brand', 'clothingCategory'];
      case 'chaussure':
        return [...commonFields, 'color', 'color_en', 'material', 'material_en', 'size', 'type', 'type_en', 'heelHeight', 'brand', 'care', 'care_en'];
      case 'sacs':
        return [...commonFields, 'color', 'color_en', 'material', 'material_en', 'type', 'type_en', 'brand', 'care', 'care_en', 'packaging', 'packaging_en'];
      case 'bijou':
        return [...commonFields, 'color', 'color_en', 'material', 'material_en', 'type', 'type_en', 'stone', 'stone_en', 'weight', 'length', 'certification', 'packaging', 'packaging_en', 'care', 'care_en'];
      case 'telephone':
        return [...commonFields, 'color', 'color_en', 'brand', 'type', 'type_en', 'material', 'material_en', 'care', 'care_en', 'packaging', 'packaging_en'];
      default:
        return commonFields;
    }
  };

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setBaseCategory(selectedCategory);
    // Si c'est un vêtement, on attend la sélection du type, sinon on utilise directement la catégorie
    if (selectedCategory === 'vetement_femme' || selectedCategory === 'vetement_homme' || selectedCategory === 'vetement_enfant') {
      setCategory(''); // Réinitialiser en attendant le choix du type
    } else {
      setCategory(selectedCategory);
    }
    // Réinitialiser clothingCategory
    setFormData(prev => ({ ...prev, clothingCategory: '' }));
    setImages([]);
    setPreviewImages([]);
    setMessage('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Si c'est clothingCategory qui change, mettre à jour la catégorie principale
    if (name === 'clothingCategory' && value) {
      setCategory(value);
    }
  };

  const handleImageChange = (e) => {
    const newFiles = Array.from(e.target.files);
    
    // Ajouter les nouvelles images aux images existantes
    setImages(prev => [...prev, ...newFiles]);
    
    // Créer des aperçus pour les nouvelles images
    const newPreviews = newFiles.map(file => URL.createObjectURL(file));
    setPreviewImages(prev => [...prev, ...newPreviews]);
    
    // Réinitialiser l'input pour permettre de sélectionner les mêmes fichiers à nouveau
    e.target.value = '';
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = previewImages.filter((_, i) => i !== index);
    setImages(newImages);
    setPreviewImages(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!baseCategory) {
      setMessage('❌ Veuillez sélectionner une catégorie');
      return;
    }
    
    // Pour les vêtements, vérifier que le type est sélectionné
    if ((baseCategory === 'vetement_femme' || baseCategory === 'vetement_homme' || baseCategory === 'vetement_enfant') && !category) {
      setMessage('❌ Veuillez sélectionner un type de vêtement');
      return;
    }

    if (images.length === 0) {
      setMessage('❌ Veuillez ajouter au moins une image');
      return;
    }

    if (!formData.name || !formData.price) {
      setMessage('❌ Le nom et le prix sont obligatoires');
      return;
    }

    setLoading(true);
    setMessage('⏳ Ajout du produit en cours...');

    try {
      const formDataToSend = new FormData();
      // Toujours envoyer baseCategory comme category (pour le chemin de stockage)
      formDataToSend.append('category', baseCategory);
      // Pour les vêtements, envoyer la catégorie sélectionnée comme une propriété séparée
      if ((baseCategory === 'vetement_femme' || baseCategory === 'vetement_homme') && category) {
        formDataToSend.append('productCategory', category);
      }
      
      const fieldsToInclude = getFieldsForCategory(baseCategory);
      fieldsToInclude.forEach(field => {
        if (formData[field]) {
          formDataToSend.append(field, formData[field]);
        }
      });

      images.forEach((image) => {
        formDataToSend.append('images', image);
      });

      const response = await fetch('http://localhost:3001/api/products/add', {
        method: 'POST',
        body: formDataToSend
      });

      const result = await response.json();

      if (response.ok) {
        setMessage(`✅ Produit ajouté avec succès! ID: ${result.productId}`);
        
        // Réinitialiser le formulaire après un délai
        setTimeout(() => {
          setFormData({
            name: '', name_en: '', price: '', promo: '',
            description: '', description_en: '',
            color: '', color_en: '',
            material: '', material_en: '',
            size: '', style: '', style_en: '',
            type: '', type_en: '', brand: '',
            heelHeight: '', care: '', care_en: '',
            weight: '', stone: '', stone_en: '',
            length: '', certification: '',
            packaging: '', packaging_en: '',
            clothingCategory: '',
            minOrder: ''
          });
          setImages([]);
          setPreviewImages([]);
          setCategory('');
          setBaseCategory('');
          setMessage('');
        }, 3000);
      } else {
        setMessage(`❌ Erreur: ${result.error}`);
      }
    } catch (error) {
      setMessage(`❌ Erreur de connexion: ${error.message}. Assurez-vous que le serveur est démarré.`);
    } finally {
      setLoading(false);
    }
  };

  const renderField = (fieldName, label, type = 'text', multiline = false, placeholder = '') => {
    const fields = getFieldsForCategory(baseCategory);
    if (!fields.includes(fieldName)) return null;

    const isRequired = fieldName === 'name' || fieldName === 'price' || fieldName === 'description';

    return (
      <div className="form-group" key={fieldName}>
        <label htmlFor={fieldName}>
          {label} {isRequired && <span className="required">*</span>}
        </label>
        {multiline ? (
          <textarea
            id={fieldName}
            name={fieldName}
            value={formData[fieldName]}
            onChange={handleInputChange}
            rows="4"
            placeholder={placeholder}
            required={isRequired}
          />
        ) : (
          <input
            type={type}
            id={fieldName}
            name={fieldName}
            value={formData[fieldName]}
            onChange={handleInputChange}
            placeholder={placeholder}
            required={isRequired}
            step={type === 'number' ? '0.01' : undefined}
          />
        )}
      </div>
    );
  };

  return (
    <div className="add-product-page">
      <div className="add-product-container">
        <h1>📦 Ajouter un Nouveau Produit</h1>
        
        {message && (
          <div className={`message ${message.includes('✅') ? 'success' : message.includes('❌') ? 'error' : 'info'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="add-product-form">
          <div className="form-section">
            <h2>🏷️ Catégorie du Produit</h2>
            <div className="form-group">
              <label htmlFor="category">Catégorie <span className="required">*</span></label>
              <select
                id="category"
                value={baseCategory}
                onChange={handleCategoryChange}
                required
              >
                <option value="">Sélectionner une catégorie</option>
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>
          </div>

          {baseCategory && (
            <>
              <div className="form-section">
                <h2>📝 Informations de base</h2>
                <div className="form-row">
                  {renderField('name', 'Nom du produit (Français)', 'text', false, 'Ex: Robe élégante')}
                  {renderField('name_en', 'Product Name (English)', 'text', false, 'Ex: Elegant dress')}
                </div>
                
                <div className="form-row">
                  {renderField('price', 'Prix (€)', 'number', false, 'Ex: 29.99')}
                  {renderField('promo', 'Prix Promo (€)', 'number', false, 'Ex: 24.99')}
                  {renderField('brand', 'Marque', 'text', false, 'Ex: Zara, H&M...')}
                </div>

                {/* Catégorie de vêtement */}
                {(baseCategory === 'vetement_femme' || baseCategory === 'vetement_homme') && (
                  <div className="form-group">
                    <label htmlFor="clothingCategory">Type de vêtement <span className="required">*</span></label>
                    <select
                      id="clothingCategory"
                      name="clothingCategory"
                      value={formData.clothingCategory}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Sélectionner un type</option>
                      {baseCategory === 'vetement_femme'
                        ? vetementFemmeCategories.map(c => (
                            <option key={c.value} value={c.value}>{c.label}</option>
                          ))
                        : (
                          <>
                            <option value="men">Homme</option>
                            <option value="tshirts">T-shirts</option>
                            <option value="shirts">Chemises</option>
                            <option value="pants">Pantalons</option>
                            <option value="sportswear">Vêtements de sport</option>
                            <option value="suits">Costumes</option>
                            <option value="jackets">Vestes</option>
                          </>
                        )
                      }
                    </select>
                  </div>
                )}

                {renderField('description', 'Description (Français)', 'text', true, 'Décrivez le produit en français...')}
                {renderField('description_en', 'Description (English)', 'text', true, 'Describe the product in English...')}
              </div>

              <div className="form-section">
                <h2>🎨 Caractéristiques</h2>
                
                {/* Sélection des couleurs avec checkboxes */}
                <div className="form-group">
                  <label>Couleur(s) <span className="required">*</span></label>
                  <div className="checkbox-grid">
                    {colorsOptions.map(color => (
                      <label key={color} className="checkbox-label">
                        <input
                          type="checkbox"
                          value={color}
                          checked={formData.color.includes(color)}
                          onChange={(e) => {
                            const currentColors = formData.color ? formData.color.split(', ').filter(c => c) : [];
                            let newColors;
                            if (e.target.checked) {
                              newColors = [...currentColors, color];
                            } else {
                              newColors = currentColors.filter(c => c !== color);
                            }
                            setFormData(prev => ({ ...prev, color: newColors.join(', ') }));
                          }}
                        />
                        <span className="checkbox-text">{color}</span>
                      </label>
                    ))}
                  </div>
                  {formData.color && <small className="selected-items">Sélectionné(s): {formData.color}</small>}
                </div>

                {/* Sélection des tailles avec checkboxes */}
                <div className="form-group">
                  <label>Taille(s) <span className="required">*</span></label>
                  <div className="checkbox-grid">
                    {(baseCategory === 'chaussure'
                      ? sizesOptions.chaussure
                      : baseCategory === 'bijou'
                      ? sizesOptions.bijou
                      : baseCategory === 'vetement_femme'
                      ? getSizesForVetementFemme()
                      : sizesOptions.vetement
                    ).map(size => (
                      <label key={size} className="checkbox-label">
                        <input
                          type="checkbox"
                          value={size}
                          checked={formData.size.includes(size)}
                          onChange={(e) => {
                            const currentSizes = formData.size ? formData.size.split(', ').filter(s => s) : [];
                            let newSizes;
                            if (e.target.checked) {
                              newSizes = [...currentSizes, size];
                            } else {
                              newSizes = currentSizes.filter(s => s !== size);
                            }
                            setFormData(prev => ({ ...prev, size: newSizes.join(', ') }));
                          }}
                        />
                        <span className="checkbox-text">{size}</span>
                      </label>
                    ))}
                  </div>
                  {formData.size && <small className="selected-items">Sélectionné(s): {formData.size}</small>}
                </div>

                {/* Quantité minimum de commande — spécifique vetement_femme */}
                {baseCategory === 'vetement_femme' && (
                  <div className="form-group">
                    <label htmlFor="minOrder">Quantité minimum de commande</label>
                    <input
                      type="number"
                      id="minOrder"
                      name="minOrder"
                      value={formData.minOrder}
                      onChange={handleInputChange}
                      placeholder="Ex: 3"
                      min="1"
                    />
                  </div>
                )}

                <div className="form-row">
                  {renderField('material', 'Matériau (Français)', 'text', false, 'Ex: Coton, Polyester')}
                  {renderField('material_en', 'Material (English)', 'text', false, 'Ex: Cotton, Polyester')}
                </div>
              </div>

              <div className="form-section">
                <h2>📸 Images du Produit</h2>
                <div className="form-group">
                  <label htmlFor="images">
                    Ajouter des images {images.length === 0 && <span className="required">*</span>}
                  </label>
                  <div className="image-upload-wrapper">
                    <input
                      type="file"
                      id="images"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      className="file-input"
                    />
                    <label htmlFor="images" className="file-input-label">
                      <span className="upload-icon">📁</span>
                      <span>Cliquez pour ajouter des images</span>
                      <small>Vous pouvez ajouter des images plusieurs fois</small>
                    </label>
                  </div>
                  {images.length > 0 && (
                    <p className="image-count">✓ {images.length} image(s) ajoutée(s)</p>
                  )}
                </div>

                {previewImages.length > 0 && (
                  <div className="image-preview-grid">
                    {previewImages.map((preview, index) => (
                      <div key={index} className="image-preview-item">
                        <img src={preview} alt={`Preview ${index + 1}`} />
                        <button
                          type="button"
                          className="remove-image-btn"
                          onClick={() => removeImage(index)}
                          title="Supprimer l'image"
                        >
                          ✕
                        </button>
                        <span className="image-number">{index + 1}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button type="submit" disabled={loading} className="submit-button">
                {loading ? '⏳ Ajout en cours...' : '✓ Ajouter le produit'}
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default AddProductForm;
