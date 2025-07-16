// src/components/TileSelectionSection.tsx

import React from 'react';
import Image from 'next/image';
import { MahjongTile, Furo } from '../types/mahjong';

interface TileSelectionSectionProps {
  title: string;
  tiles: MahjongTile[];
  onTileClick: (tile: MahjongTile, index?: number) => void;
  type: 'available' | 'hand' | 'furo';
  furoList?: Furo[]; 
  removeFuro?: (furoIndex: number) => void; 
  panelClassName?: string;
  titleClassName?: string;
}

const TileSelectionSection: React.FC<TileSelectionSectionProps> = ({
  title,
  tiles,
  onTileClick,
  type,
  furoList,
  removeFuro,
  panelClassName,
  titleClassName,
}) => {
  // 牌の画像サイズを全てのtypeで統一し、アスペクト比を考慮した幅と高さを設定
  // 一般的な麻雀牌の画像は、幅32px、高さ40pxが標準的なサイズです。
  // もしお使いの牌の画像のアスペクト比が異なる場合は、この TILE_WIDTH / TILE_HEIGHT の比率を調整してください。
  const TILE_WIDTH = 32;  // 牌の表示幅
  const TILE_HEIGHT = 40; // 牌の表示高さ

  // furoタイプの場合のフーロのインスタンスIDをキーとしたマップを生成
  const furoMap = React.useMemo(() => {
    if (type === 'furo' && furoList) {
      const map = new Map<string, number>();
      furoList.forEach((furo, index) => {
        if (furo.furoInstanceId) {
          map.set(furo.furoInstanceId, index);
        }
      });
      return map;
    }
    return new Map<string, number>();
  }, [furoList, type]);

  const handleRemoveFuroClick = (furoInstanceId: string | undefined) => {
    if (type === 'furo' && removeFuro && furoInstanceId) {
      const furoIndex = furoMap.get(furoInstanceId);
      if (furoIndex !== undefined) {
        removeFuro(furoIndex);
      } else {
        console.warn(`Furo with instanceId ${furoInstanceId} not found in furoMap.`);
      }
    }
  };

  return (
    // panelClassName があればそれを使い、なければデフォルトのスタイルを適用
    <div className={`p-6 rounded-xl shadow-lg ${panelClassName || 'bg-green-700 border-lime-600 border-4 text-white'}`}>
      {title && (
        // titleClassName があればそれを使い、なければデフォルトのスタイルを適用
        <h2 className={`${titleClassName || 'text-2xl font-bold mb-4 text-center text-white'}`}>
          {title}
        </h2>
      )}
      {/* 牌が横に並び、折り返し、間隔を空け、中央揃えするためのFlexboxコンテナ */}
      {type === 'available' && (
        <>
          <div className="flex flex-wrap gap-2 justify-center mb-2">
            {/* 萬子 */}
            {tiles.filter(t => t.type === 'manzu').map((tile, index) => (
              <div key={tile.instanceId || `${tile.id}-${index}`}
                className="relative cursor-pointer transition-transform duration-100 ease-out hover:scale-105 transform"
                onClick={() => onTileClick(tile, index)}
              >
                <Image src={tile.src} alt={tile.name} width={TILE_WIDTH} height={TILE_HEIGHT}
                  className={`rounded-md border ${tile.isRedDora ? 'border-red-500' : 'border-gray-300'}`}
                />
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 justify-center mb-2">
            {/* 筒子 */}
            {tiles.filter(t => t.type === 'pinzu').map((tile, index) => (
              <div key={tile.instanceId || `${tile.id}-${index}`}
                className="relative cursor-pointer transition-transform duration-100 ease-out hover:scale-105 transform"
                onClick={() => onTileClick(tile, index)}
              >
                <Image src={tile.src} alt={tile.name} width={TILE_WIDTH} height={TILE_HEIGHT}
                  className={`rounded-md border ${tile.isRedDora ? 'border-red-500' : 'border-gray-300'}`}
                />
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 justify-center mb-2">
            {/* 索子 */}
            {tiles.filter(t => t.type === 'souzu').map((tile, index) => (
              <div key={tile.instanceId || `${tile.id}-${index}`}
                className="relative cursor-pointer transition-transform duration-100 ease-out hover:scale-105 transform"
                onClick={() => onTileClick(tile, index)}
              >
                <Image src={tile.src} alt={tile.name} width={TILE_WIDTH} height={TILE_HEIGHT}
                  className={`rounded-md border ${tile.isRedDora ? 'border-red-500' : 'border-gray-300'}`}
                />
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 justify-center mb-2">
            {/* 字牌 */}
            {tiles.filter(t => t.type === 'jihai').map((tile, index) => (
              <div key={tile.instanceId || `${tile.id}-${index}`}
                className="relative cursor-pointer transition-transform duration-100 ease-out hover:scale-105 transform"
                onClick={() => onTileClick(tile, index)}
              >
                <Image src={tile.src} alt={tile.name} width={TILE_WIDTH} height={TILE_HEIGHT}
                  className={`rounded-md border ${tile.isRedDora ? 'border-red-500' : 'border-gray-300'}`}
                />
              </div>
            ))}
          </div>
        </>
      )}
      {type === 'furo' && furoList ? (
        <div className="flex flex-wrap gap-4 justify-center">
          {furoList.map((furo, furoIdx) => (
            <div key={furo.furoInstanceId} className="flex items-center gap-1 relative group">
              {furo.tiles.map((tile, index) => {
                let extraClass = '';
                let style: React.CSSProperties = {};
                // 暗槓: 両サイド裏返し、中央2枚はそのまま
                if (furo.type === 'kan' && furo.kanType === 'ankan' && furo.tiles.length === 4) {
                  if (index === 0 || index === 3) {
                    extraClass += ' furo-back-tile';
                    // style.filter = 'grayscale(1) brightness(0.5)'; // ←CSSで背景ごまかすので不要
                  }
                }
                // 大明槓: 一番左を横向き
                else if (furo.type === 'kan' && furo.kanType === 'minkan' && furo.tiles.length === 4) {
                  if (index === 0) {
                    extraClass += ' furo-rotated-tile';
                    style.transform = 'rotate(90deg)';
                  }
                }
                // 加槓: ポンの形で2枚横向き（1,2番目）
                else if (furo.type === 'kan' && furo.kanType === 'kakan' && furo.tiles.length === 4) {
                  if (index === 1 || index === 2) {
                    extraClass += ' furo-rotated-tile';
                    style.transform = 'rotate(90deg)';
                  }
                }
                // ポン・チー: 中央の牌を横向き
                else if ((furo.type === 'pon' || furo.type === 'chi') && furo.tiles.length === 3 && index === 1) {
                  extraClass += ' furo-rotated-tile';
                  style.transform = 'rotate(90deg)';
                }
                return (
                  <div
                    key={tile.instanceId || `${tile.id}-${index}`}
                    className={`relative transition-transform duration-100 ease-out transform${extraClass ? ' ' + extraClass : ''}`}
                    style={style}
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
              {/* フーロ削除ボタン */}
              {removeFuro && (
                <button
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-80 group-hover:opacity-100"
                  onClick={() => handleRemoveFuroClick(furo.furoInstanceId)}
                  title="このフーロを削除"
                  type="button"
                >×</button>
              )}
            </div>
          ))}
        </div>
      ) : type !== 'available' && (
        <div className="flex flex-wrap gap-2 justify-center">
          {tiles.map((tile, index) => {
            let extraClass = '';
            let style: React.CSSProperties = {};
            let kanType: string | undefined = undefined;
            if (type === 'furo' && furoList && tile.furoInstanceId) {
              const furo = furoList.find(f => f.furoInstanceId === tile.furoInstanceId);
              kanType = furo?.kanType;
            }
            if (type === 'furo') {
              // 暗槓: 両サイド裏返し
              if (tiles.length === 4 && kanType === 'ankan') {
                if (index === 0 || index === 3) {
                  extraClass += ' furo-back-tile';
                  // style.filter = 'grayscale(1) brightness(0.5)'; // CSSで背景ごまかすので不要
                }
                if (index === 1 || index === 2) {
                  extraClass += ' furo-rotated-tile';
                  style.transform = 'rotate(90deg)';
                }
              }
              // 大明槓: 一番左を横向き
              else if (tiles.length === 4 && kanType === 'minkan') {
                if (index === 0) {
                  extraClass += ' furo-rotated-tile';
                  style.transform = 'rotate(90deg)';
                }
              }
              // 加槓: ポンの形で2枚横向き（1,2番目）
              else if (tiles.length === 4 && kanType === 'kakan') {
                if (index === 1 || index === 2) {
                  extraClass += ' furo-rotated-tile';
                  style.transform = 'rotate(90deg)';
                }
              }
              // ポン・チー: 中央の牌を横向き
              else if (tiles.length === 3 && index === 1) {
                extraClass += ' furo-rotated-tile';
                style.transform = 'rotate(90deg)';
              }
            }
            return (
              <div
                key={tile.instanceId || `${tile.id}-${index}`}
                className={`relative cursor-pointer transition-transform duration-100 ease-out hover:scale-105 transform${extraClass ? ' ' + extraClass : ''}`}
                style={style}
                onClick={() => onTileClick(tile, index)}
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
      )}
    </div>
  );
};

export default TileSelectionSection;