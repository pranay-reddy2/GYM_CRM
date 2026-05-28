import express from "express";
import pool from "../db.js";

const router = express.Router();

router.get("/stats", async (req, res) => {
  try {
    const [
      totalMembersResult,
      activeMembersResult,
      totalLeadsResult,
      activeCheckinsResult,
    ] = await Promise.all([
      pool.query(`
        SELECT COUNT(*) AS count
        FROM members
      `),

      pool.query(`
        SELECT COUNT(*) AS count
        FROM members
        WHERE status = 'Active'
      `),

      pool.query(`
        SELECT COUNT(*) AS count
        FROM leads
      `),

      pool.query(`
        SELECT COUNT(*) AS count
        FROM checkins
        WHERE check_out IS NULL
      `),
    ]);

    res.json({
      totalMembers: Number(
        totalMembersResult.rows[0].count
      ),

      activeMembers: Number(
        activeMembersResult.rows[0].count
      ),

      totalLeads: Number(
        totalLeadsResult.rows[0].count
      ),

      activeCheckins: Number(
        activeCheckinsResult.rows[0].count
      ),
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch dashboard stats",
    });
  }
});

export default router;