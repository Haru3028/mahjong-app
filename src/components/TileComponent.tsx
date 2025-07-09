// src/components/TileComponent.tsx

import React from 'react';
import { MahjongTile } from '../types/mahjong';

interface TileComponentProps {
  tile: MahjongTile;
  onClick?: (tile: MahjongTile) => void;
  isHandTile?: boolean; // 手牌として表示される牌か (削除ボタン表示などに影響)
  isAvailableTile?: boolean; // 選択可能な牌として表示される牌か (クリックエフェクトなど)
  isSelectedForFuro?: boolean; // 鳴き選択モードで選択中の牌か、または鳴き候補としてハイライト表示
  isValidCandidate?: boolean; // 鳴き選択モードで有効な鳴き候補の牌か
  isFuroSelectionMode?: boolean; // 鳴き選択モード全体が有効か
  isFuroTile?: boolean; // 鳴き済み（フーロ）の牌か
}

const TileComponent: React.FC<TileComponentProps> = ({
  tile,
  onClick,
  // isHandTile = false,
  // isAvailableTile = false,
  isSelectedForFuro = false,
  isValidCandidate = true, // デフォルトで有効
  isFuroSelectionMode = false, // デフォルトで鳴き選択モードではない
  isFuroTile = false,
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick(tile);
    }
  };

  const imagePath = `/tiles/${tile.id}.png`; // 画像パスを修正

  const baseClasses = "w-10 h-14 bg-white border border-gray-300 rounded overflow-hidden flex items-center justify-center relative select-none";
  const interactiveClasses = "cursor-pointer hover:scale-105 active:scale-95 transition-transform duration-100 ease-out";
  const selectedClass = isSelectedForFuro ? "border-2 border-blue-500 shadow-md" : ""; // 鳴き選択時に選択された牌
  const candidateClass = (isFuroSelectionMode && isValidCandidate && !isSelectedForFuro) ? "border-2 border-yellow-500 shadow-md" : ""; // 鳴き候補としてハイライト
  const nonInteractiveFuroClass = isFuroTile ? "opacity-90" : ""; // フーロの牌は少し透過させる

  return (
    <div
      className={`${baseClasses} ${onClick ? interactiveClasses : ''} ${selectedClass} ${candidateClass} ${nonInteractiveFuroClass}`}
      onClick={handleClick}
      title={tile.name} // ホバー時に牌の名前を表示
    >
      <img
        src={imagePath}
        alt={tile.name}
        className="w-full h-full object-contain"
        draggable="false" // ドラッグ防止
      />
    </div>
  );
};

export default TileComponent;