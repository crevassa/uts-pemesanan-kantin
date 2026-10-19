import { MAKS_QTY } from '../context/KantinContext.jsx';

// Tombol tambah ke pesanan; menampilkan jumlah di keranjang dan terkunci di batas maksimal.
export default function AddButton({ jumlah = 0, onAdd, nama }) {
  const penuh = jumlah >= MAKS_QTY;
  return (
    <button
      type="button"
      className="btn btn-small"
      onClick={onAdd}
      disabled={penuh}
      aria-label={penuh ? `${nama} sudah maksimal ${MAKS_QTY}` : `Tambah ${nama}`}
    >
      {penuh ? `Maks ${MAKS_QTY}` : 'Tambah'}
      {!penuh && jumlah > 0 && <span className="in-cart"> ({jumlah})</span>}
    </button>
  );
}
