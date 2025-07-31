import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/postgres';
const pool = new Pool({ connectionString });

// 難易度自動分類ロジック（例: 翻数・符数・正解率で分類）
function estimateLevel(problem: any, stats?: { correct: number; total: number }) {
  // 上級: 翻数3以上 or 正解率30%未満
  if ((problem.han ?? 0) >= 3 || (stats && stats.total > 0 && stats.correct / stats.total < 0.3)) return 'hard';
  // 中級: 翻数2 or 正解率50%未満
  if ((problem.han ?? 0) === 2 || (stats && stats.total > 0 && stats.correct / stats.total < 0.5)) return 'normal';
  // 初級: それ以外
  return 'easy';
}

// GET: 難易度ごとにランダムで1問返す
export async function GET(req: NextRequest) {
  const level = req.nextUrl.searchParams.get('level') || 'easy';
  const client = await pool.connect();
  try {
    // 1. 問題テーブルから取得
    const probRes = await client.query('SELECT * FROM problems');
    const problems = probRes.rows || [];
    // 2. 履歴テーブルからも問題を抽出
    const histRes = await client.query('SELECT problem, correct FROM history WHERE problem IS NOT NULL');
    const histProblems: any[] = [];
    const statsMap: Record<string, { correct: number; total: number }> = {};
    for (const row of histRes.rows) {
      let p = null;
      try { p = typeof row.problem === 'string' ? JSON.parse(row.problem) : row.problem; } catch {}
      if (p && p.hand && p.answer) {
        const key = JSON.stringify({ hand: p.hand, answer: p.answer });
        if (!statsMap[key]) statsMap[key] = { correct: 0, total: 0 };
        statsMap[key].total++;
        if (row.correct === true) statsMap[key].correct++;
        histProblems.push({ ...p, _stats: statsMap[key] });
      }
    }
    // 3. 問題＋履歴を合成し、難易度でフィルタ
    const allProblems = [
      ...problems.map((p: any) => ({ ...p, level: p.level || estimateLevel(p) })),
      ...histProblems.map((p: any) => ({ ...p, level: estimateLevel(p, p._stats) }))
    ];
    const filtered = allProblems.filter((p: any) => p.level === level);
    if (filtered.length === 0) return NextResponse.json({ error: 'No problem found' }, { status: 404 });
    // 4. ランダムで1問返す
    const idx = Math.floor(Math.random() * filtered.length);
    return NextResponse.json(filtered[idx]);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  } finally {
    client.release();
  }
}

// POST: 問題追加（管理用）
export async function POST(req: NextRequest) {
  const data = await req.json();
  const client = await pool.connect();
  try {
    await client.query(
      `INSERT INTO problems (hand, situation, answer, explanation, furo, dora, han, fu, tsumo, level, created_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,NOW())`,
      [
        data.hand,
        data.situation,
        data.answer,
        data.explanation,
        data.furo,
        data.dora,
        data.han,
        data.fu,
        data.tsumo,
        data.level || null
      ]
    );
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  } finally {
    client.release();
  }
}
