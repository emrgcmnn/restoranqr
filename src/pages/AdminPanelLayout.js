// src/pages/AdminPanelLayout.js
import { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { FiHome, FiList, FiPackage, FiLogOut, FiChevronRight, FiChevronLeft,FiCoffee,FiImage } from 'react-icons/fi';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import '../stills/AdminPanel.css';

const AdminPanelLayout = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/admin-giris', { replace: true });
    } catch (error) {
      console.error('Çıkış yapılamadı:', error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="admin-layout">
      {/* Mobil Menü Toggle Butonu */}
      <button className="menu-toggle" onClick={toggleMenu}>
  {isMenuOpen ? <FiChevronLeft /> : <FiChevronRight />}
</button>


      {/* Yan Menü */}
      <nav className={`admin-sidebar ${isMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>Yönetim Paneli</h2>
        </div>

        <div className="sidebar-menu">
          <Link to="/admin-panel" className="menu-item" onClick={() => setIsMenuOpen(false)}>
            <FiHome className="menu-icon" />
            Ana Sayfa
          </Link>

          <Link to="/admin-panel/restoran-yonetimi" className="menu-item" onClick={() => setIsMenuOpen(false)}>
            <FiCoffee className="menu-icon" />
            Restoran Yönetimi
          </Link>
          
          <Link to="/admin-panel/kategori-duzenle" className="menu-item" onClick={() => setIsMenuOpen(false)}>
            <FiList className="menu-icon" />
            Kategori Yönetimi
          </Link>

          <Link to="/admin-panel/galeri" className="menu-item" onClick={() => setIsMenuOpen(false)}>
            <FiImage className="menu-icon" />
            Galeri Yönetimi
          </Link>
          

          
          <Link to="/admin-panel/urun-duzenle" className="menu-item" onClick={() => setIsMenuOpen(false)}>
            <FiPackage className="menu-icon" />
            Ürün Yönetimi
          </Link>

        </div>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-button">
            <FiLogOut className="menu-icon" />
            Çıkış Yap
          </button>
        </div>
      </nav>

      {/* Overlay (Mobilde menü açıkken arkaplan) */}
      {isMenuOpen && <div className="menu-overlay" onClick={toggleMenu}></div>}

      {/* Ana İçerik */}
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminPanelLayout;