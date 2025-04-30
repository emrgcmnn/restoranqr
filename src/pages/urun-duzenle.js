import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { 
  collection, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc,
  addDoc,
  query,
  where,
  writeBatch
} from 'firebase/firestore';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import '../stills/urun-duzenle.css';

const UrunDuzenle = () => {
  const [urunler, setUrunler] = useState([]);
  const [kategoriler, setKategoriler] = useState([]);
  const [seciliUrun, setSeciliUrun] = useState(null);
  const [seciliKategori, setSeciliKategori] = useState('all');
  const [yeniUrun, setYeniUrun] = useState({
    isim: '',
    fiyat: '',
    kategoriId: '',
    ozellikler: '',
    resimUrl: '',
    sira: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      const urunQuery = seciliKategori === 'all' 
        ? collection(db, 'urunler')
        : query(collection(db, 'urunler'), where('kategoriId', '==', seciliKategori));
      
      const [urunSnapshot, kategoriSnapshot] = await Promise.all([
        getDocs(urunQuery),
        getDocs(collection(db, 'kategoriler'))
      ]);
      
      setUrunler(urunSnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        sira: doc.data().sira || 0 
      })).sort((a, b) => a.sira - b.sira));
      
      setKategoriler(kategoriSnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      })));
    };

    fetchData();
  }, [seciliKategori]);

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const items = Array.from(urunler);
    const [movedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, movedItem);

    const batch = writeBatch(db);
    items.forEach((urun, index) => {
      const urunRef = doc(db, 'urunler', urun.id);
      batch.update(urunRef, { sira: index });
    });
    
    await batch.commit();
    setUrunler(items);
  };

  const urunSil = async (id) => {
    if (window.confirm('Bu ürünü silmek istediğinize emin misiniz?')) {
      await deleteDoc(doc(db, 'urunler', id));
      setUrunler(urunler.filter(u => u.id !== id));
    }
  };

  const urunEkle = async () => {
    if (!yeniUrun.kategoriId) {
      alert('Lütfen bir kategori seçin');
      return;
    }

    const newProduct = {
      ...yeniUrun,
      sira: urunler.length,
      fiyat: Number(yeniUrun.fiyat)
    };

    const docRef = await addDoc(collection(db, 'urunler'), newProduct);
    setUrunler([...urunler, { ...newProduct, id: docRef.id }]);
    setYeniUrun({
      isim: '',
      fiyat: '',
      kategoriId: '',
      ozellikler: '',
      resimUrl: '',
      sira: 0
    });
  };

  const urunGuncelle = async () => {
    await updateDoc(doc(db, 'urunler', seciliUrun.id), {
      ...seciliUrun,
      fiyat: Number(seciliUrun.fiyat)
    });
    setUrunler(urunler.map(u => u.id === seciliUrun.id ? seciliUrun : u));
    setSeciliUrun(null);
  };

  return (
    <div className="urun-duzenle-container">
      <Link to="/admin-panel" className="geri-buton">
        &larr; Yönetim Paneline Dön
      </Link>

      <div className="filtre-ve-ekleme">
        <select 
          value={seciliKategori} 
          onChange={(e) => setSeciliKategori(e.target.value)}
          className="kategori-filtre"
        >
          <option value="all">Tüm Kategoriler</option>
          {kategoriler.map(kategori => (
            <option key={kategori.id} value={kategori.id}>
              {kategori.isim}
            </option>
          ))}
        </select>

        <button 
          onClick={() => setSeciliUrun({ 
            id: null, 
            isim: '', 
            fiyat: '', 
            kategoriId: seciliKategori !== 'all' ? seciliKategori : '', 
            ozellikler: '', 
            resimUrl: '',
            sira: urunler.length 
          })}
          className="ekle-buton"
        >
          Yeni Ürün Ekle
        </button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="urunler">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="urun-listesi"
            >
              {urunler.map((urun, index) => (
                // src/pages/UrunDuzenle.js (sadece ilgili kısım)
<Draggable key={urun.id} draggableId={urun.id} index={index}>
  {(provided) => (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      className="urun-karti"
    >
      <div className="urun-icerik">
        <img
          src={urun.resimUrl || 'https://via.placeholder.com/120x120?text=Resim+Yok'}
          alt={urun.isim}
          className="urun-resmi"
        />

        <div className="urun-bilgileri">
          <h3 className="urun-ad">{urun.isim}</h3>
        </div>

        <div className="urun-actions">
          <button 
            onClick={() => setSeciliUrun(urun)}
            className="duzenle-buton"
          >
            Düzenle
          </button>
          <button 
            onClick={() => urunSil(urun.id)}
            className="sil-buton"
          >
            Sil
          </button>
          <div {...provided.dragHandleProps} className="tasi-buton">
            Taşı
          </div>
        </div>
      </div>
    </div>
  )}
</Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {(seciliUrun !== null) && (
        <div className="urun-modal">
          <div className="modal-icerik">
            <h3>{seciliUrun.id ? 'Ürün Düzenle' : 'Yeni Ürün Ekle'}</h3>
            
            <select
              value={seciliUrun.kategoriId}
              onChange={e => setSeciliUrun({...seciliUrun, kategoriId: e.target.value})}
              required
            >
              <option value="">Kategori Seçin</option>
              {kategoriler.map(kategori => (
                <option key={kategori.id} value={kategori.id}>
                  {kategori.isim}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Ürün Adı"
              value={seciliUrun.isim}
              onChange={e => setSeciliUrun({...seciliUrun, isim: e.target.value})}
              required
            />

            <input
              type="number"
              placeholder="Fiyat"
              value={seciliUrun.fiyat}
              onChange={e => setSeciliUrun({...seciliUrun, fiyat: e.target.value})}
              required
            />

            <textarea
              placeholder="Özellikler (Her özellik yeni satırda)"
              value={seciliUrun.ozellikler}
              onChange={e => setSeciliUrun({...seciliUrun, ozellikler: e.target.value})}
              rows="3"
            />

            <input
              type="text"
              placeholder="Resim URL"
              value={seciliUrun.resimUrl}
              onChange={e => setSeciliUrun({...seciliUrun, resimUrl: e.target.value})}
            />

            <div className="modal-actions">
              <button 
                onClick={seciliUrun.id ? urunGuncelle : urunEkle}
                className="kaydet-buton"
              >
                {seciliUrun.id ? 'Güncelle' : 'Ekle'}
              </button>
              <button 
                onClick={() => setSeciliUrun(null)}
                className="iptal-buton"
              >
                İptal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UrunDuzenle;