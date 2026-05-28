import express from "express";

import pool from "../db.js";

const router = express.Router();

//
// GET ALL MEMBERS
//
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT 
        id,
        name,
        plan,
        status,

        TO_CHAR(joined, 'YYYY-MM-DD') as joined,

        phone,
        email,
        address,

        TO_CHAR(date_of_birth, 'YYYY-MM-DD') as date_of_birth,

        gender,
        emergency_contact,
        goal

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

//
// ADD MEMBER
//
router.post("/", async (req, res) => {
  try {
    const {
      name,
      plan,
      status,
      joined,

      phone,
      email,
      address,
      date_of_birth,
      gender,
      emergency_contact,
      goal,
    } = req.body;

    const result = await pool.query(
      `
      INSERT INTO members
      (
        name,
        plan,
        status,
        joined,

        phone,
        email,
        address,
        date_of_birth,
        gender,
        emergency_contact,
        goal
      )

      VALUES
      (
        $1, $2, $3, $4,
        $5, $6, $7, $8,
        $9, $10, $11
      )

      RETURNING *
      `,
      [
  name,
  plan,
  status,
  joined,
  phone || null,
  email || null,
  address || null,
  date_of_birth || null,
  gender || null,
  emergency_contact || null,
  goal || null,
]
    );

    res.status(201).json(
      result.rows[0]
    );
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

//
// UPDATE MEMBER
//
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      plan,
      status,
      joined,

      phone,
      email,
      address,
      date_of_birth,
      gender,
      emergency_contact,
      goal,
    } = req.body;

    const result = await pool.query(
      `
      UPDATE members

      SET
        name = $1,
        plan = $2,
        status = $3,
        joined = $4,

        phone = $5,
        email = $6,
        address = $7,
        date_of_birth = $8,
        gender = $9,
        emergency_contact = $10,
        goal = $11

      WHERE id = $12

      RETURNING *
      `,
        name,
  plan,
  status,
  joined,
  phone || null,
  email || null,
  address || null,
  date_of_birth || null,
  gender || null,
  emergency_contact || null,
  goal || null,
  id,
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Member not found",
      });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

//
// DELETE MEMBER
//
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
      message:
        "Member deleted successfully",

      member: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

export default router;