import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import '../stills/AdminGiris.css';

const AdminGiris = () => {
  const [email, setEmail] = useState('');
  const [sifre, setSifre] = useState('');
  const navigate = useNavigate();
  const [hata, setHata] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, sifre);
      navigate('/admin-panel');
    } catch (err) {
      setHata('Giriş başarısız. Bilgileri kontrol edin.');
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Admin Giriş</h2>
        {hata && <p style={{ color: 'red' }}>{hata}</p>}
        <label>Kullanıcı Adı (Email)</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

        <label>Şifre</label>
        <input type="password" value={sifre} onChange={(e) => setSifre(e.target.value)} />

        <button type="submit">Giriş Yap</button>
      </form>
    </div>
  );
};

export default AdminGiris;
