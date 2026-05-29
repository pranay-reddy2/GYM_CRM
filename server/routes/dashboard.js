import express from "express";
import pool from "../db.js";

const router = express.Router();

const AT_RISK_DAYS = 10;

const atRiskSubquery = `
  SELECT
    m.id,
    m.name,
    COALESCE(
      CURRENT_DATE - MAX(c.date),
      365
    ) AS days_inactive
  FROM members m
  LEFT JOIN checkins c
    ON c.member_name = m.name
  GROUP BY m.id, m.name
`
router.get("/stats", async (req, res) => {
  try {
    const [
      totalMembersResult,
      activeMembersResult,
      totalLeadsResult,
      activeCheckinsResult,
      revenueResult,
      trainersResult,
      atRiskResult,
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

      pool.query(`
        SELECT COALESCE(
          SUM(amount),
          0
        ) AS revenue
        FROM payments
      `),

      pool.query(`
        SELECT COUNT(*) AS count
        FROM trainers
        WHERE status = 'Active'
      `),

      pool.query(`
        SELECT COUNT(*) AS count
        FROM (${atRiskSubquery}) t
        WHERE days_inactive >= ${AT_RISK_DAYS}
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

      revenue: Number(
        revenueResult.rows[0].revenue
      ),

      activeTrainers: Number(
        trainersResult.rows[0].count
      ),

      atRiskMembers: Number(
        atRiskResult.rows[0].count
      ),
    });
  } catch (error) {
    console.error(
      "Error in /stats:",
      error
    );

    res.status(500).json({
      message:
        "Failed to fetch dashboard stats",
    });
  }
});

router.get("/activity", async (req, res) => {
  try {
    const result =
      await pool.query(`
        SELECT
          member_name,
          check_in
        FROM checkins
        ORDER BY check_in DESC
        LIMIT 10
      `);

    res.json(result.rows);
  } catch (error) {
    console.error(
      "Error in /activity:",
      error
    );

    res.status(500).json({
      message:
        "Failed to fetch activity",
    });
  }
});

router.get("/at-risk", async (req, res) => {
  try {
    const result =
      await pool.query(`
        SELECT
          id,
          name,
          days_inactive
        FROM (${atRiskSubquery}) t
        WHERE days_inactive >= ${AT_RISK_DAYS}
        ORDER BY days_inactive DESC
        LIMIT 5
      `);

    res.json(result.rows);
  } catch (error) {
    console.error(
      "Error in /at-risk:",
      error
    );

    res.status(500).json({
      message:
        "Failed to fetch at-risk members",
    });
  }
});

export default router;