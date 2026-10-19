// Tampilan saat data kosong. `children` berisi aksi (tombol/tautan).
export default function EmptyState({ pesan, children }) {
  return (
    <div className="empty">
      <p>{pesan}</p>
      {children}
    </div>
  );
}
