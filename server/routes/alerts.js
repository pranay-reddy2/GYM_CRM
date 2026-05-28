import express from "express";

import pool from "../db.js";

const router = express.Router();

// GET AT-RISK MEMBERS
router.get(
  "/at-risk",
  async (req, res) => {
    try {
      const result =
        await pool.query(`
        SELECT 
          m.id,
          m.name,
          m.plan,
          m.status,

          MAX(c.date) as last_checkin,

          CURRENT_DATE - MAX(c.date)::date 
          as days_inactive

        FROM members m

        LEFT JOIN checkins c 
        ON c.member_name = m.name

        WHERE m.status = 'Active'

        GROUP BY m.id

        HAVING 
          MAX(c.date) < CURRENT_DATE - INTERVAL '10 days'
          OR MAX(c.date) IS NULL

        ORDER BY 
          days_inactive DESC NULLS FIRST
      `);

      res.json(result.rows);
    } catch (err) {
      res.status(500).json({
        error: err.message,
      });
    }
  }
);

export default router;