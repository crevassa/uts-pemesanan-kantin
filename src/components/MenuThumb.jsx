export default function MenuThumb({ item, size = '' }) {
  // Pakai foto kalau item punya properti `foto`, kalau tidak pakai emoji.
  return item.foto ? (
    <img className={`menu-thumb ${size}`} src={item.foto} alt={item.name} loading="lazy" />
  ) : (
    <span className={`menu-emoji ${size}`} aria-hidden="true">
      {item.emoji}
    </span>
  );
}
