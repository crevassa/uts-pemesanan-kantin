// Slot berformat "HH.MM". Slot non-jam (mis. "Secepatnya") tidak pernah lewat.
export function slotLewat(slot, now) {
  const m = /^(\d{2})\.(\d{2})$/.exec(slot);
  if (!m) return false;
  return Number(m[1]) * 60 + Number(m[2]) <= now.getHours() * 60 + now.getMinutes();
}
