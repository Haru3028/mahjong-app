// src/app/calculator/result/page.tsx

"use client";

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import TileComponent from '@/components/TileComponent';

// 牌の型定義
interface MahjongTile {
  id: string;
  name: string;
  src: string;
  type: 'manzu' | 'pinzu' | 'souzu' | 'jihai';
  value: number;
}

// 鳴きの型定義
interface Furo {
  type: 'pon' | 'kan' | 'chi';
  tiles: MahjongTile[];
}

// 計算結果の型定義
interface ScoreResult {
  valid: boolean;
  error?: string;
  score?: {
    points: number;
    han: number;
    fu: number;
    name: string;
  };
  yaku?: Array<{
    name: string;
    han: number;
  }>;
  agari_type?: string;
  winning_tile?: string;
}

// 手牌データの型定義
interface HandData {
  hand: string[];
  bakaze: string;
  jikaze: string;
  dora_indicators: string[];
  furo: Array<{
    type: string;
    tiles: string[];
  }>;
  is_tsumo: boolean;
  is_riichi: boolean;
  is_double_riichi: boolean;
  is_ippatsu: boolean;
  is_chankan: boolean;
  is_rinshan: boolean;
  is_haitei: boolean;
  is_houtei: boolean;
  is_chiiho: boolean;
  is_tenho: boolean;
  honba: number;
  winning_tile: string;
}

// 麻雀牌のデータを定義
const mahjongTiles: MahjongTile[] = [
  // 萬子
  { id: 'm1', name: '萬子1', src: '/tiles/man1.png', type: 'manzu', value: 1 },
  { id: 'm2', name: '萬子2', src: '/tiles/man2.png', type: 'manzu', value: 2 },
  { id: 'm3', name: '萬子3', src: '/tiles/man3.png', type: 'manzu', value: 3 },
  { id: 'm4', name: '萬子4', src: '/tiles/man4.png', type: 'manzu', value: 4 },
  { id: 'm5', name: '萬子5', src: '/tiles/man5.png', type: 'manzu', value: 5 },
  { id: 'm5r', name: '萬子5赤', src: '/tiles/man5_red.png', type: 'manzu', value: 5 },
  { id: 'm6', name: '萬子6', src: '/tiles/man6.png', type: 'manzu', value: 6 },
  { id: 'm7', name: '萬子7', src: '/tiles/man7.png', type: 'manzu', value: 7 },
  { id: 'm8', name: '萬子8', src: '/tiles/man8.png', type: 'manzu', value: 8 },
  { id: 'm9', name: '萬子9', src: '/tiles/man9.png', type: 'manzu', value: 9 },
  // 筒子
  { id: 'p1', name: '筒子1', src: '/tiles/pin1.png', type: 'pinzu', value: 1 },
  { id: 'p2', name: '筒子2', src: '/tiles/pin2.png', type: 'pinzu', value: 2 },
  { id: 'p3', name: '筒子3', src: '/tiles/pin3.png', type: 'pinzu', value: 3 },
  { id: 'p4', name: '筒子4', src: '/tiles/pin4.png', type: 'pinzu', value: 4 },
  { id: 'p5', name: '筒子5', src: '/tiles/pin5.png', type: 'pinzu', value: 5 },
  { id: 'p5r', name: '筒子5赤', src: '/tiles/pin5_red.png', type: 'pinzu', value: 5 },
  { id: 'p6', name: '筒子6', src: '/tiles/pin6.png', type: 'pinzu', value: 6 },
  { id: 'p7', name: '筒子7', src: '/tiles/pin7.png', type: 'pinzu', value: 7 },
  { id: 'p8', name: '筒子8', src: '/tiles/pin8.png', type: 'pinzu', value: 8 },
  { id: 'p9', name: '筒子9', src: '/tiles/pin9.png', type: 'pinzu', value: 9 },
  // 索子
  { id: 's1', name: '索子1', src: '/tiles/sou1.png', type: 'souzu', value: 1 },
  { id: 's2', name: '索子2', src: '/tiles/sou2.png', type: 'souzu', value: 2 },
  { id: 's3', name: '索子3', src: '/tiles/sou3.png', type: 'souzu', value: 3 },
  { id: 's4', name: '索子4', src: '/tiles/sou4.png', type: 'souzu', value: 4 },
  { id: 's5', name: '索子5', src: '/tiles/sou5.png', type: 'souzu', value: 5 },
  { id: 's5r', name: '索子5赤', src: '/tiles/sou5_red.png', type: 'souzu', value: 5 },
  { id: 's6', name: '索子6', src: '/tiles/sou6.png', type: 'souzu', value: 6 },
  { id: 's7', name: '索子7', src: '/tiles/sou7.png', type: 'souzu', value: 7 },
  { id: 's8', name: '索子8', src: '/tiles/sou8.png', type: 'souzu', value: 8 },
  { id: 's9', name: '索子9', src: '/tiles/sou9.png', type: 'souzu', value: 9 },
  // 字牌
  { id: 'ton', name: '東', src: '/tiles/ji_ton.png', type: 'jihai', value: 1 },
  { id: 'nan', name: '南', src: '/tiles/ji_nan.png', type: 'jihai', value: 2 },
  { id: 'shaa', name: '西', src: '/tiles/ji_shaa.png', type: 'jihai', value: 3 },
  { id: 'pei', name: '北', src: '/tiles/ji_pei.png', type: 'jihai', value: 4 },
  { id: 'haku', name: '白', src: '/tiles/ji_haku.png', type: 'jihai', value: 5 },
  { id: 'hatsu', name: '發', src: '/tiles/ji_hatsu.png', type: 'jihai', value: 6 },
  { id: 'chun', name: '中', src: '/tiles/ji_chun.png', type: 'jihai', value: 7 },
];

