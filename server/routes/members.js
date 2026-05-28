import express from "express";
import pool from "../db.js";
const router = express.Router();


router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT 
        id,
        name,
        plan,
        status,
        TO_CHAR(joined, 'YYYY-MM-DD') as joined
      FROM members
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
    const { name, plan, status, joined } =
      req.body;

    const result = await pool.query(
      `
      INSERT INTO members (name, plan, status, joined)
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [name, plan, status, joined]
    );

    res.status(201).json(result.rows[0]);
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
      DELETE FROM members
      WHERE id = $1
      RETURNING *
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Member not found",
      });
    }

    res.json({
      message: "Member deleted successfully",
      member: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

export default router;