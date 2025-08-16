


import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
const prisma = new PrismaClient();


// GET: 履歴一覧取得
export async function GET() {
  try {
    const histories = await prisma.history.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
    return NextResponse.json(histories);
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}


// POST: 履歴追加
export async function POST(req: NextRequest) {
  const data = await req.json();
  try {
    const newHistory = await prisma.history.create({
      data: {
        type: data.type ?? null,
        result: data.result ? JSON.stringify(data.result) : null,
        hand_data: data.handData ? JSON.stringify(data.handData) : null,
        problem: data.problem ? JSON.stringify(data.problem) : null,
        userId: typeof data.userId === 'string' ? data.userId : null,
      },
    });
    return NextResponse.json(newHistory);
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
