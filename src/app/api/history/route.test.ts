// /api/history API integration test
describe('/api/history API (integration)', () => {
  const baseUrl = process.env.TEST_BASE_URL || 'http://localhost:3002';

  it('GET /api/history should return 200 and array', async () => {
    const res = await fetch(`${baseUrl}/api/history`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
  });

  it('POST /api/history should insert and return ok', async () => {
    const res = await fetch(`${baseUrl}/api/history`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'test', result: {}, handData: {}, problem: {}, userId: 'test-user' })
    });
    if (res.status !== 200) {
      const text = await res.text();
      console.log('POST /api/history error:', text);
    }
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
  });
});
