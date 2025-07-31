'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import '../../mahjong-theme.css';
import './result-animations-simple.css';

interface ScoreResult {
  valid: boolean;
  points: string;
  han: number;
  fu: number;
  yaku: Array<{
    name: string;
    han: number;
    yakuman?: boolean;
  }>;
  error?: string;
}

interface HandData {
  hand: string[];
  winning_tile: string;
  is_tsumo: boolean;
  jikaze: string;
  bakaze: string;
  honba: number;
  [key: string]: any;
}

function CalculatorResultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [showAnimation, setShowAnimation] = useState(false);
  
  // URLパラメータから結果と手牌データを取得
  let result: ScoreResult | null = null;
  let handData: HandData | null = null;
  
  try {
    const resultParam = searchParams.get('result');
    const handDataParam = searchParams.get('handData');
    console.log('Raw params:', { resultParam, handDataParam });
    if (resultParam) {
      result = JSON.parse(decodeURIComponent(resultParam));
      console.log('Parsed result:', result);
    }
    if (handDataParam) {
      handData = JSON.parse(decodeURIComponent(handDataParam));
      console.log('Parsed handData:', handData);
    }
  } catch (error) {
    console.error('パラメータの解析エラー:', error);
  }

  // 牌画像パスを取得する関数
  function getTileImagePath(tileId: string): string {
    const tileMapping: Record<string, string> = {
      'man1': '/tiles/man1.png', 'man2': '/tiles/man2.png', 'man3': '/tiles/man3.png',
      'man4': '/tiles/man4.png', 'man5': '/tiles/man5.png', 'man5r': '/tiles/man5_red.png',
      'man6': '/tiles/man6.png', 'man7': '/tiles/man7.png', 'man8': '/tiles/man8.png', 'man9': '/tiles/man9.png',
      'pin1': '/tiles/pin1.png', 'pin2': '/tiles/pin2.png', 'pin3': '/tiles/pin3.png',
      'pin4': '/tiles/pin4.png', 'pin5': '/tiles/pin5.png', 'pin5r': '/tiles/pin5_red.png',
      'pin6': '/tiles/pin6.png', 'pin7': '/tiles/pin7.png', 'pin8': '/tiles/pin8.png', 'pin9': '/tiles/pin9.png',
      'sou1': '/tiles/sou1.png', 'sou2': '/tiles/sou2.png', 'sou3': '/tiles/sou3.png',
      'sou4': '/tiles/sou4.png', 'sou5': '/tiles/sou5.png', 'sou5r': '/tiles/sou5_red.png',
      'sou6': '/tiles/sou6.png', 'sou7': '/tiles/sou7.png', 'sou8': '/tiles/sou8.png', 'sou9': '/tiles/sou9.png',
      'ton': '/tiles/ji_ton.png', 'nan': '/tiles/ji_nan.png', 'sha': '/tiles/ji_sha.png', 'pei': '/tiles/ji_pei.png',
      'haku': '/tiles/ji_haku.png', 'hatsu': '/tiles/ji_hatsu.png', 'chun': '/tiles/ji_chun.png'
    };
    return tileMapping[tileId] || '/tiles/man1.png';
  }

  // アニメーション開始とスクロール制御
  useEffect(() => {
    if (result && handData) {
      // スクロールを完全に無効化
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      
      setTimeout(() => setShowAnimation(true), 200);
    }
    
    // クリーンアップ
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [result, handData]);

  // テストケース一覧
  const testCases = [
    // 1翻（30符）
    { result: { valid: true, points: "1000点", han: 1, fu: 30, yaku: [{ name: "リーチ", han: 1 }] }, handData: { hand: ["man1", "man2", "man3", "pin1", "pin2", "pin3", "sou1", "sou2", "sou3", "ton", "ton", "haku", "haku", "haku"], winning_tile: "haku", is_tsumo: false, jikaze: "ton", bakaze: "ton", honba: 0 } },
    // 3翻（40符）
    { result: { valid: true, points: "3900点", han: 3, fu: 40, yaku: [{ name: "リーチ", han: 1 }, { name: "一発", han: 1 }, { name: "ドラ", han: 1 }] }, handData: { hand: ["man1", "man2", "man3", "pin1", "pin2", "pin3", "sou1", "sou2", "sou3", "ton", "ton", "haku", "haku", "haku"], winning_tile: "haku", is_tsumo: true, jikaze: "nan", bakaze: "ton", honba: 0 } },
    // 満貫（5翻）
    { result: { valid: true, points: "8000点", han: 5, fu: 30, yaku: [{ name: "リーチ", han: 1 }, { name: "一発", han: 1 }, { name: "門前清自摸和", han: 1 }, { name: "ドラ", han: 2 }] }, handData: { hand: ["man1", "man2", "man3", "pin1", "pin2", "pin3", "sou1", "sou2", "sou3", "ton", "ton", "haku", "haku", "haku"], winning_tile: "haku", is_tsumo: false, jikaze: "ton", bakaze: "nan", honba: 0 } },
    // 跳満（6翻40符）
    { result: { valid: true, points: "12000点", han: 6, fu: 40, yaku: [{ name: "リーチ", han: 1 }, { name: "一発", han: 1 }, { name: "門前清自摸和", han: 1 }, { name: "ドラ", han: 3 }] }, handData: { hand: ["man1", "man2", "man3", "pin1", "pin2", "pin3", "sou1", "sou2", "sou3", "ton", "ton", "haku", "haku", "haku"], winning_tile: "haku", is_tsumo: true, jikaze: "nan", bakaze: "nan", honba: 0 } },
    // 倍満（8翻30符）
    { result: { valid: true, points: "16000点", han: 8, fu: 30, yaku: [{ name: "リーチ", han: 1 }, { name: "一発", han: 1 }, { name: "門前清自摸和", han: 1 }, { name: "ドラ", han: 5 }] }, handData: { hand: ["man1", "man2", "man3", "pin1", "pin2", "pin3", "sou1", "sou2", "sou3", "ton", "ton", "haku", "haku", "haku"], winning_tile: "haku", is_tsumo: false, jikaze: "ton", bakaze: "ton", honba: 0 } },
    // 三倍満（12翻30符）
    { result: { valid: true, points: "24000点", han: 12, fu: 30, yaku: [{ name: "リーチ", han: 1 }, { name: "一発", han: 1 }, { name: "門前清自摸和", han: 1 }, { name: "ドラ", han: 9 }] }, handData: { hand: ["man1", "man2", "man3", "pin1", "pin2", "pin3", "sou1", "sou2", "sou3", "ton", "ton", "haku", "haku", "haku"], winning_tile: "haku", is_tsumo: true, jikaze: "nan", bakaze: "ton", honba: 0 } },
    // 役満（13翻30符）
    { result: { valid: true, points: "32000点", han: 13, fu: 30, yaku: [{ name: "国士無双", han: 13 }] }, handData: { hand: ["man1", "man2", "man3", "pin1", "pin2", "pin3", "sou1", "sou2", "sou3", "ton", "ton", "haku", "haku", "haku"], winning_tile: "haku", is_tsumo: false, jikaze: "ton", bakaze: "nan", honba: 0 } },
  ];

  // テスト用自動切り替え
  const [testIndex, setTestIndex] = useState(0);
  useEffect(() => {
    if (!result || !handData) {
      const timer = setInterval(() => {
        setTestIndex(idx => (idx + 1) % testCases.length);
      }, 2000); // 2秒ごとに切り替え
      return () => clearInterval(timer);
    }
  }, [result, handData]);

  if (!result || !handData) {
    result = testCases[testIndex].result;
    handData = testCases[testIndex].handData;
  }

  return (
    <main className="h-screen bg-gray-900 text-white overflow-hidden flex items-center justify-center" style={{ overscrollBehavior: 'none', touchAction: 'none' }}>
      <div className={`w-full max-w-4xl px-2 transition-all duration-1000 ${showAnimation ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`} style={{ height: 'auto', maxHeight: '100vh', overflow: 'hidden' }}>
        
        {/* 手牌表示 - 左右に情報配置 */}
        <div className="mb-8">
          <div className="flex justify-center items-center gap-4 max-w-4xl mx-auto">
            {/* 左側: 場風・親子情報 - 横書き */}
            <div className="flex flex-col items-center gap-2">
              <div className="bg-green-700 rounded-lg px-3 py-1 shadow-lg">
                <div className="flex items-center gap-1" style={{
                  writingMode: 'horizontal-tb',
                  textOrientation: 'mixed',
                  direction: 'ltr'
                }}>
                  <span className="text-white font-bold text-lg">{handData.bakaze === 'ton' ? '東' : '南'}</span>
                  <span className="text-green-200 text-sm">場</span>
                </div>
              </div>
              <div className="bg-orange-700 rounded-lg px-3 py-1 shadow-lg">
                <div className="text-center" style={{
                  writingMode: 'horizontal-tb',
                  textOrientation: 'mixed',
                  direction: 'ltr'
                }}>
                  <span className="text-white font-bold text-lg">{handData.jikaze === 'ton' ? '親' : '子'}</span>
                </div>
              </div>
            </div>
            
            {/* 中央: 手牌 */}
            <div className="flex items-end gap-0.5">
              {handData.hand.map((tileId: string, index: number) => (
                <div key={`${tileId}-${index}`} className="relative flex-shrink-0">
                  <img 
                    src={getTileImagePath(tileId)} 
                    alt=""
                    className="w-6 h-8 object-contain transition-transform hover:scale-110"
                  />
                </div>
              ))}
            </div>
            
            {/* 右側: ツモ・ロン情報 */}
            <div className="flex flex-col items-center gap-2">
              <div className={`rounded-lg px-3 py-2 shadow-lg ${handData.is_tsumo ? 'bg-blue-700' : 'bg-red-700'}`}>
                <div className="text-center">
                  <span className="text-white font-bold text-lg">{handData.is_tsumo ? 'ツモ' : 'ロン'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 成立役 - 2列レイアウトで役と翻数を近づける */}
        {(result as any).valid && ((result as any).yaku || (result as any).yakuList) && ((result as any).yaku || (result as any).yakuList).length > 0 && (
          <div className="mb-6">
            <div className="grid grid-cols-2 gap-y-4 gap-x-2 max-w-2xl mx-auto">
              {((result as any).yaku || (result as any).yakuList).map((yaku: any, index: number) => (
                <div key={index} className="flex flex-col gap-1">
                  <div className="flex items-center justify-between px-2 py-0" style={{
                    background: 'none',
                    fontSize: '15px',
                    gap: '8px',
                    borderRadius: '0'
                  }}>
                    <span className="text-white font-medium flex-1" style={{ minWidth: 0 }}>{yaku.name}</span>
                    <div className="flex items-center gap-0.5 flex-shrink-0">
                      <span className="text-yellow-400 font-bold text-lg">{yaku.han}</span>
                      <span className="text-yellow-400 text-xs">翻</span>
                    </div>
                  </div>
                  <div style={{
                    width: '100%',
                    height: '2px',
                    borderRadius: '1px',
                    background: 'linear-gradient(90deg, #ffd700 0%, #ffb347 100%)',
                    boxShadow: '0 0 4px 1px #ffd70055'
                  }}></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 中央の大きな翻数・符数表示 */}
        {(result as any).valid && (
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center bg-black bg-opacity-50 rounded-full px-6 py-3">
              <span className="text-yellow-400 font-bold text-4xl">{(result as any).han}</span>
              <span className="text-white text-lg ml-2">翻</span>
              <span className="text-yellow-400 font-bold text-2xl ml-4">{(result as any).fu}</span>
              <span className="text-white text-lg ml-1">符</span>
            </div>
          </div>
        )}

        {/* 下部レイアウト: 左にボタン、中央に倍満等、右に点数 */}
        <div className="flex justify-between items-end">
          {/* 左下: ボタンエリア */}
          <div className="flex flex-col gap-2">
            <button
              onClick={() => window.location.href = '/'}
              className="base-button w-60 text-center text-lg py-4 bg-gray-600 hover:bg-gray-700 text-white font-bold rounded shadow flex items-center justify-center"
              style={{ 
                width: '120px', 
                height: '45px', 
                fontSize: '14px',
                writingMode: 'horizontal-tb',
                textOrientation: 'mixed',
                direction: 'ltr',
                unicodeBidi: 'normal'
              }}
            >
              <span style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>メニュー</span>
            </button>
            <button
              onClick={() => window.location.href = '/calculator'}
              className="base-button w-60 text-center text-lg py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded shadow flex items-center justify-center"
              style={{ 
                width: '120px', 
                height: '45px', 
                fontSize: '14px',
                writingMode: 'horizontal-tb',
                textOrientation: 'mixed',
                direction: 'ltr',
                unicodeBidi: 'normal'
              }}
            >
              <span style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>入力画面</span>
            </button>
          </div>
          
          {/* 中央: 満貫・跳満などの大きな表示のみ */}
          <div className="text-center">
            {(result as any).valid && (result as any).han >= 3 && (
              <div className="text-yellow-400 font-bold" style={{ fontSize: '64px', textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}>
                {(result as any).han >= 13 ? '数え役満' :
                 (result as any).han >= 11 ? '三倍満' :
                 (result as any).han >= 8 ? '倍満' :
                 (result as any).han >= 6 ? '跳満' :
                 (result as any).han >= 5 ? '満貫' : ''}
              </div>
            )}
          </div>
          
          {/* 右下: 背景なしの巨大な点数 */}
          <div className="text-right">
            <div className="text-white font-bold" style={{ fontSize: '64px', textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}>
              {(result as any).pointText || (result as any).totalScore || '12000'}
              <span style={{ fontSize: '32px' }}>点</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function CalculatorResultPage() {
  return (
    <Suspense fallback={
      <main className="h-screen py-8 px-4 text-white flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="text-2xl font-bold mb-4" style={{ color: '#f5e9c6' }}>
            計算中...
          </div>
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-t-transparent mx-auto" style={{ borderColor: '#bfa76f' }}></div>
        </div>
      </main>
    }>
      <CalculatorResultContent />
    </Suspense>
  );
}
