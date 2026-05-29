import "./config.js"
import express from "express"
import cors from "cors"
import dotenv from "dotenv"
dotenv.config()

import membersRouter from "./routes/members.js";
import leadsRouter from "./routes/lead.js";
import checkinsRouter from "./routes/checkins.js"
import dashboardRouter from "./routes/dashboard.js"
import pool from "./db.js"
import aiRouter from "./routes/ai.js"
import alertsRouter from "./routes/alerts.js";
import paymentsRouter from "./routes/payment.js";
import settingsRouter from "./routes/settings.js";
import trainersRoutes from "./routes/trainers.js";

// Test DB connection
pool.query("SELECT NOW()", (err, res) => {
  if (err) console.error("DB connection failed:", err)
  else console.log("DB connected:", res.rows[0])
})

const app = express()

app.use(cors())
app.use(express.json())

app.get("/api", (req, res) => {
  res.json({ message: "Gym CRM API" })
})

app.use("/api/members", membersRouter);

app.use("/api/leads", leadsRouter);

app.use("/api/checkins", checkinsRouter);

app.use("/api/dashboard", dashboardRouter)

app.use("/api/ai", aiRouter)

app.use("/api/alerts", alertsRouter);

app.use("/api/payments", paymentsRouter);

app.use("/api/settings", settingsRouter);

app.use("/api/trainers", trainersRoutes);

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})