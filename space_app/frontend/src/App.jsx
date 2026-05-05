import { useEffect, useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import FilterBar from "./components/FilterBar";
import TableToggle from "./components/TableToggle";
import TableView from "./components/TableView";
import AddDataModal from "./components/AddDataModal";

const tables = [
  "countries",
  "programs",
  "treaties",
  "satellites",
  "launches",
  "signatures"
];

export default function App() {
  const [data, setData] = useState({});
  const [visible, setVisible] = useState(
    Object.fromEntries(tables.map(t => [t, false]))
  );

  const [countries, setCountries] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);

  /* ---------------- COUNTRIES ---------------- */
  useEffect(() => {
    fetch("http://localhost:5001/api/countries")
      .then(res => res.json())
      .then(setCountries);
  }, []);

  /* ---------------- FETCH TABLE ---------------- */
  const fetchTable = async (table) => {
    let url = `http://localhost:5001/api/${table}`;

    if (selectedCountries.length) {
      url += `?country=${selectedCountries.join(",")}`;
    }

    const res = await fetch(url);
    const json = await res.json();

    setData(prev => ({
      ...prev,
      [table]: Array.isArray(json) ? json : []
    }));
  };

  const clearTable = (table) => {
    setData(prev => {
      const copy = { ...prev };
      delete copy[table];
      return copy;
    });
  };

  /* ---------------- REFRESH ON FILTER ---------------- */
  useEffect(() => {
    Object.keys(visible).forEach(table => {
      if (visible[table]) fetchTable(table);
    });
  }, [selectedCountries]);

  /* ---------------- TOGGLE TABLE ---------------- */
  const toggleTable = (table) => {
    const newState = !visible[table];

    setVisible(prev => ({
      ...prev,
      [table]: newState
    }));

    if (newState) fetchTable(table);
    else clearTable(table);
  };

  /* ---------------- CSV ---------------- */
  const downloadCSV = (table) => {
    window.open(`http://localhost:5001/api/${table}/export`);
  };

  return (
    <div>
      <Navbar onAdd={() => setModalOpen(true)} />

      <div className="container">
        <FilterBar
          countries={countries}
          selectedCountries={selectedCountries}
          setSelectedCountries={setSelectedCountries}
        />

        <TableToggle
          tables={tables}
          visible={visible}
          toggle={toggleTable}
        />

        {Object.entries(data).map(([name, rows]) => (
          <TableView
            key={name}
            name={name}
            rows={rows}
            onDownload={downloadCSV}
          />
        ))}
      </div>

      {modalOpen && (
        <AddDataModal onClose={() => setModalOpen(false)} />
      )}
    </div>
  );
}