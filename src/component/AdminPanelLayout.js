// src/components/AdminPanelLayout.js
import { Outlet, Link } from 'react-router-dom';
import { FiLogOut } from 'react-icons/fi';
import '../stills/AdminPanel.css';

const AdminPanelLayout = () => {
  return (
    <div className="admin-layout">
      <nav className="admin-sidebar">
        <div className="sidebar-header">
          <h2>Yönetim Paneli</h2>
        </div>
        <div className="sidebar-menu">
          <Link to="/admin-panel" className="menu-item">
            <FiHome /> Ana Sayfa
          </Link>
          <Link to="/admin-panel/kategori-duzenle" className="menu-item">
            <FiList /> Kategoriler
          </Link>
          <Link to="/admin-panel/urun-duzenle" className="menu-item">
            <FiPackage /> Ürünler
          </Link>
        </div>
        <div className="sidebar-footer">
          <button className="logout-button">
            <FiLogOut /> Çıkış Yap
          </button>
        </div>
      </nav>
      
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminPanelLayout;