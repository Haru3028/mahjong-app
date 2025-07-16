import fetch from 'node-fetch';

// 複数役の組み合わせテスト
const multipleYakuTests = [
  {
    name: '面前清自摸和 + タンヤオ + ピンフ + イーペーコー',
    data: {
      hand: ['m2', 'm3', 'm4', 'm5', 'm6', 'm7', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 's4', 's4'],
      is_tsumo: true,
      bakaze: '東',
      jikaze: '東'
    },
    expected_yaku: ['面前清自摸和', 'タンヤオ', 'ピンフ', 'イーペーコー']
  },
  {
    name: 'タンヤオ + ピンフ + イーペーコー（ロン）',
    data: {
      hand: ['m2', 'm3', 'm4', 'm5', 'm6', 'm7', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 's4', 's4'],
      is_tsumo: false,
      bakaze: '東',
      jikaze: '東'
    },
    expected_yaku: ['タンヤオ', 'ピンフ', 'イーペーコー']
  },
  {
    name: '面前清自摸和 + リーチ + 一発 + ピンフ + タンヤオ',
    data: {
      hand: ['m3', 'm4', 'm5', 'm6', 'm7', 'm8', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8', 's2', 's2'],
      is_tsumo: true,
      is_riichi: true,
      is_ippatsu: true,
      bakaze: '東',
      jikaze: '東'
    },
    expected_yaku: ['面前清自摸和', 'リーチ', '一発', 'ピンフ', 'タンヤオ']
  },
  {
    name: 'リャンペーコー + タンヤオ + 面前清自摸和',
    data: {
      hand: ['m2', 'm3', 'm4', 'm2', 'm3', 'm4', 'p5', 'p6', 'p7', 'p5', 'p6', 'p7', 's8', 's8'],
      is_tsumo: true,
      bakaze: '東',
      jikaze: '東'
    },
    expected_yaku: ['リャンペーコー', 'タンヤオ', '面前清自摸和']
  },
  {
    name: 'ホンイツ + イーペーコー + 面前清自摸和',
    data: {
      hand: ['m1', 'm2', 'm3', 'm4', 'm5', 'm6', 'm7', 'm8', 'm9', 'm2', 'm3', 'm4', 'haku', 'haku'],
      is_tsumo: true,
      bakaze: '東',
      jikaze: '東'
    },
    expected_yaku: ['ホンイツ', 'イーペーコー', '面前清自摸和']
  },
  {
    name: 'サンショクドウジュン + イーペーコー + ピンフ',
    data: {
      hand: ['m2', 'm3', 'm4', 'p2', 'p3', 'p4', 's2', 's3', 's4', 's5', 's6', 's7', 'm1', 'm1'],
      is_tsumo: false,
      bakaze: '東',
      jikaze: '東'
    },
    expected_yaku: ['三色同順', 'イーペーコー', 'ピンフ']
  }
];

async function testMultipleYaku() {
  console.log('=== 複数役組み合わせテスト開始 ===\n');
  
  let successCount = 0;
  let totalTests = multipleYakuTests.length;
  
  for (let i = 0; i < multipleYakuTests.length; i++) {
    const test = multipleYakuTests[i];
    console.log(`テスト ${i + 1}: ${test.name}`);
    console.log(`手牌: ${test.data.hand.join(', ')}`);
    
    try {
      const response = await fetch('http://localhost:4000/calculate_score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(test.data),
      });
      
      const result = await response.json();
      
      if (result.success) {
        console.log(`✅ 計算成功: ${result.han}翻 ${result.fu}符 ${result.total_score}点`);
        
        if (result.yaku && result.yaku.length > 0) {
          console.log('検出された役:');
          result.yaku.forEach(yaku => {
            console.log(`  - ${yaku.name}: ${yaku.han}翻`);
          });
          
          // 期待される役がすべて含まれているかチェック
          const detectedYakuNames = result.yaku.map(y => y.name);
          const missingYaku = test.expected_yaku.filter(expected => 
            !detectedYakuNames.includes(expected)
          );
          
          if (missingYaku.length === 0) {
            console.log('🎉 期待される役がすべて検出されました！');
            successCount++;
          } else {
            console.log(`⚠️  未検出の役: ${missingYaku.join(', ')}`);
          }
        } else {
          console.log('❌ 役が検出されませんでした');
        }
      } else {
        console.log(`❌ 計算失敗: ${result.error}`);
      }
    } catch (error) {
      console.log(`❌ APIエラー: ${error.message}`);
    }
    
    console.log('---\n');
  }
  
  console.log('=== テスト結果 ===');
  console.log(`✅ ${successCount}件成功, ❌ ${totalTests - successCount}件失敗`);
  console.log(`成功率: ${Math.round((successCount / totalTests) * 100)}%`);
}

testMultipleYaku().catch(console.error);
