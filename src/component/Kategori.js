import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import '../stills/Kategori.css';

const Kategori = () => {
  const [kategoriler, setKategoriler] = useState([]);
  const [expandedKategori, setExpandedKategori] = useState(null);
  const [urunler, setUrunler] = useState({});

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, 'kategoriler')),
      snapshot => {
        const veri = snapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data(),
          // Resim URL'sini kontrol et
          resimUrl: doc.data().resimUrl || 'https://via.placeholder.com/200x120?text=Resim+yok'
        }));
        const sirali = veri.sort((a, b) => (a.sira ?? 0) - (b.sira ?? 0));
        setKategoriler(sirali);
      }
    );
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
      const snap = await getDocs(q);
      const liste = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Ürün resim URL'sini kontrol et
        resimUrl: doc.data().resimUrl || 'https://via.placeholder.com/100?text=Yok'
      }));
      setUrunler(prev => ({ ...prev, [kategoriId]: liste }));
    }
  };

  return (
    <div className="kategori-wrapper">
      {kategoriler.map(item => (
        <div key={item.id} className="kategori-kart">
          <div className="img-wrapper" onClick={() => handleKategoriClick(item.id)}>
            <img
              src={item.resimUrl}
              alt={item.isim}
              className="kategori-img"
              onError={e => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/200x120?text=Resim+yok';
              }}
            />
            <div className="kategori-baslik-overlay">
              {item.isim}
            </div>
          </div>

          {expandedKategori === item.id && (
            <div className="urunler-container">
              {urunler[item.id] ? (
                urunler[item.id].map(urun => (
                  <div key={urun.id} className="urun-kart">
                    <img
                      src={urun.resimUrl}
                      alt={urun.isim}
                      className="urun-img"
                      onError={e => {
                        e.target.onerror = null;
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
                  </div>
                ))
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