import pg from "pg"
import dotenv from "dotenv"

dotenv.config()

const { Pool } = pg

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})

const createTables = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS members (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      plan VARCHAR(50) NOT NULL,
      status VARCHAR(50) NOT NULL,
      joined DATE NOT NULL
    );

    CREATE TABLE IF NOT EXISTS leads (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      source VARCHAR(100) NOT NULL,
      stage VARCHAR(50) NOT NULL
    );

    CREATE TABLE IF NOT EXISTS checkins (
      id SERIAL PRIMARY KEY,
      member_name VARCHAR(100) NOT NULL,
      membership VARCHAR(50),
      check_in TIME NOT NULL,
      check_out TIME,
      status VARCHAR(50),
      date DATE DEFAULT CURRENT_DATE
    );
  `)

  console.log("Tables created ✅")
}

createTables()

export default pool