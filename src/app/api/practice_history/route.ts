import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: 入力履歴一覧取得（input_historyテーブル）
export async function GET() {
  try {
    const histories = await prisma.inputHistory.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
    return NextResponse.json(histories);
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}

// POST: 入力履歴追加
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const newHistory = await prisma.inputHistory.create({
      data: {
        inputType: data.inputType ?? '',
        inputValue: data.inputValue ?? '',
      },
    });
    return NextResponse.json(newHistory);
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
