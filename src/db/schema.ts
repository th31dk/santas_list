
import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core"

export const santaList = sqliteTable("santa_list", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  gift: text("gift").notNull(),
  naughtyornice: text("naughtyornice").notNull(),
  fulfilled: integer("fulfilled").notNull().default(0),
  createdAt: integer("created_at").notNull(),
})