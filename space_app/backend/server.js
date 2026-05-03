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

// Country and program 
app.get("/api/countries-programs", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT p.*
      FROM Countries c
      JOIN Programs p ON c.country_name = p.country_name
      WHERE c.has_program = TRUE
    `);

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
// ---------------- INSERT TREATY ----------------
app.post("/api/treaties", async (req, res) => {
  try {
    let {
      treaty_title,
      treaty_abbreviation,
      date_created,
      year_created
    } = req.body;

    // REQUIRED FIELD
    if (!treaty_title || treaty_title.trim() === "") {
      return res.status(400).json({
        error: "Treaty title is required."
      });
    }

    // HANDLE N/A
    treaty_abbreviation =
      treaty_abbreviation === "N/A" || treaty_abbreviation === ""
        ? null
        : treaty_abbreviation;

    date_created =
      date_created === "N/A" || date_created === ""
        ? null
        : date_created;

    year_created =
      year_created === "N/A" || year_created === ""
        ? null
        : year_created;

    const sql = `
      INSERT INTO Treaties
      (
        treaty_title,
        treaty_abbreviation,
        date_created,
        year_created
      )
      VALUES (?, ?, ?, ?)
    `;

    await db.query(sql, [
      treaty_title,
      treaty_abbreviation,
      date_created,
      year_created
    ]);

    res.json({
      success: true,
      message: "Treaty inserted successfully."
    });

  } catch (err) {

    // DUPLICATE KEY
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({
        error: "Treaty already exists or abbreviation must be unique."
      });
    }

    res.status(500).json({
      error: "Failed to insert treaty."
    });
  }
});

// ---------------- INSERT SATELLITE ----------------
app.post("/api/satellites", async (req, res) => {
  try {
    let {
      serial_number,
      currently_in_orbit,
      year_made
    } = req.body;

    serial_number =
      serial_number === "N/A" || serial_number === ""
        ? null
        : serial_number;

    year_made =
      year_made === "N/A" || year_made === ""
        ? null
        : year_made;

    // convert string to boolean
    if (currently_in_orbit === "true") {
      currently_in_orbit = true;
    } else if (currently_in_orbit === "false") {
      currently_in_orbit = false;
    } else {
      currently_in_orbit = null;
    }

    const sql = `
      INSERT INTO Satellites
      (
        serial_number,
        currently_in_orbit,
        year_made
      )
      VALUES (?, ?, ?)
    `;

    await db.query(sql, [
      serial_number,
      currently_in_orbit,
      year_made
    ]);

    res.json({
      success: true,
      message: "Satellite inserted successfully."
    });

  } catch (err) {

    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({
        error: "Serial number must be unique."
      });
    }

    res.status(500).json({
      error: "Failed to insert satellite."
    });
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


// ---------------- START ----------------
app.listen(5001, () => {
  console.log("API running on port 5001");
});