import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import MenuRow from '../components/MenuRow.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { KATEGORI, MENU } from '../data/menu.js';
import { useKantin } from '../context/KantinContext.jsx';
import { rupiah } from '../utils/format.js';
import usePageTitle from '../hooks/usePageTitle.js';

export default function Menu() {
  usePageTitle('Menu');
  const [kategori, setKategori] = useState('Semua');
  const [cari, setCari] = useState('');
  const { cart, addItem, count, total } = useKantin();

  const hasil = useMemo(() => {
    const q = cari.trim().toLowerCase();
    return MENU.filter(
      (m) =>
        (kategori === 'Semua' || m.category === kategori) &&
        (!q || m.name.toLowerCase().includes(q) || m.desc.toLowerCase().includes(q)),
    );
  }, [kategori, cari]);

  const reset = () => {
    setCari('');
    setKategori('Semua');
  };

  return (
    <div className="container section">
      <h1>Menu hari ini</h1>

      <div className="toolbar">
        <label className="search">
          <span className="sr-only">Cari menu</span>
          <input
            type="search"
            placeholder="Cari menu, misalnya “ayam”"
            value={cari}
            onChange={(e) => setCari(e.target.value)}
          />
        </label>
        <div className="chips" role="group" aria-label="Filter kategori">
          {['Semua', ...KATEGORI].map((k) => (
            <button
              key={k}
              type="button"
              className={`chip ${kategori === k ? 'active' : ''}`}
              aria-pressed={kategori === k}
              onClick={() => setKategori(k)}
            >
              {k}
            </button>
          ))}
        </div>
      </div>

      {hasil.length === 0 ? (
        <EmptyState pesan={`Tidak ada menu yang cocok dengan “${cari}”.`}>
          <button type="button" className="btn btn-ghost" onClick={reset}>
            Reset pencarian
          </button>
        </EmptyState>
      ) : (
        <ul className="menu-list">
          {hasil.map((m) => (
            <MenuRow key={m.id} item={m} jumlah={cart[m.id]} onAdd={addItem} />
          ))}
        </ul>
      )}

      {count > 0 && (
        <div className="cart-bar" role="status">
          <span>
            {count} item · <strong>{rupiah(total)}</strong>
          </span>
          <Link to="/pesanan" className="btn btn-small">
            Lanjut ke pesanan
          </Link>
        </div>
      )}
    </div>
  );
}
