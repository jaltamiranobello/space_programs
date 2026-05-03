import { useState } from "react";

export default function CountryFilter({
  countries,
  selectedCountries,
  setSelectedCountries
}) {
  const [open, setOpen] = useState(false);

  const toggleCountry = (name) => {
    setSelectedCountries((prev) =>
      prev.includes(name)
        ? prev.filter((c) => c !== name)
        : [...prev, name]
    );
  };

  const toggleAll = () => {
    if (selectedCountries.length === countries.length) {
      setSelectedCountries([]);
    } else {
      setSelectedCountries(countries.map(c => c.country_name));
    }
  };

  return (
    <div className="filter-item">
      {/* 👇 clickable text instead of button */}
      <span className="filter-label" onClick={() => setOpen(!open)}>
        Countries ▾
      </span>

      {open && (
        <div className="dropdown">
          <label>
            <input
              type="checkbox"
              checked={selectedCountries.length === countries.length}
              onChange={toggleAll}
            />
            All
          </label>

          {countries.map((c) => (
            <label key={c.country_name}>
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
  );
}