// src/pages/KategoriDuzenle.js
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, updateDoc, doc, writeBatch } from 'firebase/firestore';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import '../stills/kategori-duzenle.css';

const KategoriDuzenle = () => {
  const [kategoriler, setKategoriler] = useState([]);

  useEffect(() => {
    const fetchKategoriler = async () => {
      const snapshot = await getDocs(collection(db, 'kategoriler'));
      const sorted = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => a.sira - b.sira);
      setKategoriler(sorted);
    };
    fetchKategoriler();
  }, []);

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
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="kategori-item"
                    >
                      <div className="kategori-icerik">
                        <img src={kategori.resimUrl} alt={kategori.isim} />
                        <span>{kategori.isim}</span>
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
    </div>
  );
};

export default KategoriDuzenle;