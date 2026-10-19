import { cloneElement } from 'react';

// Satu kolom form: label + kontrol + pesan error (+ petunjuk opsional).
// Atribut aksesibilitas (id, aria-invalid, aria-describedby) dipasang otomatis ke kontrol.
export default function FormField({ id, label, error, hint, children }) {
  const control = cloneElement(children, {
    id,
    'aria-invalid': Boolean(error),
    'aria-describedby': `e-${id}`,
  });
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      {control}
      <p className="error" id={`e-${id}`}>
        {error || ''}
      </p>
      {hint && <p className="hint">{hint}</p>}
    </div>
  );
}
