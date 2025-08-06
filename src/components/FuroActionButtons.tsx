// src/components/FuroActionButtons.tsx

import React from 'react';
import Image from 'next/image';
import { MahjongTile, FuroType, Furo, KanType } from '../types/mahjong';

interface FuroActionButtonsProps {
  hasFuro: boolean;
  selectedForFuro: MahjongTile[];
  setSelectedForFuro: React.Dispatch<React.SetStateAction<MahjongTile[]>>;
  onClearFuroSelection: () => void;
  isFuroSelectionMode: boolean;
  onToggleFuroSelectionMode: () => void;
  selectedTiles: MahjongTile[]; // 手牌全体
  furoList: Furo[]; // 鳴きリスト
  setFuroList: React.Dispatch<React.SetStateAction<Furo[]>>; // 加槓時に必要
  selectedFuroTypeToMake: FuroType | 'none';
  setSelectedFuroTypeToMake: React.Dispatch<React.SetStateAction<FuroType | 'none'>>;
  possibleMeldCombinations: MahjongTile[][];
  onSelectMeldCombination?: (combination: MahjongTile[]) => void; // optional
  onConfirmFuroSelection?: (type: FuroType, kanType?: KanType) => void; // optional
  onCancelFuroSelection: () => void;
}

const FuroActionButtons: React.FC<FuroActionButtonsProps> = ({
  selectedForFuro,
  onClearFuroSelection,
  isFuroSelectionMode,
  onToggleFuroSelectionMode,
  selectedFuroTypeToMake,
  setSelectedFuroTypeToMake,
  possibleMeldCombinations,
  onSelectMeldCombination,
  onConfirmFuroSelection,
  onCancelFuroSelection,
}) => {
  const TILE_WIDTH = 32;
  const TILE_HEIGHT = 40;

  const handleFuroTypeSelect = (type: FuroType) => {
    setSelectedFuroTypeToMake(type);
    onClearFuroSelection(); // 選択中の牌をクリア
    if (!isFuroSelectionMode) {
      onToggleFuroSelectionMode(); // 鳴き選択モードへ
    }
  };

  const handleKanTypeSelect = (kanType: KanType) => {
    if (selectedForFuro.length > 0) {
      if (onConfirmFuroSelection) onConfirmFuroSelection('kan', kanType);
    } else {
      alert('槓する牌を選択してください。');
    }
  };

  return (
    <div className="p-6 rounded-xl shadow-lg bg-green-800 text-gray-100">
      <h2 className="text-2xl font-bold mb-4 text-center text-amber-300">鳴き（フーロ）操作</h2>

      <div className="flex flex-wrap justify-center gap-4 mb-6">
        <button
          onClick={() => handleFuroTypeSelect('pon')}
          className={`base-button px-8 py-4 text-lg font-bold rounded-lg shadow transition-all duration-200 ${
            selectedFuroTypeToMake === 'pon' ? 'bg-blue-600 text-white' : 'bg-gray-600 hover:bg-gray-700 text-white'
          }`}
        >
          ポン
        </button>
        <button
          onClick={() => handleFuroTypeSelect('chi')}
          className={`base-button px-8 py-4 text-lg font-bold rounded-lg shadow transition-all duration-200 ${
            selectedFuroTypeToMake === 'chi' ? 'bg-blue-600 text-white' : 'bg-gray-600 hover:bg-gray-700 text-white'
          }`}
        >
          チー
        </button>
        <button
          onClick={() => handleFuroTypeSelect('kan')}
          className={`base-button px-8 py-4 text-lg font-bold rounded-lg shadow transition-all duration-200 ${
            selectedFuroTypeToMake === 'kan' ? 'bg-blue-600 text-white' : 'bg-gray-600 hover:bg-gray-700 text-white'
          }`}
        >
          カン
        </button>
        <button
          onClick={onToggleFuroSelectionMode}
          className={`base-button px-8 py-4 text-lg font-bold rounded-lg shadow transition-all duration-200 ${
            isFuroSelectionMode && selectedFuroTypeToMake === 'none' ? 'bg-red-600 text-white' : 'bg-gray-600 hover:bg-gray-700 text-white'
          }`}
        >
          {isFuroSelectionMode ? '選択モード終了' : '鳴き選択モード'}
        </button>
      </div>

      {isFuroSelectionMode && selectedFuroTypeToMake !== 'none' && (
        <div className="mt-4 p-4 border-2 border-amber-600 rounded-lg bg-green-900">
          <h3 className="text-xl font-semibold mb-3 text-center text-amber-400">
            {selectedFuroTypeToMake === 'pon' && 'ポンする牌を選択'}
            {selectedFuroTypeToMake === 'chi' && 'チーする牌を選択'}
            {selectedFuroTypeToMake === 'kan' && 'カンする牌を選択'}
          </h3>
          {/* 鳴き候補画像リスト（常に表示） */}
          <div className="mb-4">
            <p className="text-center text-sm mb-2">候補の組み合わせ:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {possibleMeldCombinations.length === 0 && (
                <span className="text-gray-400">候補なし</span>
              )}
              {possibleMeldCombinations.map((combination, combIndex) => {
                const isSelected =
                  selectedForFuro.length === combination.length &&
                  combination.every(cTile => selectedForFuro.some(sTile => sTile.instanceId === cTile.instanceId));
                return (
                  <div
                    key={`comb-${combIndex}`}
                    className={`flex gap-1 p-2 rounded-md cursor-pointer border-2 transition-all duration-150 ${
                      isSelected
                        ? 'border-blue-500 bg-blue-800/30 scale-105 shadow-lg'
                        : 'border-gray-500 hover:border-blue-500'
                    }`}
                    onClick={() => {
                      if (isSelected) {
                        // すでに選択中なら解除
                        onSelectMeldCombination && onSelectMeldCombination([]);
                      } else {
                        onSelectMeldCombination && onSelectMeldCombination(combination);
                      }
                    }}
                  >
                    {combination.map((tile, tileIndex) => (
                      <Image
                        key={tile.instanceId || `${tile.id}-${tileIndex}`}
                        src={tile.src}
                        alt={tile.name}
                        width={TILE_WIDTH}
                        height={TILE_HEIGHT}
                        className={`rounded-sm ${tile.isRedDora ? 'border border-red-500' : ''}`}
                      />
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
          {/* カン種別ボタン */}
          {selectedFuroTypeToMake === 'kan' && (
            <div className="flex justify-center gap-4 mb-4">
              <button
                onClick={() => handleKanTypeSelect('ankan')}
                className="py-2 px-4 rounded-lg font-bold bg-purple-600 hover:bg-purple-700 text-white"
              >
                暗槓
              </button>
              <button
                onClick={() => handleKanTypeSelect('minkan')}
                className="py-2 px-4 rounded-lg font-bold bg-orange-600 hover:bg-orange-700 text-white"
              >
                明槓
              </button>
              <button
                onClick={() => handleKanTypeSelect('kakan')}
                className="py-2 px-4 rounded-lg font-bold bg-pink-600 hover:bg-pink-700 text-white"
              >
                加槓
              </button>
            </div>
          )}
          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={() => onConfirmFuroSelection && onConfirmFuroSelection(selectedFuroTypeToMake as FuroType)}
              disabled={selectedForFuro.length === 0}
              className={`py-2 px-6 rounded-lg font-bold text-white transition-all duration-200 ${
                selectedForFuro.length > 0 ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              確定
            </button>
            <button
              onClick={onCancelFuroSelection}
              className="py-2 px-6 rounded-lg font-bold bg-red-600 hover:bg-red-700 text-white transition-all duration-200"
            >
              キャンセル
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FuroActionButtons;