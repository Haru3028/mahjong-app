import { NextResponse } from 'next/server';

export async function GET() {
  // 新規入力時は空の手牌を返す
  return NextResponse.json({
    hand: []
  });
}
