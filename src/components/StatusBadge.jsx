export default function StatusBadge({ status }) {
  const kelas = `status status-${status.toLowerCase().replace(/\s/g, '-')}`;
  return <span className={kelas}>{status}</span>;
}
