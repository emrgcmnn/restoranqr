import { getAuth, signInAnonymously } from "firebase/auth";
import React, { useState,useEffect } from 'react'; 



import { 
  addDoc,
  collection, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase'; // Firebase konfigürasyon dosyanızın yolu
import '../stills/Navbar.css'

const Navbar = () => {
  useEffect(() => {
    const auth = getAuth();
    signInAnonymously(auth).catch(console.error);
  }, []);
  const [showModal, setShowModal] = useState(false);
  const [masaNumarasi, setMasaNumarasi] = useState('');
  const [showSuccess, setShowSuccess] = useState(false); // Yeni state

  const handleGarsonCagir = async () => {
    if (masaNumarasi) {
      try {
        const docRef = await addDoc(collection(db, "notifications"), { // ✅ Doğru tanımlama
          masaNo: Number(masaNumarasi),
          timestamp: serverTimestamp(),
          status: "pending",
          type: "garson_cagir"
        });
        console.log("Bildirim ID:", docRef.id);
        // Modal'ı kapat ve input'u temizle
        setShowModal(false);
        setMasaNumarasi('');
        setShowSuccess(true);
        
        // 3 saniye sonra bildirimi gizle
        setTimeout(() => {
          setShowSuccess(false);
        }, 3000);
      } catch (error) {
        console.error("Hata:", error);
      }
    }
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-content">
          <button 
            className="garson-cagir-btn"
            onClick={() => setShowModal(true)}
          >
            🛎️ Garson Çağır
          </button>
        </div>
      </nav>
  
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
      
      {/* BAŞARI BİLDİRİMİ MODAL DIŞINDA OLMALI */}
      {showSuccess && (
        <div className="success-bildirim">
          🎉 Garson çağrınız başarıyla iletildi!
        </div>
      )}
    </>
  );
}

export default Navbar;