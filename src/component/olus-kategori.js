// src/pages/category-page.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import '../stills/Kategori.css'; // Stillerinizi eklemeyi unutmayın
import { getDoc, doc } from 'firebase/firestore'; 

function CategoryPage() {
  const { id } = useParams();
  const [kategori, setKategori] = useState(null);
  const [urunler, setUrunler] = useState([]);
  const [yukleniyor, setYukleniyor] = useState(true);

  useEffect(() => {
    const verileriGetir = async () => {
      try {
        // Kategori bilgilerini çek
        const kategoriDoc = await getDoc(doc(db, 'kategoriler', id));
        if (!kategoriDoc.exists()) {
          setYukleniyor(false);
          return;
        }
        setKategori(kategoriDoc.data());

        // Kategoriye ait ürünleri çek
        const urunlerQuery = query(
          collection(db, 'urunler'),
          where('kategoriId', '==', id)
        );
        const urunlerSnapshot = await getDocs(urunlerQuery);
        const urunlerListesi = urunlerSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })).sort((a, b) => a.sira - b.sira);

        setUrunler(urunlerListesi);
      } catch (error) {
        console.error('Veri çekme hatası:', error);
      } finally {
        setYukleniyor(false);
      }
    };

    verileriGetir();
  }, [id]);

  if (yukleniyor) return <div className="yukleniyor">Yükleniyor...</div>;
  if (!kategori) return <div className="hata">Kategori bulunamadı</div>;

  return (
    <div className="kategori-sayfasi">
      <div className="kategori-baslik">
        <h1>{kategori.isim}</h1>
        
      </div>

      <div className="urun-listesi">
        {urunler.map((urun) => (
          <div key={urun.id} className="urun-karti">
            <div className="urun-resim">
              <img 
                src={urun.resimUrl || 'https://via.placeholder.com/200x150?text=Resim+yok'} 
                alt={urun.isim}
              />
            </div>
            <div className="urun-bilgileri">
              <h3>{urun.isim}</h3>
              <p className="fiyat">₺{urun.fiyat}</p>
              {urun.ozellikler && (
                <div className="ozellikler">
                  {urun.ozellikler.split('\n').map((ozellik, index) => (
                    <p key={index} className="ozellik">{ozellik}</p>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CategoryPage;