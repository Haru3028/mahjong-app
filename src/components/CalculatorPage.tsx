// src/components/CalculatorPage.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { MahjongTile, Furo } from '../types/mahjong';

// 型定義はsrc/types/mahjong.tsに移動・共通化済み

const CalculatorPage: React.FC = () => {
  const router = useRouter();
  const [selectedTiles, setSelectedTiles] = useState<MahjongTile[]>([]);
  const [furoList, setFuroList] = useState<Furo[]>([]); // 鳴き面子リスト
  const [hasFuro, setHasFuro] = useState<boolean>(false); // 副露の有無
  const [isFuroModalOpen, setIsFuroModalOpen] = useState<boolean>(false); // 鳴き牌選択モーダル
  const [currentFuroType, setCurrentFuroType] = useState<Furo["type"] | null>(null); // 現在選択中の鳴きの種類
  const [isRiipaiDone, setIsRiipaiDone] = useState(false);
  const MAX_HAND_TILES = 14;
  const [remainingTilesCount, setRemainingTilesCount] = useState<number>(MAX_HAND_TILES);
  const [bakaze, setBakaze] = useState<'東' | '南' | '西' | '北'>('東');
  const [jikaze, setJikaze] = useState<'東' | '南' | '西' | '北'>('東');
  const [honba, setHonba] = useState<number>(0);
  const [reachbo, setReachbo] = useState<number>(0);

  // --- テスト用ランダム生成ロジックを削除し、元の手牌・ドラ定義に戻す ---


  // 計算結果用のstate
  const [handTiles, setHandTiles] = useState<MahjongTile[]>([]); // 初期値は空配列
  const [doraTiles, setDoraTiles] = useState<MahjongTile[]>([]);
  const [yakuList, setYakuList] = useState<{ name: string; han: number }[]>([]);
  const [isTsumo, setIsTsumo] = useState<boolean>(true);
  const [tsumoTile, setTsumoTile] = useState<MahjongTile | null>(null); // ツモ牌選択
  const [playerCount, setPlayerCount] = useState<3 | 4>(4); // 3麻/4麻切替
  const [isOya, setIsOya] = useState<boolean>(true);
  const [pointText, setPointText] = useState<string>('');
  const [han, setHan] = useState<number>(0);
  const [fu, setFu] = useState<number>(0);

  // 初回マウント時はAPIを呼ばず、手牌は空配列のまま
  // 問題出題や履歴復元時のみAPIからセットする設計に変更

  // ...（ここに元のCalculatorPageのuseEffect, コールバック, JSX return など全てを移植）...

  // 必ずJSXを返すように修正
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-gray-200 bg-gray-900 py-8">
  {/* ...existing code... */}

      {/* ツモ牌選択 */}
      <div className="mb-4">
        <span className="mr-2">自摸牌を選択：</span>
        <select
          value={tsumoTile?.id || ''}
          onChange={e => {
            const id = e.target.value;
            const tile = handTiles.find(t => t.id === id) || null;
            setTsumoTile(tile);
          }}
        >
          <option value="">--選択--</option>
          {handTiles.map(tile => (
            <option key={tile.id} value={tile.id}>{tile.name}</option>
          ))}
        </select>
        {tsumoTile && <span className="ml-2">選択中: {tsumoTile.name}</span>}
      </div>
      {/* 手牌表示 */}
      <div className="flex gap-1 mb-6 bg-[#222] px-6 py-4 rounded-2xl shadow-lg border-4 border-yellow-700">
        {handTiles.map(tile => (
          <img key={tile.id} src={tile.src} alt={tile.name} className="w-10 h-14 drop-shadow-lg" />
        ))}
      </div>
      {/* ドラ表示 */}
      <div className="flex gap-1 mb-6 items-center">
        <span className="text-sm text-gray-300 mr-2">ドラ:</span>
        {doraTiles.map(tile => (
          <img key={tile.id} src={tile.src} alt={tile.name} className="w-8 h-12 drop-shadow" />
        ))}
      </div>
      {/* 点数・翻・符 */}
      <div className="flex items-end gap-4 mb-4">
        <span className="text-4xl font-extrabold text-amber-300 drop-shadow-lg tracking-widest">{pointText}</span>
        <span className="text-xs text-gray-300 mb-1">{han}翻 {fu}符</span>
      </div>
      {/* 役一覧 */}
      <div className="bg-[#222] rounded-xl px-6 py-4 shadow border-2 border-yellow-700 w-full max-w-md flex flex-col items-center">
        {yakuList.map((yaku, i) => (
          <div key={i} className="flex justify-between w-full max-w-xs text-lg mb-1">
            <span className="text-white font-semibold">{yaku.name}</span>
            <span className="text-amber-300 font-bold">{yaku.han}翻</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalculatorPage;
