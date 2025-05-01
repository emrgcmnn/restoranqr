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
import CategoryPage from './component/olus-kategori';
import RestoranYonetimi from './pages/RestoranYonetimi';
import LoadingSpinner from './component/LoadingSpinner'; // Yeni eklediğiniz loading component

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
        <Route path="/" element={<Anasayfa />} />
        <Route path="/admin-giris" element={<AdminGiris />} />
        <Route path="/kategori/:id" element={<CategoryPage />} />

        {/* Tüm admin paneli route'larını ProtectedRoute ile sarma */}
        <Route path="/admin-panel" element={
          <ProtectedRoute>
            <AdminPanelLayout />
          </ProtectedRoute>
        }>
          <Route index element={<AdminPanelAnaSayfa />} />
          <Route path="kategori-duzenle" element={<KategoriDuzenle />} />
          <Route path="urun-duzenle" element={<UrunDuzenle />} />
          <Route path="restoran-yonetimi" element={<RestoranYonetimi />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;