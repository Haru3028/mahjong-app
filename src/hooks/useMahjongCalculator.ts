// src/hooks/useMahjongCalculator.ts

import { useState, useEffect, useCallback, useMemo } from 'react';
import { MahjongTile, Furo, Kaze, FuroType } from '../types/mahjong';
import { mahjongTiles } from '../data/mahjongTiles'; // 全ての牌データを使用

const MAX_TOTAL_TILES = 14;

export const useMahjongCalculator = () => {
  const [selectedTiles, setSelectedTiles] = useState<MahjongTile[]>([]);
  const [furoList, setFuroList] = useState<Furo[]>([]);
  const [hasFuro, setHasFuro] = useState<boolean>(false); // 鳴き機能のON/OFF

  // isFuroModalOpen, activeFuroTile, furoCandidateType は削除

  const [isRiipaiDone, setIsRiipaiDone] = useState(false);
  const [isAnimatingRiipai, setIsAnimatingRiipai] = useState(false);
  const [isWaitingForRiipaiDisplay, setIsWaitingForRiipaiDisplay] = useState(false);

  const [bakaze, setBakaze] = useState<Kaze>('東');
  const [jikaze, setJikaze] = useState<Kaze>('東');
  const [honba, setHonba] = useState<number>(0);
  const [reachbo, setReachbo] = useState<number>(0);
  const [isChankan, setIsChankan] = useState<boolean>(false); // ★ 槍槓のステートを追加

  const remainingHandTilesCount = useMemo(() => {
    const tilesInFuro = furoList.reduce((sum, furo) => sum + furo.tiles.length, 0);
    return MAX_TOTAL_TILES - tilesInFuro;
  }, [furoList]);

  useEffect(() => {
    if (selectedTiles.length > remainingHandTilesCount) {
      setSelectedTiles([]);
      setIsRiipaiDone(false);
      setIsAnimatingRiipai(false);
      setIsWaitingForRiipaiDisplay(false);
    }
  }, [remainingHandTilesCount, selectedTiles.length]);

  useEffect(() => {
    if (!hasFuro) {
      setFuroList([]);
    }
  }, [hasFuro]);

  const doRiipai = useCallback((tiles: MahjongTile[]) => {
    return [...tiles].sort((a, b) => {
      const typeOrder = ['manzu', 'pinzu', 'souzu', 'jihai'];
      const typeA = typeOrder.indexOf(a.type);
      const typeB = typeOrder.indexOf(b.type);

      if (typeA !== typeB) {
        return typeA - typeB;
      }
      if (a.value === 5 && a.id.includes('r') && b.value === 5 && !b.id.includes('r')) {
        return 1;
      }
      if (b.value === 5 && b.id.includes('r') && a.value === 5 && !a.id.includes('r')) {
        return -1;
      }
      return a.value - b.value;
    });
  }, []);

  useEffect(() => {
    if (selectedTiles.length === remainingHandTilesCount && !isRiipaiDone) {
      setIsAnimatingRiipai(true);
      const preRiipaiDelay = setTimeout(() => {
        const sortedHand = doRiipai(selectedTiles);
        setSelectedTiles(sortedHand);
        setIsRiipaiDone(true);
        setIsWaitingForRiipaiDisplay(true);

        const riipaiDuration = setTimeout(() => {
          setIsAnimatingRiipai(false);
          setIsWaitingForRiipaiDisplay(false);
        }, 1500);

        return () => clearTimeout(riipaiDuration);
      }, 500);

      return () => clearTimeout(preRiipaiDelay);
    } else if (selectedTiles.length < remainingHandTilesCount && isRiipaiDone) {
      setIsRiipaiDone(false);
      setIsAnimatingRiipai(false);
      setIsWaitingForRiipaiDisplay(false);
    }
  }, [selectedTiles, isRiipaiDone, remainingHandTilesCount, doRiipai]);

  const countTotalOccurrences = useCallback((
    tileId: string,
    currentHand: MahjongTile[],
    currentFuroList: Furo[]
  ) => {
    const allTiles = [
      ...currentHand,
      ...currentFuroList.flatMap((f) => f.tiles),
    ];
    let count = 0;
    const baseId = tileId.replace('r', '');

    if (baseId.includes('5')) {
      count = allTiles.filter(t => t.id.replace('r', '') === baseId).length;
    } else {
      count = allTiles.filter(t => t.id === tileId).length;
    }
    return count;
  }, []);

  const addTileToHand = useCallback((tileToAdd: MahjongTile) => {
    if (selectedTiles.length >= remainingHandTilesCount) {
      alert(`手牌は${remainingHandTilesCount}枚までしか選択できません。`);
      return;
    }

    if (countTotalOccurrences(tileToAdd.id, selectedTiles, furoList) >= 4) {
      alert(`${tileToAdd.name} は既に4枚選択されています。`);
      return;
    }

    setSelectedTiles(prev => [...prev, tileToAdd]);
  }, [selectedTiles, remainingHandTilesCount, furoList, countTotalOccurrences]);

  const removeTileFromHand = useCallback((indexToRemove: number) => {
    setSelectedTiles(prev => prev.filter((_, index) => index !== indexToRemove));
    setIsRiipaiDone(false);
    setIsAnimatingRiipai(false);
    setIsWaitingForRiipaiDisplay(false);
  }, []);

  const removeFuro = useCallback((indexToRemove: number) => {
    setFuroList(prev => prev.filter((_, index) => index !== indexToRemove));
  }, []);

  const handleHonbaChange = useCallback((increment: number) => {
    setHonba(prev => Math.max(0, prev + increment));
  }, []);

  const handleReachboChange = useCallback((increment: number) => {
    setReachbo(prev => Math.max(0, prev + increment));
  }, []);

  // 手牌の牌がクリックされたときの処理 (シンプルに削除のみ)
  const handleTileClickInHand = useCallback((tile: MahjongTile, index: number) => {
    removeTileFromHand(index);
  }, [removeTileFromHand]);

  // ★ 新しい鳴き（手牌内でのポン・カン）の処理
  // 選択された牌 (3枚または4枚) を受け取り、それを鳴きとして確定させる
  const makeFuroFromSelection = useCallback((
    selectedForFuro: MahjongTile[],
    type: 'pon' | 'kan',
    kanType?: 'ankan' | 'minkan'
  ) => {
    if (!hasFuro) {
      alert('鳴き機能が有効になっていません。');
      return;
    }

    // 重複を避けるために、選択された牌のIDと、それと同じ種類の牌を手牌からすべて取得
    const baseTileId = selectedForFuro[0]?.id.replace('r', '');
    const actualTilesInHand = selectedTiles.filter(t => t.id.replace('r', '') === baseTileId);

    if (type === 'pon' && actualTilesInHand.length < 3) {
      alert('ポンするには同じ牌が3枚必要です。');
      return;
    }
    if (type === 'kan' && actualTilesInHand.length < 4) {
      alert('カンするには同じ牌が4枚必要です。');
      return;
    }

    // 鳴きに追加する牌
    const furoToAdd = actualTilesInHand.slice(0, type === 'pon' ? 3 : 4); // 選択された牌から適切な枚数を取る

    setFuroList(prev => {
      // 暗カンの場合はkanTypeを'ankan'、明カンの場合は'minkan'として扱う
      const newFuro: Furo = { type, tiles: doRiipai(furoToAdd), kanType: type === 'kan' ? kanType || 'ankan' : undefined };
      return [...prev, newFuro];
    });

    // 手牌から鳴きに使用された牌を削除
    let tempTiles = [...selectedTiles];
    furoToAdd.forEach(fTile => {
      const index = tempTiles.findIndex(t => t.id === fTile.id && t.name === fTile.name);
      if (index !== -1) {
        tempTiles.splice(index, 1);
      }
    });
    setSelectedTiles(doRiipai(tempTiles));

    // カンの場合、嶺上牌を一枚追加 (ここでは仮の「東」)
    if (type === 'kan') {
      const r_tile = mahjongTiles.find(tile => tile.id === 'ton');
      if (r_tile) {
        setSelectedTiles(prev => doRiipai([...prev, r_tile]));
      }
    }

  }, [selectedTiles, furoList, doRiipai, hasFuro]); // furoListも依存配列に追加

  // getPossibleFuroTypes は削除

  return {
    selectedTiles,
    setSelectedTiles,
    furoList,
    setFuroList,
    hasFuro,
    setHasFuro,
    isRiipaiDone,
    isAnimatingRiipai,
    isWaitingForRiipaiDisplay,
    bakaze,
    setBakaze,
    jikaze,
    setJikaze,
    honba,
    setHonba,
    reachbo,
    setReachbo,
    isChankan, // ★ 槍槓のステートを公開
    setIsChankan, // ★ 槍槓のセッターを公開
    remainingHandTilesCount,
    addTileToHand,
    removeTileFromHand,
    handleTileClickInHand, // 牌クリック時のハンドラー（削除のみ）
    makeFuroFromSelection, // ★ 手牌内鳴きの新しい関数
    removeFuro,
    handleHonbaChange,
    handleReachboChange,
    doRiipai,
    countTotalOccurrences,
    MAX_TOTAL_TILES,
    // activeFuroTile, setActiveFuroTile, isFuroModalOpen, setIsFuroModalOpen, getPossibleFuroTypes は削除
  };
};