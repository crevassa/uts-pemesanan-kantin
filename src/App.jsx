import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Beranda from './pages/Beranda.jsx';
import Menu from './pages/Menu.jsx';
import Pesanan from './pages/Pesanan.jsx';
import Ringkasan from './pages/Ringkasan.jsx';
import Kontak from './pages/Kontak.jsx';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <>
      <a className="skip-link" href="#konten">
        Lewati ke konten
      </a>
      <Navbar />
      <ScrollToTop />
      <main id="konten">
        <Routes>
          <Route path="/" element={<Beranda />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/pesanan" element={<Pesanan />} />
          <Route path="/ringkasan" element={<Ringkasan />} />
          <Route path="/ringkasan/:id" element={<Ringkasan />} />
          <Route path="/kontak" element={<Kontak />} />
          {/* Alamat yang tidak terdaftar dialihkan ke Beranda */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
