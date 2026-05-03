import { useState } from "react";

export default function useFetch() {
  const [data, setData] = useState({});

  const fetchTable = async (table, filters = {}) => {
    try {
      let url = `http://localhost:5000/api/${table}`;

      if (filters.countries?.length) {
        const query = encodeURIComponent(filters.countries.join(","));
        url += `?countries=${query}`;
      }

      const res = await fetch(url);
      const json = await res.json();

      setData((prev) => ({
        ...prev,
        [table]: Array.isArray(json) ? json : []
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const clearTable = (table) => {
    setData((prev) => {
      const copy = { ...prev };
      delete copy[table];
      return copy;
    });
  };

  return { data, fetchTable, clearTable };
}