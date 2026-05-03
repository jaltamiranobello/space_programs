import { useEffect, useState } from "react";

export default function LaunchForm() {
  const [programs, setPrograms] = useState([]);
  const [satellites, setSatellites] = useState([]);

  const [form, setForm] = useState({
    program_name: "",
    satellite_id: "",
    launch_location: "",
    launch_date: "",
    launch_year: "",
    return_date: "",
    return_year: ""
  });

  // LOAD DROPDOWNS
  useEffect(() => {
    fetch("/api/program-options")
      .then(res => res.json())
      .then(setPrograms);

    fetch("/api/satellite-options")
      .then(res => res.json())
      .then(setSatellites);
  }, []);

  // HANDLE INPUTS
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // SUBMIT FORM
  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/launches", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    const data = await res.json();

    if (data.success) {
      alert("Launch inserted successfully!");

      // reset form
      setForm({
        program_name: "",
        satellite_id: "",
        launch_location: "",
        launch_date: "",
        launch_year: "",
        return_date: "",
        return_year: ""
      });
    } else {
      alert("Insert failed");
    }
  };

  return (
    <div style={{ background: "white", padding: "10px"}}>
      <h2>Insert Launch</h2>

      {/* PROGRAM */}
      <select name="program_name" onChange={handleChange} value={form.program_name}>
        <option value="">Select Program</option>
        {programs.map((p, i) => (
          <option key={i} value={p.program_name}>
            {p.program_name}
          </option>
        ))}
      </select>

      {/* SATELLITE */}
      <select name="satellite_id" onChange={handleChange} value={form.satellite_id}>
        <option value="">Select Satellite</option>
        {satellites.map((s, i) => (
          <option key={i} value={s.satellite_id}>
            {s.satellite_id}
          </option>
        ))}
      </select>

      {/* INPUTS */}
      <input name="launch_location" placeholder="Launch Location" onChange={handleChange} />
      <input type="date" name="launch_date" onChange={handleChange} />
      <input type="number" name="launch_year" placeholder="Launch Year" onChange={handleChange} />
      <input type="date" name="return_date" onChange={handleChange} />
      <input type="number" name="return_year" placeholder="Return Year" onChange={handleChange} />

      <button onClick={handleSubmit}>Submit Launch</button>
    </div>
  );
}