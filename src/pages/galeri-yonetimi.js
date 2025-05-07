import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import '../stills/galeriYonetimi.css';

const GaleriYonetimi = () => {
  const [image, setImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const galeriRef = collection(db, "galeri");

  // 📌 Base64'e Çevirme Fonksiyonu
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  // 📌 Görsel Yükleme
  const handleImageUpload = async () => {
    if (!image) return;

    try {
      const base64Image = await toBase64(image);
      const docRef = await addDoc(galeriRef, { image: base64Image });

      // Yeni eklenen görseli listeye ekle
      setGalleryImages((prev) => [
        ...prev,
        { id: docRef.id, image: base64Image }
      ]);
      setImage(null);
    } catch (error) {
      console.error("Yükleme Hatası:", error);
    }
  };

  // 📌 Firestore'dan Görselleri Çekme
  const fetchGalleryImages = async () => {
    const querySnapshot = await getDocs(galeriRef);
    const images = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      image: doc.data().image
    }));
    setGalleryImages(images);
  };

  // 📌 Görsel Silme Fonksiyonu
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "galeri", id));
      setGalleryImages((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Silme Hatası:", error);
    }
  };

  useEffect(() => {
    fetchGalleryImages();
  }, []);

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Galeri Yönetimi</h1>

      <div className="gallery-content-box">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />
        <button onClick={handleImageUpload} disabled={!image}>
          Fotoğraf Yükle
        </button>
      </div>

      <div className="gallery-grid">
        {galleryImages.map((item) => (
          <div key={item.id} className="gallery-item">
            <img src={item.image} alt="Galeri Görseli" className="gallery-image" />
            <button
              className="delete-button"
              onClick={() => handleDelete(item.id)}
            >
              Sil
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GaleriYonetimi;
