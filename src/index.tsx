import { Hono } from 'hono'
import { HomeContent } from './layout'
import { Weights } from './types/tables'

type Bindings = {
  DB: D1Database;
  userId: string;
}

const tableName = "DailyWeights"

const app = new Hono<{ Bindings: Bindings }>()

app.get('/', async (c) => {
  const period = Number(c.req.query('days')) || 90
  const userId = c.env.userId

  const sqlSelect = `
  SELECT * FROM ${tableName}
  WHERE line_id=? AND date >= datetime('now', ? || ' days')
  ORDER BY date DESC;
  `
  const queryResult = await c.env.DB.prepare(sqlSelect).bind(userId, -period).all();

  // `queryResult` の型を `D1Result<Record<string, unknown>>` から `Weights[]` に変換
  const result: Weights[] = queryResult.results as Weights[];


  const props = {
    Data: {
      xList: result.map(row => row.date),
      yList: result.map(row => row.weight)
    }
  }
  return c.html(<HomeContent {...props} />)
})

export default app
