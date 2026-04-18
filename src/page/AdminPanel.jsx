import React from 'react';
import { Link } from 'react-router-dom';
import './AdminPanel.css';

const AdminPanel = () => {
  return (
    <div className="admin-panel">
      <div className="admin-container">
        <h1>🔧 Panneau d'Administration</h1>
        <p className="admin-subtitle">Gérez vos produits et votre boutique</p>

        <div className="admin-cards">
          <Link to="/admin/add-product" className="admin-card">
            <div className="card-icon">📦</div>
            <h2>Ajouter un Produit</h2>
            <p>Ajoutez de nouveaux produits à votre catalogue avec images et descriptions multilingues</p>
            <span className="card-arrow">→</span>
          </Link>

          <div className="admin-card coming-soon">
            <div className="card-icon">✏️</div>
            <h2>Modifier un Produit</h2>
            <p>Modifiez les informations et images des produits existants</p>
            <span className="badge">Bientôt</span>
          </div>

          <div className="admin-card coming-soon">
            <div className="card-icon">🗑️</div>
            <h2>Supprimer un Produit</h2>
            <p>Retirez des produits de votre catalogue</p>
            <span className="badge">Bientôt</span>
          </div>

          <div className="admin-card coming-soon">
            <div className="card-icon">📊</div>
            <h2>Statistiques</h2>
            <p>Consultez les statistiques de vos ventes et produits</p>
            <span className="badge">Bientôt</span>
          </div>

          <div className="admin-card coming-soon">
            <div className="card-icon">📋</div>
            <h2>Gestion des Commandes</h2>
            <p>Suivez et gérez les commandes de vos clients</p>
            <span className="badge">Bientôt</span>
          </div>

          <Link to="/" className="admin-card back-to-site">
            <div className="card-icon">🏠</div>
            <h2>Retour au Site</h2>
            <p>Retournez à la page d'accueil de la boutique</p>
            <span className="card-arrow">→</span>
          </Link>
        </div>

        <div className="admin-info">
          <h3>ℹ️ Informations</h3>
          <ul>
            <li><strong>Serveur Backend:</strong> http://localhost:3001</li>
            <li><strong>Status:</strong> <span className="status-online">● En ligne</span></li>
            <li><strong>Version:</strong> 1.0.0</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
