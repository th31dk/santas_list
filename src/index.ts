import { Hono } from "hono"
import { addName, listNames, removeName, markFulfilled } from "./db/queries"

const app = new Hono()

app.get("/", (c) => c.text("🎄 Santa's List API 🎄"))

app.get("/api/names", (c) => c.json(listNames()))

app.post("/api/names", async (c) => {
  const body = await c.req.json().catch(() => null)
  const name = (body?.name ?? "").toString().trim()
  const gift = (body?.gift ?? "").toString().trim()
  const naughtyornice = (body?.naughtyornice ?? "").toString().trim()

  if (!name || !gift || !naughtyornice) {
    return c.json({ error: "name, gift, and naughtyornice are required" }, 400)
  }

  return c.json(addName(name, gift, naughtyornice), 201)
})

app.patch("/api/names/:id/fulfill", (c) => {
  const id = Number(c.req.param("id"))
  if (!Number.isFinite(id)) return c.json({ error: "bad id" }, 400)

  const res = markFulfilled(id)
  if (res.changes === 0) return c.json({ error: "not found" }, 404)

  return c.json({ ok: true })
})

app.delete("/api/names/:id", (c) => {
  const id = Number(c.req.param("id"))
  if (!Number.isFinite(id)) return c.json({ error: "bad id" }, 400)

  const res = removeName(id)
  if (res.changes === 0) return c.json({ error: "not found" }, 404)

  return c.json({ ok: true })
})

const port = Number(process.env.PORT) || 3000

export default {
  port,
  fetch: app.fetch,
}