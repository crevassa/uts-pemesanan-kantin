import { rupiah } from '../utils/format.js';
import MenuThumb from './MenuThumb.jsx';
import AddButton from './AddButton.jsx';

// Satu baris papan menu. Data dan aksi masuk lewat props, jadi komponen ini tidak bergantung ke context.
export default function MenuRow({ item, jumlah, onAdd }) {
  return (
    <li className={`menu-row ${item.available ? '' : 'sold-out'}`}>
      <MenuThumb item={item} />
      <div className="menu-main">
        <div className="menu-title">
          <span className="menu-name">{item.name}</span>
          <span className="leader" aria-hidden="true" />
          <span className="menu-price">{rupiah(item.price)}</span>
        </div>
        <p className="menu-desc">{item.desc}</p>
      </div>
      {item.available ? (
        <AddButton jumlah={jumlah} onAdd={() => onAdd(item.id)} nama={item.name} />
      ) : (
        <span className="tag tag-habis">Habis</span>
      )}
    </li>
  );
}
