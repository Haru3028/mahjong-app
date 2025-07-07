// src/components/FuroModal.tsx

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { MahjongTile, FuroType, Furo } from '../types/mahjong';
import { mahjongTiles } from '../data/mahjongTiles';

interface FuroModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectFuroTiles: (tiles: MahjongTile[], type: FuroType, kanType?: 'ankan' | 'minkan') => void;
  selectedTilesInHand: MahjongTile[]; // 現在の手牌
  furoList: Furo[]; // 現在の鳴き面子リスト
  activeFuroTile: MahjongTile | null; // 鳴きの起点となる牌 (手牌でクリックされた牌)
  getPossibleFuroTypes: (clickedTile: MahjongTile, currentHand: MahjongTile[]) => FuroType[]; // 可能な鳴きを取得する関数
}

const FuroModal: React.FC<FuroModalProps> = ({
  isOpen,
  onClose,
  onSelectFuroTiles,
  selectedTilesInHand,
  furoList,
  activeFuroTile,
  getPossibleFuroTypes,
}) => {
  const [tempSelectedTiles, setTempSelectedTiles] = useState<MahjongTile[]>([]);
  const [currentFuroType, setCurrentFuroType] = useState<FuroType | null>(null);
  const [kanType, setKanType] = useState<'ankan' | 'minkan' | null>(null);
  const [possibleFuroTypes, setPossibleFuroTypes] = useState<FuroType[]>([]);

  useEffect(() => {
    if (isOpen && activeFuroTile) { // ★ activeFuroTile の null チェックを追加
      setTempSelectedTiles([]);
      setCurrentFuroType(null);
      setKanType(null);
      // FuroModalを開く直前に手牌からactiveFuroTileを一時的に除外した状態で可能な鳴きを計算
      const handWithoutActiveTile = selectedTilesInHand.filter(tile => tile.id !== activeFuroTile.id || tile.name !== activeFuroTile.name);
      setPossibleFuroTypes(getPossibleFuroTypes(activeFuroTile, handWithoutActiveTile));
    }
  }, [isOpen, activeFuroTile, selectedTilesInHand, getPossibleFuroTypes]);


  // 全ての牌におけるその牌の合計枚数をカウント
  const countTotalOccurrences = useCallback((
    tileId: string,
    currentHand: MahjongTile[], // selectedTilesInHand (activeFuroTileを除く)
    currentFuroList: Furo[],
    currentTempTiles: MahjongTile[],
    furoTriggerTile: MahjongTile // activeFuroTile
  ) => {
    const allTiles = [
      ...currentHand, // activeFuroTileを含まない手牌
      furoTriggerTile, // activeFuroTile自身
      ...currentFuroList.flatMap((f) => f.tiles),
      ...currentTempTiles,
    ];
    let count = 0;
    const baseId = tileId.replace('r', '');

    // 赤ドラと通常の5は同じものとしてカウント
    if (baseId.includes('5')) {
      count = allTiles.filter(t => t.id.replace('r', '') === baseId).length;
    } else {
      count = allTiles.filter(t => t.id === tileId).length;
    }
    return count;
  }, []);

  const addTileToTempSelection = useCallback((tile: MahjongTile) => {
    if (!currentFuroType) {
      alert('先に鳴きの種類を選択してください。');
      return;
    }
    if (!activeFuroTile) { // ★ activeFuroTile の null チェック
        alert('鳴きの起点となる牌がありません。');
        return;
    }

    // 選択中の手牌と現在の鳴き、一時選択中の牌、そしてアクティブな牌を含めて合計枚数をカウント
    const currentHandForCount = selectedTilesInHand.filter(t => t.id !== activeFuroTile.id); // activeFuroTileは手牌に含めない
    const totalCountIncludingActive = countTotalOccurrences(tile.id, currentHandForCount, furoList, tempSelectedTiles, activeFuroTile);

    // 全体の牌数制限 (4枚まで)
    if (totalCountIncludingActive >= 4) {
      alert(`${tile.name} は既に4枚選択されています。`);
      return;
    }

    // ポン・カンの場合、選択中の牌はクリックされた牌と同じ種類でなければならない
    if (currentFuroType === 'pon' || currentFuroType === 'kan') {
      if (tile.id.replace('r','') !== activeFuroTile.id.replace('r','')) { // ★ activeFuroTile の null チェック
        alert(`${currentFuroType}はクリックされた牌と同じ種類の牌を選択してください。`);
        return;
      }
    }

    // チーの場合のバリデーション
    if (currentFuroType === 'chi') {
      if (tile.type === 'jihai' || activeFuroTile.type === 'jihai') { // ★ activeFuroTile の null チェック
        alert('字牌はチーできません。');
        return;
      }
      if (tile.type !== activeFuroTile.type) { // ★ activeFuroTile の null チェック
          alert('チーはクリックされた牌と同じ種類の数牌を選択してください。');
          return;
      }
    }

    // ポン・カン・チーの種類に応じて、tempSelectedTilesに牌を追加する際の重複チェックを調整
    if (currentFuroType === 'pon' || currentFuroType === 'kan') {
        // ポン・カンの場合、既にtempSelectedTilesに同じIDの牌が含まれていないかを確認
        // 赤5と通常の5は同一視する
        const isAlreadySelected = tempSelectedTiles.some(t => t.id.replace('r','') === tile.id.replace('r',''));
        if (isAlreadySelected) {
            alert('同じ種類の牌は複数選択できません。'); // 同じIDでなく、同じ種類の牌
            return;
        }
    } else if (currentFuroType === 'chi') {
        // チーの場合、個別の牌（IDが異なる牌）を選択する必要がある
        const isAlreadySelected = tempSelectedTiles.some(t => t.id === tile.id);
        if (isAlreadySelected) {
            alert('この牌は既に選択されています。異なる牌を選んでください。');
            return;
        }
    }

    setTempSelectedTiles(prev => [...prev, tile]);
  }, [tempSelectedTiles, currentFuroType, activeFuroTile, selectedTilesInHand, furoList, countTotalOccurrences, kanType]);

  const removeTileFromTempSelection = useCallback((indexToRemove: number) => {
    setTempSelectedTiles(prev => prev.filter((_, index) => index !== indexToRemove));
  }, []);

  const handleConfirm = useCallback(() => {
    if (!currentFuroType || !activeFuroTile) { // ★ activeFuroTile の null チェック
      alert('鳴きの種類と鳴きの起点となる牌を選択してください。');
      return;
    }

    let requiredTilesCount = 0;
    if (currentFuroType === 'pon') {
      requiredTilesCount = 2;
    } else if (currentFuroType === 'kan') {
      requiredTilesCount = 3;
    } else if (currentFuroType === 'chi') {
      requiredTilesCount = 2;
    }

    if (tempSelectedTiles.length !== requiredTilesCount) {
      alert(`${currentFuroType}には手牌から${requiredTilesCount}枚の牌が必要です。`);
      return;
    }

    // 鳴きに使用する牌リストの作成
    const furoTiles = [...tempSelectedTiles, activeFuroTile];

    // 最終的な鳴き牌の妥当性チェック
    if (currentFuroType === 'pon') {
        const baseId = activeFuroTile.id.replace('r', ''); // ★ activeFuroTile の null チェック
        // 全ての牌が同じ種類であることを確認 (赤ドラと通常の5は同一視)
        if (!furoTiles.every(t => t.id.replace('r', '') === baseId)) {
            alert('ポンは同じ種類の牌3枚で構成されます。');
            return;
        }
    } else if (currentFuroType === 'kan') {
        const baseId = activeFuroTile.id.replace('r', ''); // ★ activeFuroTile の null チェック
        // 全ての牌が同じ種類であることを確認 (赤ドラと通常の5は同一視)
        if (!furoTiles.every(t => t.id.replace('r', '') === baseId)) {
            alert('カンは同じ種類の牌4枚で構成されます。');
            return;
        }
        if (!kanType) {
            alert('カンの種類（暗槓・明槓）を選択してください。');
            return;
        }
    } else if (currentFuroType === 'chi') {
        if (furoTiles.some(t => t.type === 'jihai' || t.type !== activeFuroTile.type)) { // ★ activeFuroTile の null チェック
            alert('チーは数牌で同じ種類の牌を連続させてください。');
            return;
        }
        const values = furoTiles.map(t => t.value).sort((a, b) => a - b);
        if (values.length !== 3 || !(values[1] === values[0] + 1 && values[2] === values[1] + 1)) {
            alert('チーは連番の3枚で構成されます。');
            return;
        }
    }

    onSelectFuroTiles(furoTiles, currentFuroType, kanType || undefined);
    onClose();
  }, [tempSelectedTiles, currentFuroType, activeFuroTile, kanType, onSelectFuroTiles, onClose]);

  // モーダル内で選択可能な手牌をフィルタリング (一時選択中の牌とactiveFuroTileを除く)
  const availableTilesInHand = useMemo(() => {
    // activeFuroTileは手牌からクリックされた牌であり、鳴きに使用されるため、
    // 鳴きに使う「手牌からの選択肢」としては含めない。
    // その他のtempSelectedTilesに含まれる牌も除外する。
    const filtered = selectedTilesInHand.filter(handTile => {
      // ★ activeFuroTile の null チェック
      if (!activeFuroTile) return false; // activeFuroTile が null なら選択肢なし

      if (handTile.id === activeFuroTile.id) { // ★ activeFuroTile の null チェック
          // activeFuroTile自身は選択肢から除外
          return false;
      }
      // tempSelectedTilesに既に含まれている牌は除外（IDが完全に一致する場合）
      if (tempSelectedTiles.some(t => t.id === handTile.id)) {
          return false;
      }

      // ポン・カンであれば、activeFuroTileと同じ種類の牌も選択肢に含める
      // ただし、赤ドラと通常の5は区別せず、種類が同じであれば含める
      if (currentFuroType === 'pon' || currentFuroType === 'kan') {
          // activeFuroTileと同じ種類の牌（IDの'r'を除く）をカウント
          const baseActiveId = activeFuroTile.id.replace('r', ''); // ★ activeFuroTile の null チェック
          const baseHandTileId = handTile.id.replace('r', '');

          if (baseActiveId === baseHandTileId) {
              return true; // 同じ種類の牌は選択可能
          }
      } else if (currentFuroType === 'chi') {
          // チーであれば、activeFuroTileとは異なる牌を選択
          // かつ、同じ牌IDは選択できない
          return true; // tempSelectedTilesとactiveFuroTileに含まれていなければOK
      }

      return false; // それ以外はデフォルトで除外
    });
    return filtered;
  }, [selectedTilesInHand, tempSelectedTiles, activeFuroTile, currentFuroType]);


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full text-gray-900">
        <h2 className="text-xl font-bold mb-4">鳴きを選択</h2>

        {activeFuroTile && ( // ★ activeFuroTile の null チェック
            <div className="mb-4">
                <h3 className="text-md font-medium text-gray-800 mb-2">クリックされた牌:</h3>
                <img src={activeFuroTile.src} alt={activeFuroTile.name} className="w-10 h-14" />
                <p className="text-sm text-gray-600">{activeFuroTile.name}</p>
            </div>
        )}

        {/* 鳴き種類選択ボタン */}
        <div className="mb-4">
            <h3 className="text-md font-medium text-gray-800 mb-2">鳴きの種類を選択:</h3>
            <div className="flex gap-2">
                {/* possibleFuroTypes は activeFuroTile が null でない場合に useEffect で計算される */}
                {possibleFuroTypes.includes('pon') && (
                    <button
                        className={`px-4 py-2 rounded-md ${currentFuroType === 'pon' ? 'bg-purple-500 text-white' : 'bg-purple-200 text-purple-800'}`}
                        onClick={() => { setCurrentFuroType('pon'); setKanType(null); setTempSelectedTiles([]); }}
                    >
                        ポン
                    </button>
                )}
                {possibleFuroTypes.includes('kan') && (
                    <button
                        className={`px-4 py-2 rounded-md ${currentFuroType === 'kan' ? 'bg-blue-500 text-white' : 'bg-blue-200 text-blue-800'}`}
                        onClick={() => { setCurrentFuroType('kan'); setTempSelectedTiles([]); }}
                    >
                        カン
                    </button>
                )}
                {possibleFuroTypes.includes('chi') && (
                    <button
                        className={`px-4 py-2 rounded-md ${currentFuroType === 'chi' ? 'bg-teal-500 text-white' : 'bg-teal-200 text-teal-800'}`}
                        onClick={() => { setCurrentFuroType('chi'); setKanType(null); setTempSelectedTiles([]); }}
                    >
                        チー
                    </button>
                )}
            </div>
        </div>

        {currentFuroType === 'kan' && (
            <div className="mb-4">
                <h3 className="text-md font-medium text-gray-800 mb-2">カンの種類を選択:</h3>
                <div className="flex gap-2">
                    <button
                        className={`px-4 py-2 rounded-md ${kanType === 'ankan' ? 'bg-gray-700 text-white' : 'bg-gray-300 text-gray-800'}`}
                        onClick={() => setKanType('ankan')}
                    >
                        暗槓
                    </button>
                    <button
                        className={`px-4 py-2 rounded-md ${kanType === 'minkan' ? 'bg-gray-700 text-white' : 'bg-gray-300 text-gray-800'}`}
                        onClick={() => setKanType('minkan')}
                    >
                        明槓
                    </button>
                </div>
            </div>
        )}

        {/* 一時選択牌表示 */}
        {currentFuroType && (
            <div className="mb-4 border p-2 rounded-md min-h-[50px] flex flex-wrap gap-1 items-center bg-gray-100">
            {tempSelectedTiles.length === 0 ? (
                <p className="text-gray-500 text-sm">鳴きに使用する手牌の牌を選択してください。</p>
            ) : (
                tempSelectedTiles.map((tile, index) => (
                <img
                    key={`temp-${index}`}
                    src={tile.src}
                    alt={tile.name}
                    className="w-8 h-12 cursor-pointer hover:scale-105 transition-transform duration-100"
                    onClick={() => removeTileFromTempSelection(index)}
                />
                ))
            )}
            </div>
        )}

        {/* 牌選択エリア (手牌から選択) */}
        {currentFuroType && (
            <div className="mb-4">
                <h3 className="text-md font-medium text-gray-800 mb-2">手牌から鳴きに使う牌を選択:</h3>
                <div className="flex flex-wrap gap-1 border p-2 rounded-md bg-gray-100 min-h-[50px]">
                    {availableTilesInHand.length === 0 ? (
                        <p className="text-gray-500 text-sm">手牌に鳴きに使用できる牌がありません。</p>
                    ) : (
                        availableTilesInHand.map((tile, index) => (
                            <img
                                key={`hand-select-${index}`}
                                src={tile.src}
                                alt={tile.name}
                                className="w-8 h-12 cursor-pointer hover:scale-105 transition-transform duration-100"
                                onClick={() => addTileToTempSelection(tile)}
                            />
                        ))
                    )}
                </div>
            </div>
        )}

        {/* ボタン群 */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors shadow-sm"
          >
            キャンセル
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors shadow-sm"
          >
            確定
          </button>
        </div>
      </div>
    </div>
  );
};

export default FuroModal;