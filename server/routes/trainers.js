import express from "express";
import pool from "../db.js";

const router = express.Router();

//
// GET ALL TRAINERS
//
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT *
      FROM trainers
      ORDER BY id DESC
    `);

    res.json(result.rows);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Failed to fetch trainers",
    });
  }
});

//
// ADD TRAINER
//
router.post("/", async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      specialization,
      status,

      start_time,
      end_time,
      working_days,
    } = req.body;

    const result = await pool.query(
      `
      INSERT INTO trainers
      (
        name,
        phone,
        email,
        specialization,
        status,

        start_time,
        end_time,
        working_days
      )

      VALUES
      (
        $1, $2, $3, $4, $5,
        $6, $7, $8
      )

      RETURNING *
      `,
      [
        name,
        phone,
        email,
        specialization,
        status || "Active",

        start_time || null,
        end_time || null,
        working_days || null,
      ]
    );

    res.status(201).json(
      result.rows[0]
    );
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Failed to add trainer",
    });
  }
});

//
// UPDATE TRAINER
//
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      phone,
      email,
      specialization,
      status,

      start_time,
      end_time,
      working_days,
    } = req.body;

    const result = await pool.query(
      `
      UPDATE trainers

      SET
        name = $1,
        phone = $2,
        email = $3,
        specialization = $4,
        status = $5,

        start_time = $6,
        end_time = $7,
        working_days = $8

      WHERE id = $9

      RETURNING *
      `,
      [
        name,
        phone,
        email,
        specialization,
        status,

        start_time || null,
        end_time || null,
        working_days || null,

        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Trainer not found",
      });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Failed to update trainer",
    });
  }
});

//
// DELETE TRAINER
//
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      DELETE FROM trainers
      WHERE id = $1
      RETURNING *
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Trainer not found",
      });
    }

    res.json({
      message:
        "Trainer deleted successfully",
      trainer:
        result.rows[0],
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Failed to delete trainer",
    });
  }
});

export default router;