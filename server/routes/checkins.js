import express from "express";
import pool from "../db.js";
const router = express.Router();
//
// GET ALL CHECK-INS
//
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT *
      FROM checkins
      ORDER BY id DESC
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
// ADD CHECK-IN
//
router.post("/", async (req, res) => {
  try {
    const {
      member_name,
      membership,
      check_in,
      status,
    } = req.body;
    const result = await pool.query(
      `
      INSERT INTO checkins
      (
        member_name,
        membership,
        check_in,
        status
      )
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [
        member_name,
        membership,
        check_in,
        status,
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});
//
// CHECK OUT MEMBER
//
router.put(
  "/:id/checkout",
  async (req, res) => {
    try {
      const { id } = req.params;
      const { check_out } = req.body;
      const result = await pool.query(
        `
      UPDATE checkins
      SET check_out = $1
      WHERE id = $2
      RETURNING *
      `,
        [check_out, id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({
          error: "Check-in not found",
        });
      }
      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({
        error: err.message,
      });
    }
  }
);
//
// DELETE CHECK-IN
//
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `
      DELETE FROM checkins
      WHERE id = $1
      RETURNING *
      `,
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Check-in not found",
      });
    }
    res.json({
      message:
        "Check-in deleted successfully",
      checkin: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});
export default router;