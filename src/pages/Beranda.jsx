import { Link } from 'react-router-dom';
import { MENU } from '../data/menu.js';
import { useKantin } from '../context/KantinContext.jsx';
import { rupiah } from '../utils/format.js';
import usePageTitle from '../hooks/usePageTitle.js';
import MenuThumb from '../components/MenuThumb.jsx';
import AddButton from '../components/AddButton.jsx';

const LANGKAH = [
  { judul: 'Pilih menu', isi: 'Buka halaman Menu, cari makanan atau minuman, lalu tekan Tambah.' },
  {
    judul: 'Isi data pemesan',
    isi: 'Di halaman Pesanan, atur jumlah dan isi nama, nomor WhatsApp, serta cara pengambilan.',
  },
  {
    judul: 'Ambil pesanan',
    isi: 'Tunjukkan kode pesanan di Ringkasan Pemesanan saat statusnya Siap diambil.',
  },
];

export default function Beranda() {
  usePageTitle('');
  const { addItem, cart } = useKantin();
  const andalan = MENU.filter((m) => m.popular && m.available).slice(0, 4);

  return (
    <>
      <section className="hero">
        <div className="container hero-inner">
          <h1>Pesan dari bangku kuliah, ambil tanpa antre.</h1>
          <p className="lead">
            Lihat menu kantin hari ini, susun pesananmu, dan ambil saat makanan sudah siap.
          </p>
          <div className="hero-actions">
            <Link to="/menu" className="btn">
              Lihat menu
            </Link>
            <Link to="/pesanan" className="btn btn-ghost">
              Buka pesanan
            </Link>
          </div>
        </div>
      </section>

      <section className="container section">
        <h2>Paling sering dipesan</h2>
        <ul className="featured">
          {andalan.map((m) => (
            <li key={m.id}>
              <MenuThumb item={m} size="big" />
              <span className="menu-name">{m.name}</span>
              <span className="menu-price">{rupiah(m.price)}</span>
              <AddButton jumlah={cart[m.id]} onAdd={() => addItem(m.id)} nama={m.name} />
            </li>
          ))}
        </ul>
      </section>

      <section className="container section">
        <h2>Cara memesan</h2>
        <ol className="steps">
          {LANGKAH.map((l) => (
            <li key={l.judul}>
              <h3>{l.judul}</h3>
              <p>{l.isi}</p>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
