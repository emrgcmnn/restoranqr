import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc, addDoc, query, where, writeBatch } from 'firebase/firestore';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import '../stills/urun-duzenle.css';

const UrunDuzenle = () => {
  const [urunler, setUrunler] = useState([]);
  const [kategoriler, setKategoriler] = useState([]);
  const [seciliUrun, setSeciliUrun] = useState(null);
  const [seciliKategori, setSeciliKategori] = useState('all');
  const [showImageModal, setShowImageModal] = useState(false);
  const [galleryImages, setGalleryImages] = useState([]);

  const fetchData = useCallback(async () => {
    const urunRef = seciliKategori === 'all' 
      ? collection(db, 'urunler') 
      : query(collection(db, 'urunler'), where('kategoriId', '==', seciliKategori));

    const [urunSnap, kategoriSnap] = await Promise.all([
      getDocs(urunRef),
      getDocs(collection(db, 'kategoriler'))
    ]);

    setUrunler(
      urunSnap.docs
        .map(doc => ({
          ...doc.data(),
          id: doc.id,
          sira: doc.data().sira || 0
        }))
        .sort((a, b) => a.sira - b.sira)
    );

    setKategoriler(
      kategoriSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    );
  }, [seciliKategori]);

  const fetchGalleryImages = useCallback(async () => {
    const galeriSnap = await getDocs(collection(db, 'galeri'));
    setGalleryImages(galeriSnap.docs.map(doc => ({ id: doc.id, image: doc.data().image })));
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDragEnd = async (result) => {
    if (!result.destination) return;
    const items = Array.from(urunler);
    const [movedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, movedItem);

    const batch = writeBatch(db);
    items.forEach((u, idx) => {
      batch.update(doc(db, 'urunler', u.id), { sira: idx });
    });
    await batch.commit();
    setUrunler(items);
  };

  const urunSil = async (id) => {
    if (window.confirm('Bu ürünü silmek istediğinize emin misiniz?')) {
      await deleteDoc(doc(db, 'urunler', id));
      await fetchData();
    }
  };

  const urunEkle = async () => {
    if (!seciliUrun.kategoriId) {
      alert('Lütfen bir kategori seçin');
      return;
    }
    const newProduct = {
      ...seciliUrun,
      fiyat: Number(seciliUrun.fiyat),
      sira: urunler.length,
    };
    await addDoc(collection(db, 'urunler'), newProduct);
    await fetchData();
    setSeciliUrun(null);
  };

  const urunGuncelle = async () => {
    await updateDoc(doc(db, 'urunler', seciliUrun.id), {
      ...seciliUrun,
      fiyat: Number(seciliUrun.fiyat)
    });
    await fetchData();
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
          {kategoriler.map(k => (
            <option key={k.id} value={k.id}>{k.isim}</option>
          ))}
        </select>
        <button
          className="form-button"
          onClick={() => setSeciliUrun({
            id: null,
            isim: '',
            fiyat: '',
            kategoriId: seciliKategori !== 'all' ? seciliKategori : (kategoriler[0]?.id || ''),
            ozellikler: '',
            resim: '',
            sira: urunler.length,
          })}
        >
          Yeni Ürün Ekle
        </button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="urunler">
          {provided => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="kategori-listesi"
            >
              {urunler.map((u, idx) => (
                <Draggable key={u.id} draggableId={u.id} index={idx}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`kategori-item ${snapshot.isDragging ? 'dragging' : ''}`}
                    >
                      <div className="kategori-icerik">
                        <img 
                          src={u.resim || 'https://via.placeholder.com/120x120?text=Resim+Yok'} 
                          alt={u.isim} 
                          className="urun-resmi"
                        />
                        <div className="urun-bilgileri">
                          <h3>{u.isim}</h3>
                          <p>₺{u.fiyat}</p>
                        </div>
                      </div>
                      <div className="kategori-butonlar">
                        <button onClick={() => setSeciliUrun(u)}>✏️</button>
                        <button onClick={() => urunSil(u.id)}>🗑️</button>
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

      {seciliUrun && (
        <div className="modal-overlay">
          <div className="kategori-modal">
            <h3>{seciliUrun.id ? 'Ürün Düzenle' : 'Yeni Ürün Ekle'}</h3>
            
            <div className="resim-secim">
              <button 
                type="button" 
                className="resim-sec-buton"
                onClick={async () => {
                  await fetchGalleryImages();
                  setShowImageModal(true);
                }}
              >
                {seciliUrun.resim ? 'Resmi Değiştir' : 'Fotoğraf Seç'}
              </button>
              
              {seciliUrun.resim && (
                <img 
                  src={seciliUrun.resim} 
                  alt="Ürün resmi" 
                  className="resim-onizleme"
                />
              )}
            </div>

            <select
              value={seciliUrun.kategoriId}
              onChange={e => setSeciliUrun({ ...seciliUrun, kategoriId: e.target.value })}
              className="form-input"
              required
            >
              <option value="">Kategori Seçin</option>
              {kategoriler.map(k => (
                <option key={k.id} value={k.id}>{k.isim}</option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Ürün Adı"
              value={seciliUrun.isim}
              onChange={e => setSeciliUrun({ ...seciliUrun, isim: e.target.value })}
              className="form-input"
              required
            />

            <input
              type="number"
              placeholder="Fiyat"
              value={seciliUrun.fiyat}
              onChange={e => setSeciliUrun({ ...seciliUrun, fiyat: e.target.value })}
              className="form-input"
              required
            />

            <textarea
              placeholder="Özellikler (Her satır yeni özellik)"
              value={seciliUrun.ozellikler}
              onChange={e => setSeciliUrun({ ...seciliUrun, ozellikler: e.target.value })}
              className="form-input"
              rows={3}
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

      {showImageModal && (
        <div className="modal-overlay">
          <div className="image-select-modal">
            <h3>Galeriden Fotoğraf Seç</h3>
            <div className="gallery-grid">
              {galleryImages.map((img) => (
                <img
                  key={img.id}
                  src={img.image}
                  alt="Galeri"
                  onClick={() => {
                    setSeciliUrun({ ...seciliUrun, resim: img.image });
                    setShowImageModal(false);
                  }}
                  className="gallery-thumbnail"
                />
              ))}
            </div>
            <button 
              onClick={() => setShowImageModal(false)}
              className="iptal-buton"
            >
              Kapat
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UrunDuzenle;