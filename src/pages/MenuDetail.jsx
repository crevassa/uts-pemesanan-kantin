import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { MENU } from '../data/menu.js';
import { useKantin } from '../context/KantinContext.jsx';
import QtyStepper from '../components/QtyStepper.jsx';
import { rupiah } from '../utils/format.js';
import usePageTitle from '../hooks/usePageTitle.js';
import NotFound from './NotFound.jsx';

export default function MenuDetail() {
  const { id } = useParams();
  const item = MENU.find((m) => m.id === id);
  const { addItem } = useKantin();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const [pesan, setPesan] = useState('');
  usePageTitle(item ? item.name : 'Menu tidak ditemukan');

  if (!item) return <NotFound pesan="Menu yang kamu cari tidak ada di daftar." />;

  const tambah = () => {
    addItem(item.id, qty);
    setPesan(`${qty} × ${item.name} masuk ke pesanan.`);
  };

  return (
    <div className="container section detail">
      <p>
        <Link to="/menu">← Kembali ke menu</Link>
      </p>
      <div className="detail-grid">
        {item.foto ? (
          <img className="detail-art detail-foto" src={item.foto} alt={item.name} />
        ) : (
          <div className="detail-art" aria-hidden="true">
            {item.emoji}
          </div>
        )}
        <div>
          <p className="muted">{item.category}</p>
          <h1>{item.name}</h1>
          <p className="lead">{item.desc}</p>
          <p className="detail-price">{rupiah(item.price)}</p>

          {item.available ? (
            <>
              <div className="detail-actions">
                <QtyStepper
                  value={qty}
                  onChange={(v) => setQty(Math.max(1, v))}
                  label={item.name}
                />
                <button className="btn" onClick={tambah}>
                  Tambah ke pesanan
                </button>
              </div>
              {pesan && (
                <p className="notice" role="status">
                  {pesan}{' '}
                  <button className="link-btn" onClick={() => navigate('/pesanan')}>
                    Buka pesanan
                  </button>
                </p>
              )}
            </>
          ) : (
            <p className="notice notice-warn">
              Menu ini sedang habis. Pilih menu lain di <Link to="/menu">daftar menu</Link>.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
