import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import Kategori from '../component/Kategori';
import Navbar from '../component/Navbar'; // Navbar import edildi

function Anasayfa() {
  const [kategoriler, setKategoriler] = useState([]);

  useEffect(() => {
    const veriGetir = async () => {
      const data = await getDocs(collection(db, 'kategoriler'));
      const liste = data.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const sirali = liste.sort((a, b) => a.sira - b.sira);
      setKategoriler(sirali);
    };

    veriGetir();
  }, []);

  return (
    <div >
      <Navbar /> {/* Navbar burada render ediliyor */}
      
      <Kategori/>
        
    </div>
  );
}

export default Anasayfa;
