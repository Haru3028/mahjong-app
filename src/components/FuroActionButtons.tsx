// src/components/FuroActionButtons.tsx

import React, { useState, useMemo } from 'react';
import { MahjongTile, KanType, FuroType, Furo } from '../types/mahjong';
import TileComponent from './TileComponent'; // TileComponentをインポート

interface FuroActionButtonsProps {
  hasFuro: boolean;
  selectedForFuro: MahjongTile[]; // ユーザーが現在選択している組み合わせの牌
  onMakeFuro: (tiles: MahjongTile[], type: FuroType, kanType?: KanType) => void;
  onClearFuroSelection: () => void; // page.tsxから渡されるクリア関数
  isFuroSelectionMode: boolean;
  onToggleFuroSelectionMode: () => void;
  // selectedTiles, furoList, setFuroList は page.tsx で候補計算に使われるため、
  // このコンポーネントでは直接使われないが、Propsとして受け取る
  selectedTiles: MahjongTile[]; 
  furoList: Furo[]; 
  setFuroList: React.Dispatch<React.SetStateAction<Furo[]>>; 
  
  // 新しいプロパティ
  selectedFuroTypeToMake: FuroType | 'none'; // ユーザーが選択した鳴きの種類
  setSelectedFuroTypeToMake: React.Dispatch<React.SetStateAction<FuroType | 'none'>>; // 鳴きの種類を設定する関数
  possibleMeldCombinations: MahjongTile[][]; // page.tsxから渡される可能な組み合わせのリスト
  onSelectMeldCombination: (combination: MahjongTile[]) => void; // 組み合わせを選択したときのハンドラ
  onConfirmFuroSelection: (type: FuroType, kanType?: KanType) => void; // 確定ボタンクリック時のハンドラ
  onCancelFuroSelection: () => void; // キャンセルボタンクリック時のハンドラ
}

