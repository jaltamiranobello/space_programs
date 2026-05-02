import { useState, useEffect } from "react";
import "./App.css";

const tables = [
  "countries",
  "programs",
  "treaties",
  "satellites",
  "launches",
  "signatures"
];

export default function App() {
  // ---------------- TABLE VISIBILITY ----------------
  const [visible, setVisible] = useState(
    Object.fromEntries(tables.map(t => [t, false]))
  );

  // ---------------- DATA ----------------
  const [data, setData] = useState({});

  // ---------------- COUNTRIES FILTER ----------------
  const [countries, setCountries] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);

  // ---------------- FETCH COUNTRIES ----------------
  useEffect(() => {
    const loadCountries = async () => {
      const res = await fetch("http://localhost:5001/api/countries");
      const json = await res.json();
      setCountries(json || []);
    };

    loadCountries();
  }, []);

  // ---------------- FETCH TABLE ----------------
  const fetchTable = async (table) => {
    try {
      const res = await fetch(`http://localhost:5001/api/${table}`);
      const json = await res.json();

      setData((prev) => ({
        ...prev,
        [table]: Array.isArray(json) ? json : []
      }));
    } catch (err) {
      console.error(err);
    }
  };

  // ---------------- TOGGLE TABLE ----------------
  const toggleTable = (table) => {
    const newState = !visible[table];

    setVisible((prev) => ({
      ...prev,
      [table]: newState
    }));

    if (newState) fetchTable(table);
    else {
      setData((prev) => {
        const copy = { ...prev };
        delete copy[table];
        return copy;
      });
    }
  };

  // ---------------- COUNTRY FILTER ----------------
  const toggleCountry = (name) => {
    setSelectedCountries((prev) =>
      prev.includes(name)
        ? prev.filter((c) => c !== name)
        : [...prev, name]
    );
  };

  const toggleAllCountries = () => {
    if (selectedCountries.length === countries.length) {
      setSelectedCountries([]);
    } else {
      setSelectedCountries(countries.map(c => c.country_name));
    }
  };

  const applyFilters = (rows) => {
    if (!rows) return [];
    if (selectedCountries.length === 0) return rows;

    return rows.filter((r) =>
      selectedCountries.includes(r.country_name)
    );
  };

  // ---------------- CSV ----------------
  const downloadCSV = (table) => {
    window.open(`http://localhost:5001/api/${table}/export`, "_blank");
  };

  // ---------------- UI ----------------
  return (
    <div className="app-container">
      <h1 className="title">Space Database Dashboard</h1>

      {/* FILTER */}
      <div className="filter-wrapper">
        <button
          className="filter-button"
          onClick={() => setFilterOpen(!filterOpen)}
        >
          Filter Countries ▼
        </button>

        {filterOpen && (
          <div className="dropdown">
            <label className="dropdown-item">
              <input
                type="checkbox"
                checked={selectedCountries.length === countries.length}
                onChange={toggleAllCountries}
              />
              All
            </label>

            <hr />

            {countries.map((c) => (
              <label key={c.country_name} className="dropdown-item">
                <input
                  type="checkbox"
                  checked={selectedCountries.includes(c.country_name)}
                  onChange={() => toggleCountry(c.country_name)}
                />
                {c.country_name}
              </label>
            ))}
          </div>
        )}
      </div>

      {/* TABLE TOGGLES */}
      <h3>Tables</h3>
      {tables.map((t) => (
        <label key={t} className="table-toggle">
          <input
            type="checkbox"
            checked={visible[t]}
            onChange={() => toggleTable(t)}
          />
          {t}
        </label>
      ))}

      {/* TABLE DISPLAY */}
      {Object.entries(data).map(([tableName, rows]) => {
        const filtered = applyFilters(rows);

        return (
          <div key={tableName} className="table-section">
            <h2>{tableName}</h2>

            <button
              className="csv-button"
              onClick={() => downloadCSV(tableName)}
            >
              Download CSV
            </button>

            <table className="data-table">
              <thead>
                <tr>
                  {filtered[0] &&
                    Object.keys(filtered[0]).map((k) => (
                      <th key={k}>{k}</th>
                    ))}
                </tr>
              </thead>

              <tbody>
                {filtered.length > 0 ? (
                  filtered.map((row, i) => (
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
        );
      })}
    </div>
  );
}