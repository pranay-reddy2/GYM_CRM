import express from "express";
import pool from "../db.js";

const router = express.Router();

/*
 GET ALL TRAINERS
 GET /api/trainers
*/
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM trainers ORDER BY id DESC"
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to fetch trainers",
    });
  }
});

/*
 ADD TRAINER
 POST /api/trainers
*/
router.post("/", async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      specialization,
      status,
    } = req.body;

    const result = await pool.query(
      `
      INSERT INTO trainers
      (name, phone, email, specialization, status)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
      `,
      [
        name,
        phone,
        email,
        specialization,
        status || "Active",
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to add trainer",
    });
  }
});

/*
 UPDATE TRAINER
 PUT /api/trainers/:id
*/
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      phone,
      email,
      specialization,
      status,
    } = req.body;

    const result = await pool.query(
      `
      UPDATE trainers
      SET
        name = $1,
        phone = $2,
        email = $3,
        specialization = $4,
        status = $5
      WHERE id = $6
      RETURNING *
      `,
      [
        name,
        phone,
        email,
        specialization,
        status,
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

/*
 DELETE TRAINER
 DELETE /api/trainers/:id
*/
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
      message: "Trainer deleted successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to delete trainer",
    });
  }
});

export default router;