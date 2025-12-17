import "dotenv/config"
import { drizzle } from "drizzle-orm/bun-sqlite"

const db = drizzle(process.env.DB_FILE_NAME!)

db.run(`
  CREATE TABLE IF NOT EXISTS santa_list (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    gift TEXT NOT NULL,
    naughtyornice TEXT NOT NULL,
    fulfilled INTEGER NOT NULL DEFAULT 0,
    created_at INTEGER NOT NULL
  )
`)

console.log("Table created!")