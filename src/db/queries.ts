import { db } from "./index"
import { santaList } from "./schema"
import { eq, desc } from "drizzle-orm"

export function listNames() {
  return db.select().from(santaList).orderBy(desc(santaList.id)).all()
}

export function addName(name: string, gift: string, naughtyornice: string) {
  const createdAt = Math.floor(Date.now() / 1000)
  const res = db.insert(santaList).values({
    name,
    gift,
    naughtyornice,
    fulfilled: 0,
    createdAt,
  }).run()
  return { id: Number(res.lastInsertRowid) }
}

export function markFulfilled(id: number) {
  const res = db.update(santaList)
    .set({ fulfilled: 1 })
    .where(eq(santaList.id, id))
    .run()
  return { changes: res.changes }
}

export function removeName(id: number) {
  const res = db.delete(santaList).where(eq(santaList.id, id)).run()
  return { changes: res.changes }
}