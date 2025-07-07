// src/hooks/useMahjongCalculator.ts

import { useState, useEffect, useCallback, useMemo } from 'react';
import { MahjongTile, Furo, Kaze, FuroType, KanType } from '../types/mahjong';
import { mahjongTiles } from '../data/mahjongTiles';

const MAX_TOTAL_TILES = 14; // 面子なしの最大手牌枚数
const MAX_DORA_INDICATORS = 5; // ドラ表示牌の最大枚数 (表ドラ、裏ドラ、カンドラ、カン裏ドラ)

export const useMahjongCalculator = () => {
  const [selectedTiles, setSelectedTiles] = useState<MahjongTile[]>([]); // 現在の手牌
  const [furoList, setFuroList] = useState<Furo[]>([]); // 鳴き（フーロ）のリスト
  const [hasFuro, setHasFuro] = useState<boolean>(false); // 鳴き機能のON/OFF

  // 理牌（牌のソート）に関するステートとアニメーション制御
  const [isRiipaiDone, setIsRiipaiDone] = useState(false);
  const [isAnimatingRiipai, setIsAnimatingRiipai] = useState(false);
  const [isWaitingForRiipaiDisplay, setIsWaitingForRiipaiDisplay] = useState(false);

  // 場情報に関するステート
  const [bakaze, setBakaze] = useState<Kaze>('東'); // 場風
  const [jikaze, setJikaze] = useState<Kaze>('東'); // 自風
  const [honba, setHonba] = useState<number>(0); // 本場数
  const [reachbo, setReachbo] = useState<number>(0); // リーチ棒の数

  // アガリ方とドラ、特殊役に関するステート
  const [isTsumo, setIsTsumo] = useState<boolean>(true); // ツモアガリか (デフォルト: ツモ)
  const [doraIndicators, setDoraIndicators] = useState<MahjongTile[]>([]); // ドラ表示牌
  const [isRiichi, setIsRiichi] = useState<boolean>(false); // リーチしているか
  const [isDoubleRiichi, setIsDoubleRiichi] = useState<boolean>(false); // ダブルリーチしているか
  const [isIppatsu, setIsIppatsu] = useState<boolean>(false); // 一発か
  const [isChankan, setIsChankan] = useState<boolean>(false); // 槍槓か
  const [isRinshan, setIsRinshan] = useState<boolean>(false); // 嶺上開花か
  const [isHaitei, setIsHaitei] = useState<boolean>(false); // 海底摸月か
  const [isHoutei, setIsHoutei] = useState<boolean>(false); // 河底撈魚か
  const [isChiiho, setIsChiiho] = useState<boolean>(false); // 地和か
  const [isTenho, setIsTenho] = useState<boolean>(false); // 天和か


  // 各フーロ（ポン、チー、カン）は、手牌を実質3枚減らすと考える
  // (カンは4枚使うが嶺上牌で1枚補充されるため、手牌の枚数は3枚減)
  const remainingHandTilesCount = useMemo(() => {
    return MAX_TOTAL_TILES - (furoList.length * 3);
  }, [furoList]);

  // 手牌が規定枚数を超えた場合の初期化処理
  useEffect(() => {
    if (selectedTiles.length > remainingHandTilesCount) {
      console.warn("手牌の枚数が許容枚数を超えました。手牌をリセットします。", { selectedTilesLength: selectedTiles.length, remainingHandTilesCount });
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

  // 牌をソートするロジック (理牌)
  const doRiipai = useCallback((tiles: MahjongTile[]) => {
    return [...tiles].sort((a, b) => {
      const typeOrder = ['manzu', 'pinzu', 'souzu', 'jihai'];
      const typeA = typeOrder.indexOf(a.type);
      const typeB = typeOrder.indexOf(b.type);

      if (typeA !== typeB) {
        return typeA - typeB;
      }
      // 赤ドラは通常の5の後ろにソート（任意だが、視覚的に分かりやすくするため）
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
      // 手牌が減ったら理牌状態をリセット
      setIsRiipaiDone(false);
      setIsAnimatingRiipai(false);
      setIsWaitingForRiipaiDisplay(false);
    }
  }, [selectedTiles, isRiipaiDone, remainingHandTilesCount, doRiipai]);

  // 特定の牌が手牌とフーロの合計で何枚あるかをカウント
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
    const baseId = tileId.replace('r', ''); // 赤ドラは通常の5と同じとして扱う

    // 赤ドラと通常の5は同じ牌としてカウント
    if (baseId.includes('5')) {
      count = allTiles.filter(t => t.id.replace('r', '') === baseId).length;
    } else {
      count = allTiles.filter(t => t.id === tileId).length;
    }
    return count;
  }, []);

  // 手牌に牌を追加
  const addTileToHand = useCallback((tileToAdd: MahjongTile) => {
    if (selectedTiles.length >= remainingHandTilesCount) {
      alert(`手牌は${remainingHandTilesCount}枚までしか選択できません。`);
      return;
    }

    // 新しい牌インスタンスを作成し、ユニークなinstanceIdを付与
    const newTileInstance: MahjongTile = {
      ...tileToAdd,
      instanceId: `${tileToAdd.id}-${Date.now()}-${Math.random()}`, // ユニークなIDを生成
    };

    // 同じ牌が4枚以上にならないように制限 (種類と値で判定)
    if (countTotalOccurrences(tileToAdd.id, selectedTiles, furoList) >= 4) {
      alert(`${tileToAdd.name} は既に4枚選択されています。`);
      return;
    }

    setSelectedTiles(prev => [...prev, newTileInstance]); // 新しいインスタンスを追加
  }, [selectedTiles, remainingHandTilesCount, furoList, countTotalOccurrences]);

  // 手牌から牌を削除 (指定されたインデックスの牌)
  const removeTileFromHand = useCallback((indexToRemove: number) => {
    setSelectedTiles(prev => prev.filter((_, index) => index !== indexToRemove));
    setIsRiipaiDone(false); // 牌が減ったら理牌状態をリセット
    setIsAnimatingRiipai(false);
    setIsWaitingForRiipaiDisplay(false);
  }, []);

  // フーロ（鳴き）を削除
  const removeFuro = useCallback((indexToRemove: number) => {
    setFuroList(prev => prev.filter((_, index) => index !== indexToRemove));
  }, []);

  // 本場数を増減
  const handleHonbaChange = useCallback((increment: number) => {
    setHonba(prev => Math.max(0, prev + increment));
  }, []);

  // リーチ棒の数を増減
  const handleReachboChange = useCallback((increment: number) => {
    setReachbo(prev => Math.max(0, prev + increment));
  }, []);

  // 手牌内の選択された牌から鳴き（ポン・カン・チー）を生成する
  const makeFuroFromSelection = useCallback((
    selectedForFuroTiles: MahjongTile[], // 鳴きのためにユーザーが選択した牌の配列
    type: FuroType, // 鳴きの種類 (pon, kan, chi)
    kanType?: KanType // カンの種類 (明槓/暗槓/加槓)
  ) => {
    if (!hasFuro) {
      alert('鳴き機能が有効になっていません。');
      return;
    }

    const firstSelectedTile = selectedForFuroTiles[0];
    if (!firstSelectedTile) {
      alert('鳴きのために牌が選択されていません。');
      return;
    }

    let isValidSelection = false;
    if (type === 'pon' || type === 'kan') {
      // ポン・カンの場合、選択された牌がすべて同じ種類・数値であることを確認
      isValidSelection = selectedForFuroTiles.every(
        t => t.type === firstSelectedTile.type && t.value === firstSelectedTile.value
      );
      if (!isValidSelection) {
        alert('選択された牌がすべて同じ種類・数値ではありません。');
        return;
      }
    } else if (type === 'chi') {
      // チーの場合、順子（例: 1-2-3）になっているかチェック
      if (selectedForFuroTiles.length !== 3) {
        alert('チーするには3枚の牌を選択してください。');
        return;
      }
      const sortedChiTiles = [...selectedForFuroTiles].sort((a, b) => a.value - b.value);
      const isSequence =
        sortedChiTiles[0].type === sortedChiTiles[1].type &&
        sortedChiTiles[1].type === sortedChiTiles[2].type &&
        sortedChiTiles[0].value === sortedChiTiles[1].value - 1 &&
        sortedChiTiles[1].value === sortedChiTiles[2].value - 1;

      if (!isSequence || sortedChiTiles[0].type === 'jihai') { // 字牌は順子にならない
        alert('チーするには連続した数牌3枚を選択してください。');
        return;
      }
      isValidSelection = true;
    }

    // 選択された牌の枚数が、ポン/カン/チーに必要な枚数と一致するか確認
    if (type === 'pon' && selectedForFuroTiles.length !== 3) {
      alert('ポンするには3枚の牌を選択してください。');
      return;
    }
    if (type === 'kan' && selectedForFuroTiles.length !== 4) {
      alert('カンするには4枚の牌を選択してください。');
      return;
    }
    if (type === 'chi' && selectedForFuroTiles.length !== 3) { // チーは3枚
      alert('チーするには3枚の牌を選択してください。');
      return;
    }

    // 手牌に実際に選択された牌が存在するかを正確に確認
    const currentHandTileCounts: { [key: string]: number } = {};
    selectedTiles.forEach(tile => {
        const key = `${tile.type}-${tile.value}`;
        currentHandTileCounts[key] = (currentHandTileCounts[key] || 0) + 1;
    });

    const selectedCounts: { [key: string]: number } = {};
    selectedForFuroTiles.forEach(tile => {
        const key = `${tile.type}-${tile.value}`;
        selectedCounts[key] = (selectedCounts[key] || 0) + 1;
    });

    for (const key in selectedCounts) {
        if ((currentHandTileCounts[key] || 0) < selectedCounts[key]) {
            alert('選択された牌が手牌に不足しています。');
            return;
        }
    }

    setFuroList(prev => {
      const newFuro: Furo = { type, tiles: doRiipai(selectedForFuroTiles), kanType: type === 'kan' ? kanType || 'minkan' : undefined }; // デフォルトをminkanに
      return [...prev, newFuro];
    });

    // 手牌から鳴きに使用された牌を削除
    let tempTiles = [...selectedTiles];
    selectedForFuroTiles.forEach(fTile => {
      // instanceIdを使って、該当する特定の牌インスタンスを削除
      const index = tempTiles.findIndex(t => t.instanceId === fTile.instanceId);
      if (index !== -1) {
        tempTiles.splice(index, 1);
      }
    });
    setSelectedTiles(doRiipai(tempTiles));

    // カンの場合、嶺上牌を一枚追加
    if (type === 'kan') {
      // 仮の嶺上牌として「東」を追加します。実際の麻雀では山から引かれる牌です。
      const rinshanTile = mahjongTiles.find(tile => tile.id === 'ton');
      if (rinshanTile) {
        // 新しいインスタンスとして追加し、ユニークなinstanceIdを付与
        const newRinshanTileInstance: MahjongTile = {
          ...rinshanTile,
          instanceId: `${rinshanTile.id}-${Date.now()}-${Math.random()}`,
        };
        setSelectedTiles(prev => doRiipai([...prev, newRinshanTileInstance]));
      } else {
        console.warn("嶺上牌として追加する牌が見つかりませんでした。");
      }
    }

  }, [selectedTiles, furoList, doRiipai, hasFuro]);

  // ドラ表示牌の追加・削除 (モーダルから一括で更新するため、個別追加・削除は不要に)
  // setDoraIndicators を直接公開する
  const removeDoraIndicator = useCallback((indexToRemove: number) => {
    setDoraIndicators(prev => prev.filter((_, index) => index !== indexToRemove));
  }, []);


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
    isChankan,
    setIsChankan,
    remainingHandTilesCount,
    addTileToHand,
    removeTileFromHand,
    makeFuroFromSelection,
    removeFuro,
    handleHonbaChange,
    handleReachboChange,
    doRiipai,
    countTotalOccurrences,
    MAX_TOTAL_TILES,

    // 新しいステートとセッター
    isTsumo,
    setIsTsumo,
    doraIndicators,
    setDoraIndicators, // ★追加: setDoraIndicators を公開
    removeDoraIndicator, // 個別削除は残しておく
    isRiichi,
    setIsRiichi,
    isDoubleRiichi,
    setIsDoubleRiichi,
    isIppatsu,
    setIsIppatsu,
    isRinshan,
    setIsRinshan,
    isHaitei,
    setIsHaitei,
    isHoutei,
    setIsHoutei,
    isChiiho,
    setIsChiiho,
    isTenho,
    setIsTenho,
  };
};