const FuroActionButtons: React.FC<FuroActionButtonsProps> = ({
  hasFuro,
  selectedForFuro,
  onMakeFuro,
  onClearFuroSelection, // page.tsxから受け取る
  isFuroSelectionMode,
  onToggleFuroSelectionMode,
  selectedTiles, // このコンポーネントでは直接使わないが、Propsとして受け取る
  furoList, // このコンポーネントでは直接使わないが、Propsとして受け取る
  setFuroList, // このコンポーネントでは直接使わないが、Propsとして受け取る
  selectedFuroTypeToMake,
  setSelectedFuroTypeToMake,
  possibleMeldCombinations, // 受け取る
  onSelectMeldCombination, // 受け取る
  onConfirmFuroSelection,
  onCancelFuroSelection,
}) => {
  // カンの種類選択（明槓/暗槓/加槓）は、確定時に渡すためにここで管理
  const [currentKanType, setCurrentKanType] = useState<KanType>('minkan');

  if (!hasFuro) {
    return null; // 鳴き機能が無効な場合は何も表示しない
  }

  // 選択中の鳴きタイプが「カン」の場合のみ、カンの種類を選択するUIを表示
  const showKanTypeSelection = selectedFuroTypeToMake === 'kan';

  // 確定ボタンのdisabled状態を判定
  const isConfirmDisabled = useMemo(() => {
    // 選択された組み合わせがなければ無効
    if (selectedForFuro.length === 0) return true; 

    // 選択された組み合わせが、鳴きタイプと枚数に合致しているか確認
    if (selectedFuroTypeToMake === 'pon' && selectedForFuro.length === 3) {
      // ポンの場合、3枚全てが同じ牌であるか
      const firstTile = selectedForFuro[0];
      return !selectedForFuro.every(t => t.id.replace('r', '') === firstTile.id.replace('r', ''));
    }
    if (selectedFuroTypeToMake === 'chi' && selectedForFuro.length === 3) {
      // チーの場合、3枚が順子を形成しているか
      const sortedChiTiles = [...selectedForFuro].sort((a, b) => a.value - b.value);
      if (sortedChiTiles[0].type === 'jihai') return true; // 字牌はチーできない
      return !(sortedChiTiles[0].type === sortedChiTiles[1].type &&
               sortedChiTiles[1].type === sortedChiTiles[2].type &&
               sortedChiTiles[0].value === sortedChiTiles[1].value - 1 &&
               sortedChiTiles[1].value === sortedChiTiles[2].value - 1);
    }
    if (selectedFuroTypeToMake === 'kan') {
      if (selectedForFuro.length === 4) { // 明槓/暗槓
        // 4枚全てが同じ牌であるか
        const firstTile = selectedForFuro[0];
        return !selectedForFuro.every(t => t.id.replace('r', '') === firstTile.id.replace('r', ''));
      } else if (selectedForFuro.length === 1) { // 加槓
        const selectedTile = selectedForFuro[0];
        // furoListから該当するポンがあるかチェック (page.tsxで既にチェック済みだが念のため)
        return !furoList.some(f => f.type === 'pon' && f.tiles[0].id.replace('r', '') === selectedTile.id.replace('r', ''));
      }
      return true; // カンで1枚でも4枚でもない場合は無効
    }
    return true; // その他の場合は無効
  }, [selectedForFuro, selectedFuroTypeToMake, furoList]);


  return (
    <div className="mb-8 p-4 border rounded-lg bg-white shadow-md flex flex-col items-center w-full max-w-2xl">
      <h2 className="text-xl font-semibold w-full text-center mb-4">鳴き操作</h2>

      {/* ボタンのスタイルを統一し、雀卓の雰囲気に合わせる */}
      <button
        onClick={onToggleFuroSelectionMode}
        className={`py-2 px-4 rounded-lg font-bold mb-4 w-full shadow-md transition-colors duration-200
          ${isFuroSelectionMode ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-gray-700 hover:bg-gray-600 text-white'
        }`}
      >
        {isFuroSelectionMode ? '鳴き選択モード解除' : '鳴き選択モード開始'}
      </button>

      {isFuroSelectionMode && (
        <>
          {selectedFuroTypeToMake === 'none' ? (
            // 鳴きタイプ選択フェーズ
            <>
              <h3 className="text-lg font-semibold mb-2">鳴きの種類を選択:</h3>
              <div className="flex flex-wrap gap-2 justify-center w-full mb-4">
                <button
                  onClick={() => setSelectedFuroTypeToMake('pon')}
                  className="py-2 px-4 rounded-lg font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md"
                >
                  ポン
                </button>
                <button
                  onClick={() => setSelectedFuroTypeToMake('chi')}
                  className="py-2 px-4 rounded-lg font-bold bg-green-600 hover:bg-green-700 text-white shadow-md"
                >
                  チー
                </button>
                <button
                  onClick={() => setSelectedFuroTypeToMake('kan')}
                  className="py-2 px-4 rounded-lg font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-md"
                >
                  カン
                </button>
              </div>
            </>
          ) : (
            // 組み合わせ表示と確定/キャンセルフェーズ
            <>
              <h3 className="text-lg font-semibold mb-2">
                {selectedFuroTypeToMake === 'pon' && 'ポン'}
                {selectedFuroTypeToMake === 'chi' && 'チー'}
                {selectedFuroTypeToMake === 'kan' && 'カン'}
                の組み合わせを選択してください:
              </h3>
              {showKanTypeSelection && (
                <div className="mt-2 flex gap-2 text-sm mb-4 text-gray-800">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="kanType"
                      value="minkan"
                      checked={currentKanType === 'minkan'}
                      onChange={() => setCurrentKanType('minkan')}
                      className="form-radio text-purple-600"
                    />
                    <span className="ml-1">明槓</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="kanType"
                      value="ankan"
                      checked={currentKanType === 'ankan'}
                      onChange={() => setCurrentKanType('ankan')}
                      className="form-radio text-purple-600"
                    />
                    <span className="ml-1">暗槓</span>
                  </label>
                  {/* 加槓は候補として表示されるため、ここではラジオボタンは不要 */}
                </div>
              )}

              {/* 可能な組み合わせの表示 */}
              <div className="flex flex-wrap gap-x-6 gap-y-6 justify-center w-full mb-4">
                {possibleMeldCombinations.length > 0 ? (
                  possibleMeldCombinations.map((combination, combIndex) => (
                    <button
                      key={combIndex}
                      onClick={() => onSelectMeldCombination(combination)}
                      className={`py-2 px-3 rounded-lg font-bold transition-colors duration-150 flex items-center gap-0.5 shadow-md
                        ${selectedForFuro.length > 0 && combination.every(t => selectedForFuro.some(s => s.instanceId === t.instanceId)) && selectedForFuro.length === combination.length
                          ? 'bg-yellow-400 text-gray-800' // 選択中の組み合わせをハイライト
                          : 'bg-blue-300 hover:bg-blue-400 text-gray-800'
                        }`}
                    >
                      {/* 牌の画像を直接表示 */}
                      {combination.map((tile, tileIdx) => (
                        <TileComponent 
                          key={tile.instanceId || `${tile.id}-${tileIdx}`} 
                          tile={tile} 
                          isSmall={true} // 小さく表示
                          isFaceDown={selectedFuroTypeToMake === 'kan' && currentKanType === 'ankan' && (tileIdx === 0 || tileIdx === 3)} // 暗槓の裏返し
                          isTilted={selectedFuroTypeToMake === 'pon' || selectedFuroTypeToMake === 'chi' ? tileIdx === 2 : false} // ポン・チーの最後の牌を傾ける
                        />
                      ))}
                    </button>
                  ))
                ) : (
                  <p className="text-gray-700">この鳴きタイプで可能な組み合わせはありません</p>
                )}
              </div>

              <div className="flex gap-2 justify-center w-full mb-4">
                <button
                  onClick={() => onConfirmFuroSelection(selectedFuroTypeToMake, currentKanType)}
                  disabled={isConfirmDisabled} // disabledロジックをuseMemoで一元化
                  className={`py-2 px-4 rounded-lg font-bold shadow-md ${
                    !isConfirmDisabled ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  確定
                </button>
                <button
                  onClick={onCancelFuroSelection}
                  className="py-2 px-4 rounded-lg font-bold bg-gray-500 hover:bg-gray-600 text-white shadow-md"
                >
                  キャンセル
                </button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default FuroActionButtons;