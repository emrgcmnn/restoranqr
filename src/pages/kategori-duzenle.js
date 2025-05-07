import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, addDoc, deleteDoc, updateDoc, doc, writeBatch } from 'firebase/firestore';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import '../stills/kategori-duzenle.css';

const KategoriDuzenle = () => {
  const [kategoriler, setKategoriler] = useState([]);
  const [yeniIsim, setYeniIsim] = useState('');
  const [duzenleModalAcik, setDuzenleModalAcik] = useState(false);
  const [seciliKategori, setSeciliKategori] = useState(null);
  const [galeriModalAcik, setGaleriModalAcik] = useState(false);
  const [galeriResimleri, setGaleriResimleri] = useState([]);

  // Verileri çekme fonksiyonları
  const fetchGaleriResimleri = async () => {
    const snapshot = await getDocs(collection(db, 'galeri'));
    setGaleriResimleri(snapshot.docs.map(doc => ({ 
      id: doc.id, 
      image: doc.data().image 
    })));
  };

  const fetchKategoriler = async () => {
    const snapshot = await getDocs(collection(db, 'kategoriler'));
    const sorted = snapshot.docs
      .map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        sira: doc.data().sira || 0 
      }))
      .sort((a, b) => a.sira - b.sira);
    setKategoriler(sorted);
  };

  useEffect(() => {
    fetchKategoriler();
  }, []);

  // Kategori işlemleri
  const handleKategoriEkle = async (e) => {
    e.preventDefault();
    if (!yeniIsim || !seciliKategori?.resim) {
      alert('Lütfen kategori ismi girin ve resim seçin!');
      return;
    }

    const yeniKategori = {
      isim: yeniIsim,
      resim: seciliKategori.resim,
      sira: kategoriler.length
    };

    await addDoc(collection(db, 'kategoriler'), yeniKategori);
    setYeniIsim('');
    setSeciliKategori(null);
    fetchKategoriler();
  };

  const handleKategoriSil = async (id) => {
    if (window.confirm('Bu kategoriyi silmek istediğinize emin misiniz?')) {
      await deleteDoc(doc(db, 'kategoriler', id));
      fetchKategoriler();
    }
  };

  const handleKategoriDuzenle = (kategori) => {
    setSeciliKategori(kategori);
    setDuzenleModalAcik(true);
  };

  const handleKaydet = async () => {
    if (!seciliKategori?.isim || !seciliKategori?.resim) {
      alert('Lütfen tüm alanları doldurun!');
      return;
    }

    await updateDoc(doc(db, 'kategoriler', seciliKategori.id), {
      isim: seciliKategori.isim,
      resim: seciliKategori.resim,
      sira: seciliKategori.sira
    });
    
    fetchKategoriler();
    setDuzenleModalAcik(false);
  };

  // Sürükle-bırak işlemleri
  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const items = Array.from(kategoriler);
    const [movedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, movedItem);

    const batch = writeBatch(db);
    items.forEach((item, index) => {
      const ref = doc(db, 'kategoriler', item.id);
      batch.update(ref, { sira: index });
    });
    
    await batch.commit();
    setKategoriler(items);
  };

  // Galeri modal bileşeni
  const GaleriModal = () => (
    <div className="modal-overlay">
      <div className="galeri-modal">
        <h3>Galeriden Resim Seç</h3>
        <div className="galeri-grid">
          {galeriResimleri.map((resim) => (
            <img
              key={resim.id}
              src={resim.image}
              alt="Galeri"
              className="galeri-resim"
              onClick={() => {
                setSeciliKategori(prev => ({
                  ...prev,
                  resim: resim.image
                }));
                setGaleriModalAcik(false);
              }}
            />
          ))}
        </div>
        <button 
          onClick={() => setGaleriModalAcik(false)}
          className="iptal-buton"
        >
          Kapat
        </button>
      </div>
    </div>
  );

  return (
    <div className="kategori-duzenle-container">
      <h1>Kategori Yönetimi</h1>

      {/* Yeni Kategori Formu */}
      <form onSubmit={handleKategoriEkle} className="kategori-form">
        <input
          type="text"
          placeholder="Kategori İsmi"
          value={yeniIsim}
          onChange={(e) => setYeniIsim(e.target.value)}
          className="form-input"
          required
        />

        <div className="resim-secim-alani">
          <button
            type="button"
            className="resim-sec-buton"
            onClick={async () => {
              await fetchGaleriResimleri();
              setGaleriModalAcik(true);
            }}
          >
            {seciliKategori?.resim ? 'Resmi Değiştir' : 'Resim Seç'}
          </button>
          
          {seciliKategori?.resim && (
            <img
              src={seciliKategori.resim}
              alt="Seçilen Resim"
              className="resim-onizleme"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/150?text=Resim+Yok';
              }}
            />
          )}
        </div>

        <button type="submit" className="form-button">
          Yeni Kategori Ekle
        </button>
      </form>

      {/* Kategori Listesi */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="kategoriler">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="kategori-listesi"
            >
              {kategoriler.map((kategori, index) => (
                <Draggable
                  key={kategori.id}
                  draggableId={kategori.id}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`kategori-item ${snapshot.isDragging ? 'dragging' : ''}`}
                    >
                      <div className="kategori-icerik">
                        <img
                          src={kategori.resim}
                          alt={kategori.isim}
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/100?text=Resim+Yok';
                          }}
                        />
                        <span>{kategori.isim}</span>
                      </div>
                      <div className="kategori-butonlar">
                        <button onClick={() => handleKategoriDuzenle(kategori)}>
                          ✏️ 
                        </button>
                        <button onClick={() => handleKategoriSil(kategori.id)}>
                          🗑️ 
                        </button>
                        <span className="tasima-etiket">☰ 

                        </span>
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

      {/* Düzenleme Modali */}
      {duzenleModalAcik && (
        <div className="modal-overlay">
          <div className="kategori-modal">
            <h3>Kategori Düzenle</h3>
            
            <div className="resim-secim-alani">
              <button
                type="button"
                className="resim-sec-buton"
                onClick={async () => {
                  await fetchGaleriResimleri();
                  setGaleriModalAcik(true);
                }}
              >
                {seciliKategori?.resim ? 'Resmi Değiştir' : 'Resim Seç'}
              </button>
              
              {seciliKategori?.resim && (
                <img
                  src={seciliKategori.resim}
                  alt="Seçilen Resim"
                  className="resim-onizleme"
                />
              )}
            </div>

            <input
              type="text"
              placeholder="Kategori İsmi"
              value={seciliKategori?.isim || ''}
              onChange={(e) => setSeciliKategori({
                ...seciliKategori,
                isim: e.target.value
              })}
              className="form-input"
            />

            <div className="modal-actions">
              <button onClick={handleKaydet} className="kaydet-buton">
                Değişiklikleri Kaydet
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

      {/* Galeri Modali */}
      {galeriModalAcik && <GaleriModal />}
    </div>
  );
};

export default KategoriDuzenle;