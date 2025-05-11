import React from 'react';
import '../stills/SepetMenu.css';

const SepetMenu = ({ isOpen, onClose, sepetItems = [] }) => {
  if (!isOpen) return null;

  const toplam = sepetItems.reduce((sum, item) => sum + item.price, 0).toFixed(2);

  return (
    <div className="sepet-menu">
      <h3>Sepetim</h3>
      {sepetItems.length > 0 ? (
        <>
          <ul>
            {sepetItems.map(item => (
              <li key={item.id}>
                <span className="item-name">{item.name}</span>
                <span className="item-price">${item.price.toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <p style={{ textAlign: 'right', fontWeight: 'bold', marginTop: '1rem' }}>
            Toplam: ${toplam}
          </p>
          <div className="sepet-actions">
            <button className="checkout-button">Sipariş Oluştur</button>
          </div>
        </>
      ) : (
        <p className="empty-cart">Sepetiniz boş.</p>
      )}
    </div>
  );
};

export default SepetMenu;
