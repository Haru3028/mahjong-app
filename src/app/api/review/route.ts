import { NextResponse } from 'next/server';

export async function GET() {
  // 仮の手牌データ
  return NextResponse.json({
    hand: [
      "man1", "man2", "man3", "pin4", "pin5", "pin6",
      "sou7", "sou8", "sou9", "ji_ton", "ji_nan", "ji_sha", "ji_pei", "ji_haku"
    ]
  });
}
