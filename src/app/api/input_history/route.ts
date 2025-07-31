import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: 入力履歴一覧取得
export async function GET() {
  const histories = await prisma.inputHistory.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,
    include: { user: true },
  });
  return NextResponse.json(histories);
}

// POST: 入力履歴追加
export async function POST(req: NextRequest) {
  const data = await req.json();
  try {
    const newHistory = await prisma.inputHistory.create({
      data: {
        userId: data.userId ?? null,
        inputType: data.inputType ?? '',
        inputValue: data.inputValue ?? '',
      },
    });
    return NextResponse.json(newHistory);
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
