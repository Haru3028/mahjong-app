// src/hooks/useCalculatorPageLogic.ts

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { MahjongTile, FuroType, KanType, Furo, Kaze } from '../types/mahjong';

// useMahjongCalculator の戻り値の型を定義
interface UseMahjongCalculatorReturn {
  selectedTiles: MahjongTile[];
  addTileToHand: (tile: MahjongTile) => void;
  removeTileFromHand: (index: number) => void;
  furoList: Furo[];
  // setHasFuro: (has: boolean) => void; // ここから削除
  makeFuroFromSelection: (tiles: MahjongTile[], type: FuroType, kanType?: KanType) => void;
  removeFuro: (index: number) => void;
  bakaze: Kaze; setBakaze: (kaze: Kaze) => void;
  jikaze: Kaze; setJikaze: (kaze: Kaze) => void;
  honba: number; setHonba: (value: number) => void;
  reachbo: number; setReachbo: (value: number) => void;
  remainingHandTilesCount: number;
  setFuroList: (value: Furo[] | ((prevState: Furo[]) => Furo[])) => void;

  isTsumo: boolean | undefined; setIsTsumo: (checked: boolean) => void;
  doraIndicators: MahjongTile[]; setDoraIndicators: (tiles: MahjongTile[]) => void;
  removeDoraIndicator: (index: number) => void;
  isRiichi: boolean; setIsRiichi: (checked: boolean) => void;
  isDoubleRiichi: boolean; setIsDoubleRiichi: (checked: boolean) => void;
  isIppatsu: boolean; setIsIppatsu: (checked: boolean) => void;
  isChankan: boolean; setIsChankan: (checked: boolean) => void;
  isRinshan: boolean; setIsRinshan: (checked: boolean) => void;
  isHaitei: boolean; setIsHaitei: (checked: boolean) => void;
  isHoutei: boolean; setIsHoutei: (checked: boolean) => void;
  isChiiho: boolean; setIsChiiho: (checked: boolean) => void;
  isTenho: boolean; setIsTenho: (checked: boolean) => void;
  setSelectedTiles: (value: MahjongTile[] | ((prevState: MahjongTile[]) => MahjongTile[])) => void;
}


interface UseCalculatorPageLogicProps {
  mahjongCalculator: UseMahjongCalculatorReturn;
}

