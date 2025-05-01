import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, addDoc, deleteDoc, updateDoc, doc, writeBatch } from 'firebase/firestore';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import '../stills/kategori-duzenle.css';

const KategoriDuzenle = () => {
  const [kategoriler, setKategoriler] = useState([]);
  const [yeniIsim, setYeniIsim] = useState('');
  const [yeniResimUrl, setYeniResimUrl] = useState('');
  const [duzenleModalAcik, setDuzenleModalAcik] = useState(false);
  const [seciliKategori, setSeciliKategori] = useState(null);

  const fetchKategoriler = async () => {
    const snapshot = await getDocs(collection(db, 'kategoriler'));
    const sorted = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .sort((a, b) => a.sira - b.sira);
    setKategoriler(sorted);
  };

  useEffect(() => {
    fetchKategoriler();
  }, []);

  const handleKategoriEkle = async (e) => {
    e.preventDefault();
    const yeniKategori = {
      isim: yeniIsim,
      resimUrl: yeniResimUrl,
      sira: kategoriler.length,
    };
    await addDoc(collection(db, 'kategoriler'), yeniKategori);
    setYeniIsim('');
    setYeniResimUrl('');
    fetchKategoriler();
  };

  const handleKategoriSil = async (id) => {
    await deleteDoc(doc(db, 'kategoriler', id));
    fetchKategoriler();
  };

  const handleKategoriDuzenle = (kategori) => {
    setSeciliKategori(kategori);
    setDuzenleModalAcik(true);
  };

  const handleKaydet = async () => {
    if (!seciliKategori?.isim || !seciliKategori?.resimUrl) {
      alert('Lütfen tüm alanları doldurun!');
      return;
    }

    await updateDoc(doc(db, 'kategoriler', seciliKategori.id), {
      isim: seciliKategori.isim,
      resimUrl: seciliKategori.resimUrl
    });
    
    fetchKategoriler();
    setDuzenleModalAcik(false);
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const items = Array.from(kategoriler);
    const [movedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, movedItem);

    const updated = items.map((item, index) => ({ ...item, sira: index }));

    const batch = writeBatch(db);
    updated.forEach(kategori => {
      const kategoriRef = doc(db, 'kategoriler', kategori.id);
      batch.update(kategoriRef, { sira: kategori.sira });
    });

    await batch.commit();
    setKategoriler(updated);
  };

  return (
    <div className="kategori-duzenle-container">
      <h1>Kategori Düzenleme</h1>

      <form onSubmit={handleKategoriEkle} className="kategori-form">
        <input
          type="text"
          placeholder="Kategori ismi"
          value={yeniIsim}
          onChange={(e) => setYeniIsim(e.target.value)}
          required
          className="form-input"
        />
        <input
          type="text"
          placeholder="Resim URL"
          value={yeniResimUrl}
          onChange={(e) => setYeniResimUrl(e.target.value)}
          required
          className="form-input"
        />
        <button type="submit" className="form-button">Kategori Ekle</button>
      </form>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="kategoriler">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="kategori-listesi"
            >
              {kategoriler.map((kategori, index) => (
                <Draggable key={kategori.id} draggableId={kategori.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`kategori-item ${snapshot.isDragging ? 'dragging' : ''}`}
                    >
                      <div className="kategori-icerik">
                        <img src={kategori.resimUrl} alt={kategori.isim} />
                        <span>{kategori.isim}</span>
                      </div>
                      <div className="kategori-butonlar">
                        <button onClick={() => handleKategoriDuzenle(kategori)}>✏️</button>
                        <button onClick={() => handleKategoriSil(kategori.id)}>🗑️</button>
                        <span className="tasima-etiket">☰</span>
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

      {duzenleModalAcik && (
        <div className="modal-overlay">
          <div className="kategori-modal">
            <h3>Kategori Düzenle</h3>
            <input
              type="text"
              placeholder="Kategori İsmi"
              value={seciliKategori?.isim || ''}
              onChange={(e) => setSeciliKategori({...seciliKategori, isim: e.target.value})}
            />
            <input
              type="text"
              placeholder="Resim URL"
              value={seciliKategori?.resimUrl || ''}
              onChange={(e) => setSeciliKategori({...seciliKategori, resimUrl: e.target.value})}
            />
            <div className="modal-actions">
              <button onClick={handleKaydet} className="kaydet-buton">
                Kaydet
              </button>
              <button 
                onClick={() => setDuzenleModalAcik(false)} 
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

export default KategoriDuzenle;