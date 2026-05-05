require("dotenv").config();

const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

/* ---------------- TABLE MAP ---------------- */
const tableMap = {
  countries: "Countries",
  programs: "Programs",
  treaties: "Treaties",
  satellites: "Satellites",
  launches: "Launches",
  signatures: "Signatures"
};

/* ---------------- COUNTRY FILTER ---------------- */
const buildCountryFilter = (req, alias = "c") => {
  const { country } = req.query;

  let where = "WHERE 1=1";
  const params = [];

  if (country) {
    const countries = country.split(",");

    where += ` AND ${alias}.country_name IN (${countries.map(() => "?").join(",")})`;
    params.push(...countries);
  }

  return { where, params };
};

/* ---------------- COUNTRIES ---------------- */
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

/* ---------------- PROGRAMS ---------------- */
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

/* ---------------- LAUNCHES ---------------- */
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

/* ---------------- SATELLITES ---------------- */
app.get("/api/satellites", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM Satellites");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ---------------- TREATIES ---------------- */
app.get("/api/treaties", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM Treaties");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ---------------- SIGNATURES ---------------- */
app.get("/api/signatures", async (req, res) => {
  try {
    const { where, params } = buildCountryFilter(req, "c");

    const [rows] = await db.query(
      `SELECT s.*
       FROM Signatures s
       JOIN Countries c ON s.country_name = c.country_name
       ${where}`,
      params
    );

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ---------------- GENERIC POST (ADD DATA) ---------------- */
app.post("/api/:table", async (req, res) => {
  try {
    const apiTable = req.params.table.toLowerCase();
    const table = tableMap[apiTable];

    if (!table) {
      return res.status(400).json({ error: "Invalid table" });
    }

    const data = req.body;

    if (!data || Object.keys(data).length === 0) {
      return res.status(400).json({ error: "No data provided" });
    }

    const keys = Object.keys(data);
    const values = Object.values(data);

    const sql = `
      INSERT INTO \`${table}\`
      (${keys.map(k => `\`${k}\``).join(",")})
      VALUES (${keys.map(() => "?").join(",")})
    `;

    await db.query(sql, values);

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

/* ---------------- SCHEMA ---------------- */
app.get("/api/:table/schema", async (req, res) => {
  const apiTable = req.params.table.toLowerCase();
  const table = tableMap[apiTable];

  if (!table) {
    return res.status(400).json({ error: "Invalid table" });
  }

  try {
    const [rows] = await db.query(
      `
      SELECT 
        COLUMN_NAME as column_name,
        DATA_TYPE as data_type,
        EXTRA as extra
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = ?
      ORDER BY ORDINAL_POSITION
      `,
      [table]
    );

    res.json(rows.filter(col => col.extra !== "auto_increment"));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.get('/api/:table/export', async (req, res) => {
  try {
    const apiTable = req.params.table.toLowerCase();
    const table = tableMap[apiTable];

  if (!table) {
    return res.status(400).json({ error: "Invalid table" });
  }

    // Fetch data
    const [rows] = await db.query(`SELECT * FROM \`${table}\``);

    if (!rows.length) {
      return res.status(404).json({ error: 'No data found' });
    }

    // Get column names from first row
    const columns = Object.keys(rows[0]);

    // Build CSV
    let csv = columns.join(',') + '\n';

    rows.forEach(row => {
      const values = columns.map(col => {
        let val = row[col];

        // Handle null/undefined and commas
        if (val === null || val === undefined) return '';
        return `"${String(val).replace(/"/g, '""')}"`;
      });

      csv += values.join(',') + '\n';
    });

    // Dynamic filename
    const filename = `${table}.csv`;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    res.send(csv);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

/* ---------------- START ---------------- */
app.listen(5001, () => {
  console.log("API running on port 5001");
});