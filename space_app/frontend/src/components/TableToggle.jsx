export default function TableToggle({ tables, visible, toggle }) {
  return (
    <div className="table-toggle-container">
      {tables.map((t) => (
        <label
          key={t}
          className={`toggle-item ${visible[t] ? "active" : ""}`}
          onClick={() => toggle(t)}
        >
          <div className="checkbox-box">
            {visible[t] && <span className="checkmark">✓</span>}
          </div>

          <span className="label-text">{t}</span>
        </label>
      ))}
    </div>
  );
}