type Kaze = '東' | '南' | '西' | '北';
type FuroType = 'pon' | 'kan' | 'chi';

// 鳴き牌選択モーダルコンポーネント
interface FuroModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectFuroTiles: (tiles: MahjongTile[], type: FuroType) => void;
  furoType: FuroType;
  selectedTilesInHand: MahjongTile[]; // 現在選択中の手牌
  furoList: Furo[]; // 現在の鳴き面子リスト
}

const FuroModal: React.FC<FuroModalProps> = ({ isOpen, onClose, onSelectFuroTiles, furoType, selectedTilesInHand, furoList }) => {
  const [tempSelectedTiles, setTempSelectedTiles] = useState<MahjongTile[]>([]);

  // Helper to count total occurrences of a tile (including red 5s) across all relevant lists
  const countTotalTiles = (
    tileId: string,
    currentHand: MahjongTile[],
    currentFuroList: Furo[],
    tempSelections: MahjongTile[]
  ) => {
    const allTiles = [
      ...currentHand,
      ...currentFuroList.flatMap((f) => f.tiles),
      ...tempSelections,
    ];
    let count = 0;
    if (tileId.includes('5') && tileId.includes('r')) {
      // If red 5, count both normal 5 and red 5
      const normalId = tileId.replace('r', '');
      count = allTiles.filter(
        (t) => t.id === tileId || t.id === normalId
      ).length;
    } else if (tileId.includes('5')) {
      // If normal 5, count both normal 5 and red 5
      const redId = tileId + 'r';
      count = allTiles.filter(
        (t) => t.id === tileId || t.id === redId
      ).length;
    } else {
      // For other tiles, just count by ID
      count = allTiles.filter((t) => t.id === tileId).length;
    }
    return count;
  };


  // モーダルが開かれたときに一時選択をリセット
  useEffect(() => {
    if (isOpen) {
      setTempSelectedTiles([]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  let requiredTilesCount = 0;
  let modalTitle = '';
  switch (furoType) {
    case 'pon':
      requiredTilesCount = 3;
      modalTitle = 'ポンする牌を選択 (3枚)';
      break;
    case 'kan':
      requiredTilesCount = 4;
      modalTitle = 'カンする牌を選択 (4枚)';
      break;
    case 'chi':
      requiredTilesCount = 3;
      modalTitle = 'チーする牌を選択 (3枚)';
      break;
  }

  const handleTileClick = (tile: MahjongTile) => {
    // const currentCount = countTotalTiles(tile.id, selectedTilesInHand, furoList, tempSelectedTiles);
    // const tempSelectedCountOfThisTile = tempSelectedTiles.filter(t => t.id === tile.id).length;

    if (tempSelectedTiles.includes(tile)) {
      // If already selected, remove it
      setTempSelectedTiles(tempSelectedTiles.filter((t: MahjongTile) => t !== tile));
    } else if (tempSelectedTiles.length < requiredTilesCount) {
      // Check if adding this tile would exceed 4 total (including red 5s)
      if (countTotalTiles(tile.id, selectedTilesInHand, furoList, [...tempSelectedTiles, tile]) > 4) {
        alert(`${tile.name} は既に4枚選択されています。`);
        return;
      }
      setTempSelectedTiles([...tempSelectedTiles, tile]);
    } else {
      alert(`${requiredTilesCount}枚選択済みです。`);
    }
  };

  const handleConfirm = () => {
    if (tempSelectedTiles.length === requiredTilesCount) {
      if (furoType === 'pon' || furoType === 'kan') {
        // ポン・カンは同じ牌が選択されているか確認
        const firstTileId = tempSelectedTiles[0].id.replace('r', ''); // 赤5も通常の5として扱う
        const allSame = tempSelectedTiles.every((t: MahjongTile) => t.id.replace('r', '') === firstTileId);
        if (!allSame) {
          alert('ポン・カンは同じ種類の牌を選択してください。');
          return;
        }
      } else if (furoType === 'chi') {
        // チーは順子になっているか確認 (同種牌かつ連番)
        const sortedChiTiles = [...tempSelectedTiles].sort((a, b) => a.value - b.value);
        const isSameType = sortedChiTiles.every(t => t.type === sortedChiTiles[0].type && t.type !== 'jihai');
        const isSequence = sortedChiTiles[0].value === sortedChiTiles[1].value - 1 && sortedChiTiles[1].value === sortedChiTiles[2].value - 1;

        if (!isSameType || !isSequence) {
          alert('チーは同種類の連続した数字の牌を選択してください。');
          return;
        }
      }
      onSelectFuroTiles(tempSelectedTiles, furoType);
      onClose();
    } else {
      alert(`${requiredTilesCount}枚の牌を選択してください。`);
    }
  };

  const tilesByType: { [key: string]: MahjongTile[] } = {
    manzu: mahjongTiles.filter(tile => tile.type === 'manzu'),
    pinzu: mahjongTiles.filter(tile => tile.type === 'pinzu'),
    souzu: mahjongTiles.filter(tile => tile.type === 'souzu'),
    jihai: mahjongTiles.filter(tile => tile.type === 'jihai'),
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="section-panel w-11/12 max-w-xl max-h-[90vh] overflow-y-auto">
        <h3 className="section-title">{modalTitle}</h3>

        {/* 萬子 */}
        <div className="mb-3">
          <h4 className="text-base font-medium text-amber-200 mb-1">萬子</h4>
          <div className="flex flex-wrap gap-1 justify-center">
            {tilesByType.manzu.map((tile) => (
              <img
                key={tile.id}
                src={tile.src}
                alt={tile.name}
                className={`w-8 h-12 cursor-pointer border-2 ${
                  tempSelectedTiles.includes(tile) ? 'border-blue-500' : 'border-transparent'
                } hover:scale-105 transition-transform duration-100`}
                onClick={() => handleTileClick(tile)}
              />
            ))}
          </div>
        </div>
        {/* 筒子 */}
        <div className="mb-3">
          <h4 className="text-base font-medium text-amber-200 mb-1">筒子</h4>
          <div className="flex flex-wrap gap-1 justify-center">
            {tilesByType.pinzu.map((tile) => (
              <img
                key={tile.id}
                src={tile.src}
                alt={tile.name}
                className={`w-8 h-12 cursor-pointer border-2 ${
                  tempSelectedTiles.includes(tile) ? 'border-blue-500' : 'border-transparent'
                } hover:scale-105 transition-transform duration-100`}
                onClick={() => handleTileClick(tile)}
              />
            ))}
          </div>
        </div>
        {/* 索子 */}
        <div className="mb-3">
          <h4 className="text-base font-medium text-amber-200 mb-1">索子</h4>
          <div className="flex flex-wrap gap-1 justify-center">
            {tilesByType.souzu.map((tile) => (
              <img
                key={tile.id}
                src={tile.src}
                alt={tile.name}
                className={`w-8 h-12 cursor-pointer border-2 ${
                  tempSelectedTiles.includes(tile) ? 'border-blue-500' : 'border-transparent'
                } hover:scale-105 transition-transform duration-100`}
                onClick={() => handleTileClick(tile)}
              />
            ))}
          </div>
        </div>
        {/* 字牌 */}
        <div className="mb-3">
          <h4 className="text-base font-medium text-amber-200 mb-1">字牌</h4>
          <div className="flex flex-wrap gap-1 justify-center">
            {tilesByType.jihai.map((tile) => (
              <img
                key={tile.id}
                src={tile.src}
                alt={tile.name}
                className={`w-8 h-12 cursor-pointer border-2 ${
                  tempSelectedTiles.includes(tile) ? 'border-blue-500' : 'border-transparent'
                } hover:scale-105 transition-transform duration-100`}
                onClick={() => handleTileClick(tile)}
              />
            ))}
          </div>
        </div>

        <div className="mt-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="base-button back-button"
          >
            キャンセル
          </button>
          <button
            onClick={handleConfirm}
            className={`base-button calculate-button ${
              tempSelectedTiles.length === requiredTilesCount ? 'enabled' : 'disabled'
            }`}
            disabled={tempSelectedTiles.length !== requiredTilesCount}
          >
            選択を確定
          </button>
        </div>
      </div>
    </div>
  );
};


const CalculatorPage: React.FC = () => {
  const router = useRouter();
  const [selectedTiles, setSelectedTiles] = useState<MahjongTile[]>([]);
  const [furoList, setFuroList] = useState<Furo[]>([]); // 鳴き面子リスト
  const [hasFuro, setHasFuro] = useState<boolean>(false); // 副露の有無
  const [isFuroModalOpen, setIsFuroModalOpen] = useState<boolean>(false); // 鳴き牌選択モーダル
  const [currentFuroType, setCurrentFuroType] = useState<FuroType | null>(null); // 現在選択中の鳴きの種類

  const [isRiipaiDone, setIsRiipaiDone] = useState(false);
  // const [isAnimatingRiipai, setIsAnimatingRiipai] = useState(false);
  // const [isWaitingForRiipaiDisplay, setIsWaitingForRiipaiDisplay] = useState(false);

  const MAX_HAND_TILES = 14; // 全ての牌（手牌＋鳴き）の合計枚数
  const [remainingTilesCount, setRemainingTilesCount] = useState<number>(MAX_HAND_TILES); // 手牌として選択できる残り枚数

  const [bakaze, setBakaze] = useState<Kaze>('東'); // 場風
  const [jikaze, setJikaze] = useState<Kaze>('東'); // 自風
  const [honba, setHonba] = useState<number>(0); // 本場
  const [reachbo, setReachbo] = useState<number>(0); // リーチ棒

  // 鳴き面子の枚数に基づいて残り手牌数を計算
  useEffect(() => {
    const tilesInFuro = furoList.reduce((sum: number, furo: any) => sum + furo.tiles.length, 0);
    setRemainingTilesCount(MAX_HAND_TILES - tilesInFuro);
    // 鳴きを追加/削除した際に手牌が多すぎないかチェックし、クリアする
    if (selectedTiles.length > (MAX_HAND_TILES - tilesInFuro)) {
      setSelectedTiles([]); // 手牌枚数が超過したらクリア
      setIsRiipaiDone(false);
      // setIsAnimatingRiipai(false);
      // setIsWaitingForRiipaiDisplay(false);
    }
  }, [furoList]); // selectedTilesは不要、furoListの変更のみで更新

  const tilesByType: { [key: string]: MahjongTile[] } = {
    manzu: mahjongTiles.filter(tile => tile.type === 'manzu'),
    pinzu: mahjongTiles.filter(tile => tile.type === 'pinzu'),
    souzu: mahjongTiles.filter(tile => tile.type === 'souzu'),
    jihai: mahjongTiles.filter(tile => tile.type === 'jihai'),
  };

  const doRiipai = useCallback((tiles: MahjongTile[]) => {
    return [...tiles].sort((a, b) => {
      const typeOrder = ['manzu', 'pinzu', 'souzu', 'jihai'];
      const typeA = typeOrder.indexOf(a.type);
      const typeB = typeOrder.indexOf(b.type);

      if (typeA !== typeB) {
        return typeA - typeB;
      }
      return a.value - b.value;
    });
  }, []);

  useEffect(() => {
    // 手牌の枚数がremainingTilesCountに達したら理牌
    if (selectedTiles.length === remainingTilesCount && !isRiipaiDone) {
      // setIsAnimatingRiipai(true);

      const preRiipaiDelay = setTimeout(() => {
        const sortedHand = doRiipai(selectedTiles);
        setSelectedTiles(sortedHand);
        setIsRiipaiDone(true);
        // setIsWaitingForRiipaiDisplay(true);

        const riipaiDuration = setTimeout(() => {
          // setIsAnimatingRiipai(false);
          // setIsWaitingForRiipaiDisplay(false);
        }, 1500);

        return () => clearTimeout(riipaiDuration);
      }, 500);

      return () => clearTimeout(preRiipaiDelay);
    } else if (selectedTiles.length < remainingTilesCount && isRiipaiDone) {
      // 手牌が減ったら理牌状態をリセット
      setIsRiipaiDone(false);
      // setIsAnimatingRiipai(false);
      // setIsWaitingForRiipaiDisplay(false);
    }
  }, [selectedTiles, isRiipaiDone, remainingTilesCount, doRiipai]);

  const addTileToHand = (tileToAdd: MahjongTile) => {
    // Helper to count total occurrences of a tile (including red 5s) across all relevant lists
    const countTotalTiles = (
      tileId: string,
      currentHand: MahjongTile[],
      currentFuroList: Furo[]
    ) => {
      const allTiles = [
        ...currentHand,
        ...currentFuroList.flatMap((f) => f.tiles),
      ];
      let count = 0;
      if (tileId.includes('5') && tileId.includes('r')) {
        // If red 5, count both normal 5 and red 5
        const normalId = tileId.replace('r', '');
        count = allTiles.filter(
          (t) => t.id === tileId || t.id === normalId
        ).length;
      } else if (tileId.includes('5')) {
        // If normal 5, count both normal 5 and red 5
        const redId = tileId + 'r';
        count = allTiles.filter(
          (t) => t.id === tileId || t.id === redId
        ).length;
      } else {
        // For other tiles, just count by ID
        count = allTiles.filter((t) => t.id === tileId).length;
      }
      return count;
    };

    if (selectedTiles.length >= remainingTilesCount) {
      alert(`手牌は${remainingTilesCount}枚までしか選択できません。`);
      return;
    }

    // 全ての牌（手牌+鳴き）におけるその牌の合計枚数を確認
    if (countTotalTiles(tileToAdd.id, selectedTiles, furoList) >= 4) {
      alert(`${tileToAdd.name} は既に4枚選択されています。`);
      return;
    }

    const newHand = [...selectedTiles, tileToAdd];
    setSelectedTiles(newHand);
  };

  // 鳴き牌の選択モーダルを開く
  const openFuroModal = (type: FuroType) => {
    setCurrentFuroType(type);
    setIsFuroModalOpen(true);
  };

  // 鳴き牌がモーダルで選択された時の処理
  const handleSelectFuroTiles = (tiles: MahjongTile[], type: FuroType) => {
    // 既に同じタイプの鳴きがある場合は、追加しない (簡易化のため)
    // 例えば、ポンを複数回したい場合は、furoListの構造をfuroList: {pon: [], kan: [], chi: []} のように変える必要がある
    if (furoList.some((f: any) => f.type === type)) {
      alert(`${type}は既に選択されています。既存の鳴きを削除してから追加してください。`);
      return;
    }
    setFuroList((prev: any) => [...prev, { type, tiles: doRiipai(tiles) }]); // 鳴き面子もソートして追加
    setIsFuroModalOpen(false);
    setCurrentFuroType(null);
  };

  // 鳴き面子を削除
  const removeFuro = (indexToRemove: number) => {
    setFuroList((prev: any) => prev.filter((_: any, index: number) => index !== indexToRemove));
  };


  const handleHonbaChange = (increment: number) => {
    setHonba((prev: number) => Math.max(0, prev + increment));
  };

  const handleReachboChange = (increment: number) => {
    setReachbo((prev: number) => Math.max(0, prev + increment));
  };

  return (
    // 全体のコンテナ: 背景色を深緑 (bg-green-700) に設定し、茶色のボーダー (border-brown-800 border-8) を追加
    <div className="min-h-screen p-4 bg-green-700 text-gray-100 border-brown-800 border-8">
      {/* ヘッダー: 背景を半透明の白 (bg-white/90) に設定し、ぼかし効果を維持 */}
      <header className="bg-white/90 shadow p-3 rounded-lg mb-4 flex justify-between items-center backdrop-blur-sm">
        <h1 className="text-xl font-bold text-gray-900">点数計算・役表示</h1>
        <Link href="/" className="text-blue-500 hover:underline text-sm">
          トップへ戻る
        </Link>
      </header>

      {/* メインコンテンツ領域: 背景を半透明の白 (bg-white/90) に設定し、ぼかし効果を維持 */}
      <main className="bg-white/90 shadow p-4 rounded-lg backdrop-blur-sm">
        {/* 対局情報セクション: 背景を半透明の灰色 (bg-gray-50/70) に設定し、ぼかし効果を維持 */}
        <section className="mb-4 p-3 border border-gray-300 rounded-md bg-gray-50/70 backdrop-blur-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">対局情報</h2>

          {/* 場風の選択 */}
          <div className="mb-4">
            <h3 className="text-base font-medium text-gray-800 mb-2">場風</h3>
            <div className="flex gap-4">
              {['東', '南'].map((kaze) => (
                <label key={kaze} className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-amber-500 focus:ring-amber-500" // 金色系のラジオボタン
                    name="bakaze"
                    value={kaze}
                    checked={bakaze === kaze}
                    onChange={() => setBakaze(kaze as Kaze)}
                  />
                  <span className="ml-2 text-gray-800">{kaze}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 自風の選択 */}
          <div className="mb-4">
            <h3 className="text-base font-medium text-gray-800 mb-2">自風</h3>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {['東', '南', '西', '北'].map((kaze) => (
                <label key={kaze} className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-amber-500 focus:ring-amber-500" // 金色系のラジオボタン
                    name="jikaze"
                    value={kaze}
                    checked={jikaze === kaze}
                    onChange={() => setJikaze(kaze as Kaze)}
                  />
                  <span className="ml-2 text-gray-800">{kaze}家</span>
                </label>
              ))}
            </div>
          </div>

          {/* 本場数入力 */}
          <div className="mb-4">
            <h3 className="text-base font-medium text-gray-800 mb-2">本場数</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleHonbaChange(-1)}
                className="bg-amber-200 text-amber-800 px-3 py-1 rounded-md hover:bg-amber-300 transition-colors shadow-sm" // 金色系のボタン
                aria-label="本場数を減らす"
              >
                -
              </button>
              <span className="text-lg font-bold w-8 text-center text-gray-900">{honba}</span>
              <button
                onClick={() => handleHonbaChange(1)}
                className="bg-amber-200 text-amber-800 px-3 py-1 rounded-md hover:bg-amber-300 transition-colors shadow-sm" // 金色系のボタン
                aria-label="本場数を増やす"
              >
                +
              </button>
            </div>
          </div>

          {/* リーチ棒の数入力 */}
          <div>
            <h3 className="text-base font-medium text-gray-800 mb-2">リーチ棒の数</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleReachboChange(-1)}
                className="bg-amber-200 text-amber-800 px-3 py-1 rounded-md hover:bg-amber-300 transition-colors shadow-sm" // 金色系のボタン
                aria-label="リーチ棒を減らす"
              >
                -
              </button>
              <span className="text-lg font-bold w-8 text-center text-gray-900">{reachbo}</span>
              <button
                onClick={() => handleReachboChange(1)}
                className="bg-amber-200 text-amber-800 px-3 py-1 rounded-md hover:bg-amber-300 transition-colors shadow-sm" // 金色系のボタン
                aria-label="リーチ棒を増やす"
              >
                +
              </button>
            </div>
          </div>
        </section>

        {/* 鳴きの入力セクション */}
        <section className="mb-4 p-3 border border-gray-300 rounded-md bg-gray-50/70 backdrop-blur-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">鳴き（副露）</h2>

          {/* 副露あり/なし */}
          <div className="mb-4">
            <h3 className="text-base font-medium text-gray-800 mb-2">副露の有無</h3>
            <div className="flex gap-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio text-green-500 focus:ring-green-500"
                  name="hasFuro"
                  checked={hasFuro}
                  onChange={() => {
                    setHasFuro(true);
                  }}
                />
                <span className="ml-2 text-gray-800">あり</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio text-red-500 focus:ring-red-500"
                  name="hasFuro"
                  checked={!hasFuro}
                  onChange={() => {
                    setHasFuro(false);
                    setFuroList([]); // 副露なしにしたら鳴きをクリア
                  }}
                />
                <span className="ml-2 text-gray-800">なし</span>
              </label>
            </div>
          </div>

          {hasFuro && (
            <>
              {/* ポン */}
              <div className="mb-4">
                <h3 className="text-base font-medium text-gray-800 mb-2 flex justify-between items-center">
                  ポン
                  <button
                    onClick={() => openFuroModal('pon')}
                    className="bg-purple-200 text-purple-800 px-3 py-1 rounded-md hover:bg-purple-300 transition-colors shadow-sm text-sm"
                    disabled={furoList.some(f => f.type === 'pon')} // ポンが既に存在する場合は無効化
                  >
                    牌を選択
                  </button>
                </h3>
                {furoList.filter(f => f.type === 'pon').map((furo, index) => (
                  <div key={`pon-${index}`} className="flex items-center gap-1">
                    {furo.tiles.map((tile, tileIdx) => (
                      <img
                        key={tileIdx}
                        src={tile.src}
                        alt={tile.name}
                        className="w-6 h-9"
                      />
                    ))}
                    <button
                      onClick={() => removeFuro(furoList.indexOf(furo))}
                      className="ml-2 text-red-500 hover:text-red-700 text-sm"
                    >
                      削除
                    </button>
                  </div>
                ))}
                {furoList.filter(f => f.type === 'pon').length === 0 && (
                  <p className="text-gray-600 text-sm">ポンした牌がここに表示されます。</p>
                )}
              </div>

              {/* カン */}
              <div className="mb-4">
                <h3 className="text-base font-medium text-gray-800 mb-2 flex justify-between items-center">
                  カン
                  <button
                    onClick={() => openFuroModal('kan')}
                    className="bg-blue-200 text-blue-800 px-3 py-1 rounded-md hover:bg-blue-300 transition-colors shadow-sm text-sm"
                    disabled={furoList.some(f => f.type === 'kan')} // カンが既に存在する場合は無効化
                  >
                    牌を選択
                  </button>
                </h3>
                {furoList.filter(f => f.type === 'kan').map((furo, index) => (
                  <div key={`kan-${index}`} className="flex items-center gap-1">
                    {/* カンの表示は横向き1枚＋縦向き3枚を考慮 */}
                    {furo.tiles.map((tile, tileIdx) => (
                      <img
                        key={tileIdx}
                        src={tile.src}
                        alt={tile.name}
                        className={`w-6 h-9 ${tileIdx === 0 ? 'rotate-90 origin-bottom-left relative top-1' : ''}`} // 1枚目を横向きに (簡易的な表現)
                        style={tileIdx === 0 ? { transform: 'rotate(90deg)', transformOrigin: 'bottom left' } : {}}
                      />
                    ))}
                    <button
                      onClick={() => removeFuro(furoList.indexOf(furo))}
                      className="ml-2 text-red-500 hover:text-red-700 text-sm"
                    >
                      削除
                    </button>
                  </div>
                ))}
                {furoList.filter(f => f.type === 'kan').length === 0 && (
                  <p className="text-gray-600 text-sm">カンした牌がここに表示されます。</p>
                )}
              </div>

              {/* チー */}
              <div>
                <h3 className="text-base font-medium text-gray-800 mb-2 flex justify-between items-center">
                  チー
                  <button
                    onClick={() => openFuroModal('chi')}
                    className="bg-teal-200 text-teal-800 px-3 py-1 rounded-md hover:bg-teal-300 transition-colors shadow-sm text-sm"
                    disabled={furoList.some(f => f.type === 'chi')} // チーが既に存在する場合は無効化
                  >
                    牌を選択
                  </button>
                </h3>
                {furoList.filter(f => f.type === 'chi').map((furo, index) => (
                  <div key={`chi-${index}`} className="flex items-center gap-1">
                    {/* チーの表示も横向き1枚＋縦向き2枚を考慮 */}
                    {furo.tiles.map((tile, tileIdx) => (
                      <img
                        key={tileIdx}
                        src={tile.src}
                        alt={tile.name}
                        className={`w-6 h-9 ${tileIdx === 0 ? 'rotate-90 origin-bottom-left relative top-1' : ''}`} // 1枚目を横向きに (簡易的な表現)
                        style={tileIdx === 0 ? { transform: 'rotate(90deg)', transformOrigin: 'bottom left' } : {}}
                      />
                    ))}
                    <button
                      onClick={() => removeFuro(furoList.indexOf(furo))}
                      className="ml-2 text-red-500 hover:text-red-700 text-sm"
                    >
                      削除
                    </button>
                  </div>
                ))}
                {furoList.filter(f => f.type === 'chi').length === 0 && (
                  <p className="text-gray-600 text-sm">チーした牌がここに表示されます。</p>
                )}
              </div>
            </>
          )}
        </section>

        {/* 麻雀牌の選択エリア */}
        <section className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">牌を選択</h2>
          {/* 背景を半透明の灰色 (bg-gray-50/70) に設定し、ぼかし効果を維持 */}
          <div className="border border-gray-300 p-2 rounded-md min-h-[90px] flex flex-col gap-2 bg-gray-50/70 backdrop-blur-sm">
            {/* 萬子 */}
            <div>
              <h3 className="text-base font-medium text-gray-800 mb-1">萬子</h3>
              <div className="flex flex-wrap gap-1 justify-center items-center">
                {tilesByType.manzu.map((tile) => (
                  <img
                    key={tile.id}
                    src={tile.src}
                    alt={tile.name}
                    className="w-6 h-9 cursor-pointer hover:scale-105 transition-transform duration-100"
                    onClick={() => addTileToHand(tile)}
                  />
                ))}
              </div>
            </div>
            {/* 筒子 */}
            <div>
              <h3 className="text-base font-medium text-gray-800 mb-1">筒子</h3>
              <div className="flex flex-wrap gap-1 justify-center items-center">
                {tilesByType.pinzu.map((tile) => (
                  <img
                    key={tile.id}
                    src={tile.src}
                    alt={tile.name}
                    className="w-6 h-9 cursor-pointer hover:scale-105 transition-transform duration-100"
                    onClick={() => addTileToHand(tile)}
                  />
                ))}
              </div>
            </div>
            {/* 索子 */}
            <div>
              <h3 className="text-base font-medium text-gray-800 mb-1">索子</h3>
              <div className="flex flex-wrap gap-1 justify-center items-center">
                {tilesByType.souzu.map((tile) => (
                  <img
                    key={tile.id}
                    src={tile.src}
                    alt={tile.name}
                    className="w-6 h-9 cursor-pointer hover:scale-105 transition-transform duration-100"
                    onClick={() => addTileToHand(tile)}
                  />
                ))}
              </div>
            </div>
            {/* 字牌 */}
            <div>
              <h3 className="text-base font-medium text-gray-800 mb-1">字牌</h3>
              <div className="flex flex-wrap gap-1 justify-center items-center">
                {tilesByType.jihai.map((tile) => (
                  <img
                    key={tile.id}
                    src={tile.src}
                    alt={tile.name}
                    className="w-6 h-9 cursor-pointer hover:scale-105 transition-transform duration-100"
                    onClick={() => addTileToHand(tile)}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 手牌表示エリア */}
        <section className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-3 flex justify-between items-center">
            手牌
            <span className="text-base text-gray-700">
              {selectedTiles.length} / {remainingTilesCount} 枚 (合計 {MAX_HAND_TILES} 枚)
            </span>
          </h2>
          {/* 背景を半透明の白 (bg-white/70) に設定し、ぼかし効果を維持 */}
          <div className="border border-gray-300 p-2 rounded-md min-h-[70px] flex flex-wrap gap-2 items-center bg-white/70 backdrop-blur-sm relative overflow-hidden">
            {/* 鳴き面子表示エリア */}
            <div className="absolute left-0 top-0 h-full flex flex-row items-center p-2 z-10" style={{ right: `${(selectedTiles.length * (24 + 4)) + 16}px` }}>
              {furoList.map((furo, furoIndex) => (
                <div key={`furo-${furoIndex}`} className="flex items-center mr-2">
                  {furo.tiles.map((tile, tileIdx) => (
                    <img
                      key={tileIdx}
                      src={tile.src}
                      alt={tile.name}
                      className="w-6 h-9"
                    />
                  ))}
                  <button
                    onClick={() => removeFuro(furoList.indexOf(furo))}
                    className="ml-2 text-red-500 hover:text-red-700 text-sm"
                  >
                    削除
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FuroModal の表示 */}
        {isFuroModalOpen && currentFuroType && (
          <FuroModal
            isOpen={isFuroModalOpen}
            onClose={() => setIsFuroModalOpen(false)}
            onSelectFuroTiles={handleSelectFuroTiles}
            furoType={currentFuroType}
            selectedTilesInHand={selectedTiles}
            furoList={furoList}
          />
        )}
      </main>
    </div>
  );
};

// CalculatorResultPageをSuspenseでラップしたコンポーネント
function CalculatorResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // クエリパラメータから結果を取得
  const [result, setResult] = useState<any>(null);
  const [handData, setHandData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const resultParam = searchParams.get('result');
      const handDataParam = searchParams.get('handData');
      
      if (resultParam && handDataParam) {
        setResult(JSON.parse(resultParam));
        setHandData(JSON.parse(handDataParam));
      }
    } catch (error) {
      console.error('結果の解析に失敗しました:', error);
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  if (loading) {
    return (
      <main className="min-h-screen py-8 px-4 bg-gray-900 text-white flex flex-col items-center justify-center">
        <div className="text-center">
          <div className="text-2xl text-amber-400 mb-4">計算中...</div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-400 mx-auto"></div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen py-8 px-4 bg-gray-900 text-white">
      {/* ヘッダー：戻るボタン（左）と自風場風（右） */}
      <header className="flex justify-between items-center mb-8 w-full max-w-3xl mx-auto">
        <button
          className="base-button back-button"
          onClick={() => router.push('/calculator')}
        >
          戻る
        </button>
        
        {handData && (
          <div className="flex gap-4 text-lg">
            <span className="text-amber-300">場風: {handData.bakaze}</span>
            <span className="text-green-300">自風: {handData.jikaze}</span>
          </div>
        )}
      </header>

      <div className="flex flex-col items-center">
        {/* 手牌表示 */}
        {handData && (
          <section className="section-panel w-full max-w-3xl mb-6">
            <h2 className="section-title">上がった手牌</h2>
            <div className="mb-4">
              <div className="font-bold text-green-300 mb-2">手牌 ({handData.hand?.length || 0}枚)</div>
              <div className="text-gray-300">
                {handData.hand?.map((tileId: string, index: number) => {
                  const tile = mahjongTiles.find(t => t.id === tileId);
                  return (
                    <span key={index} className="inline-block mr-1 text-sm bg-gray-800 px-2 py-1 rounded">
                      {tile ? tile.name : tileId}
                    </span>
                  );
                }) || 'なし'}
              </div>
            </div>
            
            {handData.furo && handData.furo.length > 0 && (
              <div className="mb-4">
                <div className="font-bold text-blue-300 mb-2">鳴き</div>
                {handData.furo.map((furo: any, index: number) => (
                  <div key={index} className="text-gray-300 mb-1">
                    <span className="text-blue-200 font-semibold">{furo.type}:</span>
                    {furo.tiles.map((tileId: string, tileIndex: number) => {
                      const tile = mahjongTiles.find(t => t.id === tileId);
                      return (
                        <span key={tileIndex} className="inline-block ml-1 mr-1 text-sm bg-gray-800 px-2 py-1 rounded">
                          {tile ? tile.name : tileId}
                        </span>
                      );
                    })}
                  </div>
                ))}
              </div>
            )}

            <div className="grid grid-cols-3 md:grid-cols-6 gap-2 text-sm mb-4">
              <div><span className="font-bold">本場</span>: {handData.honba || 0}</div>
              <div><span className="font-bold">ツモ</span>: {handData.is_tsumo ? '○' : '×'}</div>
              <div><span className="font-bold">リーチ</span>: {handData.is_riichi ? '○' : '×'}</div>
              <div><span className="font-bold">ダブルリーチ</span>: {handData.is_double_riichi ? '○' : '×'}</div>
              <div><span className="font-bold">一発</span>: {handData.is_ippatsu ? '○' : '×'}</div>
              <div><span className="font-bold">槍槓</span>: {handData.is_chankan ? '○' : '×'}</div>
              <div><span className="font-bold">嶺上開花</span>: {handData.is_rinshan ? '○' : '×'}</div>
              <div><span className="font-bold">海底</span>: {handData.is_haitei ? '○' : '×'}</div>
              <div><span className="font-bold">河底</span>: {handData.is_houtei ? '○' : '×'}</div>
              <div><span className="font-bold">地和</span>: {handData.is_chiiho ? '○' : '×'}</div>
              <div><span className="font-bold">天和</span>: {handData.is_tenho ? '○' : '×'}</div>
            </div>
          </section>
        )}

        {/* 点数・翻数・符数 */}
        <section className="section-panel w-full max-w-3xl mb-6">
          <h2 className="section-title">点数・翻数・符数</h2>
          
          {result ? (
            <>
              {result.success ? (
                <div className="text-center">
                  <div className="text-4xl text-amber-400 font-bold mb-2">
                    {result.total_score}点
                  </div>
                  <div className="text-2xl text-green-300">
                    {result.han}翻 {result.fu}符
                  </div>
                  
                  {result.dora_count > 0 && (
                    <div className="mt-4 text-lg text-amber-300">
                      ドラ: {result.dora_count}翻
                    </div>
                  )}
                  
                  {result.payment_info && (
                    <div className="mt-6">
                      <h3 className="text-lg font-bold text-green-300 mb-2">支払情報</h3>
                      <div className="text-gray-300">
                        {handData.is_tsumo ? (
                          <>
                            <div>子: {result.payment_info.ko_payment || 0}点</div>
                            <div>親: {result.payment_info.oya_payment || 0}点</div>
                          </>
                        ) : (
                          <div>振り込み: {result.total_score}点</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-red-400">
                  <div className="text-xl font-bold mb-2">計算エラー</div>
                  <div className="text-gray-300">{result.error || '不明なエラーが発生しました'}</div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center text-gray-400">
              計算結果がありません
            </div>
          )}
        </section>

        {/* 成立役 */}
        {result && result.success && result.yaku && result.yaku.length > 0 && (
          <section className="section-panel w-full max-w-3xl mb-6">
            <h2 className="section-title">成立役</h2>
            <div className="space-y-2">
              {result.yaku.map((yaku: any, index: number) => (
                <div key={index} className="flex justify-between items-center bg-gray-800 p-3 rounded">
                  <span className="text-white text-lg">{yaku.name}</span>
                  <span className="text-amber-400 font-bold text-lg">{yaku.han}翻</span>
                </div>
              ))}
            </div>
          </section>
        )}
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