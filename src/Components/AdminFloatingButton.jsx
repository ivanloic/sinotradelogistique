import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './AdminFloatingButton.css';

const AdminFloatingButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Afficher seulement si on n'est pas déjà sur une page admin
  const isAdminPage = window.location.pathname.startsWith('/admin');
  
  if (isAdminPage) return null;

  return (
    <div className="admin-floating-container">
      <div className={`admin-floating-menu ${isOpen ? 'open' : ''}`}>
        <Link to="/admin" className="admin-menu-item" onClick={() => setIsOpen(false)}>
          <span className="menu-icon">🔧</span>
          <span className="menu-text">Panneau Admin</span>
        </Link>
        <Link to="/admin/add-product" className="admin-menu-item" onClick={() => setIsOpen(false)}>
          <span className="menu-icon">📦</span>
          <span className="menu-text">Ajouter Produit</span>
        </Link>
      </div>
      
      <button 
        className={`admin-floating-button ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        title="Menu Administration"
      >
        {isOpen ? '✕' : '⚙️'}
      </button>
    </div>
  );
};

export default AdminFloatingButton;
