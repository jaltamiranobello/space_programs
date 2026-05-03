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

  // ---------------- SIGNATURE ENTRY ----------------
  const [newSignature, setNewSignature] = useState({
  treaty_title: "",
  country_name: "",
  signed_date: "",
  bound_date: ""
  });

  const handleSignatureChange = (e) => {
  const { name, value } = e.target;
  setNewSignature((prev) => ({
    ...prev,
    [name]: value
  }));
  };

  const submitSignature = async () => {
  try {
    const payload = {
      ...newSignature,
      signed_year: newSignature.signed_date
        ? newSignature.signed_date.split("-")[0]
        : null,
      bound_year: newSignature.bound_date
        ? newSignature.bound_date.split("-")[0]
        : null
    };

    const res = await fetch("http://localhost:5001/api/signatures", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error("Failed to insert");

    // refresh table if open
    if (visible.signatures) {
      fetchTable("signatures");
    }

    // reset form
    setNewSignature({
      treaty_title: "",
      country_name: "",
      signed_date: "",
      bound_date: ""
    });

  } catch (err) {
    console.error(err);
  }
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
      <h2>Insert Data</h2>
      <h3>Add Signature</h3>
      <div className="form">

        <div className="form-group">
          <label>Treaty Title: </label>
          <select
            name="treaty_title"
            value={newSignature.treaty_title}
            onChange={handleSignatureChange}
          >
            <option value="">Select Treaty</option>
            {data.treaties?.map((t) => (
              <option key={t.treaty_title} value={t.treaty_title}>
                {t.treaty_title}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Country Name: </label>
          <select
            name="country_name"
            value={newSignature.country_name}
            onChange={handleSignatureChange}
          >
            <option value="">Select Country</option>
            {countries.map((c) => (
              <option key={c.country_name} value={c.country_name}>
                {c.country_name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Signed Date: </label>
          <input
            type="date"
            name="signed_date"
            value={newSignature.signed_date}
            onChange={handleSignatureChange}
          />
        </div>

        <div className="form-group">
          <label>Bound Date: </label>
          <input
            type="date"
            name="bound_date"
            value={newSignature.bound_date}
            onChange={handleSignatureChange}
          />
        </div>

        <button onClick={submitSignature}>
          Add Signature
        </button>

      </div>

      <h2>View Data:</h2>
      <em>Users may filter tables by country name or view all cells in a table!</em><br></br><br></br>
      <em>NOTE: Satellites & Treaties cannot be filtered by country</em><br></br><br></br>
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