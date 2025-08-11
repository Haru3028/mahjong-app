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
  const client = await pool.connect();
  try {
    // 履歴テーブルからのみ問題を抽出
    const histRes = await client.query('SELECT problem FROM history WHERE problem IS NOT NULL');
    const histProblems: any[] = [];
    for (const row of histRes.rows) {
      let p = null;
      try {
        p = typeof row.problem === 'string' ? JSON.parse(row.problem) : row.problem;
      } catch {}
      // handが配列またはスペース区切り文字列、answerが存在すればOK
      if (p && p.hand && p.answer) {
        // handがスペース区切り文字列なら配列に変換
        if (typeof p.hand === 'string') {
          p.hand = p.hand.trim().split(/\s+/);
        }
        // doraも同様に
        if (p.dora && typeof p.dora === 'string') {
          p.dora = p.dora.trim().split(/\s+/);
        }
        histProblems.push(p);
      }
    }
    if (histProblems.length === 0) {
      // ダミー問題を返す
      return NextResponse.json({
        hand: [
          "man1", "man2", "man3", "pin4", "pin5", "pin6",
          "sou7", "sou8", "sou9", "ji_ton", "ji_nan", "ji_sha", "ji_pei", "ji_haku"
        ],
        answer: "1300点",
        han: 2,
        fu: 30,
        explanation: "リーチ・ツモ・ピンフ",
        situation: "東1局 0本場 親",
        dora: ["pin5"],
        furo: [],
        tsumo: "sou9"
      });
    }
    // ランダムで1問返す
    const idx = Math.floor(Math.random() * histProblems.length);
    return NextResponse.json(histProblems[idx]);
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
