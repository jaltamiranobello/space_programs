const express = require("express");
const router = express.Router();
const db = require("./db");

// ---------------- DROPDOWN DATA ----------------

// Get all program names
router.get("/program-options", async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT program_name FROM Programs ORDER BY program_name`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all satellite IDs
router.get("/satellite-options", async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT satellite_id FROM Satellites ORDER BY satellite_id`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------- INSERT LAUNCH ----------------

router.post("/launches", async (req, res) => {
  try {
    const {
      program_name,
      satellite_id,
      launch_location,
      launch_date,
      launch_year,
      return_date,
      return_year
    } = req.body;

    const sql = `
      INSERT INTO Launches (
        program_name,
        satellite_id,
        launch_location,
        launch_date,
        launch_year,
        return_date,
        return_year
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    await db.query(sql, [
      program_name,
      satellite_id,
      launch_location,
      launch_date,
      launch_year,
      return_date,
      return_year
    ]);

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;