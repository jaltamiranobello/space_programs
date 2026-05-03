import CountryFilter from "./CountryFilter";

export default function FilterBar({
  countries,
  selectedCountries,
  setSelectedCountries
}) {
  return (
    <div className="filter-bar">
      <CountryFilter
        countries={countries}
        selectedCountries={selectedCountries}
        setSelectedCountries={setSelectedCountries}
      />

      {/* Future filters go here */}
      {/* <YearFilter /> */}
      {/* <StatusFilter /> */}
    </div>
  );
}