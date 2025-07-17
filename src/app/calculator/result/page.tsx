'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

// 計算結果の型定義
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

// 手牌データの型定義
interface HandData {
  hand: string[];
  winning_tile: string;
  is_tsumo: boolean;
  is_riichi: boolean;
  is_double_riichi: boolean;
  is_ippatsu: boolean;
  is_chankan: boolean;
  is_rinshan: boolean;
  is_haitei: boolean;
  is_houtei: boolean;
  is_tenhou: boolean;
  is_chiihou: boolean;
  bakaze: string;
  jikaze: string;
  honba: number;
  dora_indicators?: string[];
  ura_dora_indicators?: string[];
  furo?: Array<{
    type: string;
    tiles: string[];
  }>;
}

function CalculatorResultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // URLパラメータから結果と手牌データを取得
  const resultParam = searchParams.get('result');
  const handDataParam = searchParams.get('handData');
  
  let result: ScoreResult | null = null;
  let handData: HandData | null = null;
  
  try {
    if (resultParam) {
      result = JSON.parse(decodeURIComponent(resultParam));
    }
    if (handDataParam) {
      handData = JSON.parse(decodeURIComponent(handDataParam));
    }
  } catch (error) {
    console.error('パラメータの解析エラー:', error);
  }

  // 牌IDを画像パスに変換する関数
  function getTileImagePath(tileId: string): string {
    const tileMapping: { [key: string]: string } = {
      // 萬子
      'man1': '/tiles/man1.png', 'man2': '/tiles/man2.png', 'man3': '/tiles/man3.png',
      'man4': '/tiles/man4.png', 'man5': '/tiles/man5.png', 'man5r': '/tiles/man5_red.png',
      'man6': '/tiles/man6.png', 'man7': '/tiles/man7.png', 'man8': '/tiles/man8.png', 'man9': '/tiles/man9.png',
      // 筒子
      'pin1': '/tiles/pin1.png', 'pin2': '/tiles/pin2.png', 'pin3': '/tiles/pin3.png',
      'pin4': '/tiles/pin4.png', 'pin5': '/tiles/pin5.png', 'pin5r': '/tiles/pin5_red.png',
      'pin6': '/tiles/pin6.png', 'pin7': '/tiles/pin7.png', 'pin8': '/tiles/pin8.png', 'pin9': '/tiles/pin9.png',
      // 索子
      'sou1': '/tiles/sou1.png', 'sou2': '/tiles/sou2.png', 'sou3': '/tiles/sou3.png',
      'sou4': '/tiles/sou4.png', 'sou5': '/tiles/sou5.png', 'sou5r': '/tiles/sou5_red.png',
      'sou6': '/tiles/sou6.png', 'sou7': '/tiles/sou7.png', 'sou8': '/tiles/sou8.png', 'sou9': '/tiles/sou9.png',
      // 字牌
      'ton': '/tiles/ji_ton.png', 'nan': '/tiles/ji_nan.png', 'shaa': '/tiles/ji_sha.png', 'pei': '/tiles/ji_pei.png',
      'haku': '/tiles/ji_haku.png', 'hatsu': '/tiles/ji_hatsu.png', 'chun': '/tiles/ji_chun.png'
    };
    return tileMapping[tileId] || '/tiles/man1.png';
  }

  // 特殊和了の判定
  function getSpecialAgari(handData: HandData | null): string[] {
    if (!handData) return [];
    const special: string[] = [];
    
    if (handData.is_tenhou) special.push('天和');
    if (handData.is_chiihou) special.push('地和');
    
    return special;
  }

  // データがない場合の表示
  if (!result || !handData) {
    return (
      <main className="min-h-screen py-8 px-4 bg-gray-900 text-white flex flex-col items-center justify-center">
        <div className="text-center">
          <div className="text-2xl text-red-400 mb-4">データが見つかりません</div>
          <Link 
            href="/calculator" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold transition-colors"
          >
            計算機に戻る
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen py-4 px-2 sm:px-4 bg-gray-900 text-white overflow-x-hidden">
      <div className="w-full max-w-6xl mx-auto space-y-6">

        {/* 和了手牌 */}
        <section className="bg-gray-800 rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-center mb-6 text-amber-400">和了手牌</h2>
          
          {/* 手牌画像表示 */}
          <div className="flex justify-center items-center flex-wrap gap-2 mb-6">
            {handData.hand.map((tileId: string, index: number) => (
              <div key={index} className="relative">
                <img 
                  src={getTileImagePath(tileId)} 
                  alt=""
                  className={`w-14 h-20 sm:w-16 sm:h-22 object-contain transition-transform hover:scale-105 ${
                    tileId === handData.winning_tile ? 'border-3 border-yellow-400 rounded shadow-lg shadow-yellow-400/50' : ''
                  }`}
                />
                {tileId === handData.winning_tile && (
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-black text-xs px-2 py-1 rounded font-bold">
                    {handData.is_tsumo ? 'ツモ' : 'ロン'}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* 鳴き面子表示 */}
          {handData.furo && handData.furo.length > 0 && (
            <div className="mt-6">
              <h3 className="text-center text-gray-300 mb-4 text-lg">鳴き</h3>
              <div className="flex justify-center gap-4 flex-wrap">
                {handData.furo.map((furo: any, index: number) => (
                  <div key={index} className="bg-gray-700 rounded p-3">
                    <div className="text-sm text-gray-400 text-center mb-2">{furo.type}</div>
                    <div className="flex gap-1">
                      {furo.tiles.map((tileId: string, tileIndex: number) => (
                        <img 
                          key={tileIndex}
                          src={getTileImagePath(tileId)} 
                          alt=""
                          className="w-10 h-14 object-contain"
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* 計算結果 */}
        <section className="bg-gray-800 rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-center mb-6 text-amber-400">計算結果</h2>
          
          {result.valid ? (
            <div className="text-center">
              {/* メイン点数表示 */}
              <div className="bg-gradient-to-r from-amber-500 to-yellow-400 text-black rounded-lg p-6 mb-6">
                <div className="text-3xl sm:text-5xl font-bold mb-2">{result.points}</div>
                <div className="text-lg sm:text-xl">{result.han}翻 {result.fu}符</div>
              </div>
              
              {/* 詳細情報 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {/* 和了タイプ */}
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="text-lg sm:text-xl font-bold text-green-400 mb-2">
                    {handData.is_tsumo ? '自摸和了' : 'ロン和了'}
                  </div>
                  <div className="text-gray-300 text-sm">
                    {handData.bakaze === 'ton' ? '東風戦' : handData.bakaze === 'nan' ? '南風戦' : '風戦'} ・ 
                    {handData.jikaze === 'ton' ? '親' : '子'}
                  </div>
                </div>

                {/* ドラ情報 */}
                {result.yaku && result.yaku.some((y: any) => y.name.includes('ドラ')) && (
                  <div className="bg-purple-700 rounded-lg p-4">
                    <h3 className="text-lg font-bold text-purple-300 mb-2">ドラ</h3>
                    <div className="text-amber-300 text-base">
                      合計 {result.yaku.filter((y: any) => y.name.includes('ドラ')).reduce((sum: number, y: any) => sum + y.han, 0)}翻
                    </div>
                    <div className="flex justify-center gap-1 mt-3">
                      {handData.dora_indicators?.slice(0, 5).map((doraId: string, index: number) => (
                        <img 
                          key={index}
                          src={getTileImagePath(doraId)} 
                          alt=""
                          className="w-6 h-9 object-contain border border-purple-400 rounded"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center text-red-400 bg-red-900/20 rounded-lg p-8">
              <div className="text-2xl font-bold mb-3">計算エラー</div>
              <div className="text-gray-300 text-lg">{result.error || '不明なエラーが発生しました'}</div>
            </div>
          )}
        </section>

        {/* 成立役 */}
        {result.valid && result.yaku && result.yaku.length > 0 && (
          <section className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-center mb-6 text-amber-400">成立役</h2>
            
            {/* 特殊和了があれば最初に表示 */}
            {(() => {
              const specialAgari = getSpecialAgari(handData);
              return specialAgari.length > 0 ? (
                <div className="mb-6 text-center">
                  <h3 className="text-red-400 font-bold mb-4 text-xl">特殊和了</h3>
                  <div className="flex justify-center gap-3 flex-wrap">
                    {specialAgari.map((special: string, index: number) => (
                      <span key={index} className="bg-red-500 text-white px-4 py-2 rounded-full text-lg font-bold">
                        {special}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null;
            })()}
            
            {/* 通常の成立役 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {result.yaku.map((yaku: any, index: number) => (
                <div key={index} className="bg-gray-700 rounded-lg p-4 flex justify-between items-center hover:bg-gray-600 transition-colors">
                  <span className="text-white text-lg font-medium">{yaku.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-green-400 text-2xl font-bold">{yaku.han}</span>
                    <span className="text-green-300 text-lg">翻</span>
                  </div>
                  {yaku.yakuman && (
                    <div className="ml-2 text-red-400 text-sm font-bold">役満</div>
                  )}
                </div>
              ))}
            </div>
            
            {/* 合計翻数表示 */}
            <div className="mt-6 text-center">
              <div className="bg-green-600 text-white rounded-lg px-6 py-3 inline-block">
                <span className="text-xl font-bold">
                  合計: {result.yaku.reduce((sum: number, yaku: any) => sum + yaku.han, 0)}翻
                </span>
              </div>
            </div>
          </section>
        )}

        {/* ナビゲーションボタン */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 w-full max-w-md mx-auto pb-8">
          <Link 
            href="/calculator" 
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-lg font-bold text-lg transition-colors shadow-lg text-center border-2 border-transparent hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            ← 入力画面に戻る
          </Link>
          <Link 
            href="/dashboard" 
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-6 py-4 rounded-lg font-bold text-lg transition-colors shadow-lg text-center border-2 border-transparent hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            メニュー画面へ
          </Link>
        </div>
      </div>
    </main>
  );
}

// Suspenseでラップしたメインコンポーネント
export default function CalculatorResultPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen py-8 px-4 bg-gray-900 text-white flex flex-col items-center justify-center">
        <div className="text-center">
          <div className="text-2xl text-amber-400 mb-4">読み込み中...</div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-400 mx-auto"></div>
        </div>
      </main>
    }>
      <CalculatorResultContent />
    </Suspense>
  );
}
