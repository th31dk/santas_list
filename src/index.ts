import { Hono } from "hono"
import { addName, listNames, removeName, markFulfilled } from "./db/queries"

const app = new Hono()

app.get("/api/names", async (c) => {
  const db = c.env.DB
  return c.json(listNames(db))
})

app.post("/api/names", async (c) => {
  const db = c.env.DB
  const body = await c.req.json().catch(() => null)
  const name = (body?.name ?? "").toString().trim()
  const gift = (body?.gift ?? "").toString().trim()
  const naughtyornice = (body?.naughtyornice ?? "").toString().trim()

  if (!name || !gift || !naughtyornice) {
    return c.json({ error: "name, gift, and naughtyornice are required" }, 400)
  }

  return c.json(addName(db, name, gift, naughtyornice), 201)
})

app.patch("/api/names/:id/fulfill", async (c) => {
  const db = c.env.DB
  const id = Number(c.req.param("id"))
  if (!Number.isFinite(id)) return c.json({ error: "bad id" }, 400)

  const res = markFulfilled(db, id)
  if (res.changes === 0) return c.json({ error: "not found" }, 404)

  return c.json({ ok: true })
})

app.delete("/api/names/:id", async (c) => {
  const db = c.env.DB
  const id = Number(c.req.param("id"))
  if (!Number.isFinite(id)) return c.json({ error: "bad id" }, 400)

  const res = removeName(db, id)
  if (res.changes === 0) return c.json({ error: "not found" }, 404)

  return c.json({ ok: true })
})

const port = Number(process.env.PORT) || 3000

export default {
  port,
  fetch: app.fetch,
}