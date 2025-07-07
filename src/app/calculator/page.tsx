// src/app/calculator/page.tsx

"use client"; // クライアントコンポーネントとして宣言

import { useMahjongCalculator } from '../../hooks/useMahjongCalculator';
import { useEffect, useState, useMemo, useCallback } from 'react';
import { MahjongTile, FuroType, KanType, Furo } from '../../types/mahjong';
import { mahjongTiles } from '../../data/mahjongTiles'; // 牌データもここで使用

// 分割したコンポーネントをインポート
import TileSelectionSection from '../../components/TileSelectionSection';
import HandDisplaySection from '../../components/HandDisplaySection';
import FuroActionButtons from '../../components/FuroActionButtons';
import GameInfoSection from '../../components/GameInfoSection';
import DoraSelectionModal from '../../components/DoraSelectionModal';

export default function CalculatorPage() {
  const {
    selectedTiles,
    addTileToHand,
    removeTileFromHand,
    furoList,
    setHasFuro,
    makeFuroFromSelection,
    removeFuro,
    bakaze, setBakaze,
    jikaze, setJikaze,
    honba, setHonba,
    reachbo, setReachbo,
    remainingHandTilesCount,
    setFuroList,

    isTsumo, setIsTsumo,
    doraIndicators, setDoraIndicators, removeDoraIndicator,
    isRiichi, setIsRiichi,
    isDoubleRiichi, setIsDoubleRiichi,
    isIppatsu, setIsIppatsu,
    isChankan, setIsChankan,
    isRinshan, setIsRinshan,
    isHaitei, setIsHaitei,
    isHoutei, setIsHoutei,
    isChiiho, setIsChiiho,
    isTenho, setIsTenho,
  } = useMahjongCalculator();

  const [selectedForFuro, setSelectedForFuro] = useState<MahjongTile[]>([]);
  const [isFuroSelectionMode, setIsFuroSelectionMode] = useState<boolean>(false);
  const [selectedFuroTypeToMake, setSelectedFuroTypeToMake] = useState<FuroType | 'none'>('none');
  const [isDoraModalOpen, setIsDoraModalOpen] = useState<boolean>(false);

  useEffect(() => {
    setHasFuro(true);
  }, [setHasFuro]);

  const handleToggleFuroSelectionMode = () => {
    setIsFuroSelectionMode(prev => !prev);
    setSelectedForFuro([]);
    setSelectedFuroTypeToMake('none');
  };

  const onClearFuroSelection = useCallback(() => {
    setSelectedForFuro([]);
  }, []);

  const handleHandTileClick = useCallback((tile: MahjongTile, index: number) => {
    if (!isFuroSelectionMode) {
      removeTileFromHand(index);
    }
  }, [isFuroSelectionMode, removeTileFromHand]);


  const handleConfirmFuroSelection = useCallback((type: FuroType, kanType?: KanType) => {
    if (selectedForFuro.length === 0) {
      alert('鳴きに使う牌の組み合わせを選択してください。');
      return;
    }

    if (type === 'kan' && kanType === 'kakan') {
      const selectedTileForKakan = selectedForFuro.find(t => !furoList.some(f => f.tiles.some(ft => ft.instanceId === t.instanceId)));
      if (!selectedTileForKakan) {
          alert('加槓する牌が特定できませんでした。');
          return;
      }
      const targetFuroIndex = furoList.findIndex(f => 
        f.type === 'pon' && 
        f.tiles[0].id.replace('r', '') === selectedTileForKakan.id.replace('r', '')
      );
      if (targetFuroIndex !== -1) {
        const newFuroList = [...furoList];
        newFuroList.splice(targetFuroIndex, 1);
        setFuroList(newFuroList);
      }
      makeFuroFromSelection(selectedForFuro, type, kanType);
    } else {
      makeFuroFromSelection(selectedForFuro, type, kanType);
    }
    onClearFuroSelection();
    setSelectedFuroTypeToMake('none');
  }, [selectedForFuro, furoList, makeFuroFromSelection, onClearFuroSelection, setFuroList]);


  const handleCancelFuroSelection = useCallback(() => {
    onClearFuroSelection();
    setSelectedFuroTypeToMake('none');
  }, [onClearFuroSelection]);


  const possibleMeldCombinations = useMemo(() => {
    if (!isFuroSelectionMode || selectedFuroTypeToMake === 'none') {
      return [];
    }

    const combinations: MahjongTile[][] = [];
    const handTiles = [...selectedTiles];

    const getHandCounts = (tiles: MahjongTile[]) => {
      const counts = new Map<string, MahjongTile[]>();
      tiles.forEach(tile => {
        const baseId = tile.id.replace('r', '');
        if (!counts.has(baseId)) {
          counts.set(baseId, []);
        }
        counts.get(baseId)?.push(tile);
      });
      return counts;
    };

    const currentHandCounts = getHandCounts(handTiles);

    if (selectedFuroTypeToMake === 'pon') {
      currentHandCounts.forEach((tiles, baseId) => {
        if (tiles.length >= 3) {
          combinations.push(tiles.slice(0, 3));
        }
      });
    } else if (selectedFuroTypeToMake === 'chi') {
      const numberTiles = handTiles.filter(t => t.type !== 'jihai').sort((a, b) => {
        if (a.type !== b.type) {
          return a.type.localeCompare(b.type);
        }
        return a.value - b.value;
      });

      for (let i = 0; i < numberTiles.length; i++) {
        for (let j = i + 1; j < numberTiles.length; j++) {
          for (let k = j + 1; k < numberTiles.length; k++) {
            const tile1 = numberTiles[i];
            const tile2 = numberTiles[j];
            const tile3 = numberTiles[k];

            if (tile1.type === tile2.type && tile2.type === tile3.type &&
                tile1.value === tile2.value - 1 && tile2.value === tile3.value - 1) {
              combinations.push([tile1, tile2, tile3]);
            }
          }
        }
      }
    } else if (selectedFuroTypeToMake === 'kan') {
      currentHandCounts.forEach((tiles, baseId) => {
        if (tiles.length >= 4) {
          combinations.push(tiles.slice(0, 4));
        }
      });

      furoList.forEach(furo => {
        if (furo.type === 'pon') {
          const ponTileBaseId = furo.tiles[0].id.replace('r', '');
          if (currentHandCounts.has(ponTileBaseId) && currentHandCounts.get(ponTileBaseId)!.length >= 1) {
            const kakanTile = currentHandCounts.get(ponTileBaseId)![0];
            const kakanCombination = [...furo.tiles, kakanTile];
            combinations.push(kakanCombination);
          }
        }
      });
    }

    const uniqueCombinationsMap = new Map<string, MahjongTile[]>();
    combinations.forEach(comb => {
      const sortedCombIds = [...comb].sort((a, b) => (a.instanceId || '').localeCompare(b.instanceId || ''))
                                     .map(t => t.instanceId).join(',');
      if (!uniqueCombinationsMap.has(sortedCombIds)) {
        uniqueCombinationsMap.set(sortedCombIds, comb);
      }
    });

    const uniqueCombinations = Array.from(uniqueCombinationsMap.values());

    return uniqueCombinations.sort((a, b) => {
        const nameA = a.map(t => t.name).join('');
        const nameB = b.map(t => t.name).join('');
        return nameA.localeCompare(nameB);
    });

  }, [isFuroSelectionMode, selectedFuroTypeToMake, selectedTiles, furoList]);


  const validCandidateTiles = useMemo(() => {
    const tileInstanceIds = new Set<string>();
    possibleMeldCombinations.forEach(combination => {
      combination.forEach(tile => {
        if (tile.instanceId) {
          tileInstanceIds.add(tile.instanceId);
        }
      });
    });
    return selectedTiles.filter(tile => tileInstanceIds.has(tile.instanceId || ''));
  }, [possibleMeldCombinations, selectedTiles]);


  const handleSelectMeldCombination = useCallback((combination: MahjongTile[]) => {
    setSelectedForFuro(combination);
  }, []);

  // ドラモーダル確定時のハンドラ
  const handleDoraConfirm = useCallback((selectedDora: MahjongTile[]) => {
    setDoraIndicators(selectedDora);
    setIsDoraModalOpen(false);
  }, [setDoraIndicators]);


  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 bg-gray-100"> {/* ★bg-green-900からbg-gray-100に変更 */}
      <h1 className="text-2xl font-bold mb-4 text-gray-800">麻雀点数計算機</h1> {/* タイトルを黒文字に */}

      {/* 上部セクション: 場情報とドラ表示牌の選択・一覧 (2カラム) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl mb-6">
        {/* 左側: 場情報と役の有無 */}
        <GameInfoSection
          bakaze={bakaze} setBakaze={setBakaze}
          jikaze={jikaze} setJikaze={setJikaze}
          honba={honba} setHonba={setHonba}
          reachbo={reachbo} setReachbo={setReachbo}
          isTsumo={isTsumo} setIsTsumo={setIsTsumo}
          isRiichi={isRiichi} setIsRiichi={setIsRiichi}
          isDoubleRiichi={isDoubleRiichi} setIsDoubleRiichi={setIsDoubleRiichi}
          isIppatsu={isIppatsu} setIsIppatsu={setIsIppatsu}
          isChankan={isChankan} setIsChankan={setIsChankan}
          isRinshan={isRinshan} setIsRinshan={setIsRinshan}
          isHaitei={isHaitei} setIsHaitei={setIsHaitei}
          isHoutei={isHoutei} setIsHoutei={setIsHoutei}
          isChiiho={isChiiho} setIsChiiho={setIsChiiho}
          isTenho={isTenho} setIsTenho={setIsTenho}
        />

        {/* 右側: ドラ表示牌の選択と一覧 */}
        <div className="flex flex-col gap-6">
          <div className="mb-6 p-4 border rounded-lg bg-white shadow-md w-full text-gray-800">
            <h2 className="text-xl font-semibold mb-2 text-center">ドラ表示牌</h2>
            <button
              onClick={() => setIsDoraModalOpen(true)}
              className="py-2 px-4 rounded-lg font-bold bg-blue-600 hover:bg-blue-700 text-white w-full shadow-md transition-colors duration-200"
            >
              ドラ表示牌を選択・編集
            </button>
            {/* 現在のドラ表示牌一覧はボタンの下に表示 */}
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2 text-center">現在のドラ表示牌</h3>
              <TileSelectionSection
                title=""
                tiles={doraIndicators}
                onTileClick={(tile, index) => removeDoraIndicator(index!)}
                type="hand"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 中間セクション: 牌を選択 (単一カラム) */}
      <TileSelectionSection
        title="牌を選択"
        tiles={mahjongTiles}
        onTileClick={addTileToHand}
        type="available"
      />

      {/* 下部セクション: 手牌、鳴き操作、鳴き（フーロ）一覧 (単一カラムで縦に並ぶ) */}
      <HandDisplaySection
        selectedTiles={selectedTiles}
        remainingHandTilesCount={remainingHandTilesCount}
        selectedForFuro={selectedForFuro}
        onRemoveIndividualTile={(tile, index) => removeTileFromHand(index)}
        isFuroSelectionMode={isFuroSelectionMode}
        selectedFuroTypeToMake={selectedFuroTypeToMake}
        validCandidateTiles={validCandidateTiles}
      />

      <FuroActionButtons
        hasFuro={true}
        selectedForFuro={selectedForFuro}
        onMakeFuro={makeFuroFromSelection}
        onClearFuroSelection={onClearFuroSelection}
        isFuroSelectionMode={isFuroSelectionMode}
        onToggleFuroSelectionMode={handleToggleFuroSelectionMode}
        selectedTiles={selectedTiles}
        furoList={furoList}
        setFuroList={setFuroList}
        selectedFuroTypeToMake={selectedFuroTypeToMake}
        setSelectedFuroTypeToMake={setSelectedFuroTypeToMake}
        possibleMeldCombinations={possibleMeldCombinations}
        onSelectMeldCombination={handleSelectMeldCombination}
        onConfirmFuroSelection={handleConfirmFuroSelection}
        onCancelFuroSelection={handleCancelFuroSelection}
      />

      <TileSelectionSection
        title="鳴き（フーロ）一覧"
        tiles={furoList.flatMap(f => f.tiles)}
        furoList={furoList}
        onTileClick={() => {}}
        type="furo"
        removeFuro={removeFuro}
      />

      {/* ドラ選択モーダル */}
      {isDoraModalOpen && (
        <DoraSelectionModal
          currentDoraIndicators={doraIndicators}
          onConfirm={handleDoraConfirm}
          onClose={() => setIsDoraModalOpen(false)}
        />
      )}
    </main>
  );
}