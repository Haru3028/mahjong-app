
import { POST, GET } from './route';
import { NextRequest } from 'next/server';

describe('input_history API', () => {
  it('POSTで履歴が保存できる', async () => {
    const req = {
      json: async () => ({
        inputType: 'test_type',
        inputValue: JSON.stringify({ hand: '123456789m', answer: '32000点', level: 'hard' })
      })
    } as unknown as NextRequest;
    const res = await POST(req);
    const json = await res.json();
    // NextResponse.json()の戻り値は {inputType, inputValue, ...} 形式
    expect(json.inputType).toBe('test_type');
    expect(json.inputValue).toContain('32000点');
  });

  it('GETで履歴一覧が取得できる', async () => {
    const res = await GET();
    const json = await res.json();
    expect(Array.isArray(json)).toBe(true);
    // 直前のテストで保存した履歴が含まれていること
    expect(json.some((item: any) => item.inputType === 'test_type')).toBe(true);
  });
});
