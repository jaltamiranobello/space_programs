export default function TableView({ name, rows, onDownload }) {
  return (
    <div className="table-section">
      <div className="table-section-header">
        <h2>{name}</h2>
        <button onClick={() => onDownload(name)}>
          Download CSV
        </button>
      </div>

      {/* 👇 NEW WRAPPER */}
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              {rows[0] &&
                Object.keys(rows[0]).map((k) => (
                  <th key={k}>{k}</th>
                ))}
            </tr>
          </thead>

          <tbody>
            {rows.length > 0 ? (
              rows.map((row, i) => (
                <tr key={i}>
                  {Object.values(row).map((v, j) => (
                    <td key={j}>{String(v)}</td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10">No data</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}