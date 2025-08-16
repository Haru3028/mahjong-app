// src/app/calculator/page.tsx

"use client"; // クライアントコンポーネントとして宣言

import { useMahjongCalculator } from '../../hooks/useMahjongCalculator';
import { useCalculatorPageLogic } from '../../hooks/useCalculatorPageLogic';
import { mahjongTiles } from '../../data/mahjongTiles';
import { useEffect, useState, useMemo } from 'react';
import { usePlayerCount } from '../../context/PlayerCountContext';


import HandDisplaySection from '../../components/HandDisplaySection';
import FuroActionButtons from '../../components/FuroActionButtons';
import GameInfoSection from '../../components/GameInfoSection';

export default function CalculatorPage() {
  const { playerCount, setPlayerCount, kitaCount, setKitaCount } = usePlayerCount();
  const [dbProblem, setDbProblem] = useState<any>(null);
  useEffect(() => {
    async function fetchProblem() {
      try {
        // 履歴DB（historyテーブル）からのみ出題
        const res = await fetch('/api/review');
        const data = await res.json();
        console.log('API /api/review response:', data); // デバッグ用
        if (data && data.hand) {
          setDbProblem(data);
        } else {
          console.warn('No hand data in API response:', data);
        }
      } catch (e) {
        console.error('API fetch error:', e);
      }
    }
    fetchProblem();
  }, []);
  const mahjongCalculator = useMahjongCalculator();

  const {
    selectedTiles, addTileToHand, /* removeTileFromHand, */ furoList, /* makeFuroFromSelection, */ removeFuro,
    bakaze, setBakaze, jikaze, setJikaze, honba, setHonba, reachbo, setReachbo, remainingHandTilesCount, setFuroList,
    isTsumo, setIsTsumo, doraIndicators, setDoraIndicators, removeDoraIndicator,
    isRiichi, setIsRiichi, isDoubleRiichi, setIsDoubleRiichi, isIppatsu, setIsIppatsu,
    isChankan, setIsChankan, isRinshan, setIsRinshan, isHaitei, setIsHaitei, isHoutei, setIsHoutei,
    isChiiho, setIsChiiho, isTenho, setIsTenho,
    selectedForFuro, setSelectedForFuro,
    isFuroSelectionMode, handleToggleFuroSelectionMode,
    selectedFuroTypeToMake, setSelectedFuroTypeToMake, isRiipaiing,
    onClearFuroSelection, handleHandTileClick, handleConfirmFuroSelection, handleCancelFuroSelection,
    possibleMeldCombinations, validCandidateTiles, 
    handleSelectMeldCombination,
    isCalculateButtonEnabled, handleCalculate,
    setSelectedTiles, // ← 追加
  } = useCalculatorPageLogic({ mahjongCalculator });

  // 新規入力時は手牌を空に初期化
  useEffect(() => {
    if (!dbProblem) {
      setSelectedTiles([]);
    } else if (dbProblem.hand) {
      setSelectedTiles(
        dbProblem.hand
          .map((id: string) => mahjongTiles.find(tile => tile.id === id))
          .filter(Boolean)
      );
    }
  }, [dbProblem, setSelectedTiles, mahjongTiles]);

  const tileCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    selectedTiles.forEach(tile => {
      counts[tile.id] = (counts[tile.id] || 0) + 1;
    });
    doraIndicators.forEach(tile => {
      counts[tile.id] = (counts[tile.id] || 0) + 1;
    });
    furoList.forEach(furo => {
      furo.tiles.forEach(tile => {
        counts[tile.id] = (counts[tile.id] || 0) + 1;
      });
    });
    return counts;
  }, [selectedTiles, doraIndicators, furoList]);

  const handleClearAll = () => {
    if (window.confirm('全ての設定をクリアしますか？')) {
      setSelectedTiles([]);
      setFuroList([]);
      setDoraIndicators([]);
      setBakaze('ton');
      setJikaze('ton');
      setHonba(0);
      setReachbo(0);
      setIsTsumo(false);
      setIsRiichi(false);
      setIsDoubleRiichi(false);
      setIsIppatsu(false);
      setIsChankan(false);
      setIsRinshan(false);
      setIsHaitei(false);
      setIsHoutei(false);
      setIsChiiho(false);
      setIsTenho(false);
    }
  };

  return (
    <>
  <main className="w-full max-w-full pb-32 overflow-y-auto overflow-x-hidden bg-gray-900 text-white flex flex-col items-center">
        {/* ヘッダー */}
        <header className="mb-8 w-full max-w-4xl flex flex-col items-center">
          <button
            onClick={() => window.location.href = '/'}
            className="base-button w-40 text-center text-md py-2 bg-gray-700 hover:bg-gray-800 text-white font-bold rounded-lg shadow mb-4 self-start"
          >
            ← メニューに戻る
          </button>
          <h1 className="text-3xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
            麻雀役計算機
          </h1>
          <div className="mt-2 text-center">
            <span className="inline-block px-4 py-1 bg-blue-800 text-blue-100 rounded-full text-sm font-semibold">現在：履歴から出題中</span>
          </div>
        </header>

        {/* 上部セクション: 場情報とドラ表示牌の選択・一覧 (2カラム) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full max-w-4xl mb-8">
          {/* 左側: 場情報と役の有無 */}
          <div className="flex flex-col gap-6 section-panel">
            {/* 戻るボタンとクリアボタン */}

            <div className="flex justify-between items-center mb-4 gap-4">
              <button
                onClick={handleClearAll}
                className="base-button w-60 text-center text-lg py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow"
              >
                クリア
              </button>
            </div>
            
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
              playerCount={playerCount} setPlayerCount={setPlayerCount}
              kitaCount={kitaCount} setKitaCount={setKitaCount}
              panelClassName="section-panel"
              titleClassName="section-title"
            />
          </div>

          {/* 右側: ドラ表示牌の選択と一覧 */}
          <div className="flex flex-col gap-6 section-panel">
            <div className="section-panel w-full">
              <h2 className="section-title">ドラ表示牌</h2>
              {/* ドラ選択UI（常時表示） */}
              <div className="mb-4">
                <h3 className="text-xl font-semibold mb-3 text-amber-400">現在のドラ表示牌</h3>

              </div>
              <div className="mb-4">
                <h3 className="text-xl font-semibold mb-3 text-amber-400">選択可能な牌</h3>

              </div>
            </div>
          </div>
        </div>

        {/* 中間セクション: 牌を選択 (単一カラム) */}
        <div className="w-full max-w-4xl section-panel">

        </div>

        {/* 理牌中メッセージ */}
        {isRiipaiing && (
          <p className="riipaiing-message">理牌中...</p>
        )}

        {/* 下部セクション: 手牌、鳴き操作、鳴き（フーロ）一覧 */}
        <div className="w-full max-w-4xl space-y-8">
          {/* 手牌表示セクション */}
          <div className="section-panel">
            <div className="flex justify-end mb-2">
              <button
                onClick={() => setSelectedTiles([])}
                className="base-button w-60 text-center text-lg py-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg shadow"
              >
                手牌クリア
              </button>
            </div>
            <HandDisplaySection
              selectedTiles={selectedTiles}
              remainingHandTilesCount={remainingHandTilesCount}
              selectedForFuro={selectedForFuro}
              onRemoveIndividualTile={handleHandTileClick}
              isFuroSelectionMode={isFuroSelectionMode}
              validCandidateTiles={validCandidateTiles}
              isRiipaiing={isRiipaiing}
            />
          </div>

          {/* 鳴き操作セクション */}
          <div className="section-panel">
            <div className="flex justify-end mb-2">
              <button
                onClick={() => setFuroList([])}
                className="base-button w-60 text-center text-lg py-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg shadow"
              >
                フーロクリア
              </button>
            </div>
            <FuroActionButtons
              hasFuro={true}
              selectedForFuro={selectedForFuro}
              setSelectedForFuro={setSelectedForFuro}
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
          </div>

          {/* 鳴き（フーロ）一覧セクション */}
          <div className="section-panel">
            <div className="flex justify-end mb-2">
              <button
                onClick={() => setFuroList([])}
                className="base-button w-60 text-center text-lg py-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg shadow"
              >
                フーロクリア
              </button>
            </div>

          </div>
        </div>

        {/* 計算ボタンを一番下に移動 */}
        <div className="flex justify-center w-full max-w-4xl mt-8 mb-8">
          <div className="flex gap-4 w-full justify-center">
            <button
              onClick={handleCalculate}
              disabled={!isCalculateButtonEnabled}
              className={`base-button px-8 py-4 text-lg ${
                  isCalculateButtonEnabled
                  ? '' 
                  : 'disabled'
              }`}
            >
              計算
            </button>
            <button
              onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
              className="base-button px-8 py-4 text-lg bg-gray-600 hover:bg-gray-700 text-white font-bold rounded-lg shadow ml-4"
              aria-label="一番上に戻る"
            >
              ↑ 一番上へ
            </button>
          </div>
        </div>

      </main>
    </>
  );
}