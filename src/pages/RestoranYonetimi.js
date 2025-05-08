import React, { useEffect, useState } from 'react';
import { getAuth, signInAnonymously } from "firebase/auth";
import { db } from '../firebase';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  updateDoc, 
  doc, 
  deleteDoc 
} from 'firebase/firestore'; // ✅ Doğru import
import '../stills/restoranYonetim.css';

const RestoranYonetimi = () => {
  useEffect(() => {
    const auth = getAuth();
    signInAnonymously(auth).catch(console.error);
  }, []);
  const [bildirimler, setBildirimler] = useState([]);

useEffect(() => {
  const q = query(collection(db, 'notifications'), where('status', '==', 'pending'));
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const bildirimList = [];
    snapshot.forEach(doc => {
      bildirimList.push({ id: doc.id, ...doc.data() });
    });
    setBildirimler(bildirimList);
  });
  return () => unsubscribe();
}, []);

    
const handleTamamlandi = async (id) => {
  try {
    await deleteDoc(doc(db, "notifications", id));
    console.log("Bildirim başarıyla silindi");
  } catch (error) {
    console.error("Silme hatası:", error);
    alert("Silme işlemi başarısız: " + error.message);
  }
};

return (
  <div className="dashboard-container">
    <h1 className="dashboard-title">Restoran Yönetimi</h1>
    <div className="content-box">
      <h2>Aktif Bildirimler</h2>
      <div className="bildirim-listesi">
        {bildirimler.map(bildirim => (
          <div key={bildirim.id} className="bildirim-item">
            <div className="bildirim-icerik">
              <span className="masa-no">Masa {bildirim.masaNo}</span>
              <span className="zaman">
  {bildirim.timestamp?.toDate().toLocaleTimeString('tr-TR', {
    hour: '2-digit',
    minute: '2-digit'
  })}
</span>
            </div>
            <button 
              onClick={() => handleTamamlandi(bildirim.id)}
              className="tamamla-btn"
            >
              Tamamlandı
            </button>
          </div>
        ))}
        {bildirimler.length === 0 && (
          <div className="bos-liste">Aktif bildirim bulunmamaktadır</div>
        )}
      </div>
    </div>
  </div>
);
};

export default RestoranYonetimi;