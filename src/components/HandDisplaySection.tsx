// src/components/HandDisplaySection.tsx

import React from 'react';
import Image from 'next/image';
import { MahjongTile } from '../types/mahjong';

interface HandDisplaySectionProps {
  selectedTiles: MahjongTile[];
  remainingHandTilesCount: number;
  selectedForFuro: MahjongTile[];
  onRemoveIndividualTile: (tile: MahjongTile, index: number) => void;
  isFuroSelectionMode: boolean;
  validCandidateTiles: MahjongTile[]; // 鳴き候補の牌
  isRiipaiing?: boolean; // ←追加
}

const HandDisplaySection: React.FC<HandDisplaySectionProps> = ({
  selectedTiles,
  remainingHandTilesCount,
  selectedForFuro,
  onRemoveIndividualTile,
  isFuroSelectionMode,
  validCandidateTiles,
  isRiipaiing = false, // ←追加
}: HandDisplaySectionProps) => {
  // 牌の画像サイズを全てのtypeで統一し、アスペクト比を考慮した幅と高さを設定
  const TILE_WIDTH = 32;  // 牌の表示幅
  const TILE_HEIGHT = 40; // 牌の表示高さ

  // 理牌（ソート）された手牌
  const sortedTiles = [...selectedTiles].sort((a, b) => {
    // まずタイプでソート (萬子, 筒子, 索子, 字牌)
    const typeOrder = ['manzu', 'pinzu', 'souzu', 'jihai'];
    if (a.type !== b.type) {
      return typeOrder.indexOf(a.type) - typeOrder.indexOf(b.type);
    }
    // 次に値でソート (1, 2, ..., 9)
    if (a.value !== b.value) {
      return a.value - b.value;
    }
    // 同じ牌の場合、赤ドラを優先 (赤ドラが手前に来るように)
    return (b.isRedDora ? 1 : 0) - (a.isRedDora ? 1 : 0);
  });

  // 理牌中は牌を隠し、理牌中メッセージを中央に表示
  if (isRiipaiing) {
    return (
      <div className="p-6 rounded-xl shadow-lg bg-green-800 text-gray-100 flex flex-col items-center justify-center min-h-[120px]">
        <div className="riipaiing-message text-2xl font-bold text-amber-300">理牌中...</div>
      </div>
    );
  }

  // 牌が14枚揃うまではキュー状に左詰めで表示
  const isQueueMode = selectedTiles.length < 14;
  const displayTiles = isQueueMode ? selectedTiles : sortedTiles;

  return (
    <div className="p-6 rounded-xl shadow-lg bg-green-800 text-gray-100">
      <h2 className="text-2xl font-bold mb-4 text-center text-amber-300">手牌</h2>
      <div className={`flex gap-2 justify-center mb-4 ${isQueueMode ? '' : ''}`} style={isQueueMode ? {minHeight: 48} : {}}>
        {displayTiles.map((tile: MahjongTile, index: number) => {
          const isSelectedForFuro = selectedForFuro.some(
            (t: MahjongTile) => t.instanceId === tile.instanceId
          );
          const isValidCandidate = validCandidateTiles.some(
            (t: MahjongTile) => t.instanceId === tile.instanceId
          );

          return (
            <div
              key={tile.instanceId || `${tile.id}-${index}`}
              className={`relative cursor-pointer transition-transform duration-100 ease-out transform
                ${isFuroSelectionMode && isValidCandidate ? 'hover:scale-110 active:scale-95' : ''}
                ${isSelectedForFuro ? 'ring-4 ring-blue-500 ring-offset-2 ring-offset-green-800' : ''}
                ${!isFuroSelectionMode ? 'hover:scale-105 active:scale-95' : ''}
              `}
              onClick={() => onRemoveIndividualTile(tile, index)}
            >
              <Image
                src={tile.src}
                alt={tile.name}
                width={TILE_WIDTH}
                height={TILE_HEIGHT}
                className={`rounded-md border ${tile.isRedDora ? 'border-red-500' : 'border-gray-300'}`}
              />
            </div>
          );
        })}
      </div>
      <p className="text-center text-lg font-semibold text-amber-200">
        残り手牌枚数: {remainingHandTilesCount}
      </p>
    </div>
  );
};

export default HandDisplaySection;