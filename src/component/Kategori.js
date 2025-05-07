import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import '../stills/Kategori.css';

const Kategori = () => {
  const [kategoriler, setKategoriler] = useState([]);
  const [expandedKategori, setExpandedKategori] = useState(null);
  const [urunler, setUrunler] = useState({});

  useEffect(() => {
    return onSnapshot(collection(db, 'kategoriler'), snapshot => {
      const liste = snapshot.docs.map(doc => ({
        id: doc.id,
        isim: doc.data().isim,
        resim: doc.data().resim, // resimUrl yerine resim kullanılıyor
        sira: doc.data().sira ?? 0
      })).sort((a,b) => a.sira - b.sira);
      setKategoriler(liste);
    });
  }, []);

  const handleKategoriClick = async (kategoriId) => {
    if (expandedKategori === kategoriId) { 
      setExpandedKategori(null); 
      return; 
    }
    setExpandedKategori(kategoriId);
    
    if (!urunler[kategoriId]) {
      const snap = await getDocs(query(
        collection(db,'urunler'), 
        where('kategoriId','==',kategoriId)
      ));
      const list = snap.docs.map(doc => ({
        id: doc.id,
        isim: doc.data().isim,
        fiyat: doc.data().fiyat,
        resimUrl: doc.data().resimUrl,
        ozellikler: doc.data().ozellikler
      }));
      setUrunler(prev => ({ ...prev, [kategoriId]: list }));
    }
  };

  return (
    <div className="kategori-wrapper">
      {kategoriler.map(kat => (
        <div key={kat.id} className="kategori-kart">
          <div className="img-wrapper" onClick={() => handleKategoriClick(kat.id)}>
            {/* resimUrl yerine resim kullanılıyor */}
            <img 
              src={kat.resim || 'https://via.placeholder.com/800x400?text=Resim+Yok'} 
              alt={kat.isim} 
              className="kategori-img" 
              onError={e => e.target.src = 'https://via.placeholder.com/800x400?text=Hata'} 
            />
            <div className="kategori-baslik-overlay">{kat.isim}</div>
          </div>

          {expandedKategori === kat.id && (
            <div className="urunler-container">
              {urunler[kat.id]?.length > 0 ? (
                urunler[kat.id].map(urun => (
                  <div key={urun.id} className="urun-kart">
                    <img 
                      src={urun.resimUrl || 'https://via.placeholder.com/300x200?text=Ürün+Yok'} 
                      alt={urun.isim} 
                      className="urun-resmi" 
                      onError={e => e.target.src = 'https://via.placeholder.com/300x200?text=Hata'} 
                    />
                    <div className="urun-detaylari">
                      <h3 className="urun-isim">{urun.isim}</h3>
                      <p className="urun-fiyat">₺{urun.fiyat?.toFixed(2)}</p>
                      {urun.ozellikler?.split('\n').map((o,i) => (
                        <p key={i} className="urun-ozellik">• {o.trim()}</p>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <p className="urun-yok">Bu kategoride ürün bulunamadı</p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Kategori;