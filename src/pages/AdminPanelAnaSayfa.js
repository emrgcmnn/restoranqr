// src/pages/AdminPanelAnaSayfa.js
import { Link } from 'react-router-dom';
import { FiSettings, FiBox, FiUsers } from 'react-icons/fi';
import '../stills/AdminPanel.css';

const AdminPanelAnaSayfa = () => {
  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Yönetim Paneli</h1>
      
      <div className="quick-access-grid">
        {/* Kategori Yönetimi Kartı */}
        <Link to="/admin-panel/kategori-duzenle" className="dashboard-card">
          <div className="card-icon-wrapper">
            <FiSettings className="card-icon" />
          </div>
          <h3>Kategori Yönetimi</h3>
          <p>Kategorileri düzenle ve sıralama ayarlarını yap</p>
        </Link>

        {/* Ürün Yönetimi Kartı */}
        <Link to="/admin-panel/urun-duzenle" className="dashboard-card">
          <div className="card-icon-wrapper">
            <FiBox className="card-icon" />
          </div>
          <h3>Ürün Yönetimi</h3>
          <p>Ürün ekle, düzenle ve kategorilere göre filtrele</p>
        </Link>

        {/* Kullanıcı Yönetimi Kartı (Opsiyonel) */}
        <div className="dashboard-card coming-soon">
          <div className="card-icon-wrapper">
            <FiUsers className="card-icon" />
          </div>
          <h3>Kullanıcı Yönetimi</h3>
          <p>Yakında gelecek...</p>
        </div>
      </div>
    </div>
  );
};

export default AdminPanelAnaSayfa;