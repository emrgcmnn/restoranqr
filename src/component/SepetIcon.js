// SepetIcon.js
import React from 'react';
import '../stills/SepetIcon.css'; // CSS dosyasının yolu
import { FaShoppingCart } from 'react-icons/fa'; // React Icons kütüphanesinden sepet ikonu

const SepetIcon = ({ onClick }) => {
  return (
    <div className="sepet-icon-container" onClick={onClick}>
      <FaShoppingCart className="sepet-icon" />
      {/* Sepet içeriği sayısı eklenebilir */}
    </div>
  );
};

export default SepetIcon;