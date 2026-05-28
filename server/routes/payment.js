import express from "express";

import pool from "../db.js";

const router = express.Router();

//
// GET PAYMENTS FOR ONE MEMBER
//
router.get(
  "/:memberId",
  async (req, res) => {
    try {
      const { memberId } =
        req.params;

      const result =
        await pool.query(
          `
        SELECT *
        FROM payments
        WHERE member_id = $1
        ORDER BY date DESC
      `,
          [memberId]
        );

      res.json(result.rows);
    } catch (err) {
      res.status(500).json({
        error: err.message,
      });
    }
  }
);

//
// ADD PAYMENT
//
router.post("/", async (req, res) => {
  try {
    const {
      member_id,
      member_name,
      amount,
      method,
      date,
      note,
    } = req.body;

    const result =
      await pool.query(
        `
      INSERT INTO payments
      (
        member_id,
        member_name,
        amount,
        method,
        date,
        note
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
      `,
        [
          member_id,
          member_name,
          amount,
          method,
          date,
          note,
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
// DELETE PAYMENT
//
router.delete(
  "/:id",
  async (req, res) => {
    try {
      const { id } =
        req.params;

      const result =
        await pool.query(
          `
        DELETE FROM payments
        WHERE id = $1
        RETURNING *
      `,
          [id]
        );

      if (
        result.rows.length === 0
      ) {
        return res.status(404).json({
          error: "Payment not found",
        });
      }

      res.json({
        message:
          "Payment deleted successfully",

        payment:
          result.rows[0],
      });
    } catch (err) {
      res.status(500).json({
        error: err.message,
      });
    }
  }
);

export default router;