import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useKantin } from '../context/KantinContext.jsx';

const LINKS = [
  { to: '/', label: 'Beranda', end: true },
  { to: '/menu', label: 'Menu' },
  { to: '/pesanan', label: 'Pesanan', badge: true },
  { to: '/ringkasan', label: 'Ringkasan Pemesanan' },
  { to: '/kontak', label: 'Kontak' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { count } = useKantin();

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="brand" onClick={() => setOpen(false)}>
          <span className="brand-mark" aria-hidden="true">
            🍛
          </span>
          Kantin Sanata Dharma
        </Link>

        <button
          className="nav-toggle"
          aria-expanded={open}
          aria-controls="nav-links"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? 'Tutup' : 'Menu'}
        </button>

        <nav
          id="nav-links"
          className={`nav-links ${open ? 'open' : ''}`}
          aria-label="Navigasi utama"
        >
          {LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} onClick={() => setOpen(false)}>
              {l.label}
              {l.badge && count > 0 && (
                <span className="badge" aria-label={`${count} item di pesanan`}>
                  {count}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
