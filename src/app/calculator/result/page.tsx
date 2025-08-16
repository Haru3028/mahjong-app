'use client';
import React from 'react';

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
  let result: ScoreResult | null = null;
  let handData: HandData | null = null;
  let errorMsg: string | null = null;
  try {
    const resultParam = searchParams.get('result');
    const handDataParam = searchParams.get('handData');
    if (resultParam) {
      result = JSON.parse(decodeURIComponent(resultParam));
    }
    if (handDataParam) {
      handData = JSON.parse(decodeURIComponent(handDataParam));
    }
  } catch (error) {
    errorMsg = 'パラメータの解析エラー: ' + (error instanceof Error ? error.message : String(error));
  }

  // パラメータ不正やエラー時は必ずUIを返す
  if (errorMsg) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <div className="text-2xl font-bold mb-4 text-red-400">{errorMsg}</div>
          <button onClick={() => router.push('/')} className="base-button mt-4">メニューに戻る</button>
        </div>
      </main>
    );
  }
  if (!result || !handData) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <div className="text-2xl font-bold mb-4 text-yellow-300">データがありません</div>
          <button onClick={() => router.push('/')} className="base-button mt-4">メニューに戻る</button>
        </div>
      </main>
    );
  }

  // 牌画像パスを取得する関数
  function getTileImagePath(tileId: string): string {
    const tileMapping: Record<string, string> = {
      'man1': '/tiles/man1.png', 'man2': '/tiles/man2.png', 'man3': '/tiles/man3.png',
  'man4': '/tiles/man4.png', 'man5': '/tiles/man5.png', 'man5r': '/tiles/man5_red.png', 'man5_red': '/tiles/man5_red.png',
      'man6': '/tiles/man6.png', 'man7': '/tiles/man7.png', 'man8': '/tiles/man8.png', 'man9': '/tiles/man9.png',
      'pin1': '/tiles/pin1.png', 'pin2': '/tiles/pin2.png', 'pin3': '/tiles/pin3.png',
  'pin4': '/tiles/pin4.png', 'pin5': '/tiles/pin5.png', 'pin5r': '/tiles/pin5_red.png', 'pin5_red': '/tiles/pin5_red.png',
      'pin6': '/tiles/pin6.png', 'pin7': '/tiles/pin7.png', 'pin8': '/tiles/pin8.png', 'pin9': '/tiles/pin9.png',
      'sou1': '/tiles/sou1.png', 'sou2': '/tiles/sou2.png', 'sou3': '/tiles/sou3.png',
  'sou4': '/tiles/sou4.png', 'sou5': '/tiles/sou5.png', 'sou5r': '/tiles/sou5_red.png', 'sou5_red': '/tiles/sou5_red.png',
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
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex items-center justify-center py-8 px-2">
      <div className={`w-full max-w-3xl mx-auto rounded-2xl shadow-2xl bg-gray-950/95 border border-yellow-900/30 transition-all duration-1000 ${showAnimation ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`} style={{ overflow: 'hidden' }}>
        {/* 手牌・ドラ・北ドラ・和了種まとめて中央カード上部に */}
        <div className="flex flex-col items-center gap-2 pt-8 pb-4">
          {/* 南場・子・ロンを横並び・等間隔で中央上部に */}
          <div className="flex flex-row items-center justify-center gap-8 mb-4">
            <div className="flex flex-col items-center">
              <span className="bg-green-700 rounded-lg px-6 py-2 shadow-lg text-white font-bold text-xl tracking-widest">{handData.bakaze === 'ton' ? '東場' : '南場'}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="bg-orange-700 rounded-lg px-6 py-2 shadow-lg text-white font-bold text-xl tracking-widest">{handData.jikaze === 'ton' ? '親' : '子'}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className={`${handData.is_tsumo ? 'bg-blue-700' : 'bg-red-700'} rounded-lg px-6 py-2 shadow-lg text-white font-bold text-xl tracking-widest`}>{handData.is_tsumo ? 'ツモ' : 'ロン'}</span>
            </div>
          </div>
          <div className="flex items-end gap-2 justify-center px-2 py-2 bg-gray-800 rounded-xl shadow-lg">
            {handData.hand.map((tileId: string, index: number) => {
              const isWinning = tileId === handData.winning_tile &&
                (handData.hand.filter(t => t === tileId).length === 1 || index === handData.hand.lastIndexOf(tileId));
              // 和了牌（自摸牌/ロン牌）の直前に大きめスペースを挿入
              const isWinningTileLast = isWinning && index === handData.hand.lastIndexOf(tileId);
              return (
                <React.Fragment key={`${tileId}-${index}`}>
                  {isWinningTileLast && index !== 0 && (
                    <div style={{ width: '2.5rem' }} />
                  )}
                  <div className="relative flex-shrink-0 flex items-end justify-center" style={{height: '4.5rem'}}>
                    <img 
                      src={getTileImagePath(tileId)} 
                      alt={tileId}
                      className={`w-12 h-16 drop-shadow-lg ${isWinning ? 'scale-110' : ''}`}
                      style={{display: 'block'}}
                    />
                    {isWinning && (
                      <span className="absolute left-1/2 -translate-x-1/2 text-xs text-white bg-gray-700 bg-opacity-80 rounded px-2 py-0.5 border border-gray-500" style={{fontSize:'0.75rem', letterSpacing:'0.1em', bottom: '-1.3rem'}}>
                        {handData.is_tsumo ? 'ツモ' : 'ロン'}
                      </span>
                    )}
                  </div>
                </React.Fragment>
              );
            })}
          </div>
          <div className="flex flex-row justify-center gap-8 mt-3 mb-1">
            <div className="flex flex-col items-center">
              <span className="text-xs text-yellow-300 font-bold mb-0.5">ドラ表示牌</span>
              <div className="flex gap-1 bg-gray-800 rounded-lg px-2 py-1">
                {(handData.doraTiles || []).map((tileId: string, idx: number) => (
                  <img key={tileId + idx} src={getTileImagePath(tileId)} alt={tileId} className="w-8 h-10" />
                ))}
              </div>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xs text-blue-300 font-bold mb-0.5">北ドラ（抜きドラ）</span>
              <div className="flex gap-1 bg-gray-800 rounded-lg px-2 py-1">
                {(handData.kitaTiles || []).map((tileId: string, idx: number) => (
                  <img key={tileId + idx} src={getTileImagePath(tileId)} alt={tileId} className="w-8 h-10" />
                ))}
              </div>
            </div>
          </div>
        </div>
  {/* 中央: 翻・符・点数・満貫等の表示を削除 */}
        {/* 役リストは下部1箇所のみ。重複表示を完全に削除 */}
        {(result as any).valid && ((result as any).yaku || (result as any).yakuList) && ((result as any).yaku || (result as any).yakuList).length > 0 && (
          <div className="mb-6">
            <div className="grid grid-cols-2 gap-y-4 gap-x-6 max-w-xl mx-auto bg-gray-800/80 rounded-xl py-4 px-6 shadow-lg">
              {((result as any).yaku || (result as any).yakuList).map((yaku: any, index: number) => (
                <div key={index} className="flex items-center justify-between px-2 py-1 border-b border-yellow-900/30">
                  <span className="text-white font-medium text-lg truncate">{yaku.name}</span>
                  <span className="text-yellow-400 font-bold text-xl ml-2">{yaku.han}翻</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* 下部: ボタンを中央寄せで */}
        <div className="flex justify-center gap-8 pb-8">
          <button
            onClick={() => window.location.href = '/'}
            className="base-button text-center text-lg py-3 px-8 bg-gray-700 hover:bg-gray-800 text-white font-bold rounded shadow"
          >メニュー</button>
          <button
            onClick={() => window.location.href = '/calculator'}
            className="base-button text-center text-lg py-3 px-8 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded shadow"
          >入力画面</button>
        </div>

  {/* 上部の役リスト・役名表示を完全に削除（下部1箇所のみ残す） */}

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
