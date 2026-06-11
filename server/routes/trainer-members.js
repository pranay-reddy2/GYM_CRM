import express from "express";
import pool from "../db.js";

const router = express.Router();

//
// GET MEMBERS ASSIGNED TO A TRAINER
//
router.get(
  "/:trainerId",
  async (req, res) => {
    try {
      const { trainerId } =
        req.params;

      const result =
        await pool.query(
          `
          SELECT
            m.*
          FROM trainer_members tm
          JOIN members m
            ON tm.member_id = m.id
          WHERE tm.trainer_id = $1
          ORDER BY m.name
          `,
          [trainerId]
        );

      res.json(
        result.rows
      );
    } catch (err) {
      res.status(500).json({
        error:
          err.message,
      });
    }
  }
);

//
// ASSIGN MEMBER TO TRAINER
//
router.post(
  "/",
  async (req, res) => {
    try {
      const {
        trainer_id,
        member_id,
      } = req.body;

      const result =
        await pool.query(
          `
          INSERT INTO trainer_members
          (
            trainer_id,
            member_id
          )
          VALUES
          (
            $1,
            $2
          )
          RETURNING *
          `,
          [
            trainer_id,
            member_id,
          ]
        );

      res
        .status(201)
        .json(
          result.rows[0]
        );
    } catch (err) {
      res.status(500).json({
        error:
          err.message,
      });
    }
  }
);

//
// REMOVE MEMBER ASSIGNMENT
//
router.delete(
  "/:trainerId/:memberId",
  async (req, res) => {
    try {
      const {
        trainerId,
        memberId,
      } = req.params;

      const result =
        await pool.query(
          `
          DELETE FROM trainer_members
          WHERE trainer_id = $1
          AND member_id = $2
          RETURNING *
          `,
          [
            trainerId,
            memberId,
          ]
        );

      if (
        result.rows
          .length === 0
      ) {
        return res
          .status(404)
          .json({
            error:
              "Assignment not found",
          });
      }

      res.json({
        message:
          "Member removed from trainer",
        assignment:
          result.rows[0],
      });
    } catch (err) {
      res.status(500).json({
        error:
          err.message,
      });
    }
  }
);

export default router;