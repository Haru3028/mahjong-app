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

  // 仮データ
  const handTiles: MahjongTile[] = [
    { id: 'm1', name: '一萬', src: '/tiles/man1.png', type: 'manzu', value: 1, isRedDora: false },
    { id: 'm2', name: '二萬', src: '/tiles/man2.png', type: 'manzu', value: 2, isRedDora: false },
    { id: 'm3', name: '三萬', src: '/tiles/man3.png', type: 'manzu', value: 3, isRedDora: false },
    { id: 'm4', name: '四萬', src: '/tiles/man4.png', type: 'manzu', value: 4, isRedDora: false },
    { id: 'm5', name: '五萬', src: '/tiles/man5.png', type: 'manzu', value: 5, isRedDora: false },
    { id: 'm6', name: '六萬', src: '/tiles/man6.png', type: 'manzu', value: 6, isRedDora: false },
    { id: 'm7', name: '七萬', src: '/tiles/man7.png', type: 'manzu', value: 7, isRedDora: false },
    { id: 'm8', name: '八萬', src: '/tiles/man8.png', type: 'manzu', value: 8, isRedDora: false },
    { id: 'm9', name: '九萬', src: '/tiles/man9.png', type: 'manzu', value: 9, isRedDora: false },
    { id: 'p1', name: '一筒', src: '/tiles/pin1.png', type: 'pinzu', value: 1, isRedDora: false },
    { id: 'p2', name: '二筒', src: '/tiles/pin2.png', type: 'pinzu', value: 2, isRedDora: false },
    { id: 'p3', name: '三筒', src: '/tiles/pin3.png', type: 'pinzu', value: 3, isRedDora: false },
    { id: 'haku', name: '白', src: '/tiles/ji_haku.png', type: 'jihai', value: 5, isRedDora: false },
  ];
  const doraTiles: MahjongTile[] = [
    { id: 'p5', name: '五筒', src: '/tiles/pin5.png', type: 'pinzu', value: 5, isRedDora: false },
  ];

  const yakuList = [
    { name: '立直', han: 1 },
    { name: '門前清自摸和', han: 1 },
    { name: 'ドラ', han: 2 },
  ];
  const isTsumo = true;
  const isOya = true;
  const pointText = isTsumo ? (isOya ? '4000オール' : '3000/6000') : '12000';
  const han = 3;
  const fu = 40;

  // ...（ここに元のCalculatorPageのuseEffect, コールバック, JSX return など全てを移植）...

  // 必ずJSXを返すように修正
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-gray-200 bg-gray-900 py-8">
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
