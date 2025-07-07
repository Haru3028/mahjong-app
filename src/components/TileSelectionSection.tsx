// src/components/TileSelectionSection.tsx

import React from 'react';
import { MahjongTile, Furo, MahjongTileType } from '../types/mahjong';
import TileComponent from './TileComponent';

interface TileSelectionSectionProps {
  title: string;
  tiles: MahjongTile[];
  onTileClick: (tile: MahjongTile, index?: number) => void;
  type: 'available' | 'hand' | 'furo'; // available: 選択可能牌, hand: 手牌, furo: 鳴き牌
  furoList?: Furo[]; // typeが'furo'の場合に必要
  removeFuro?: (index: number) => void; // typeが'furo'の場合に必要
}

const TileSelectionSection: React.FC<TileSelectionSectionProps> = ({
  title,
  tiles,
  onTileClick,
  type,
  furoList,
  removeFuro,
}) => {
  // 牌を種類ごとにグループ化する関数
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

  const groupedTiles = groupTilesByType(tiles);
  const tileTypeOrder: MahjongTileType[] = ['manzu', 'pinzu', 'souzu', 'jihai'];
  const typeLabels: { [key in MahjongTileType]: string } = {
    manzu: '萬子',
    pinzu: '筒子',
    souzu: '索子',
    jihai: '字牌',
  };

  return (
    <div className="mb-6 p-4 border rounded-lg bg-white shadow-md w-full text-gray-800">
      <h2 className="text-xl font-semibold mb-2 text-center">{title}</h2>
      <div className="flex flex-col gap-2"> {/* 全体をflex-colで囲み、種類ごとに改行 */}
        {type === 'furo' && furoList ? (
          <div className="flex flex-wrap justify-center gap-1"> {/* フーロは既存のレイアウトを維持 */}
            {furoList.map((furo, furoIndex) => (
              <div key={`furo-${furoIndex}`} className="flex items-center border rounded-md p-1 bg-gray-100 shadow-sm relative">
                {furo.tiles.map((tile, tileIndex) => (
                  <TileComponent
                    key={tile.instanceId || `${tile.id}-${furoIndex}-${tileIndex}`}
                    tile={tile}
                    isFuroTile={true}
                    isTilted={furo.type === 'pon' || furo.type === 'chi' ? tileIndex === 2 : false}
                    isFaceDown={furo.kanType === 'ankan' && (tileIndex === 0 || tileIndex === 3)}
                  />
                ))}
                {removeFuro && (
                  <button
                    onClick={() => removeFuro(furoIndex)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center shadow-md"
                    style={{ zIndex: 10 }}
                  >
                    X
                  </button>
                )}
              </div>
                ))}
          </div>
        ) : ( // type === 'available' または type === 'hand' の場合
          tileTypeOrder.map(typeKey => {
            const tilesOfType = groupedTiles[typeKey];
            if (!tilesOfType || tilesOfType.length === 0) {
              return null;
            }
            return (
              <div key={typeKey} className="flex flex-col items-center mb-2"> {/* 各種類グループのコンテナ */}
                <h3 className="text-lg font-medium mb-1">{typeLabels[typeKey]}</h3>
                <div className="flex flex-wrap justify-center gap-1">
                  {tilesOfType.map((tile, index) => (
                    <div key={tile.instanceId || `${tile.id}-${index}`} className="relative">
                      <TileComponent
                        tile={tile}
                        onClick={() => onTileClick(tile, index)}
                        isAvailable={type === 'available'}
                        isHandTile={type === 'hand'}
                      />
                      {(type === 'hand') && ( // ドラ表示牌の削除ボタン
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onTileClick(tile, index);
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center shadow-md"
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
          })
        )}
      </div>
    </div>
  );
};

export default TileSelectionSection;