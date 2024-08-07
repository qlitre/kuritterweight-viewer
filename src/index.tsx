import { Hono } from 'hono'
import { HomeContent } from './layout'
import { Weights } from './types/tables'
import { serveStatic } from 'hono/cloudflare-pages'

type Bindings = {
  DB: D1Database;
  userId: string;
}

const tableName = "DailyWeights"

const app = new Hono<{ Bindings: Bindings }>()
app.use('/static/*', serveStatic())

function formatDateToYYMMDD(dateString: string): string {
  // "yyyy-mm-dd hh:mm" 形式の日付文字列をパースする
  const date = new Date(dateString.replace(' ', 'T'));

  // 年、月、日の値を取得する
  const year = date.getFullYear().toString().slice(2); // 最後の2桁を取得
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 月を2桁に
  const day = date.getDate().toString().padStart(2, '0'); // 日を2桁に

  // "yymmdd" 形式の文字列を返す
  return `${year}${month}${day}`;
}

app.get('/', async (c) => {
  const limit = Number(c.req.query('days')) || 30
  const userId = c.env.userId
  const sqlSelect = `
  SELECT * FROM ${tableName} WHERE line_id=? ORDER BY date DESC LIMIT ?;
  `
  const queryResult = await c.env.DB.prepare(sqlSelect).bind(userId, limit).all();

  // `queryResult` の型を `D1Result<Record<string, unknown>>` から `Weights[]` に変換
  const result: Weights[] = queryResult.results as Weights[];

  const days = result.map(row => row.date)
  days.reverse()
  const weights = result.map(row => row.weight)
  weights.reverse()
  const timestamps: number[] = []
  for (const d of days) {
    const yymmdd = formatDateToYYMMDD(d)
    timestamps.push(Number(yymmdd))
  }
  const props = {
    Data: {
      xList: timestamps,
      yList: weights,
    }
  }
  return c.html(<HomeContent {...props} />)
})

export default app
