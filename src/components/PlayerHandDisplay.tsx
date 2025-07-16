// src/components/PlayerHandDisplay.tsx

import React from 'react';
import { MahjongTile, Furo } from '../types/mahjong';

interface PlayerHandDisplayProps {
  selectedTiles: MahjongTile[];
  removeTileFromHand: (index: number) => void; // 元の削除関数も残す
  furoList: Furo[];
  removeFuro: (index: number) => void;
  remainingHandTilesCount: number;
  maxTotalTiles: number;
  isAnimatingRiipai: boolean;
  handleTileClickInHand: (tile: MahjongTile, index: number) => void; // 新しいハンドラー
}

export const PlayerHandDisplay: React.FC<PlayerHandDisplayProps> = ({
  selectedTiles,
  // removeTileFromHand, // もし通常の削除ボタンを残すなら残す
  furoList,
  removeFuro,
  // remainingHandTilesCount,
  maxTotalTiles,
  isAnimatingRiipai,
  handleTileClickInHand, // 新しいハンドラーを受け取る
}) => {
  const currentTotalTiles = selectedTiles.length + furoList.reduce((sum, furo) => sum + furo.tiles.length, 0);

  return (
    <section className="p-4 mb-4 rounded-lg bg-gray-100 shadow-md relative z-10">
      <h2 className="text-lg font-bold text-gray-800 mb-3">手牌</h2>
      <div className="text-sm text-gray-600 mb-3">
        現在の牌数: {currentTotalTiles} / {maxTotalTiles} （鳴き {furoList.length > 0 ? 'あり' : 'なし'}）
      </div>

      <div className={`flex flex-wrap items-end justify-center min-h-[100px] transition-all duration-500 ease-out ${isAnimatingRiipai ? 'opacity-0' : 'opacity-100'}`}>
        {/* 手牌の表示 */}
        <div className="flex flex-wrap gap-1 p-2 border border-gray-300 rounded-md bg-white mr-4">
          {selectedTiles.length === 0 ? (
            <p className="text-gray-500 text-sm">手牌に牌がありません。</p>
          ) : (
            selectedTiles.map((tile, index) => (
              <img
                key={`${tile.id}-${index}`}
                src={tile.src}
                alt={tile.name}
                className="w-10 h-14 cursor-pointer hover:scale-105 transform transition-transform duration-100"
                onClick={() => handleTileClickInHand(tile, index)} // クリックハンドラーを修正
              />
            ))
          )}
        </div>

        {/* 鳴き面子の表示 */}
        {furoList.length > 0 && (
          <div className="flex flex-col items-center gap-2">
            <h3 className="text-md font-medium text-gray-800">鳴き面子:</h3>
            <div className="flex flex-wrap gap-2">
              {furoList.map((furo, furoIndex) => (
                <div key={furoIndex} className="flex items-center border border-gray-300 rounded-md p-1 bg-white">
                  <span className="mr-1 text-gray-700 text-sm">{
                    furo.type === 'pon' ? 'ポン' :
                    furo.type === 'kan' ? (furo.kanType === 'ankan' ? '暗槓' : '明槓') : 'チー'
                  }:</span>
                  <div className="flex">
                    {furo.tiles.map((tile, tileIndex) => (
                      <img
                        key={tileIndex}
                        src={tile.src}
                        alt={tile.name}
                        // 鳴かれた牌（最後の一枚）を横向きに表示するCSSを適用
                        className={`w-8 h-12 mr-0.5 ${tileIndex === furo.tiles.length - 1 ? 'transform rotate-90 origin-bottom-left -translate-y-2 translate-x-2' : ''}`}
                      />
                    ))}
                  </div>
                  <button
                    onClick={() => removeFuro(furoIndex)}
                    className="ml-2 text-red-500 hover:text-red-700 text-sm"
                    title="この鳴きを削除"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};