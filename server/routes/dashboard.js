import express from "express";
import pool from "../db.js";

const router = express.Router();

router.get(
  "/stats",
  async (req, res) => {
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
        // Total Members
        pool.query(`
          SELECT COUNT(*) AS count
          FROM members
        `),

        // Active Members
        pool.query(`
          SELECT COUNT(*) AS count
          FROM members
          WHERE status = 'Active'
        `),

        // Leads
        pool.query(`
          SELECT COUNT(*) AS count
          FROM leads
        `),

        // Active Check-ins
        pool.query(`
          SELECT COUNT(*) AS count
          FROM checkins
          WHERE check_out IS NULL
        `),

        // Revenue This Month
        pool.query(`
          SELECT
            COALESCE(
              SUM(amount),
              0
            ) AS revenue
          FROM payments
          WHERE DATE_TRUNC(
            'month',
            date
          ) =
          DATE_TRUNC(
            'month',
            CURRENT_DATE
          )
        `),

        // Active Trainers
        pool.query(`
          SELECT COUNT(*) AS count
          FROM trainers
          WHERE status = 'Active'
        `),

        // At-Risk Members
        pool.query(`
          SELECT COUNT(*) AS count
          FROM (
            SELECT
              m.id,
              CURRENT_DATE -
              COALESCE(
                MAX(c.date),
                CURRENT_DATE -
                INTERVAL '365 days'
              ) AS days_inactive
            FROM members m
            LEFT JOIN checkins c
              ON m.name =
                 c.member_name
            GROUP BY m.id
          ) t
          WHERE days_inactive >= 10
        `),
      ]);

      res.json({
        totalMembers: Number(
          totalMembersResult
            .rows[0].count
        ),

        activeMembers: Number(
          activeMembersResult
            .rows[0].count
        ),

        totalLeads: Number(
          totalLeadsResult
            .rows[0].count
        ),

        activeCheckins: Number(
          activeCheckinsResult
            .rows[0].count
        ),

        revenue: Number(
          revenueResult
            .rows[0].revenue
        ),

        activeTrainers: Number(
          trainersResult
            .rows[0].count
        ),

        atRiskMembers: Number(
          atRiskResult
            .rows[0].count
        ),
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message:
          "Failed to fetch dashboard stats",
      });
    }
  }
);
router.get(
  "/activity",
  async (req, res) => {
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

      res.json(
        result.rows
      );
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message:
          "Failed to fetch activity",
      });
    }
  }
);

router.get(
  "/at-risk",
  async (req, res) => {
    try {
      const result =
        await pool.query(`
          SELECT
            m.id,
            m.name,
            MAX(c.date) AS last_checkin,
            CURRENT_DATE -
            COALESCE(
              MAX(c.date),
              CURRENT_DATE -
              INTERVAL '365 days'
            ) AS days_inactive
          FROM members m
          LEFT JOIN checkins c
            ON m.name =
               c.member_name
          GROUP BY m.id, m.name
          HAVING CURRENT_DATE -
            COALESCE(
              MAX(c.date),
              CURRENT_DATE -
              INTERVAL '365 days'
            ) >= 10
          ORDER BY days_inactive DESC
          LIMIT 5
        `);

      res.json(
        result.rows
      );
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message:
          "Failed to fetch at-risk members",
      });
    }
  }
);
export default router;