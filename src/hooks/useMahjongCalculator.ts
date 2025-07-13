// src/hooks/useMahjongCalculator.ts

import { useState, useCallback, useMemo } from 'react';
import { MahjongTile, FuroType, Furo, KanType, Kaze } from '../types/mahjong';
// import { mahjongTiles as allMahjongTiles } from '../data/mahjongTiles';

// インスタンスIDを生成するヘルパー関数
const generateInstanceId = () => Math.random().toString(36).substring(2, 11);

export const useMahjongCalculator = () => {
  const [selectedTiles, setSelectedTiles] = useState<MahjongTile[]>([]);
  const [furoList, setFuroList] = useState<Furo[]>([]);
  const [bakaze, setBakaze] = useState<Kaze>('ton'); // 場風
  const [jikaze, setJikaze] = useState<Kaze>('ton'); // 自風
  const [honba, setHonba] = useState<number>(0); // 本場
  const [reachbo, setReachbo] = useState<number>(0); // リーチ棒

  const [isTsumo, setIsTsumo] = useState<boolean | undefined>(undefined); // ツモ上がりかロン上がりか
  const [doraIndicators, setDoraIndicators] = useState<MahjongTile[]>([]); // ドラ表示牌
  const [isRiichi, setIsRiichi] = useState<boolean>(false); // リーチ
  const [isDoubleRiichi, setIsDoubleRiichi] = useState<boolean>(false); // ダブルリーチ
  const [isIppatsu, setIsIppatsu] = useState<boolean>(false); // 一発
  const [isChankan, setIsChankan] = useState<boolean>(false); // 槍槓
  const [isRinshan, setIsRinshan] = useState<boolean>(false); // 嶺上開花
  const [isHaitei, setIsHaitei] = useState<boolean>(false); // 海底摸月
  const [isHoutei, setIsHoutei] = useState<boolean>(false); // 河底撈魚
  const [isChiiho, setIsChiiho] = useState<boolean>(false); // 地和
  const [isTenho, setIsTenho] = useState<boolean>(false); // 天和

  // 現在の手牌とフーロを合わせた合計枚数
  const totalTilesCount = useMemo(() => {
    const kanCount = furoList.filter((f: Furo) => f.type === 'kan').length;
    return selectedTiles.length + furoList.reduce((acc: number, furo: Furo) => acc + furo.tiles.length, 0) + kanCount;
  }, [selectedTiles.length, furoList]);

  // 残りの手牌の枚数（ツモ上がりを想定して13枚から計算）
  const remainingHandTilesCount = useMemo(() => {
    const kanCount = furoList.filter((f: Furo) => f.type === 'kan').length;
    if (furoList.length === 0) {
      return 14 - selectedTiles.length;
    }
    return 14 + kanCount - (selectedTiles.length + furoList.reduce((acc: number, furo: Furo) => acc + furo.tiles.length, 0));
  }, [selectedTiles.length, furoList]);

  const addTileToHand = useCallback((tile: MahjongTile) => {
    if (tile.isRedDora) {
      const redDoraId = tile.id;
      const isRedDoraAlreadyInHand = selectedTiles.filter((t: MahjongTile) => t.id === redDoraId).length >= 1;
      const isRedDoraAlreadyInFuro = furoList.some((furo: Furo) =>
        furo.tiles.some((furoTile: MahjongTile) => furoTile.id === redDoraId)
      );
      if (isRedDoraAlreadyInHand || isRedDoraAlreadyInFuro) {
        alert(`赤ドラ（${tile.name}）は1枚しか使えません。`);
        return;
      }
    }
    const baseId = tile.id.replace('_red', '');
    const countInHand = selectedTiles.filter((t: MahjongTile) => t.id.replace('_red', '') === baseId).length;
    const countInFuro = furoList.reduce((acc: number, furo: Furo) => acc + furo.tiles.filter((t: MahjongTile) => t.id.replace('_red', '') === baseId).length, 0);
    if (countInHand + countInFuro >= 4) {
      alert(`${tile.name}は4枚までしか使えません。`);
      return;
    }
    const kanCount = furoList.filter((f: Furo) => f.type === 'kan').length;
    if (selectedTiles.length + furoList.reduce((acc: number, furo: Furo) => acc + furo.tiles.length, 0) < 14 + kanCount) {
      setSelectedTiles((prev: MahjongTile[]) => [...prev, { ...tile, instanceId: generateInstanceId() }]);
    } else {
      alert(`これ以上牌を追加できません。手牌+副露+カン数=${14 + kanCount}枚までです。`);
    }
  }, [selectedTiles, furoList]);

  const removeTileFromHand = useCallback((index: number) => {
    setSelectedTiles((prev: MahjongTile[]) => prev.filter((_, i: number) => i !== index));
  }, []);

  const makeFuroFromSelection = useCallback((tiles: MahjongTile[], type: FuroType, kanType?: KanType) => {
    if (tiles.length === 0) return;
    const currentHand = [...selectedTiles];
    const furoTilesWithInstanceId: MahjongTile[] = [];
    if (type === 'kan' && kanType === 'kakan') {
      let handRemoved = false;
      tiles.forEach((furoTile: MahjongTile) => {
        const indexToRemove = currentHand.findIndex((handTile: MahjongTile) =>
          handTile.id === furoTile.id && handTile.isRedDora === furoTile.isRedDora
        );
        if (indexToRemove !== -1 && !handRemoved) {
          furoTilesWithInstanceId.push({ ...currentHand[indexToRemove], instanceId: generateInstanceId() });
          currentHand.splice(indexToRemove, 1);
          handRemoved = true;
        } else {
          furoTilesWithInstanceId.push({ ...furoTile, instanceId: furoTile.instanceId || generateInstanceId() });
        }
      });
    } else {
      tiles.forEach((furoTile: MahjongTile) => {
        const indexToRemove = currentHand.findIndex((handTile: MahjongTile) =>
          handTile.id === furoTile.id && handTile.isRedDora === furoTile.isRedDora
        );
        if (indexToRemove !== -1) {
          furoTilesWithInstanceId.push({ ...currentHand[indexToRemove], instanceId: generateInstanceId() });
          currentHand.splice(indexToRemove, 1);
        } else {
          furoTilesWithInstanceId.push({ ...furoTile, instanceId: furoTile.instanceId || generateInstanceId() });
        }
      });
    }
    setSelectedTiles(currentHand);
    setFuroList((prev: Furo[]) => [...prev, { type, tiles: furoTilesWithInstanceId, kanType, furoInstanceId: generateInstanceId() }]);
  }, [selectedTiles]);

  const removeFuro = useCallback((furoIndex: number) => {
    setFuroList((prev: Furo[]) => {
      const newFuroList = prev.filter((_, i: number) => i !== furoIndex);
      return newFuroList;
    });
  }, []);

  const removeDoraIndicator = useCallback((index: number) => {
    setDoraIndicators((prev: MahjongTile[]) => prev.filter((_, i: number) => i !== index));
  }, []);

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
    setSelectedTiles, // 追加
  };
};