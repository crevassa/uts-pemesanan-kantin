import { Link } from 'react-router-dom';
import usePageTitle from '../hooks/usePageTitle.js';

export default function NotFound({ pesan = 'Halaman yang kamu buka tidak ada.' }) {
  usePageTitle('Halaman tidak ditemukan');
  return (
    <div className="container section">
      <h1>Halaman tidak ditemukan</h1>
      <div className="empty">
        <p>{pesan}</p>
        <Link to="/" className="btn">
          Kembali ke beranda
        </Link>
      </div>
    </div>
  );
}
