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
    // カンの数だけ+1（嶺上牌分）
    const kanCount = furoList.filter(f => f.type === 'kan').length;
    return selectedTiles.length + furoList.reduce((acc, furo) => acc + furo.tiles.length, 0) + kanCount;
  }, [selectedTiles.length, furoList]);

  // 残りの手牌の枚数（ツモ上がりを想定して13枚から計算）
  const remainingHandTilesCount = useMemo(() => {
    // カンの数だけ+1（嶺上牌分）
    const kanCount = furoList.filter(f => f.type === 'kan').length;
    if (furoList.length === 0) {
      return 14 - selectedTiles.length;
    }
    return 14 + kanCount - (selectedTiles.length + furoList.reduce((acc, furo) => acc + furo.tiles.length, 0));
  }, [selectedTiles.length, furoList]);

  const addTileToHand = useCallback((tile: MahjongTile) => {
    // 赤ドラのチェックロジックを追加
    if (tile.isRedDora) {
      const redDoraId = tile.id;
      const isRedDoraAlreadyInHand = selectedTiles.filter(t => t.id === redDoraId).length >= 1;
      const isRedDoraAlreadyInFuro = furoList.some(furo =>
        furo.tiles.some(furoTile => furoTile.id === redDoraId)
      );
      if (isRedDoraAlreadyInHand || isRedDoraAlreadyInFuro) {
        alert(`赤ドラ（${tile.name}）は1枚しか使えません。`);
        return;
      }
    }
    // 同じ牌は4枚まで
    const baseId = tile.id.replace('_red', '');
    const countInHand = selectedTiles.filter(t => t.id.replace('_red', '') === baseId).length;
    const countInFuro = furoList.reduce((acc, furo) => acc + furo.tiles.filter(t => t.id.replace('_red', '') === baseId).length, 0);
    if (countInHand + countInFuro >= 4) {
      alert(`${tile.name}は4枚までしか使えません。`);
      return;
    }
    // カンの数だけ最大枚数を増やす
    const kanCount = furoList.filter(f => f.type === 'kan').length;
    if (selectedTiles.length + furoList.reduce((acc, furo) => acc + furo.tiles.length, 0) < 14 + kanCount) {
      setSelectedTiles(prev => [...prev, { ...tile, instanceId: generateInstanceId() }]);
    } else {
      alert(`これ以上牌を追加できません。手牌+副露+カン数=${14 + kanCount}枚までです。`);
    }
  }, [selectedTiles, furoList]);

  const removeTileFromHand = useCallback((index: number) => {
    setSelectedTiles(prev => prev.filter((_, i) => i !== index));
  }, []);


  const makeFuroFromSelection = useCallback((tiles: MahjongTile[], type: FuroType, kanType?: KanType) => {
    if (tiles.length === 0) return;

    const currentHand = [...selectedTiles];
    const furoTilesWithInstanceId: MahjongTile[] = [];

    if (type === 'kan' && kanType === 'kakan') {
      // 加槓: 既存のポン＋手牌から1枚
      let handRemoved = false;
      tiles.forEach(furoTile => {
        const indexToRemove = currentHand.findIndex(handTile =>
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
      tiles.forEach(furoTile => {
        const indexToRemove = currentHand.findIndex(handTile =>
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
    setFuroList(prev => [...prev, { type, tiles: furoTilesWithInstanceId, kanType, furoInstanceId: generateInstanceId() }]);
    // カンの数が増えた場合、合計枚数の上限も増える
  }, [selectedTiles]);

  const removeFuro = useCallback((furoIndex: number) => {
    setFuroList(prev => {
      const newFuroList = prev.filter((_, i) => i !== furoIndex);
      return newFuroList;
    });
  }, []);

  // setHasFuro は不要なため削除
  // const setHasFuro = useCallback((has: boolean) => {
  //   // このフックではfuroListの有無でhasFuroを判断するので、直接setFuroListを操作する必要がある場合に使う
  //   // 現状、外部から直接furoListを変更する必要がない限り、この関数は不要かもしれません。
  // }, []);

  const removeDoraIndicator = useCallback((index: number) => {
    setDoraIndicators(prev => prev.filter((_, i) => i !== index));
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