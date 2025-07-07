// src/components/MahjongTile.tsx

import React from 'react';
import { MahjongTile } from '../types/mahjong';

interface MahjongTileProps {
  tile: MahjongTile;
  onClick?: () => void;
  isAvailable?: boolean; // 牌選択エリアの牌
  isHandTile?: boolean; // 手牌の牌
  isFuroTile?: boolean; // 鳴き牌（フーロ）
  isLarge?: boolean; // 大きく表示する場合
  isSmall?: boolean; // 小さく表示する場合
  isSelectedForFuro?: boolean; // ★ 鳴きのために選択された牌かどうか
}

const MahjongTileComponent: React.FC<MahjongTileProps> = ({
  tile,
  onClick,
  isAvailable = false,
  isHandTile = false,
  isFuroTile = false,
  isLarge = false,
  isSmall = false,
  isSelectedForFuro = false, // ★ デフォルト値を追加
}) => {
  let sizeClass = 'w-10 h-14 text-lg'; // デフォルトサイズ
  if (isLarge) {
    sizeClass = 'w-12 h-16 text-xl';
  } else if (isSmall) {
    sizeClass = 'w-8 h-12 text-md';
  }

  const borderClass = isSelectedForFuro ? 'border-2 border-blue-500 ring-2 ring-blue-300' : 'border border-gray-300';
  const cursorClass = onClick ? 'cursor-pointer' : '';

  return (
    <div
      className={`
        flex items-center justify-center
        bg-white rounded shadow-sm
        ${sizeClass} ${borderClass} ${cursorClass}
        ${isAvailable ? 'hover:bg-gray-50' : ''}
        ${isHandTile ? 'active:translate-y-0.5' : ''}
        ${isFuroTile ? 'bg-gray-100' : ''}
        relative
      `}
      onClick={onClick}
    >
      <span className="font-bold text-gray-800 select-none">
        {tile.name.replace(/子|牌|[赤]/g, '').trim()}
      </span>
      {tile.isRedDora && (
        <span className="absolute bottom-0.5 right-0.5 text-red-500 text-xs">◆</span>
      )}
    </div>
  );
};

export default MahjongTileComponent;