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

  // ---------------- TREATY FORM ----------------
  const [treatyForm, setTreatyForm] = useState({
    treaty_title: "",
    treaty_abbreviation: "",
    date_created: "",
    year_created: ""
  });

  const [treatyMessage, setTreatyMessage] = useState("");

  // ---------------- SATELLITE FORM ----------------
  const [satelliteForm, setSatelliteForm] = useState({
    serial_number: "",
    currently_in_orbit: "",
    year_made: ""
  });

  const [satelliteMessage, setSatelliteMessage] = useState("");

  // ---------------- FETCH COUNTRIES ----------------
  useEffect(() => {
    const loadCountries = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/countries");
        const json = await res.json();
        setCountries(json || []);
      } catch (err) {
        console.error(err);
      }
    };

    loadCountries();
  }, []);

  // ---------------- FETCH TABLE ----------------
  const fetchTable = async (table) => {
  try {

    // ---------------- SPECIAL CASE ----------------
    // if BOTH countries + programs are selected, override logic
    if (table === "programs-countries") {
      const res = await fetch(`http://localhost:5001/api/countries-programs`);
      const json = await res.json();

      setData((prev) => ({
        ...prev,
        countries: json,
        programs: json
      }));

      return;
    }

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

    const selected = {
  ...visible,
  [table]: newState
};

  const selectedTables = Object.entries(selected)
    .filter(([_, v]) => v)
    .map(([k]) => k);

  // SPECIAL CASE: countries + programs
  if (selectedTables.includes("countries") && selectedTables.includes("programs")) {
    fetchTable("programs-countries");
    return;
  }

  if (newState) fetchTable(table);
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

    if (selectedCountries.length === 0) {
      return rows;
    }

    return rows.filter((r) =>
      selectedCountries.includes(r.country_name)
    );
  };

  // ---------------- CSV ----------------
  const downloadCSV = (table) => {
    window.open(`http://localhost:5001/api/${table}/export`, "_blank");
  };

  // ---------------- INSERT TREATY ----------------
  const submitTreaty = async (e) => {
    e.preventDefault();

    try {

      const res = await fetch("http://localhost:5001/api/treaties", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(treatyForm)
      });

      const json = await res.json();

      if (!res.ok) {
        setTreatyMessage(json.error);
        return;
      }

      setTreatyMessage(json.message);

      setTreatyForm({
        treaty_title: "",
        treaty_abbreviation: "",
        date_created: "",
        year_created: ""
      });

    } catch (err) {
      console.error(err);
      setTreatyMessage("Server error.");
    }
  };

  // ---------------- INSERT SATELLITE ----------------
  const submitSatellite = async (e) => {
  e.preventDefault();

  try {

    const payload = {
      ...satelliteForm,
      currently_in_orbit:
        satelliteForm.currently_in_orbit === "true"
          ? 1
          : satelliteForm.currently_in_orbit === "false"
          ? 0
          : null
    };

    const res = await fetch("http://localhost:5001/api/satellites", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const json = await res.json();

    if (!res.ok) {
      setSatelliteMessage(json.error);
      return;
    }

    setSatelliteMessage(json.message);

    setSatelliteForm({
      serial_number: "",
      currently_in_orbit: "",
      year_made: ""
    });

  } catch (err) {
    console.error(err);
    setSatelliteMessage("Server error.");
  }
};

  // ---------------- UI ----------------
  return (
    <div className="app-container">

      <h1 className="title">
        Space Database Dashboard
      </h1>

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
              <label
                key={c.country_name}
                className="dropdown-item"
              >
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

      {/* ---------------- INSERT TREATY ---------------- */}

      <div className="form-section">

        <h2>Add Treaty</h2>

        <form
          onSubmit={submitTreaty}
          className="form-card"
        >

          <input
            type="text"
            placeholder="Treaty Title *"
            value={treatyForm.treaty_title}
            onChange={(e) =>
              setTreatyForm({
                ...treatyForm,
                treaty_title: e.target.value
              })
            }
            required
          />

          <input
            type="text"
            placeholder="Abbreviation or N/A"
            value={treatyForm.treaty_abbreviation}
            onChange={(e) =>
              setTreatyForm({
                ...treatyForm,
                treaty_abbreviation: e.target.value
              })
            }
          />

          <input
            type="date"
            value={treatyForm.date_created}
            onChange={(e) =>
              setTreatyForm({
                ...treatyForm,
                date_created: e.target.value
              })
            }
          />

          <input
            type="number"
            placeholder="Year Created"
            value={treatyForm.year_created}
            onChange={(e) =>
              setTreatyForm({
                ...treatyForm,
                year_created: e.target.value
              })
            }
          />

          <button type="submit">
            Insert Treaty
          </button>

          {treatyMessage && (
            <p className="message">
              {treatyMessage}
            </p>
          )}

        </form>

      </div>

      {/* ---------------- INSERT SATELLITE ---------------- */}

      <div className="form-section">

        <h2>Add Satellite</h2>

        <form
          onSubmit={submitSatellite}
          className="form-card"
        >

          <input
            type="text"
            placeholder="Serial Number or N/A"
            value={satelliteForm.serial_number}
            onChange={(e) =>
              setSatelliteForm({
                ...satelliteForm,
                serial_number: e.target.value
              })
            }
          />

          <select
            value={satelliteForm.currently_in_orbit}
            onChange={(e) =>
              setSatelliteForm({
                ...satelliteForm,
                currently_in_orbit: e.target.value
              })
            }
          >
            <option value="">
              Select Orbit Status
            </option>

            <option value="true">
              In Orbit
            </option>

            <option value="false">
              Not In Orbit
            </option>

            <option value="N/A">
              N/A
            </option>
          </select>

          <input
            type="number"
            placeholder="Year Made"
            value={satelliteForm.year_made}
            onChange={(e) =>
              setSatelliteForm({
                ...satelliteForm,
                year_made: e.target.value
              })
            }
          />

          <button type="submit">
            Insert Satellite
          </button>

          {satelliteMessage && (
            <p className="message">
              {satelliteMessage}
            </p>
          )}

        </form>

      </div>

      {/* TABLE DISPLAY */}

      {Object.entries(data).map(([tableName, rows]) => {

        const filtered = applyFilters(rows);

        return (
          <div
            key={tableName}
            className="table-section"
          >

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
                      <th key={k}>
                        {k}
                      </th>
                    ))}
                </tr>
              </thead>

              <tbody>

                {filtered.length > 0 ? (

                  filtered.map((row, i) => (
                    <tr key={i}>

                      {Object.values(row).map((v, j) => (
                        <td key={j}>
                          {String(v)}
                        </td>
                      ))}

                    </tr>
                  ))

                ) : (

                  <tr>
                    <td colSpan="10">
                      No data
                    </td>
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