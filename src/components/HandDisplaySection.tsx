// src/components/HandDisplaySection.tsx

import React, { useCallback } from 'react';
import { MahjongTile, FuroType, MahjongTileType } from '../types/mahjong';
import TileComponent from './TileComponent';

interface HandDisplaySectionProps {
  selectedTiles: MahjongTile[];
  remainingHandTilesCount: number;
  selectedForFuro: MahjongTile[]; // ユーザーが選択した組み合わせの牌
  onRemoveIndividualTile: (tile: MahjongTile, index: number) => void; // 個別削除用
  isFuroSelectionMode: boolean;
  selectedFuroTypeToMake: FuroType | 'none';
  validCandidateTiles: MahjongTile[]; // 鳴き候補として有効な牌のリスト
}

const HandDisplaySection: React.FC<HandDisplaySectionProps> = ({
  selectedTiles,
  remainingHandTilesCount,
  selectedForFuro,
  onRemoveIndividualTile,
  isFuroSelectionMode,
  selectedFuroTypeToMake,
  validCandidateTiles,
}) => {
  const highlightableTiles = React.useMemo(() => {
    if (!isFuroSelectionMode || selectedFuroTypeToMake === 'none') {
      return new Set<string>();
    }
    const tileInstanceIds = new Set<string>();
    validCandidateTiles.forEach(tile => {
      if (tile.instanceId) {
        tileInstanceIds.add(tile.instanceId);
      }
    });
    return tileInstanceIds;
  }, [isFuroSelectionMode, selectedFuroTypeToMake, validCandidateTiles]);

  // ★新しいソート関数: 萬子、索子、筒子、字牌の順に並べる
  const sortTilesForDisplay = useCallback((tiles: MahjongTile[]) => {
    const typeOrder = ['manzu', 'souzu', 'pinzu', 'jihai']; // ご要望の並び順

    return [...tiles].sort((a, b) => {
      const typeA = typeOrder.indexOf(a.type);
      const typeB = typeOrder.indexOf(b.type);

      if (typeA !== typeB) {
        return typeA - typeB; // 牌の種類でソート
      }
      // 同じ種類内では数値でソート
      // 赤ドラは通常の5の後ろにソート（視覚的な整理のため）
      if (a.value === 5 && a.isRedDora && b.value === 5 && !b.isRedDora) {
        return 1;
      }
      if (b.value === 5 && b.isRedDora && a.value === 5 && !a.isRedDora) {
        return -1;
      }
      return a.value - b.value;
    });
  }, []);

  const shouldSortAndDisplayAsSingleRow = selectedTiles.length === 14; // 14枚になったら整理して表示

  // 表示する牌のリストを決定
  const tilesToRender = shouldSortAndDisplayAsSingleRow
    ? sortTilesForDisplay(selectedTiles) // 14枚ならソート
    : selectedTiles; // 14枚未満なら選択順

  return (
    <div className="mb-6 p-4 border rounded-lg bg-white shadow-md w-full text-gray-800">
      <h2 className="text-xl font-semibold mb-2 text-center">
        手牌 ({selectedTiles.length} / {remainingHandTilesCount})
      </h2>
      <div className="flex flex-col gap-2">
        {/* 牌の表示エリア */}
        <div className="flex flex-wrap justify-center gap-1">
          {tilesToRender.map((tile, index) => (
            <div key={`${tile.id}-${tile.instanceId}`} className="relative">
              <TileComponent
                tile={tile}
                onClick={isFuroSelectionMode ? undefined : (clickedTile) => onRemoveIndividualTile(clickedTile, selectedTiles.indexOf(tile))}
                isHandTile={true}
                isSelectedForFuro={selectedForFuro.some(t => t.instanceId === tile.instanceId)}
                isValidCandidate={isFuroSelectionMode && selectedFuroTypeToMake !== 'none' ?
                                  highlightableTiles.has(tile.instanceId || '') :
                                  true}
                isFuroSelectionMode={isFuroSelectionMode} // 鳴き選択モードであることを伝える
              />
              {!isFuroSelectionMode && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveIndividualTile(tile, selectedTiles.indexOf(tile));
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                  style={{ zIndex: 10 }}
                >
                    X
                  </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HandDisplaySection;