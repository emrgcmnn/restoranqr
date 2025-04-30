// src/pages/AdminPanelAnaSayfa.js
import React from 'react';
import { Link } from 'react-router-dom';
import { FiSettings, FiUsers } from 'react-icons/fi';
import '../stills/AdminPanel.css';

const AdminPanelAnaSayfa = () => {
  return (
    <div className="dashboard-container">
      <h1>Yönetim Paneli Ana Sayfa</h1>
      <div className="quick-access-grid">
        <Link to="/admin-panel/kategori-duzenle" className="quick-card">
          <FiSettings className="card-icon" />
          <h3>Kategori Yönetimi</h3>
          <p>Kategorileri düzenle ve sırala</p>
        </Link>
        <Link to="/admin-panel/urun-duzenle" className="quick-card">
          <FiUsers className="card-icon" />
          <h3>Ürün Yönetimi</h3>
          <p>Ürünleri ekle ve düzenle</p>
        </Link>
      </div>
    </div>
  );
};

export default AdminPanelAnaSayfa;