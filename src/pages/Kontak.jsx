import { useState } from 'react';
import { useKantin } from '../context/KantinContext.jsx';
import usePageTitle from '../hooks/usePageTitle.js';
import Card from '../components/Card.jsx';
import FormField from '../components/FormField.jsx';

const AWAL = { nama: '', email: '', topik: 'Saran menu', pesan: '' };
const TOPIK = ['Saran menu', 'Masalah pesanan', 'Kerja sama', 'Lainnya'];

function validasi(f) {
  const e = {};
  if (f.nama.trim().length < 3) e.nama = 'Nama minimal 3 karakter.';
  if (!f.email.trim()) e.email = 'Email wajib diisi.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim()))
    e.email = 'Format email tidak valid. Contoh: nama@kampus.ac.id.';
  if (f.pesan.trim().length < 10) e.pesan = 'Pesan minimal 10 karakter.';
  return e;
}

export default function Kontak() {
  usePageTitle('Kontak');
  const { messages, addMessage } = useKantin();
  const [f, setF] = useState(AWAL);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [sent, setSent] = useState(false);

  const ubah = (k) => (e) => {
    const next = { ...f, [k]: e.target.value };
    setF(next);
    setSent(false);
    if (touched[k] || errors[k]) setErrors(validasi(next));
  };
  const blur = (k) => () => {
    setTouched((t) => ({ ...t, [k]: true }));
    setErrors(validasi(f));
  };
  const err = (k) => (touched[k] ? errors[k] : undefined);

  const kirim = (ev) => {
    ev.preventDefault();
    const e = validasi(f);
    setErrors(e);
    setTouched({ nama: true, email: true, pesan: true });
    const pertama = Object.keys(e)[0];
    if (pertama) {
      // Fokus diambil dari hasil validasi saat ini, bukan dari DOM yang belum re-render.
      document.getElementById(`k-${pertama}`)?.focus();
      return;
    }
    addMessage({ ...f, nama: f.nama.trim(), email: f.email.trim(), pesan: f.pesan.trim() });
    setF(AWAL);
    setTouched({});
    setSent(true);
  };

  return (
    <div className="container section">
      <h1>Kontak</h1>
      <div className="order-grid">
        <section aria-labelledby="h-info">
          <h2 id="h-info">Informasi kantin</h2>
          <dl className="meta stack">
            <div>
              <dt>Lokasi</dt>
              <dd>Gedung Utama, lantai dasar</dd>
            </div>
            <div>
              <dt>Jam buka</dt>
              <dd>
                Senin–Jumat 07.00–15.00
                <br />
                Sabtu 07.00–12.00
                <br />
                Minggu tutup
              </dd>
            </div>
            <div>
              <dt>WhatsApp</dt>
              <dd>0812-1234-4321</dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>kantin@usd.ac.id</dd>
            </div>
          </dl>
          {messages.length > 0 && (
            <p className="muted" data-testid="jumlah-pesan">
              {messages.length} pesan tersimpan di perangkat ini.
            </p>
          )}
        </section>

        <Card as="form" className="form" onSubmit={kirim} noValidate aria-labelledby="h-kirim">
          <h2 id="h-kirim">Kirim pesan</h2>

          <FormField id="k-nama" label="Nama" error={err('nama')}>
            <input value={f.nama} onChange={ubah('nama')} onBlur={blur('nama')} autoComplete="name" />
          </FormField>
          <FormField id="k-email" label="Email" error={err('email')}>
            <input
              type="email"
              value={f.email}
              onChange={ubah('email')}
              onBlur={blur('email')}
              autoComplete="email"
            />
          </FormField>
          <div className="field">
            <label htmlFor="k-topik">Topik</label>
            <select id="k-topik" value={f.topik} onChange={ubah('topik')}>
              {TOPIK.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
          <FormField id="k-pesan" label="Pesan" error={err('pesan')}>
            <textarea rows="5" value={f.pesan} onChange={ubah('pesan')} onBlur={blur('pesan')} />
          </FormField>

          <button className="btn btn-block" type="submit">
            Kirim pesan
          </button>
          {sent && (
            <p className="notice" role="status">
              Pesan terkirim dan tersimpan. Terima kasih atas masukannya.
            </p>
          )}
        </Card>
      </div>
    </div>
  );
}
