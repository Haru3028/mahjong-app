// src/components/DoraSelectionModal.tsx

import React, { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { MahjongTile } from '../types/mahjong';
import { mahjongTiles as allAvailableTiles } from '../data/mahjongTiles'; // 全ての牌データ

interface DoraSelectionModalProps {
  isOpen: boolean;
  currentDoraIndicators: MahjongTile[];
  onConfirm?: (selectedDora: MahjongTile[]) => void; // optional
  onClose: () => void;
}

const DoraSelectionModal: React.FC<DoraSelectionModalProps> = ({
  isOpen,
  currentDoraIndicators,
  onConfirm,
  onClose,
}) => {
  const [selectedDoraTiles, setSelectedDoraTiles] = useState<MahjongTile[]>([]);
  const TILE_WIDTH = 32;
  const TILE_HEIGHT = 40;

  useEffect(() => {
    if (isOpen) {
      setSelectedDoraTiles([...currentDoraIndicators]);
    }
  }, [isOpen, currentDoraIndicators]);

  const handleTileClick = useCallback((tile: MahjongTile) => {
    setSelectedDoraTiles(prev => {
      // 赤ドラの重複チェック
      if (tile.isRedDora) {
        const existingRedDora = prev.find(t => t.id === tile.id);
        if (existingRedDora) {
          // 既に同じ赤ドラがあれば削除
          return prev.filter(t => t.instanceId !== existingRedDora.instanceId);
        }
      }

      // 既に選択されている牌であれば削除
      const existingTileIndex = prev.findIndex(t => t.instanceId === tile.instanceId);
      if (existingTileIndex !== -1) {
        return prev.filter(t => t.instanceId !== tile.instanceId);
      } else {
        // 新しい牌を追加（ユニークなインスタンスIDを付与）
        return [...prev, { ...tile, instanceId: Math.random().toString(36).substring(2, 11) }];
      }
    });
  }, []);

  const handleConfirm = () => {
    // ドラ表示牌は最大5枚まで（裏ドラ含め最大10枚だが、表示牌は5枚が一般的）
    if (selectedDoraTiles.length > 5) {
      alert('ドラ表示牌は最大5枚まで選択できます。');
      return;
    }
    if (onConfirm) onConfirm(selectedDoraTiles);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-green-800 p-8 rounded-xl shadow-2xl border-4 border-amber-500 w-full max-w-2xl max-h-[90vh] overflow-y-auto text-gray-100">
        <h2 className="text-3xl font-bold mb-6 text-center text-amber-300">ドラ表示牌選択</h2>

        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3 text-amber-400">現在の選択:</h3>
          <div className="flex flex-wrap gap-2 justify-center p-4 border-2 border-amber-600 rounded-lg bg-green-900 min-h-[60px]">
            {selectedDoraTiles.length > 0 ? (
              selectedDoraTiles.map((tile, index) => (
                <div
                  key={tile.instanceId || `${tile.id}-${index}`}
                  className="relative cursor-pointer hover:scale-105 transition-transform duration-100 ease-out"
                  onClick={() => handleTileClick(tile)}
                >
                  <Image
                    src={tile.src}
                    alt={tile.name}
                    width={TILE_WIDTH}
                    height={TILE_HEIGHT}
                    className={`rounded-md border ${tile.isRedDora ? 'border-red-500' : 'border-gray-300'}`}
                  />
                </div>
              ))
            ) : (
              <p className="text-gray-400">ドラ表示牌を選択してください。</p>
            )}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3 text-amber-400">選択可能な牌:</h3>
          <div className="flex flex-wrap gap-2 justify-center p-4 border-2 border-amber-600 rounded-lg bg-green-900">
            {allAvailableTiles.map((tile, /* index */) => {
              const isSelected = selectedDoraTiles.some(t => t.id === tile.id && t.isRedDora === tile.isRedDora);
              // 赤ドラは各種類1枚までしか選択できないように制御
              const isRedDoraAlreadySelected = tile.isRedDora && selectedDoraTiles.some(t => t.id === tile.id);

              return (
                <div
                  key={tile.id} // モーダル内の選択可能な牌はIDでキーを設定
                  className={`relative cursor-pointer hover:scale-105 transition-transform duration-100 ease-out
                    ${isSelected ? 'ring-4 ring-blue-500 ring-offset-2 ring-offset-green-900' : ''}
                    ${isRedDoraAlreadySelected && !isSelected ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                  onClick={() => {
                    if (isRedDoraAlreadySelected && !isSelected) {
                      alert(`赤ドラ（${tile.name}）は1枚しか選択できません。`);
                      return;
                    }
                    handleTileClick(tile);
                  }}
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
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={handleConfirm}
            className="py-3 px-8 rounded-xl font-bold bg-amber-500 hover:bg-amber-600 text-green-950 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            確定
          </button>
          <button
            onClick={onClose}
            className="py-3 px-8 rounded-xl font-bold bg-gray-600 hover:bg-gray-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoraSelectionModal;