import { createContext, useCallback, useContext, useEffect, useMemo } from 'react';
import useLocalStorage from '../hooks/useLocalStorage.js';
import { MENU } from '../data/menu.js';
import { makeOrderId } from '../utils/format.js';

const KantinContext = createContext(null);
export const useKantin = () => useContext(KantinContext);

export const MAKS_QTY = 20;
// Simulasi dapur: pesanan "Diproses" otomatis jadi "Siap diambil" setelah waktu ini.
export const LAMA_MASAK_MS = 20000;

export function KantinProvider({ children }) {
  const [cart, setCart] = useLocalStorage('kantin.cart', {});
  const [orders, setOrders] = useLocalStorage('kantin.orders', []);
  const [messages, setMessages] = useLocalStorage('kantin.messages', []);

  const addItem = useCallback(
    (id, qty = 1) =>
      setCart((c) => ({ ...c, [id]: Math.min((c[id] || 0) + qty, MAKS_QTY) })),
    [setCart],
  );

  const setQty = useCallback(
    (id, qty) =>
      setCart((c) => {
        const next = { ...c };
        if (qty <= 0) delete next[id];
        else next[id] = Math.min(qty, MAKS_QTY);
        return next;
      }),
    [setCart],
  );

  const removeItem = useCallback((id) => setQty(id, 0), [setQty]);
  const clearCart = useCallback(() => setCart({}), [setCart]);

  const lines = useMemo(
    () =>
      Object.entries(cart)
        .map(([id, qty]) => {
          const item = MENU.find((m) => m.id === id);
          return item && item.available
            ? { ...item, qty, subtotal: item.price * qty }
            : null;
        })
        .filter(Boolean),
    [cart],
  );

  const total = lines.reduce((s, l) => s + l.subtotal, 0);
  const count = lines.reduce((s, l) => s + l.qty, 0);

  const placeOrder = useCallback(
    (customer) => {
      const order = {
        id: makeOrderId(),
        createdAt: new Date().toISOString(),
        customer,
        items: lines.map(({ id, name, price, qty, subtotal }) => ({
          id,
          name,
          price,
          qty,
          subtotal,
        })),
        total,
        status: 'Diproses',
      };
      setOrders((o) => [order, ...o]);
      setCart({});
      return order;
    },
    [lines, total, setOrders, setCart],
  );

  const updateOrderStatus = useCallback(
    (id, status) => setOrders((o) => o.map((x) => (x.id === id ? { ...x, status } : x))),
    [setOrders],
  );
  const deleteOrder = useCallback(
    (id) => setOrders((o) => o.filter((x) => x.id !== id)),
    [setOrders],
  );

  // Timer per pesanan "Diproses". Sisa waktu dihitung dari createdAt,
  // jadi tetap benar setelah refresh; timer dibersihkan saat daftar pesanan berubah.
  useEffect(() => {
    const timers = orders
      .filter((o) => o.status === 'Diproses')
      .map((o) => {
        const sisa = new Date(o.createdAt).getTime() + LAMA_MASAK_MS - Date.now();
        return setTimeout(
          () =>
            setOrders((list) =>
              list.map((x) =>
                x.id === o.id && x.status === 'Diproses' ? { ...x, status: 'Siap diambil' } : x,
              ),
            ),
          Math.max(0, sisa),
        );
      });
    return () => timers.forEach(clearTimeout);
  }, [orders, setOrders]);

  const addMessage = useCallback(
    (msg) =>
      setMessages((m) => [
        { ...msg, id: Date.now(), createdAt: new Date().toISOString() },
        ...m,
      ]),
    [setMessages],
  );

  const value = useMemo(
    () => ({
      cart,
      lines,
      total,
      count,
      addItem,
      setQty,
      removeItem,
      clearCart,
      orders,
      placeOrder,
      updateOrderStatus,
      deleteOrder,
      messages,
      addMessage,
    }),
    [cart, lines, total, count, addItem, setQty, removeItem, clearCart, orders, placeOrder,
      updateOrderStatus, deleteOrder, messages, addMessage],
  );

  return <KantinContext.Provider value={value}>{children}</KantinContext.Provider>;
}
