// Pembungkus kartu serbaguna. `as` menentukan elemen HTML (div, form, article, ...).
export default function Card({ as: Tag = 'div', className = '', children, ...rest }) {
  return (
    <Tag className={`card ${className}`.trim()} {...rest}>
      {children}
    </Tag>
  );
}
