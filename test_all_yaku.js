#!/usr/bin/env node

// 全役のテストケース
const testCases = [
  // 1翻役
  {
    name: "リーチ",
    hand: ["m1", "m1", "m2", "m3", "m4", "p1", "p1", "p1", "s1", "s2", "s3", "s7", "s8", "s9"],
    is_riichi: true,
    is_tsumo: false,
    bakaze: "東",
    jikaze: "東"
  },
  {
    name: "門前清自摸和（ツモ）",
    hand: ["m1", "m1", "m2", "m3", "m4", "p1", "p1", "p1", "s1", "s2", "s3", "s7", "s8", "s9"],
    is_riichi: false,
    is_tsumo: true,
    bakaze: "東",
    jikaze: "東"
  },
  {
    name: "断幺九（タンヤオ）",
    hand: ["m2", "m3", "m4", "p2", "p3", "p4", "p5", "p6", "p7", "s2", "s3", "s4", "s5", "s5"],
    is_riichi: false,
    is_tsumo: false,
    bakaze: "東",
    jikaze: "東"
  },
  {
    name: "一盃口",
    hand: ["m1", "m2", "m3", "m1", "m2", "m3", "p1", "p1", "s1", "s2", "s3", "s7", "s8", "s9"],
    is_riichi: false,
    is_tsumo: false,
    bakaze: "東",
    jikaze: "東"
  },
  {
    name: "平和",
    hand: ["m1", "m2", "m3", "p2", "p3", "p4", "p5", "p6", "p7", "s1", "s2", "s3", "s4", "s5"],
    is_riichi: false,
    is_tsumo: false,
    bakaze: "東",
    jikaze: "東"
  },
  {
    name: "役牌（白）",
    hand: ["m1", "m1", "m2", "m3", "m4", "p1", "p2", "p3", "s1", "s2", "s3", "haku", "haku", "haku"],
    is_riichi: false,
    is_tsumo: false,
    bakaze: "東",
    jikaze: "東"
  },
  {
    name: "役牌（發）",
    hand: ["m1", "m1", "m2", "m3", "m4", "p1", "p2", "p3", "s1", "s2", "s3", "hatsu", "hatsu", "hatsu"],
    is_riichi: false,
    is_tsumo: false,
    bakaze: "東",
    jikaze: "東"
  },
  {
    name: "役牌（中）",
    hand: ["m1", "m1", "m2", "m3", "m4", "p1", "p2", "p3", "s1", "s2", "s3", "chun", "chun", "chun"],
    is_riichi: false,
    is_tsumo: false,
    bakaze: "東",
    jikaze: "東"
  },
  {
    name: "役牌（場風：東）",
    hand: ["m1", "m1", "m2", "m3", "m4", "p1", "p2", "p3", "s1", "s2", "s3", "ton", "ton", "ton"],
    is_riichi: false,
    is_tsumo: false,
    bakaze: "東",
    jikaze: "南"
  },
  {
    name: "役牌（自風：東）",
    hand: ["m1", "m1", "m2", "m3", "m4", "p1", "p2", "p3", "s1", "s2", "s3", "ton", "ton", "ton"],
    is_riichi: false,
    is_tsumo: false,
    bakaze: "南",
    jikaze: "東"
  },
  // 2翻役
  {
    name: "七対子",
    hand: ["m1", "m1", "m3", "m3", "p2", "p2", "p7", "p7", "s1", "s1", "s5", "s5", "s9", "s9"],
    is_riichi: false,
    is_tsumo: false,
    bakaze: "東",
    jikaze: "東"
  },
  {
    name: "対々和",
    hand: ["m1", "m1", "m1", "p2", "p2", "p2", "s3", "s3", "s3", "ton", "ton", "ton", "haku", "haku"],
    is_riichi: false,
    is_tsumo: false,
    bakaze: "東",
    jikaze: "東"
  },
  {
    name: "三暗刻",
    hand: ["m1", "m1", "m1", "p2", "p2", "p2", "s3", "s3", "s3", "m5", "m6", "m7", "ton", "ton"],
    is_riichi: false,
    is_tsumo: false,
    bakaze: "東",
    jikaze: "東"
  },
  {
    name: "混全帯幺九",
    hand: ["m1", "m2", "m3", "p7", "p8", "p9", "s1", "s1", "s1", "ton", "ton", "ton", "m9", "m9"],
    is_riichi: false,
    is_tsumo: false,
    bakaze: "東",
    jikaze: "東"
  },
  {
    name: "一気通貫",
    hand: ["m1", "m2", "m3", "m4", "m5", "m6", "m7", "m8", "m9", "p1", "p1", "p1", "s2", "s2"],
    is_riichi: false,
    is_tsumo: false,
    bakaze: "東",
    jikaze: "東"
  },
  {
    name: "三色同順",
    hand: ["m1", "m2", "m3", "p1", "p2", "p3", "s1", "s2", "s3", "m7", "m7", "m7", "p9", "p9"],
    is_riichi: false,
    is_tsumo: false,
    bakaze: "東",
    jikaze: "東"
  },
  {
    name: "三色同刻",
    hand: ["m2", "m2", "m2", "p2", "p2", "p2", "s2", "s2", "s2", "m1", "m1", "p5", "p6", "p7"],
    is_riichi: false,
    is_tsumo: false,
    bakaze: "東",
    jikaze: "東"
  },
  {
    name: "小三元",
    hand: ["haku", "haku", "haku", "hatsu", "hatsu", "hatsu", "chun", "chun", "m1", "m2", "m3", "p1", "p1", "p1"],
    is_riichi: false,
    is_tsumo: false,
    bakaze: "東",
    jikaze: "東"
  },
  {
    name: "ダブルリーチ",
    hand: ["m1", "m1", "m2", "m3", "m4", "p1", "p1", "p1", "s1", "s2", "s3", "s7", "s8", "s9"],
    is_riichi: false,
    is_double_riichi: true,
    is_tsumo: false,
    bakaze: "東",
    jikaze: "東"
  },
  // 3翻役
  {
    name: "二盃口",
    hand: ["m1", "m2", "m3", "m1", "m2", "m3", "p4", "p5", "p6", "p4", "p5", "p6", "s7", "s7"],
    is_riichi: false,
    is_tsumo: false,
    bakaze: "東",
    jikaze: "東"
  },
  {
    name: "純全帯幺九",
    hand: ["m1", "m2", "m3", "p7", "p8", "p9", "s1", "s1", "s1", "m9", "m9", "m9", "p1", "p1"],
    is_riichi: false,
    is_tsumo: false,
    bakaze: "東",
    jikaze: "東"
  },
  {
    name: "混一色",
    hand: ["m1", "m2", "m3", "m4", "m5", "m6", "m7", "m8", "m9", "ton", "ton", "ton", "haku", "haku"],
    is_riichi: false,
    is_tsumo: false,
    bakaze: "東",
    jikaze: "東"
  },
  // 6翻役
  {
    name: "清一色",
    hand: ["m1", "m2", "m3", "m4", "m5", "m6", "m7", "m8", "m9", "m1", "m1", "m2", "m2", "m3"],
    is_riichi: false,
    is_tsumo: false,
    bakaze: "東",
    jikaze: "東"
  },
  // 役満
  {
    name: "国士無双",
    hand: ["m1", "m9", "p1", "p9", "s1", "s9", "ton", "nan", "shaa", "pei", "haku", "hatsu", "chun", "m1"],
    is_riichi: false,
    is_tsumo: false,
    bakaze: "東",
    jikaze: "東"
  },
  {
    name: "九蓮宝燈",
    hand: ["m1", "m1", "m1", "m2", "m3", "m4", "m5", "m6", "m7", "m8", "m9", "m9", "m9", "m5"],
    is_riichi: false,
    is_tsumo: false,
    bakaze: "東",
    jikaze: "東"
  },
  {
    name: "四暗刻",
    hand: ["m1", "m1", "m1", "p2", "p2", "p2", "s3", "s3", "s3", "m7", "m7", "m7", "ton", "ton"],
    is_riichi: false,
    is_tsumo: true,
    bakaze: "東",
    jikaze: "東"
  },
  {
    name: "大三元",
    hand: ["haku", "haku", "haku", "hatsu", "hatsu", "hatsu", "chun", "chun", "chun", "m1", "m2", "m3", "p1", "p1"],
    is_riichi: false,
    is_tsumo: false,
    bakaze: "東",
    jikaze: "東"
  },
  {
    name: "字一色",
    hand: ["ton", "ton", "ton", "nan", "nan", "nan", "haku", "haku", "haku", "hatsu", "hatsu", "hatsu", "chun", "chun"],
    is_riichi: false,
    is_tsumo: false,
    bakaze: "東",
    jikaze: "東"
  },
  {
    name: "緑一色",
    hand: ["s2", "s3", "s4", "s6", "s8", "s2", "s3", "s4", "s6", "s8", "hatsu", "hatsu", "hatsu", "s2"],
    is_riichi: false,
    is_tsumo: false,
    bakaze: "東",
    jikaze: "東"
  },
  {
    name: "清老頭",
    hand: ["m1", "m1", "m1", "m9", "m9", "m9", "p1", "p1", "p1", "p9", "p9", "p9", "s1", "s1"],
    is_riichi: false,
    is_tsumo: false,
    bakaze: "東",
    jikaze: "東"
  },
  {
    name: "四喜和（大四喜）",
    hand: ["ton", "ton", "ton", "nan", "nan", "nan", "shaa", "shaa", "shaa", "pei", "pei", "pei", "m1", "m1"],
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

async function runAllTests() {
  console.log('🀄 麻雀役テスト開始\n');
  console.log('=' * 60);
  
  let passCount = 0;
  let failCount = 0;
  
  for (const testCase of testCases) {
    process.stdout.write(`Testing ${testCase.name}... `);
    
    const result = await testYaku(testCase);
    
    if (result.error) {
      console.log(`❌ ERROR: ${result.error}`);
      failCount++;
    } else if (result.success) {
      console.log(`✅ ${result.han}翻 ${result.fu}符 ${result.total_score}点`);
      if (result.yaku && result.yaku.length > 0) {
        console.log(`   役: ${result.yaku.map(y => y.name).join(', ')}`);
      }
      passCount++;
    } else {
      console.log(`❌ 計算失敗: ${result.error || '不明なエラー'}`);
      failCount++;
    }
    console.log('');
  }
  
  console.log('=' * 60);
  console.log(`テスト結果: ✅ ${passCount}件成功, ❌ ${failCount}件失敗`);
  console.log(`成功率: ${Math.round((passCount / (passCount + failCount)) * 100)}%`);
  
  return failCount === 0;
}

// メイン実行
if (require.main === module) {
  runAllTests().then(success => {
    process.exit(success ? 0 : 1);
  }).catch(error => {
    console.error('テスト実行エラー:', error);
    process.exit(1);
  });
}

module.exports = { testCases, testYaku, runAllTests };