export const useCalculatorPageLogic = ({ mahjongCalculator }: UseCalculatorPageLogicProps) => {
  const router = useRouter();

  // useMahjongCalculator から必要なものを展開
  const {
    selectedTiles,
    addTileToHand,
    removeTileFromHand,
    furoList,
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
    setSelectedTiles, // 追加
  } = mahjongCalculator;

  // page.tsx から移動する状態
  const [selectedForFuro, setSelectedForFuro] = useState<MahjongTile[]>([]);
  const [isFuroSelectionMode, setIsFuroSelectionMode] = useState<boolean>(false);
  const [selectedFuroTypeToMake, setSelectedFuroTypeToMake] = useState<FuroType | 'none'>('none');
  const [isDoraModalOpen, setIsDoraModalOpen] = useState<boolean>(false);
  const [isRiipaiing, setIsRiipaiing] = useState(false);

  // 理牌用: 手牌が14枚揃ったら2秒間「理牌中」表示→牌をソートして表示
  useEffect(() => {
    const totalTilesInHandAndFuro = selectedTiles.length + furoList.reduce((acc, furo) => acc + furo.tiles.length, 0);
    if (selectedTiles.length === 14 && totalTilesInHandAndFuro === 14) {
      setIsRiipaiing(true);
      const timer = setTimeout(() => {
        setIsRiipaiing(false);
        // 手牌を種類・数字順で自動整列
        const sorted = [...selectedTiles].sort((a, b) => {
          const typeOrder = { manzu: 0, pinzu: 1, souzu: 2, jihai: 3 };
          if (a.type !== b.type) return typeOrder[a.type] - typeOrder[b.type];
          if (a.type === 'jihai' && b.type === 'jihai') return a.value - b.value;
          return a.value - b.value;
        });
        if (JSON.stringify(sorted.map(t=>t.id)) !== JSON.stringify(selectedTiles.map(t=>t.id))) {
          setSelectedTiles(sorted);
        }
      }, 2000); // 2秒に変更
      return () => clearTimeout(timer);
    } else {
      setIsRiipaiing(false);
    }
  }, [selectedTiles, furoList, setSelectedTiles]);

  const handleToggleFuroSelectionMode = useCallback(() => {
    setIsFuroSelectionMode((prev: boolean) => !prev);
    setSelectedForFuro([]);
    setSelectedFuroTypeToMake('none');
  }, []);

  const onClearFuroSelection = useCallback(() => {
    setSelectedForFuro([]);
  }, []);

  const handleHandTileClick = useCallback((tile: MahjongTile, index: number) => {
    if (!isFuroSelectionMode) {
      removeTileFromHand(index);
    } else {
      const isSelected = selectedForFuro.some((t: MahjongTile) => t.instanceId === tile.instanceId);
      if (isSelected) {
        setSelectedForFuro((prev: MahjongTile[]) => prev.filter((t: MahjongTile) => t.instanceId !== tile.instanceId));
      } else {
        setSelectedForFuro((prev: MahjongTile[]) => [...prev, tile]);
      }
    }
  }, [isFuroSelectionMode, removeTileFromHand, selectedForFuro]);


  // 鳴き候補画像クリック→確定で鳴きが成立するように修正済み
  const handleConfirmFuroSelection = useCallback((type: FuroType, kanType?: KanType) => {
    if (selectedForFuro.length === 0) {
      alert('鳴きに使う牌の組み合わせを選択してください。');
      return;
    }
    // 鳴きの形をmakeFuroFromSelectionで確定
    if (type === 'kan' && kanType === 'kakan') {
      const selectedTileForKakan = selectedForFuro.find((t: MahjongTile) => !furoList.some((f: Furo) => f.tiles.some((ft: MahjongTile) => ft.instanceId === t.instanceId)));
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
    const handTilesLocal = [...selectedTiles];

    const getHandCounts = (tiles: MahjongTile[]) => {
      const counts = new Map<string, MahjongTile[]>();
      tiles.forEach(tile => {
        // const baseId = tile.id.replace('r', '');
        if (!counts.has(tile.id)) {
          counts.set(tile.id, []);
        }
        counts.get(tile.id)?.push(tile);
      });
      return counts;
    };

    const currentHandCounts = getHandCounts(handTilesLocal);

    if (selectedFuroTypeToMake === 'pon') {
      currentHandCounts.forEach((tiles /*, baseId */) => {
        if (tiles.length >= 3) {
          combinations.push(tiles.slice(0, 3));
        }
      });
    } else if (selectedFuroTypeToMake === 'chi') {
      const numberTiles = handTilesLocal.filter(t => t.type !== 'jihai').sort((a, b) => {
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
      currentHandCounts.forEach((tiles /*, baseId */) => {
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
      // インスタンスIDではなく、牌のIDと赤ドラかどうかでユニーク性を判断
      const sortedCombIds = [...comb].sort((a, b) => {
        const idA = a.id.replace('r', ''); // 赤ドラの 'r' を削除して比較
        const idB = b.id.replace('r', '');
        if (idA !== idB) return idA.localeCompare(idB);
        return (a.isRedDora ? 1 : 0) - (b.isRedDora ? 1 : 0);
      }).map(t => `${t.id}-${t.isRedDora}`).join(',');

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
    possibleMeldCombinations.forEach((combination: MahjongTile[]) => {
      combination.forEach((tile: MahjongTile) => {
        if (tile.instanceId) {
          tileInstanceIds.add(tile.instanceId);
        }
      });
    });
    return selectedTiles.filter(tile => tile.instanceId && tileInstanceIds.has(tile.instanceId));
  }, [selectedTiles, possibleMeldCombinations]);


  // --- 追加: 鳴き候補選択用 ---
  const handleSelectMeldCombination = useCallback((combination: MahjongTile[]) => {
    setSelectedForFuro(combination);
  }, []);

  // --- 追加: ドラ選択確定 ---
  const handleDoraConfirm = useCallback((selectedDora: MahjongTile[]) => {
    setDoraIndicators(selectedDora);
    setIsDoraModalOpen(false);
  }, [setDoraIndicators]);

  // 鳴き候補が1つだけなら自動で選択状態にする
  useEffect(() => {
    if (isFuroSelectionMode && possibleMeldCombinations.length === 1) {
      setSelectedForFuro(possibleMeldCombinations[0]);
    }
  }, [isFuroSelectionMode, possibleMeldCombinations, setSelectedForFuro]);

  return {
    selectedTiles,
    addTileToHand,
    removeTileFromHand,
    furoList,
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
    selectedForFuro, setSelectedForFuro,
    isFuroSelectionMode, handleToggleFuroSelectionMode,
    selectedFuroTypeToMake, setSelectedFuroTypeToMake,
    isDoraModalOpen, setIsDoraModalOpen,
    isRiipaiing,
    onClearFuroSelection,
    handleHandTileClick,
    handleConfirmFuroSelection,
    handleCancelFuroSelection,
    possibleMeldCombinations,
    validCandidateTiles,
    handleSelectMeldCombination,
    handleDoraConfirm,
    isCalculateButtonEnabled: selectedTiles.length + furoList.reduce((sum, furo) => sum + furo.tiles.length, 0) === 14, // 14枚揃った時のみ有効
    handleGoBack: () => {}, // 必要に応じて実装
    handleCalculate: async () => {
      try {
        console.log('🎯 計算開始');
        // 手牌数チェック
        const totalHandTiles = selectedTiles.length + furoList.reduce((sum, furo) => sum + furo.tiles.length, 0);
        console.log(`📊 牌数チェック: 手牌${selectedTiles.length}枚 + 鳴き${furoList.reduce((sum, furo) => sum + furo.tiles.length, 0)}枚 = ${totalHandTiles}枚`);
        if (totalHandTiles !== 14) {
          alert(`手牌が${totalHandTiles}枚です。14枚になるように牌を選択してください。\n（現在: 手牌${selectedTiles.length}枚 + 鳴き${furoList.reduce((sum, furo) => sum + furo.tiles.length, 0)}枚 = ${totalHandTiles}枚）`);
          return;
        }
        // 必須フィールドの検証
        if (selectedTiles.length === 0) {
          alert('手牌が選択されていません。');
          return;
        }
        if (isTsumo === undefined) {
          alert('ツモかロンかを選択してください。');
          return;
        }
        // Ruby APIの期待する形式に合わせてデータを準備
        const handData = {
          hand: selectedTiles.map(tile => tile.id),
          bakaze: bakaze,
          jikaze: jikaze,
          dora_indicators: doraIndicators.map(tile => tile.id),
          furo: furoList.map(furo => ({
            type: furo.type,
            tiles: furo.tiles.map(tile => tile.id)
          })),
          is_tsumo: isTsumo || false,
          is_riichi: isRiichi,
          is_double_riichi: isDoubleRiichi,
          is_ippatsu: isIppatsu,
          is_chankan: isChankan,
          is_rinshan: isRinshan,
          is_haitei: isHaitei,
          is_houtei: isHoutei,
          is_chiiho: isChiiho,
          is_tenho: isTenho,
          honba: honba,
          winning_tile: selectedTiles.length > 0 ? selectedTiles[selectedTiles.length - 1].id : '',
          prevalent_wind: bakaze,
          seat_wind: jikaze
        };
        console.log('📤 送信データ:', JSON.stringify(handData, null, 2));
        // Next.jsのAPIルートに送信
        const response = await fetch('/api/calc_score', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(handData)
        });
        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }
        const result = await response.json();
        console.log('📥 API受信データ:', result);
        // APIレスポンス形式に対応
        const formattedResult = {
          valid: result.valid && result.total_han > 0,
          points: result.point_text || '0点',
          han: result.total_han || 0,
          fu: result.fu || 0,
          yaku: result.valid && result.yaku_list ? result.yaku_list : [],
          error: result.valid ? undefined : (result.error || '計算に失敗しました')
        };
        console.log('🎯 整形後結果:', formattedResult);

        // --- 履歴APIに保存 ---
        try {
          await fetch('/api/history', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'calculation',
              handData,
              result: formattedResult
            })
          });
        } catch (e) {
          console.warn('履歴保存失敗', e);
        }
        // --- 履歴API保存ここまで ---

        // 結果をクエリパラメータとして結果ページに渡す
        const searchParams = new URLSearchParams({
          result: JSON.stringify(formattedResult),
          handData: JSON.stringify(handData)
        });
        console.log('🔗 リダイレクト先:', `/calculator/result?${searchParams.toString()}`);
        router.push(`/calculator/result?${searchParams.toString()}`);
      } catch (error) {
        console.error('❌ 計算エラー:', error);
        // エラー時もとりあえず結果画面に遷移してエラー表示
        const errorResult = {
          valid: false,
          points: '0点',
          han: 0,
          fu: 0,
          yaku: [],
          error: `計算エラー: ${error instanceof Error ? error.message : 'Unknown error'}`
        };
        const handData = {
          hand: selectedTiles.map(tile => tile.id),
          is_tsumo: isTsumo || false,
          bakaze: bakaze,
          jikaze: jikaze,
          winning_tile: selectedTiles.length > 0 ? selectedTiles[selectedTiles.length - 1].id : ''
        };
        // --- 履歴APIにエラーも保存 ---
        try {
          await fetch('/api/history', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'calculation',
              handData,
              result: errorResult
            })
          });
        } catch (e) {
          console.warn('履歴保存失敗', e);
        }
        // --- 履歴API保存ここまで ---
        const searchParams = new URLSearchParams({
          result: JSON.stringify(errorResult),
          handData: JSON.stringify(handData)
        });
        router.push(`/calculator/result?${searchParams.toString()}`);
      }
    },
    setSelectedTiles,
  };
}