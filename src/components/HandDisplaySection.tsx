// src/components/HandDisplaySection.tsx

import React from 'react';
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

  // 牌を種類ごとにグループ化する関数 (理牌と同じソート順)
  const groupTilesByType = (tiles: MahjongTile[]) => {
    const grouped: { [key in MahjongTileType]?: MahjongTile[] } = {};
    tiles.forEach(tile => {
      if (!grouped[tile.type]) {
        grouped[tile.type] = [];
      }
      grouped[tile.type]?.push(tile);
    });
    // 各グループ内で牌をソート
    for (const type in grouped) {
      if (Object.prototype.hasOwnProperty.call(grouped, type)) {
        grouped[type as MahjongTileType]?.sort((a, b) => {
          if (a.type === 'jihai' || b.type === 'jihai') {
            return a.value - b.value;
          }
          if (a.value === 5 && a.isRedDora && b.value === 5 && !b.isRedDora) {
            return 1;
          }
          if (b.value === 5 && b.isRedDora && a.value === 5 && !a.isRedDora) {
            return -1;
          }
          return a.value - b.value;
        });
      }
    }
    return grouped;
  };

  const groupedHandTiles = groupTilesByType(selectedTiles);

  const tileTypeOrder: MahjongTileType[] = ['manzu', 'pinzu', 'souzu', 'jihai'];
  const typeLabels: { [key in MahjongTileType]: string } = {
    manzu: '萬子',
    pinzu: '筒子',
    souzu: '索子',
    jihai: '字牌',
  };

  return (
    <div className="mb-6 p-4 border rounded-lg bg-white shadow-md w-full text-gray-800">
      <h2 className="text-xl font-semibold mb-2 text-center">
        手牌 ({selectedTiles.length} / {remainingHandTilesCount})
      </h2>
      <div className="flex flex-col gap-2"> {/* 各種類グループのコンテナ間のマージン */}
        {tileTypeOrder.map(type => {
          const tilesOfType = groupedHandTiles[type];
          if (!tilesOfType || tilesOfType.length === 0) {
            return null;
          }
          return (
            <div key={type} className="flex flex-col items-center mb-2"> {/* 各種類グループのコンテナ */}
              <h3 className="text-lg font-medium mb-1">{typeLabels[type]}</h3>
              <div className="flex flex-wrap justify-center gap-1">
                {tilesOfType.map((tile, index) => (
                  <div key={`${tile.id}-${tile.instanceId}`} className="relative">
                    <TileComponent
                      tile={tile}
                      onClick={isFuroSelectionMode ? undefined : (clickedTile) => onRemoveIndividualTile(clickedTile, selectedTiles.indexOf(tile))}
                      isHandTile={true}
                      isSelectedForFuro={selectedForFuro.some(t => t.instanceId === tile.instanceId)}
                      isValidCandidate={isFuroSelectionMode && selectedFuroTypeToMake !== 'none' ? 
                                        highlightableTiles.has(tile.instanceId || '') : 
                                        true}
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
          );
        })}
      </div>
    </div>
  );
};

export default HandDisplaySection;