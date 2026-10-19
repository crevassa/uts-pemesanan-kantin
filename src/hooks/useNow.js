import { useEffect, useState } from 'react';

// Waktu sekarang yang diperbarui berkala, untuk status kantin dan slot waktu ambil.
export default function useNow(intervalMs = 30000) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(t);
  }, [intervalMs]);
  return now;
}
