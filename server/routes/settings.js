import express from "express";
import pool from "../db.js";

const router = express.Router();

//
// GET SETTINGS
//
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT *
      FROM gym_settings
      LIMIT 1
    `);

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

//
// UPDATE SETTINGS
//
router.put("/", async (req, res) => {
  try {
    const {
      gym_name,
      phone,
      email,
      address,
      logo_url,
    } = req.body;

    const result = await pool.query(
      `
      UPDATE gym_settings
      SET
        gym_name = $1,
        phone = $2,
        email = $3,
        address = $4,
        logo_url = $5
      WHERE id = 1
      RETURNING *
      `,
      [
        gym_name,
        phone || null,
        email || null,
        address || null,
        logo_url || null,
      ]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

export default router;