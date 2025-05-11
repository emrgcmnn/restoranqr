// Navbar.js
import React, { useEffect, useState } from 'react';
import { getAuth, signInAnonymously } from "firebase/auth";
import GarsonCagir from './GarsonCagir';
import SepetIcon from './SepetIcon';
import SepetMenu from './SepetMenu';
import '../stills/Navbar.css';

const Navbar = () => {
  useEffect(() => {
    const auth = getAuth();
    signInAnonymously(auth).catch(console.error);
  }, []);

  const [isSepetOpen, setIsSepetOpen] = useState(false);

  const toggleSepet = () => {
    setIsSepetOpen(!isSepetOpen);
  };

  const closeSepet = () => {
    setIsSepetOpen(false);
  };

  // Örnek sepet içeriği (gerçek uygulamada burası dinamik olmalı)
  const sepetItems = [
    { id: 1, name: 'Örnek Ürün 1', price: 10.99 },
    { id: 2, name: 'Başka Bir Ürün', price: 5.50 },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <GarsonCagir />
        <div style={{ position: 'relative' }}> {/* Sepet ikonu ve menüsü için relative konumlandırma */}
          <SepetIcon onClick={toggleSepet} />
          <SepetMenu isOpen={isSepetOpen} onClose={closeSepet} sepetItems={sepetItems} />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;