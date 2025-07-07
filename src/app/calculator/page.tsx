// src/app/page.tsx

"use client";

import { useMahjongCalculator } from '../hooks/useMahjongCalculator';
import { useEffect, useState, useMemo } from 'react';
import { MahjongTile, Kaze } from '../types/mahjong'; // Kazeも必要に応じてインポート

// TileSelectionArea をインポート (MahjongTileComponent は削除)
import TileSelectionArea from '../components/TileSelectionArea';

export default function Home() {
  const {
    selectedTiles,
    addTileToHand,
    handleTileClickInHand, // 個別削除用
    furoList,
    hasFuro,
    setHasFuro,
    makeFuroFromSelection, // 新しい鳴き生成関数
    removeFuro,
    bakaze, setBakaze,
    jikaze, setJikaze,
    honba, setHonba,
    reachbo, setReachbo,
    isChankan, setIsChankan,
    remainingHandTilesCount,
  } = useMahjongCalculator();

  const [selectedForFuro, setSelectedForFuro] = useState<MahjongTile[]>([]); // 鳴きのために一時的に選択された牌

  useEffect(() => {
    setHasFuro(true); // 常に鳴き機能を有効にする
  }, [setHasFuro]);

  // 手牌の牌がクリックされた時の処理（鳴きのための選択と、通常削除の分岐）
  const handleHandTileClick = (tile: MahjongTile, index: number) => {
    // selectedForFuro に含まれていれば削除、含まれていなければ追加
    if (selectedForFuro.includes(tile)) {
      setSelectedForFuro(prev => prev.filter(t => t !== tile));
    } else {
      // 最大選択数を4枚に制限 (ポン3枚、カン4枚なので)
      if (selectedForFuro.length < 4) {
        setSelectedForFuro(prev => [...prev, tile]);
      } else {
        alert('鳴きのために選択できる牌は最大4枚です。');
      }
    }
  };

  // ポンボタンが押せるかどうかの判定
  const canMakePon = useMemo(() => {
    if (selectedForFuro.length !== 3) return false;
    const firstTile = selectedForFuro[0];
    // 赤ドラと通常の5は同じ牌として扱う
    return selectedForFuro.every(t => t.type === firstTile.type && t.value === firstTile.value);
  }, [selectedForFuro]);

  // カンボタンが押せるかどうかの判定 (暗カンを想定)
  const canMakeKan = useMemo(() => {
    if (selectedForFuro.length !== 4) return false;
    const firstTile = selectedForFuro[0];
    // 赤ドラと通常の5は同じ牌として扱う
    return selectedForFuro.every(t => t.type === firstTile.type && t.value === firstTile.value);
  }, [selectedForFuro]);

  // 仮の牌データ（表示用、実際の牌選択エリアで使う）
  const availableTilesData: MahjongTile[] = [
    { id: 'm1', name: '萬子1', type: 'manzu', value: 1 }, { id: 'm2', name: '萬子2', type: 'manzu', value: 2 },
    { id: 'm3', name: '萬子3', type: 'manzu', value: 3 }, { id: 'm4', name: '萬子4', type: 'manzu', value: 4 },
    { id: 'm5', name: '萬子5', type: 'manzu', value: 5 }, { id: 'm5r', name: '萬子赤5', type: 'manzu', value: 5, isRedDora: true },
    { id: 'm6', name: '萬子6', type: 'manzu', value: 6 }, { id: 'm7', name: '萬子7', type: 'manzu', value: 7 },
    { id: 'm8', name: '萬子8', type: 'manzu', value: 8 }, { id: 'm9', name: '萬子9', type: 'manzu', value: 9 },
    { id: 'p1', name: '筒子1', type: 'pinzu', value: 1 }, { id: 'p5r', name: '筒子赤5', type: 'pinzu', value: 5, isRedDora: true },
    { id: 's1', name: '索子1', type: 'souzu', value: 1 }, { id: 's5r', name: '索子赤5', type: 'souzu', value: 5, isRedDora: true },
    { id: 'ton', name: '東', type: 'jihai', value: 1 }, { id: 'nan', name: '南', type: 'jihai', value: 2 },
    { id: 'shaa', name: '西', type: 'jihai', value: 3 }, { id: 'pei', name: '北', type: 'jihai', value: 4 },
    { id: 'haku', name: '白', type: 'jihai', value: 5 }, { id: 'hatsu', name: '發', type: 'jihai', value: 6 },
    { id: 'chun', name: '中', type: 'jihai', value: 7 },
  ];


  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4">
      <h1 className="text-2xl font-bold mb-4">麻雀点数計算機</h1>

      {/* 牌選択エリア */}
      <TileSelectionArea
        title="牌を選択"
        tiles={availableTilesData}
        onTileClick={addTileToHand} // 牌をクリックしたら手牌に追加
        type="available" // 選択可能牌エリア
      />

      {/* 手牌表示エリア */}
      <div className="mb-8 p-4 border rounded-lg bg-white shadow-md w-full max-w-2xl">
        <h2 className="text-xl font-semibold mb-2 text-center">手牌 ({selectedTiles.length} / {remainingHandTilesCount})</h2>
        <div className="flex flex-wrap justify-center gap-1">
          {selectedTiles.map((tile, index) => (
            <div key={`${tile.id}-${index}`} className="relative">
              <TileSelectionArea.TileComponent // TileSelectionArea 内の TileComponent を使用
                tile={tile}
                onClick={() => handleHandTileClick(tile, index)} // 鳴き選択のために個別のハンドラを渡す
                isHandTile={true}
                isSelectedForFuro={selectedForFuro.includes(tile)}
              />
              {/* 個別削除ボタン（鳴き選択中でない場合のみ表示） */}
              {!selectedForFuro.includes(tile) && (
                <button
                  onClick={() => handleTileClickInHand(tile, index)} // 選択した牌を直接削除
                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center"
                  style={{ zIndex: 10 }}
                >
                  X
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 鳴き操作ボタンエリア */}
      {hasFuro && (
        <div className="mb-8 p-4 border rounded-lg bg-white shadow-md flex flex-col items-center w-full max-w-2xl">
          <h2 className="text-xl font-semibold w-full text-center mb-4">手牌から鳴きを生成</h2>
          <div className="flex gap-4 justify-center w-full">
            <button
              onClick={() => {
                makeFuroFromSelection(selectedForFuro, 'pon');
                setSelectedForFuro([]); // 選択をリセット
              }}
              disabled={!canMakePon}
              className={`py-2 px-4 rounded font-bold ${
                canMakePon ? 'bg-blue-500 hover:bg-blue-700 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              選択牌でポン ({selectedForFuro.length}/3)
            </button>
            <button
              onClick={() => {
                makeFuroFromSelection(selectedForFuro, 'kan', 'ankan'); // 手牌内なので暗カン
                setSelectedForFuro([]); // 選択をリセット
              }}
              disabled={!canMakeKan}
              className={`py-2 px-4 rounded font-bold ${
                canMakeKan ? 'bg-purple-500 hover:bg-purple-700 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              選択牌でカン ({selectedForFuro.length}/4)
            </button>
          </div>
          {selectedForFuro.length > 0 && (
            <button
              onClick={() => setSelectedForFuro([])}
              className="mt-4 py-2 px-4 rounded font-bold bg-gray-400 hover:bg-gray-500 text-white"
            >
              選択解除
            </button>
          )}
        </div>
      )}

      {/* 鳴き表示エリア */}
      <TileSelectionArea
        title="鳴き（フーロ）一覧"
        tiles={furoList.flatMap(f => f.tiles)} // 鳴き牌の配列を渡す
        furoList={furoList} // Furoオブジェクト全体も渡す
        onTileClick={() => {}} // 鳴き牌はクリック不可
        type="furo" // 鳴き牌エリア
        removeFuro={removeFuro} // 鳴きを削除する関数を渡す
      />

      {/* 場情報と役の有無 */}
      <div className="mb-8 p-4 border rounded-lg bg-white shadow-md">
        <h2 className="text-xl font-semibold mb-2 text-center">場情報と役の有無</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="bakaze" className="block text-sm font-medium text-gray-700">場風:</label>
            <select
              id="bakaze"
              value={bakaze}
              onChange={(e) => setBakaze(e.target.value as Kaze)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="東">東</option>
              <option value="南">南</option>
              <option value="西">西</option>
              <option value="北">北</option>
            </select>
          </div>
          <div>
            <label htmlFor="jikaze" className="block text-sm font-medium text-gray-700">自風:</label>
            <select
              id="jikaze"
              value={jikaze}
              onChange={(e) => setJikaze(e.target.value as Kaze)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="東">東</option>
              <option value="南">南</option>
              <option value="西">西</option>
              <option value="北">北</option>
            </select>
          </div>
          <div>
            <label htmlFor="honba" className="block text-sm font-medium text-gray-700">本場:</label>
            <input
              type="number"
              id="honba"
              value={honba}
              onChange={(e) => setHonba(Number(e.target.value))}
              min="0"
              className="mt-1 block w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            />
          </div>
          <div>
            <label htmlFor="reachbo" className="block text-sm font-medium text-gray-700">リーチ棒 (場に出ている合計):</label>
            <input
              type="number"
              id="reachbo"
              value={reachbo}
              onChange={(e) => setReachbo(Number(e.target.value))}
              min="0"
              className="mt-1 block w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            />
          </div>
          <div className="col-span-2 flex items-center">
            <input
              id="isChankan"
              name="isChankan"
              type="checkbox"
              checked={isChankan}
              onChange={(e) => setIsChankan(e.target.checked)}
              className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
            />
            <label htmlFor="isChankan" className="ml-2 block text-sm text-gray-900">槍槓（他家考慮）</label>
          </div>
        </div>
      </div>
    </main>
  );
}