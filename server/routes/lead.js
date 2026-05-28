import express from "express";
import pool from "../db.js";

const router = express.Router();


router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT *
      FROM leads
      ORDER BY id ASC
      `
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});


router.post("/", async (req, res) => {
  try {
    const { name, source, stage } =
      req.body;

    const result = await pool.query(
      `
      INSERT INTO leads (name, source, stage)
      VALUES ($1, $2, $3)
      RETURNING *
      `,
      [name, source, stage]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});


router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { stage } = req.body;

    const result = await pool.query(
      `
      UPDATE leads
      SET stage = $1
      WHERE id = $2
      RETURNING *
      `,
      [stage, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Lead not found",
      });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});


router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      DELETE FROM leads
      WHERE id = $1
      RETURNING *
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Lead not found",
      });
    }

    res.json({
      message: "Lead deleted successfully",
      lead: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

export default router;