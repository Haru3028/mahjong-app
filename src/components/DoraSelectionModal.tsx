// src/components/DoraSelectionModal.tsx

import React, { useState, useCallback, useMemo } from 'react';
import { MahjongTile } from '../types/mahjong';
import { mahjongTiles } from '../data/mahjongTiles'; // 全ての牌データ
import TileComponent from './TileComponent'; // 牌コンポーネント

interface DoraSelectionModalProps {
  currentDoraIndicators: MahjongTile[]; // 現在設定されているドラ表示牌
  onConfirm: (selectedTiles: MahjongTile[]) => void; // 確定時のコールバック
  onClose: () => void; // モーダルを閉じるコールバック
}

const MAX_DORA_INDICATORS = 5; // ドラ表示牌の最大枚数

const DoraSelectionModal: React.FC<DoraSelectionModalProps> = ({
  currentDoraIndicators,
  onConfirm,
  onClose,
}) => {
  // モーダル内で一時的に選択されているドラ表示牌のリスト
  const [tempDoraIndicators, setTempDoraIndicators] = useState<MahjongTile[]>(currentDoraIndicators);

  // 牌が選択可能かどうかを判定 (最大枚数制限)
  const canSelectMoreDora = tempDoraIndicators.length < MAX_DORA_INDICATORS;

  // 牌が既に一時選択リストに含まれているか
  const isTileSelected = useCallback((tile: MahjongTile) => {
    // instanceId で厳密に比較する
    return tempDoraIndicators.some(t => t.instanceId === tile.instanceId);
  }, [tempDoraIndicators]);

  // 牌がクリックされたときのハンドラ
  const handleTileClick = useCallback((tile: MahjongTile) => {
    // 選択されている牌と同じIDを持つ牌がtempDoraIndicatorsに存在するかどうかで判定
    const existingTileInTemp = tempDoraIndicators.find(t => t.id === tile.id);

    if (existingTileInTemp) {
      // 既に選択されている場合は解除（同じIDの牌が複数ある場合は最初の1つを削除）
      setTempDoraIndicators(prev => {
        const indexToRemove = prev.findIndex(t => t.id === tile.id);
        if (indexToRemove > -1) {
          const newArr = [...prev];
          newArr.splice(indexToRemove, 1);
          return newArr;
        }
        return prev;
      });
    } else {
      // 未選択の場合は追加（最大枚数制限を考慮）
      if (canSelectMoreDora) {
        // 新しいインスタンスとして追加し、ユニークなinstanceIdを付与
        const newTileInstance: MahjongTile = {
          ...tile,
          instanceId: `${tile.id}-dora-${Date.now()}-${Math.random()}`,
        };
        setTempDoraIndicators(prev => [...prev, newTileInstance]);
      } else {
        alert(`ドラ表示牌は最大${MAX_DORA_INDICATORS}枚まで選択できます。`);
      }
    }
  }, [canSelectMoreDora, tempDoraIndicators]); // tempDoraIndicators を依存配列に追加

  // 確定ボタンのハンドラ
  const handleConfirmClick = useCallback(() => {
    onConfirm(tempDoraIndicators);
    onClose();
  }, [onConfirm, onClose, tempDoraIndicators]);

  // キャンセルボタンのハンドラ
  const handleCancelClick = useCallback(() => {
    onClose();
  }, [onClose]);

  // 牌を種類ごとにグループ化してソート
  const groupedMahjongTiles = useMemo(() => {
    const grouped: { [key: string]: MahjongTile[] } = {};
    mahjongTiles.forEach(tile => {
      if (!grouped[tile.type]) {
        grouped[tile.type] = [];
      }
      grouped[tile.type].push(tile);
    });
    for (const type in grouped) {
      if (Object.prototype.hasOwnProperty.call(grouped, type)) {
        grouped[type].sort((a, b) => {
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
  }, []);

  const tileTypeOrder = ['manzu', 'pinzu', 'souzu', 'jihai'];
  const typeLabels: { [key: string]: string } = {
    manzu: '萬子',
    pinzu: '筒子',
    souzu: '索子',
    jihai: '字牌',
  };


  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-blue-50 rounded-lg shadow-2xl border-4 border-blue-600 p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto text-gray-800">
        <h2 className="text-2xl font-extrabold mb-4 text-center text-blue-800">ドラ表示牌を選択 ({tempDoraIndicators.length}/{MAX_DORA_INDICATORS})</h2>
        
        {/* 現在選択中のドラ表示牌 */}
        <div className="mb-4 p-3 border rounded-md bg-blue-100 border-blue-300">
          <h3 className="text-lg font-semibold mb-2 text-blue-700">選択中のドラ表示牌:</h3>
          <div className="flex flex-wrap justify-center gap-1">
            {tempDoraIndicators.length > 0 ? (
              tempDoraIndicators.map((tile, index) => (
                <TileComponent
                  key={tile.instanceId || `${tile.id}-${index}`}
                  tile={tile}
                  onClick={() => handleTileClick(tile)} // クリックで解除
                  isSmall={false} // 通常サイズで表示
                  isSelectedForFuro={true} // 選択中としてハイライト
                  isDoraSelectionMode={true} // ★追加: ドラ選択モードであることを伝える
                />
              ))
            ) : (
              <p className="text-gray-700">ドラ表示牌が選択されていません。</p>
            )}
          </div>
        </div>

        {/* 全ての牌の選択肢 */}
        <div className="flex flex-col gap-4 mb-6">
          {tileTypeOrder.map(typeKey => {
            const tilesOfType = groupedMahjongTiles[typeKey];
            if (!tilesOfType || tilesOfType.length === 0) {
              return null;
            }
            return (
              <div key={typeKey} className="flex flex-col items-center">
                <h3 className="text-lg font-medium mb-1 text-blue-700">{typeLabels[typeKey]}</h3>
                <div className="flex flex-wrap justify-center gap-1">
                  {tilesOfType.map((tile) => (
                    <TileComponent
                      key={tile.id} // 元のIDで十分
                      tile={tile}
                      onClick={() => handleTileClick(tile)}
                      isAvailable={true}
                      // tempDoraIndicators に同じIDの牌がいくつあるかを確認してハイライト
                      isSelectedForFuro={tempDoraIndicators.some(t => t.id === tile.id)}
                      isValidCandidate={canSelectMoreDora || tempDoraIndicators.some(t => t.id === tile.id)} // 選択可能か、または既に選択済みか
                      isDoraSelectionMode={true} // ★追加: ドラ選択モードであることを伝える
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* アクションボタン */}
        <div className="flex justify-end gap-4">
          <button
            onClick={handleCancelClick}
            className="py-2 px-6 rounded-lg font-bold bg-gray-500 hover:bg-gray-600 text-white shadow-md transition-colors duration-200"
          >
            キャンセル
          </button>
          <button
            onClick={handleConfirmClick}
            className="py-2 px-6 rounded-lg font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-colors duration-200"
          >
            確定
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoraSelectionModal;