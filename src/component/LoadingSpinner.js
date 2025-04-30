// src/component/LoadingSpinner.js (yeni oluşturun)
import React from 'react';
import '../stills/LoadingSpinner.css';

const LoadingSpinner = () => {
  return (
    <div className="loading-overlay">
      <div className="loading-spinner"></div>
    </div>
  );
};

export default LoadingSpinner;