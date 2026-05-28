import express from "express";

import pool from "../db.js";

import { generateMessage } from "../ai/index.js";

const router = express.Router();

router.post(
  "/generate-message",
  async (req, res) => {
    try {
      const {
        memberId,
        situation,
        customContext,
      } = req.body;

      // Fetch Member
      const memberResult =
        await pool.query(
          `
        SELECT *
        FROM members
        WHERE id = $1
      `,
          [memberId]
        );

      // Member Not Found
      if (
        memberResult.rows.length === 0
      ) {
        return res.status(404).json({
          message: "Member not found",
        });
      }

      const member =
        memberResult.rows[0];

      // Fetch Checkin Stats
    const checkinStatsResult =
    await pool.query(
    `
    SELECT 
      COUNT(*) as total_checkins,
      MAX(date) as last_checkin
    FROM checkins
    WHERE member_name = $1
  `,
    [member.name]
  );
      const stats =
        checkinStatsResult.rows[0];

      // Context Variables
      const totalCheckins =
        stats.total_checkins || 0;

      const lastCheckin =
        stats.last_checkin || "Never";

      const joinedDate =
        member.joined || "Unknown";

      let prompt = "";

      // Membership Expiring
      if (
        situation ===
        "membership_expiring"
      ) {
        prompt = `
You are a smart AI assistant for a premium gym CRM.

Generate a WhatsApp-style membership renewal message.

MEMBER DETAILS:
- Name: ${member.name}
- Plan: ${member.plan}
- Total Check-ins: ${totalCheckins}
- Last Check-in: ${lastCheckin}
- Member Since: ${joinedDate}

GOAL:
Encourage the member to renew their membership.

MESSAGE STYLE:
- Friendly
- Personal
- Professional
- Motivational
- Short and concise
- Mention their consistency if relevant
`;
      }

      // Inactive Member
      else if (
        situation ===
        "inactive_member"
      ) {
        prompt = `
You are a smart AI assistant for a premium gym CRM.

Generate a motivational re-engagement message for a member who has not visited recently.

MEMBER DETAILS:
- Name: ${member.name}
- Plan: ${member.plan}
- Total Check-ins: ${totalCheckins}
- Last Check-in: ${lastCheckin}
- Member Since: ${joinedDate}

GOAL:
Motivate them to return to the gym.

MESSAGE STYLE:
- Friendly
- Encouraging
- Personal
- Positive
- Supportive
- Short and natural
`;
      }

      // Welcome Message
      else if (
        situation === "welcome"
      ) {
        prompt = `
You are a smart AI assistant for a premium gym CRM.

Generate a welcome message for a new gym member.

MEMBER DETAILS:
- Name: ${member.name}
- Plan: ${member.plan}
- Total Check-ins: ${totalCheckins}
- Last Check-in: ${lastCheckin}
- Member Since: ${joinedDate}

GOAL:
Welcome them warmly and motivate them to begin their fitness journey.

MESSAGE STYLE:
- Positive
- Friendly
- Professional
- Exciting
- Motivational
- Short and natural
`;
      }

      // Custom
      else if (
        situation === "custom"
      ) {
        prompt = `
You are a smart AI assistant for a premium gym CRM.

Generate a professional gym communication message.

MEMBER DETAILS:
- Name: ${member.name}
- Plan: ${member.plan}
- Total Check-ins: ${totalCheckins}
- Last Check-in: ${lastCheckin}
- Member Since: ${joinedDate}

CUSTOM CONTEXT:
${customContext}

MESSAGE STYLE:
- Friendly
- Professional
- Personalized
- Clear
- Natural sounding
- Short and concise
`;
      }

      // Invalid Situation
      else {
        return res.status(400).json({
          message:
            "Invalid situation provided",
        });
      }

      // Generate AI Message
      const message =
        await generateMessage(prompt);

      // Response
      res.json({
        message,
      });
    } catch (error) {
      console.error(
        "AI Route Error:",
        error.message
      );

      console.error(
        "Full error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to generate AI message",

        error: error.message,
      });
    }
  }
);

export default router;