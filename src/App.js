// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase';
import Anasayfa from './pages/Anasayfa';
import AdminGiris from './pages/admin-giris';
import AdminPanelLayout from './pages/AdminPanelLayout';
import AdminPanelAnaSayfa from './pages/AdminPanelAnaSayfa';
import KategoriDuzenle from './pages/kategori-duzenle';
import UrunDuzenle from './pages/urun-duzenle';
import RestoranYonetimi from './pages/RestoranYonetimi';
import GaleriYonetimi from './pages/galeri-yonetimi'; // bileşen adlandırmasına dikkat!
import LoadingSpinner from './component/LoadingSpinner';

const ProtectedRoute = ({ children }) => {
  const [user, loading] = useAuthState(auth);

  if (loading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/admin-giris" replace />;
  
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Genel sayfalar */}
        <Route path="/" element={<Anasayfa />} />
        <Route path="/admin-giris" element={<AdminGiris />} />

        {/* Admin paneli */}
        <Route 
          path="/admin-panel" 
          element={
            <ProtectedRoute>
              <AdminPanelLayout />
            </ProtectedRoute>
          }
        >
          {/* /admin-panel */}
          <Route index element={<AdminPanelAnaSayfa />} />
          {/* /admin-panel/kategori-duzenle */}
          <Route path="kategori-duzenle" element={<KategoriDuzenle />} />
          {/* /admin-panel/urun-duzenle */}
          <Route path="urun-duzenle" element={<UrunDuzenle />} />
          {/* /admin-panel/restoran-yonetimi */}
          <Route path="restoran-yonetimi" element={<RestoranYonetimi />} />
          {/* /admin-panel/galeri */}
          <Route path="galeri" element={<GaleriYonetimi />} />
        </Route>

        {/* Diğer tüm yollar ana sayfaya */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
