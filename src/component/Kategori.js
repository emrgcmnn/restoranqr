// src/component/Kategori.js
import React, { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import '../stills/Kategori.css';

const Kategori = () => {
  const [kategoriler, setKategoriler] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'kategoriler'), (snapshot) => {
      const veri = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Eğer 'sira' alanı varsa ona göre sırala, yoksa olduğu gibi bırak
      const sirali = veri.sort((a, b) => (a.sira ?? 0) - (b.sira ?? 0));
      setKategoriler(sirali);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="kategori-wrapper">
      {kategoriler.map((item) => (
        <div key={item.id} className="kategori-kart">
          <img
            src={item.resimUrl}
            alt={item.isim}
            className="kategori-img"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/200x120?text=Resim+yok';
            }}
          />
          <p className="kategori-baslik">{item.isim}</p>
        </div>
      ))}
    </div>
  );
};

export default Kategori;
