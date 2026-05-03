require("dotenv").config();

const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

// ---------------- FILTER HELPER ----------------
const buildCountryFilter = (req, alias = "c") => {
  const { country } = req.query;

  let where = "WHERE 1=1";
  const params = [];

  if (country) {
    where += ` AND ${alias}.country_name LIKE ?`;
    params.push(`%${country}%`);
  }

  return { where, params };
};

// ---------------- COUNTRIES ----------------
app.get("/api/countries", async (req, res) => {
  try {
    const { where, params } = buildCountryFilter(req, "c");

    const [rows] = await db.query(
      `SELECT * FROM Countries c ${where}`,
      params
    );

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------- PROGRAMS ----------------
app.get("/api/programs", async (req, res) => {
  try {
    const { where, params } = buildCountryFilter(req, "c");

    const [rows] = await db.query(
      `SELECT p.*
       FROM Programs p
       JOIN Countries c ON p.country_name = c.country_name
       ${where}`,
      params
    );

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------- LAUNCHES ----------------
app.get("/api/launches", async (req, res) => {
  try {
    const { where, params } = buildCountryFilter(req, "c");

    const [rows] = await db.query(
      `SELECT 
          l.program_name,
          l.launch_location,
          l.launch_date,
          l.launch_year,
          l.return_date,
          l.return_year,

          s.satellite_id,
          s.serial_number,
          s.currently_in_orbit,
          s.year_made,

          p.country_name

       FROM Launches l
       JOIN Programs p ON l.program_name = p.program_name
       JOIN Countries c ON p.country_name = c.country_name
       JOIN Satellites s ON l.satellite_id = s.satellite_id
       ${where}`,
      params
    );

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/launches/export", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM Launches");

    if (!rows.length) {
      return res.status(200).send("No data");
    }

    // 🔥 AUTO-GENERATE HEADERS
    const headers = Object.keys(rows[0]);

    let csv = headers.join(",") + "\n";

    // 🔥 AUTO-GENERATE ROWS
    rows.forEach(row => {
      const values = headers.map(h => {
        const val = row[h];

        // handle nulls + escaping commas
        if (val === null || val === undefined) return "";
        return `"${String(val).replace(/"/g, '""')}"`;
      });

      csv += values.join(",") + "\n";
    });

    res.header("Content-Type", "text/csv");
    res.attachment("launches.csv");
    res.send(csv);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// ---------------- SATELLITES ----------------

app.get("/api/satellites/export", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM Satellites");

    let csv = "satellite_id,serial_number,currently_in_orbit,year_made\n";

    rows.forEach(r => {
      csv += `${r.satellite_id},${r.serial_number},${r.currently_in_orbit},${r.year_made}\n`;
    });

    res.header("Content-Type", "text/csv");
    res.attachment("satellites.csv");
    res.send(csv);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/satellites", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM Satellites");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------- TREATIES ----------------
app.get("/api/treaties", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM Treaties");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------- SIGNATURES ----------------
app.get("/api/signatures", async (req, res) => {
  try {
    const { where, params } = buildCountryFilter(req, "c");

    const [rows] = await db.query("SELECT * FROM Signatures");

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------- GENERIC INSERT ----------------
app.post("/api/:table", async (req, res) => {
  try {
    const table = req.params.table;
    const data = req.body;

    const keys = Object.keys(data);
    const values = Object.values(data);

    const sql = `
      INSERT INTO ${table}
      (${keys.join(",")})
      VALUES (${keys.map(() => "?").join(",")})
    `;

    await db.query(sql, values);

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/signatures", async (req, res) => {
  const {
    treaty_title,
    country_name,
    signed_date,
    signed_year,
    bound_date,
    bound_year
  } = req.body;

  try {
    await db.query(
      `INSERT INTO Signatures 
       (treaty_title, country_name, signed_date, signed_year, bound_date, bound_year)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        treaty_title,
        country_name,
        signed_date,
        signed_year,
        bound_date,
        bound_year
      ]
    );

    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Insert failed");
  }
});

// ---------------- START ----------------
app.listen(5001, () => {
  console.log("API running on port 5001");
});