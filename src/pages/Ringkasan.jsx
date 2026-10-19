import { Link, useNavigate, useParams } from 'react-router-dom';
import { useKantin, LAMA_MASAK_MS } from '../context/KantinContext.jsx';
import { rupiah, tanggalWaktu } from '../utils/format.js';
import usePageTitle from '../hooks/usePageTitle.js';
import Card from '../components/Card.jsx';
import EmptyState from '../components/EmptyState.jsx';
import StatusBadge from '../components/StatusBadge.jsx';

const INFO_STATUS = {
  Diproses: `Pesanan sedang dimasak. Status berubah otomatis dalam ± ${LAMA_MASAK_MS / 1000} detik (simulasi dapur).`,
  'Siap diambil': 'Pesanan siap. Tunjukkan kode ini di kasir kantin.',
  Selesai: 'Pesanan sudah diambil.',
  Dibatalkan: 'Pesanan dibatalkan.',
};

export default function Ringkasan() {
  usePageTitle('Ringkasan Pemesanan');
  const { id } = useParams();
  const navigate = useNavigate();
  const { orders, updateOrderStatus, deleteOrder } = useKantin();

  if (orders.length === 0) {
    return (
      <div className="container section">
        <h1>Ringkasan Pemesanan</h1>
        <EmptyState pesan="Belum ada pesanan yang dibuat.">
          <Link to="/menu" className="btn">
            Mulai pesan
          </Link>
        </EmptyState>
      </div>
    );
  }

  const order = orders.find((o) => o.id === id) || orders[0];
  const riwayat = orders.filter((o) => o.id !== order.id);

  return (
    <div className="container section">
      <h1>Ringkasan Pemesanan</h1>
      {id && !orders.some((o) => o.id === id) && (
        <p className="notice notice-warn">
          Pesanan <code>{id}</code> tidak ditemukan. Menampilkan pesanan terbaru.
        </p>
      )}

      <Card as="article" className="receipt" aria-labelledby="kode">
        <header className="receipt-head">
          <div>
            <p className="muted">Kode pesanan</p>
            <p id="kode" className="order-code">
              {order.id}
            </p>
            <p className="muted">{tanggalWaktu(order.createdAt)}</p>
          </div>
          <StatusBadge status={order.status} />
        </header>
        <p className="muted status-info" role="status">
          {INFO_STATUS[order.status]}
        </p>

        <table className="table">
          <thead>
            <tr>
              <th scope="col">Menu</th>
              <th scope="col" className="num">
                Jumlah
              </th>
              <th scope="col" className="num">
                Subtotal
              </th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((i) => (
              <tr key={i.id}>
                <td>
                  {i.name}
                  <span className="muted block">{rupiah(i.price)} per porsi</span>
                </td>
                <td className="num">{i.qty}</td>
                <td className="num">{rupiah(i.subtotal)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th scope="row" colSpan="2">
                Total bayar
              </th>
              <td className="num total">{rupiah(order.total)}</td>
            </tr>
          </tfoot>
        </table>

        <dl className="meta">
          <div>
            <dt>Pemesan</dt>
            <dd>{order.customer.nama}</dd>
          </div>
          <div>
            <dt>WhatsApp</dt>
            <dd>{order.customer.wa}</dd>
          </div>
          <div>
            <dt>Pengambilan</dt>
            <dd>{order.customer.cara}</dd>
          </div>
          <div>
            <dt>Waktu ambil</dt>
            <dd>{order.customer.waktu}</dd>
          </div>
          <div>
            <dt>Pembayaran</dt>
            <dd>{order.customer.bayar}</dd>
          </div>
          {order.customer.catatan && (
            <div>
              <dt>Catatan</dt>
              <dd>{order.customer.catatan}</dd>
            </div>
          )}
        </dl>

        <div className="receipt-actions">
          {order.status === 'Siap diambil' && (
            <button
              type="button"
              className="btn btn-small"
              onClick={() => updateOrderStatus(order.id, 'Selesai')}
            >
              Tandai sudah diambil
            </button>
          )}
          {order.status === 'Diproses' && (
            <button
              type="button"
              className="btn btn-ghost btn-small"
              onClick={() =>
                window.confirm(`Batalkan pesanan ${order.id}?`) &&
                updateOrderStatus(order.id, 'Dibatalkan')
              }
            >
              Batalkan pesanan
            </button>
          )}
          <button type="button" className="btn btn-ghost btn-small" onClick={() => window.print()}>
            Cetak
          </button>
          <button
            type="button"
            className="link-btn danger"
            onClick={() => {
              if (window.confirm(`Hapus pesanan ${order.id}?`)) {
                deleteOrder(order.id);
                navigate('/ringkasan');
              }
            }}
          >
            Hapus pesanan
          </button>
        </div>
      </Card>

      {riwayat.length > 0 && (
        <section className="section-sub" aria-labelledby="h-riwayat">
          <h2 id="h-riwayat">Pesanan sebelumnya</h2>
          <ul className="history">
            {riwayat.map((o) => (
              <li key={o.id}>
                <Link to={`/ringkasan/${o.id}`} className="menu-name">
                  {o.id}
                </Link>
                <span className="muted">{tanggalWaktu(o.createdAt)}</span>
                <StatusBadge status={o.status} />
                <strong>{rupiah(o.total)}</strong>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
