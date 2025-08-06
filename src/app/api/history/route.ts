

import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/postgres';
const pool = new Pool({ connectionString });

// DBコネクション取得・解放をラップ
async function withDb<T>(fn: (client: any) => Promise<T>): Promise<T> {
  const client = await pool.connect();
  try {
    return await fn(client);
  } finally {
    client.release();
  }
}

// GET: 履歴一覧取得

export async function GET() {
  return withDb(async (client) => {
    try {
      const res = await client.query('SELECT * FROM "History" ORDER BY "createdAt" DESC LIMIT 100');
      return NextResponse.json(res.rows || []);
    } catch {
      return NextResponse.json([]);
    }
  });
}

// POST: 履歴追加

export async function POST(req: NextRequest) {
  const data = await req.json();
  // hand_data, result, problem すべてJSON文字列で保存（カラムがなければ無視される）
  const insertData = {
    type: data.type || null,
    result: data.result ? JSON.stringify(data.result) : null,
    hand_data: data.handData ? JSON.stringify(data.handData) : null,
    problem: data.problem ? JSON.stringify(data.problem) : null,
    userId: typeof data.userId === 'string' ? data.userId : null
  };
  // hand_data, problemカラムが存在する場合は含めてINSERT、なければ従来通り
  let columns = ['type', 'result', '"userId"'];
  let values = [insertData.type, insertData.result, insertData.userId];
  let placeholders = ['$1', '$2', '$3'];
  let idx = 4;
  if (insertData.hand_data !== null) {
    columns.push('hand_data');
    placeholders.push(`$${idx++}`);
    values.push(insertData.hand_data);
  }
  if (insertData.problem !== null) {
    columns.push('problem');
    placeholders.push(`$${idx++}`);
    values.push(insertData.problem);
  }
  columns.push('"createdAt"');
  let query = `INSERT INTO "History" (${columns.join(', ')}) VALUES (${placeholders.join(', ')}, NOW())`;
  return withDb(async (client) => {
    try {
      await client.query(query, values);
      return NextResponse.json({ ok: true });
    } catch (e) {
      return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
    }
  });
}
