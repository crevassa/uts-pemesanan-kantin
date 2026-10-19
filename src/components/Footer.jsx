import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <p>
          <strong>Kantin Sanata Dharma</strong> · Samping Fakultas Psikologi, lantai dasar
        </p>
        <p>Senin–Jumat 07.00–15.00 · Sabtu 07.00–12.00</p>
        <p>
          <Link to="/kontak">Hubungi kantin</Link>
        </p>
      </div>
    </footer>
  );
}
