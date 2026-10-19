import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useKantin, MAKS_QTY } from '../context/KantinContext.jsx';
import QtyStepper from '../components/QtyStepper.jsx';
import MenuThumb from '../components/MenuThumb.jsx';
import Card from '../components/Card.jsx';
import FormField from '../components/FormField.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { rupiah } from '../utils/format.js';
import { slotLewat } from '../utils/jam.js';
import usePageTitle from '../hooks/usePageTitle.js';
import useNow from '../hooks/useNow.js';

const SECEPATNYA = 'Secepatnya (± 10 menit)';
const WAKTU = [SECEPATNYA, '10.00', '11.30', '12.00', '13.00'];
const BAYAR = ['Tunai di kantin', 'QRIS di kantin', 'Transfer'];
const AWAL = {
  nama: '',
  wa: '',
  cara: 'ambil',
  meja: '',
  waktu: SECEPATNYA,
  bayar: BAYAR[0],
  catatan: '',
};

function validasi(f, now) {
  const e = {};
  if (f.nama.trim().length < 3) e.nama = 'Nama minimal 3 karakter.';
  else if (!/^[\p{L}\s.'-]+$/u.test(f.nama.trim()))
    e.nama = 'Nama hanya boleh berisi huruf dan spasi.';

  const wa = f.wa.replace(/[\s-]/g, '');
  if (!wa) e.wa = 'Nomor WhatsApp wajib diisi.';
  else if (!/^(\+62|62|0)8[1-9][0-9]{6,10}$/.test(wa))
    e.wa = 'Format nomor tidak valid. Contoh: 081234567890.';

  if (f.cara === 'antar') {
    if (!f.meja.trim()) e.meja = 'Nomor meja wajib diisi untuk pesanan antar.';
    else if (!/^[1-9][0-9]?$/.test(f.meja.trim()) || Number(f.meja) > 40)
      e.meja = 'Nomor meja antara 1 sampai 40.';
  }
  if (slotLewat(f.waktu, now)) e.waktu = 'Waktu ambil sudah lewat. Pilih waktu lain.';
  if (f.catatan.length > 120) e.catatan = 'Catatan maksimal 120 karakter.';
  return e;
}

export default function Pesanan() {
  usePageTitle('Pesanan');
  const { lines, total, count, setQty, removeItem, clearCart, placeOrder } = useKantin();
  const navigate = useNavigate();
  const now = useNow();
  const [f, setF] = useState(AWAL);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const ubah = (k) => (e) => {
    const next = { ...f, [k]: e.target.value };
    setF(next);
    if (touched[k] || errors[k]) setErrors(validasi(next, now));
  };
  const blur = (k) => () => {
    setTouched((t) => ({ ...t, [k]: true }));
    setErrors(validasi(f, now));
  };
  const err = (k) => (touched[k] ? errors[k] : undefined);

  const kirim = (ev) => {
    ev.preventDefault();
    const e = validasi(f, new Date());
    setErrors(e);
    setTouched({ nama: true, wa: true, meja: true, waktu: true, catatan: true });
    const pertama = Object.keys(e)[0];
    if (pertama) {
      // Urutan key = urutan kolom di form, jadi fokus jatuh ke kolom error paling atas.
      document.getElementById(pertama)?.focus();
      return;
    }
    const order = placeOrder({
      nama: f.nama.trim(),
      wa: f.wa.replace(/[\s-]/g, ''),
      cara: f.cara === 'antar' ? `Diantar ke meja ${f.meja.trim()}` : 'Ambil di kantin',
      waktu: f.waktu,
      bayar: f.bayar,
      catatan: f.catatan.trim(),
    });
    navigate(`/ringkasan/${order.id}`);
  };

  if (lines.length === 0) {
    return (
      <div className="container section">
        <h1>Pesanan</h1>
        <EmptyState pesan="Pesananmu masih kosong. Pilih dulu menu yang ingin dipesan.">
          <Link to="/menu" className="btn">
            Buka menu
          </Link>
        </EmptyState>
      </div>
    );
  }

  return (
    <div className="container section">
      <h1>Pesanan</h1>
      <div className="order-grid">
        <section aria-labelledby="h-item">
          <div className="section-head">
            <h2 id="h-item">Item dipesan ({count})</h2>
            <button
              type="button"
              className="link-btn danger"
              onClick={() => window.confirm('Kosongkan semua item?') && clearCart()}
            >
              Kosongkan
            </button>
          </div>
          <ul className="cart-list">
            {lines.map((l) => (
              <li key={l.id}>
                <MenuThumb item={l} />
                <div className="cart-info">
                  <span className="menu-name">{l.name}</span>
                  <span className="muted">{rupiah(l.price)} per porsi</span>
                </div>
                <QtyStepper
                  value={l.qty}
                  max={MAKS_QTY}
                  onChange={(v) => setQty(l.id, v)}
                  label={l.name}
                />
                <strong className="cart-sub">{rupiah(l.subtotal)}</strong>
                <button
                  type="button"
                  className="link-btn danger"
                  onClick={() => removeItem(l.id)}
                  aria-label={`Hapus ${l.name}`}
                >
                  Hapus
                </button>
              </li>
            ))}
          </ul>
          <p className="total-line">
            <span>Total</span>
            <strong>{rupiah(total)}</strong>
          </p>
        </section>

        <Card as="form" className="form" onSubmit={kirim} noValidate aria-labelledby="h-form">
          <h2 id="h-form">Data pemesan</h2>

          <FormField id="nama" label="Nama" error={err('nama')}>
            <input value={f.nama} onChange={ubah('nama')} onBlur={blur('nama')} autoComplete="name" />
          </FormField>

          <FormField id="wa" label="Nomor WhatsApp" error={err('wa')}>
            <input
              type="tel"
              inputMode="tel"
              placeholder="081234567890"
              value={f.wa}
              onChange={ubah('wa')}
              onBlur={blur('wa')}
              autoComplete="tel"
            />
          </FormField>

          <fieldset className="field">
            <legend>Cara pengambilan</legend>
            {[
              ['ambil', 'Ambil di kantin'],
              ['antar', 'Antar ke meja'],
            ].map(([v, teks]) => (
              <label className="radio" key={v}>
                <input
                  type="radio"
                  name="cara"
                  value={v}
                  checked={f.cara === v}
                  onChange={ubah('cara')}
                />{' '}
                {teks}
              </label>
            ))}
          </fieldset>

          {f.cara === 'antar' && (
            <FormField id="meja" label="Nomor meja (1–40)" error={err('meja')}>
              <input inputMode="numeric" value={f.meja} onChange={ubah('meja')} onBlur={blur('meja')} />
            </FormField>
          )}

          <div className="field two">
            <FormField id="waktu" label="Waktu ambil" error={err('waktu')}>
              <select value={f.waktu} onChange={ubah('waktu')} onBlur={blur('waktu')}>
                {WAKTU.map((w) => (
                  <option key={w} value={w} disabled={slotLewat(w, now)}>
                    {slotLewat(w, now) ? `${w} (sudah lewat)` : w}
                  </option>
                ))}
              </select>
            </FormField>
            <div className="field">
              <label htmlFor="bayar">Pembayaran</label>
              <select id="bayar" value={f.bayar} onChange={ubah('bayar')}>
                {BAYAR.map((b) => (
                  <option key={b}>{b}</option>
                ))}
              </select>
            </div>
          </div>

          <FormField
            id="catatan"
            label="Catatan (opsional)"
            error={err('catatan')}
            hint={`${f.catatan.length}/120`}
          >
            <textarea
              rows="3"
              placeholder="Contoh: sambal dipisah, tanpa es"
              value={f.catatan}
              onChange={ubah('catatan')}
              onBlur={blur('catatan')}
            />
          </FormField>

          <button className="btn btn-block" type="submit">
            Buat pesanan · {rupiah(total)}
          </button>
        </Card>
      </div>
    </div>
  );
}
