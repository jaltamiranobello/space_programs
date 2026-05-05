import { useState, useEffect } from "react";

const tables = [
  "countries",
  "programs",
  "treaties",
  "satellites",
  "launches",
  "signatures"
];

export default function AddDataModal({ onClose }) {
  const [step, setStep] = useState(1);
  const [selectedTable, setSelectedTable] = useState(null);
  const [fields, setFields] = useState([]);
  const [form, setForm] = useState({});

  useEffect(() => {
    if (!selectedTable) return;

    fetch(`http://localhost:5001/api/${selectedTable}/schema`)
      .then(res => res.json())
      .then(data => setFields(data));
  }, [selectedTable]);

  const handleChange = (key, value) => {
    setForm(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const getInputType = (type) => {
    if (type.includes("int")) return "number";
    if (type.includes("date")) return "date";
    return "text";
  };

  const handleSubmit = async () => {
    let cleanedForm = { ...form };

    // ONLY allow has_program for countries table
    if (selectedTable !== "countries") {
      delete cleanedForm.has_program;
    }

    await fetch(`http://localhost:5001/api/${selectedTable}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(cleanedForm)
    });

    onClose();
  };

  const formatLabel = (text) =>
  text.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());

  const [countries, setCountries] = useState([]);

  useEffect(() => {
    if (
      selectedTable !== "programs" &&
      selectedTable !== "signatures"
    ) return;

    fetch("http://localhost:5001/api/countries")
      .then(res => res.json())
      .then(data => setCountries(data));
  }, [selectedTable]);

  const [programs, setPrograms] = useState([]);

  useEffect(() => {
  if (selectedTable !== "launches") return;

  fetch("http://localhost:5001/api/programs")
    .then(res => res.json())
    .then(data => setPrograms(data));
  }, [selectedTable]);

  const [satellites, setSatellites] = useState([]);
  
  useEffect(() => {
  if (selectedTable !== "launches") return;

  fetch("http://localhost:5001/api/satellites")
    .then(res => res.json())
    .then(data => setSatellites(data));
  }, [selectedTable]);

  const [treaties, setTreaties] = useState([]);

  useEffect(() => {
  if (selectedTable !== "signatures") return;

  fetch("http://localhost:5001/api/treaties")
    .then(res => res.json())
    .then(data => setTreaties(data));
  }, [selectedTable]);

  return (
    <div className="modal-overlay">
      <div className="modal">

        {/* STEP 1 */}
        {step === 1 && (
          <>
            <h2>Select Table</h2>

            {tables.map(t => (
              <button
                key={t}
                className="table-option"
                onClick={() => {
                  setSelectedTable(t);
                  setStep(2);
                }}
              >
                {t}
              </button>
            ))}

            <button onClick={onClose}>Cancel</button>
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            <h2>Add to {selectedTable}</h2>
            {fields.map(field => {

              // ----------------------------
              // 1. COUNTRIES TABLE BOOLEAN
              // ----------------------------
              if (
                selectedTable === "countries" &&
                field.column_name === "has_program"
              ) {
                return (
                  <div key={field.column_name} className="form-field">
                    <label>Has Program</label>

                    <select
                      value={form[field.column_name] ?? ""}
                      onChange={(e) =>
                        handleChange(field.column_name, Number(e.target.value))
                      }
                    >
                      <option value="">Select True / False</option>
                      <option value={1}>True</option>
                      <option value={0}>False</option>
                    </select>
                  </div>
                );
              }

              // ----------------------------
              // 2. PROGRAMS TABLE → COUNTRY DROPDOWN
              // ----------------------------
              if (
                selectedTable === "programs" &&
                field.column_name === "country_name"
              ) {
                return (
                  <div key={field.column_name} className="form-field">
                    <label>Country</label>

                    <select
                      value={form[field.column_name] ?? ""}
                      onChange={(e) =>
                        handleChange(field.column_name, e.target.value)
                      }
                    >
                      <option value="">Select Country</option>

                      {countries.map(c => (
                        <option key={c.country_name} value={c.country_name}>
                          {c.country_name}
                        </option>
                      ))}
                    </select>
                  </div>
                );
              }

              // ----------------------------
              // 3. LAUNCHES -> program dropdown
              // ----------------------------
              if (
                selectedTable === "launches" &&
                field.column_name === "program_name"
              ) {
                return (
                  <div key={field.column_name} className="form-field">
                    <label>Program</label>

                    <select
                      value={form[field.column_name] ?? ""}
                      onChange={(e) =>
                        handleChange(field.column_name, e.target.value)
                      }
                    >
                      <option value="">Select Program</option>

                      {programs.map(p => (
                        <option key={p.program_name} value={p.program_name}>
                          {p.program_name}
                        </option>
                      ))}
                    </select>
                  </div>
                );
              }

              // ----------------------------
              // 4. LAUNCHES -> Satellite dropdown
              // ----------------------------
              if (
                selectedTable === "launches" &&
                field.column_name === "satellite_id"
              ) {
                return (
                  <div key={field.column_name} className="form-field">
                    <label>Satellite</label>

                    <select
                      value={form[field.column_name] ?? ""}
                      onChange={(e) =>
                        handleChange(field.column_name, Number(e.target.value))
                      }
                    >
                      <option value="">Select Satellite</option>

                      {satellites.map(s => (
                        <option key={s.satellite_id} value={s.satellite_id}>
                          {s.satellite_id}
                        </option>
                      ))}
                    </select>
                  </div>
                );
              }

              // ----------------------------
              // 5. SIGNATURES -> Country dropdown
              // ----------------------------
              if (
                selectedTable === "signatures" &&
                field.column_name === "country_name"
              ) {
                return (
                  <div key={field.column_name} className="form-field">
                    <label>Country</label>

                    <select
                      value={form[field.column_name] ?? ""}
                      onChange={(e) =>
                        handleChange(field.column_name, e.target.value)
                      }
                    >
                      <option value="">Select Country</option>

                      {countries.map(c => (
                        <option key={c.country_name} value={c.country_name}>
                          {c.country_name}
                        </option>
                      ))}
                    </select>
                  </div>
                );
              }

              // ----------------------------
              // 6. SIGNATURES -> Treaty dropdown
              // ----------------------------
              if (
                selectedTable === "signatures" &&
                field.column_name === "treaty_title"
              ) {
                return (
                  <div key={field.column_name} className="form-field">
                    <label>Treaty</label>

                    <select
                      value={form[field.column_name] ?? ""}
                      onChange={(e) =>
                        handleChange(field.column_name, e.target.value)
                      }
                    >
                      <option value="">Select Treaty</option>

                      {treaties.map(t => (
                        <option key={t.treaty_title} value={t.treaty_title}>
                          {t.treaty_title}
                        </option>
                      ))}
                    </select>
                  </div>
                );
              }

              // ----------------------------
              // 7. SATELLITES -> currently_in_orbit dropdown
              // ----------------------------
              if (
                selectedTable === "satellites" &&
                field.column_name === "currently_in_orbit"
              ) {
                return (
                  <div key={field.column_name} className="form-field">
                    <label>Currently in Orbit</label>

                    <select
                      value={form[field.column_name] ?? ""}
                      onChange={(e) =>
                        handleChange(field.column_name, Number(e.target.value))
                      }
                    >
                      <option value="">Select True / False</option>
                      <option value={1}>True</option>
                      <option value={0}>False</option>
                    </select>
                  </div>
                );
                }

              // ----------------------------
              // 8. DEFAULT INPUT
              // ----------------------------
              const isNonNegativeIntField =
                selectedTable === "programs" &&
                (field.column_name === "num_of_satellites" ||
                field.column_name === "num_of_astronauts");

              return (
                <input
                  key={field.column_name}
                  type={getInputType(field.data_type)}
                  placeholder={field.column_name}
                  min={isNonNegativeIntField ? 0 : undefined}
                  step={isNonNegativeIntField ? 1 : undefined}
                  onChange={(e) => {
                    let value = e.target.value;

                    if (isNonNegativeIntField) {
                      value = value === "" ? "" : parseInt(value, 10);

                      if (isNaN(value) || value < 0) return; // block invalid input
                    }

                    handleChange(field.column_name, value);
                  }}
                />
              );

            })}

            <div className="modal-actions">
              <button onClick={handleSubmit}>Submit</button>
              <button onClick={() => setStep(1)}>Back</button>
              <button onClick={onClose}>Cancel</button>
            </div>
          </>
        )}

      </div>
    </div>
  );
}