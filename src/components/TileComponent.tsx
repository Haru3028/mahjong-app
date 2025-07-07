// src/components/TileComponent.tsx

import React from 'react';
import { MahjongTile } from '../types/mahjong';

interface TileComponentProps {
  tile: MahjongTile;
  onClick?: (tile: MahjongTile) => void;
  isSmall?: boolean; // 小さく表示するかどうか
  isFuroTile?: boolean; // 鳴き牌として表示するかどうか
  isHandTile?: boolean; // 手牌として表示するかどうか
  isAvailable?: boolean; // 選択肢の牌として表示するかどうか
  isTilted?: boolean; // 牌を傾けて表示するかどうか (チーの最後の牌など)
  isFaceDown?: boolean; // 牌を裏向きに表示するかどうか (暗槓など)
  isSelectedForFuro?: boolean; // 鳴き選択モードで選択中の牌かどうか
  isValidCandidate?: boolean; // 鳴き候補として有効な牌かどうか (ハイライト用)
  isFuroSelectionMode?: boolean; // ★鳴き選択モードかどうか（追加済み）
  // ★ドラ表示牌の選択かどうかを判断するプロパティを追加
  isDoraSelectionMode?: boolean; 
}

const TileComponent: React.FC<TileComponentProps> = ({
  tile,
  onClick,
  isSmall = false,
  isFuroTile = false,
  isHandTile = false,
  isAvailable = false,
  isTilted = false,
  isFaceDown = false,
  isSelectedForFuro = false,
  isValidCandidate = true, // デフォルトは有効
  isFuroSelectionMode = false, // ★デフォルト値を設定
  isDoraSelectionMode = false, // ★デフォルト値を設定
}) => {
  // 牌の画像パスを生成 (public/tiles/ に画像があることを想定)
  const tileSrc = `/tiles/${tile.id}.png`;
  const faceDownSrc = '/tiles/ura.png'; // 裏向きの牌の画像パス

  // 牌のサイズを決定
  const width = isSmall ? 'w-8' : 'w-10'; // 32px vs 40px
  const height = isSmall ? 'h-12' : 'h-14'; // 48px vs 56px

  // スタイルクラスを動的に生成
  const tileClasses = `
    relative inline-block select-none
    ${width} ${height}
    ${onClick ? 'cursor-pointer hover:scale-105 transition-transform duration-100' : ''}
    ${isTilted ? 'rotate-90' : ''}
    ${isFuroTile ? 'mx-0.5' : 'm-0.5'}
    ${isSelectedForFuro ? 'bg-yellow-300 border-2 border-blue-600 rounded-md shadow-lg' : ''} /* 選択時のハイライトを強化 */
    
    /* ★ここを修正: 鳴き選択モードかつ無効な候補の場合のみ半透明にする */
    ${!isValidCandidate && isFuroSelectionMode && !isDoraSelectionMode ? 'opacity-50 grayscale' : ''} 
  `;

  return (
    <div className={tileClasses} onClick={onClick ? () => onClick(tile) : undefined}>
      <img
        src={isFaceDown ? faceDownSrc : tileSrc}
        alt={isFaceDown ? '裏向きの牌' : tile.name}
        className="w-full h-full object-contain rounded-md"
        onError={(e) => {
          // 画像が見つからない場合のフォールバック (例: プレースホルダー画像)
          e.currentTarget.src = `https://placehold.co/${width.replace('w-', '')}x${height.replace('h-', '')}/cccccc/000000?text=Tile`;
        }}
      />
      {/* デバッグ用: 牌のIDを表示 (必要に応じてコメントアウト) */}
      {/* <span className="absolute bottom-0 left-0 text-[8px] text-white bg-black bg-opacity-50 px-0.5 rounded-br-md">
        {tile.id}
      </span> */}
    </div>
  );
};

export default TileComponent;