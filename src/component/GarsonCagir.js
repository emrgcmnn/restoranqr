// GarsonCagir.js
import React, { useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import '../stills/GarsonCagir.css'; // Yeni CSS dosyasının yolu

const GarsonCagir = () => {
  const [showModal, setShowModal] = useState(false);
  const [masaNumarasi, setMasaNumarasi] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleGarsonCagir = async () => {
    if (masaNumarasi) {
      try {
        await addDoc(collection(db, "notifications"), {
          masaNo: Number(masaNumarasi),
          timestamp: serverTimestamp(),
          status: "pending",
          type: "garson_cagir",
        });
        console.log("Garson çağrı bildirimi gönderildi.");
        setShowModal(false);
        setMasaNumarasi('');
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
        }, 3000);
      } catch (error) {
        console.error("Garson çağrı bildirimi gönderilirken hata oluştu:", error);
      }
    }
  };

  return (
    <>
      <button
        className="garson-cagir-btn"
        onClick={() => setShowModal(true)}
      >
        🛎️ Garson Çağır
      </button>

      {showModal && (
        <div className="modal-overlay">
          <div className="garson-modal">
            <h3>Masa Numaranızı Girin</h3>
            <input
              type="number"
              value={masaNumarasi}
              onChange={(e) => setMasaNumarasi(e.target.value)}
              placeholder="Örn: 5"
              className="masa-input"
            />
            <div className="modal-actions">
              <button
                onClick={handleGarsonCagir}
                disabled={!masaNumarasi}
                className="onayla-btn"
              >
                Çağır
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  setMasaNumarasi('');
                }}
                className="iptal-btn"
              >
                İptal
              </button>
            </div>
          </div>
        </div>
      )}

      {showSuccess && (
        <div className="success-bildirim">
          🎉 Garson çağrınız başarıyla iletildi!
        </div>
      )}
    </>
  );
};

export default GarsonCagir;