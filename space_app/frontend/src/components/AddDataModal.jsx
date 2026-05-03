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

    fetch(`http://localhost:5000/api/${selectedTable}/schema`)
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
    await fetch(`http://localhost:5000/api/${selectedTable}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    });

    onClose();
  };

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

            {fields.map(field => (
              <input
                key={field.column_name}
                type={getInputType(field.data_type)}
                placeholder={field.column_name}
                onChange={(e) =>
                  handleChange(field.column_name, e.target.value)
                }
              />
            ))}

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