
console.log('DATABASE_URL:', process.env.DATABASE_URL);
import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/postgres';
const pool = new Pool({ connectionString });

// GET: 履歴一覧取得

export async function GET() {
  const client = await pool.connect();
  try {
    const res = await client.query('SELECT * FROM history ORDER BY created_at DESC LIMIT 100');
    return NextResponse.json(res.rows || []);
  } catch (e) {
    // DBエラー時も空配列を返す
    return NextResponse.json([]);
  } finally {
    client.release();
  }
}

// POST: 履歴追加

export async function POST(req: NextRequest) {
  const data = await req.json();
  console.log('受信データ:', data);
  const client = await pool.connect();
  try {
    // problemはオブジェクトのまま保存、文字列ならパース
    let problemObj = null;
    if (data.problem) {
      if (typeof data.problem === 'string') {
        try {
          problemObj = JSON.parse(data.problem);
        } catch {
          problemObj = null;
        }
      } else {
        problemObj = data.problem;
      }
    }
    const insertData = {
      type: data.type || null,
      handData: data.handData ? JSON.stringify(data.handData) : null,
      result: data.result ? JSON.stringify(data.result) : null,
      problem: problemObj ? JSON.stringify(problemObj) : null,
      user_input: (typeof data.userInput === 'string' && data.userInput !== '') ? data.userInput
        : (typeof data.user_input === 'string' && data.user_input !== '') ? data.user_input
        : null,
      correct: typeof data.correct === 'boolean' ? data.correct : null,
      message: typeof data.message === 'string' ? data.message : null,
      created_by: typeof data.created_by === 'string' ? data.created_by : null
    };
    console.log('INSERT内容:', insertData);
    await client.query(
      `INSERT INTO history (type, hand_data, result, problem, user_input, correct, message, created_by, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())`,
      [
        insertData.type,
        insertData.handData,
        insertData.result,
        insertData.problem,
        insertData.user_input,
        insertData.correct,
        insertData.message,
        insertData.created_by
      ]
    );
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('履歴INSERTエラー:', e);
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  } finally {
    client.release();
  }
}
