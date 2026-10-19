export default function QtyStepper({ value, onChange, label, max }) {
  return (
    <div className="stepper" role="group" aria-label={`Jumlah ${label}`}>
      <button type="button" onClick={() => onChange(value - 1)} aria-label={`Kurangi ${label}`}>
        −
      </button>
      <output aria-live="polite">{value}</output>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        aria-label={`Tambah ${label}`}
        disabled={value >= max}
      >
        +
      </button>
    </div>
  );
}
