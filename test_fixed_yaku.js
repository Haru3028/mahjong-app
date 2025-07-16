#!/usr/bin/env node

// 修正されたテストケース
const fixedTestCases = [
  {
    name: "一盃口（修正版）",
    hand: ["m1", "m2", "m3", "m1", "m2", "m3", "p1", "p1", "s1", "s2", "s3", "s4", "s5", "s6"],
    is_riichi: false,
    is_tsumo: false,
    bakaze: "東",
    jikaze: "東"
  },
  {
    name: "平和（修正版）",
    hand: ["m1", "m2", "m3", "p2", "p3", "p4", "p5", "p6", "p7", "s1", "s2", "s3", "s4", "s4"],
    is_riichi: false,
    is_tsumo: false,
    bakaze: "東",
    jikaze: "東"
  },
  {
    name: "三暗刻（修正版）",
    hand: ["m1", "m1", "m1", "p2", "p2", "p2", "s3", "s3", "s3", "m5", "m6", "m7", "ton", "ton"],
    is_riichi: false,
    is_tsumo: false,
    bakaze: "東",
    jikaze: "東"
  },
  {
    name: "一気通貫（修正版）",
    hand: ["m1", "m2", "m3", "m4", "m5", "m6", "m7", "m8", "m9", "p1", "p1", "p1", "s2", "s2"],
    is_riichi: false,
    is_tsumo: false,
    bakaze: "東",
    jikaze: "東"
  },
  {
    name: "三色同順（修正版）",
    hand: ["m1", "m2", "m3", "p1", "p2", "p3", "s1", "s2", "s3", "m7", "m7", "m7", "p9", "p9"],
    is_riichi: false,
    is_tsumo: false,
    bakaze: "東",
    jikaze: "東"
  },
  {
    name: "三色同刻（修正版）",
    hand: ["m2", "m2", "m2", "p2", "p2", "p2", "s2", "s2", "s2", "m1", "m1", "p5", "p6", "p7"],
    is_riichi: false,
    is_tsumo: false,
    bakaze: "東",
    jikaze: "東"
  },
  {
    name: "純全帯幺九（修正版）",
    hand: ["m1", "m2", "m3", "p7", "p8", "p9", "s1", "s1", "s1", "m9", "m9", "m9", "p1", "p1"],
    is_riichi: false,
    is_tsumo: false,
    bakaze: "東",
    jikaze: "東"
  }
];

async function testYaku(testCase) {
  const fetch = (await import('node-fetch')).default;
  try {
    const response = await fetch('http://localhost:4000/api/calc_score', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testCase)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    return { error: error.message };
  }
}

async function runFixedTests() {
  console.log('🀄 修正版麻雀役テスト開始\n');
  
  for (const testCase of fixedTestCases) {
    process.stdout.write(`Testing ${testCase.name}... `);
    
    const result = await testYaku(testCase);
    
    if (result.error) {
      console.log(`❌ ERROR: ${result.error}`);
    } else if (result.success) {
      console.log(`✅ ${result.han}翻 ${result.fu}符 ${result.total_score}点`);
      if (result.yaku && result.yaku.length > 0) {
        console.log(`   役: ${result.yaku.map(y => y.name).join(', ')}`);
      }
    } else {
      console.log(`❌ 計算失敗: ${result.error || '不明なエラー'}`);
    }
    console.log('');
  }
}

// メイン実行
if (require.main === module) {
  runFixedTests().catch(error => {
    console.error('テスト実行エラー:', error);
    process.exit(1);
  });
}

module.exports = { fixedTestCases, runFixedTests };
