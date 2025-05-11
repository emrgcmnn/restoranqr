import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import '../stills/Kategori.css';

const Kategori = () => {
  const [kategoriler, setKategoriler] = useState([]);
  const [expandedKategori, setExpandedKategori] = useState(null);
  const [urunler, setUrunler] = useState({});
  useEffect(() => {
    // Firestore'dan kategorileri anlık dinleme ile alır
    const unsubscribe = onSnapshot(
      collection(db, 'kategoriler'),
      snapshot => {
        const veri = snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .sort((a, b) => (a.sira ?? 0) - (b.sira ?? 0));
        setKategoriler(veri);
      },
      error => {
        console.error('Kategori onSnapshot hatası:', error);
      }
    );
    // Cleanup: component unmount olduğunda listener'i kapat
    return () => unsubscribe();
  }, []);

  const handleKategoriClick = async kategoriId => {
    if (expandedKategori === kategoriId) {
      setExpandedKategori(null);
      return;
    }
    setExpandedKategori(kategoriId);

    if (!urunler[kategoriId]) {
      const q = query(
        collection(db, 'urunler'),
        where('kategoriId', '==', kategoriId)
      );

      // Ürünler için de onSnapshot kullanıyoruz
      const unsubscribe = onSnapshot(q, (snap) => {
        const liste = snap.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .sort((a, b) => (a.sira ?? 0) - (b.sira ?? 0)); // Sıralama burada
        
        setUrunler(prev => ({ 
          ...prev, 
          [kategoriId]: liste 
        }));
      });

      // Cleanup için unsubscribe'ı sakla
      return () => unsubscribe();
    }
  };

  return (
    <div className="kategori-wrapper">
      {kategoriler.map(item => (
        <div key={item.id} className="kategori-kart">
          <div
            className="img-wrapper"
            onClick={() => handleKategoriClick(item.id)}
          >
            <img
              src={item.resim}
              alt={item.isim}
              className="kategori-img"
              onError={e => {
                console.error('Resim yüklenemedi:', item.id, item.resim);
                e.target.src =
                  'https://via.placeholder.com/200x120?text=Resim+yok';
              }}
            />
            <div className="kategori-baslik-overlay">
              {item.isim}
            </div>
          </div>

          {expandedKategori === item.id && (
            <div className="urunler-container">
              {urunler[item.id] ? (
                urunler[item.id].length > 0 ? (
                  urunler[item.id].map(urun => (
                    <div className="urun-kart">
  <img
    src={urun.resim}
    alt={urun.isim}
    className="urun-img"
    onError={e => {
      console.error('Ürün resmi yüklenemedi:', urun.id, urun.resim);
      e.target.src = 'https://via.placeholder.com/100?text=Yok';
    }}
  />
  <div className="urun-bilgiler">
    <p className="urun-isim">{urun.isim}</p>
    <p className="urun-fiyat">{urun.fiyat} ₺</p>
    {urun.ozellikler && (
      <p className="urun-ozellik">• {urun.ozellikler}</p>
    )}
  </div>
  <button className="ekle-button">Ekle</button>
</div>

                  ))
                ) : (
                  <p className="bos-mesaj">
                    Bu kategoriye ait ürün bulunamadı.
                  </p>
                )
              ) : (
                <p className="bos-mesaj">Yükleniyor...</p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Kategori;
