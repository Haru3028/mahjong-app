// 初期問題データをHistoryテーブルに一括投入するスクリプト
import { Pool } from 'pg';
import { problems } from '../src/data/problems';

const connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/postgres';
const pool = new Pool({ connectionString });

async function main() {
  const client = await pool.connect();
  try {
    for (const p of problems) {
      await client.query(
        `INSERT INTO "History" (type, result, hand_data, problem, "createdAt") VALUES ($1, $2, $3, $4, NOW())`,
        [
          'init',
          null,
          JSON.stringify({ hand: p.hand }),
          JSON.stringify(p),
        ]
      );
      console.log(`Inserted problem id=${p.id}`);
    }
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
