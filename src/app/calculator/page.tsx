// src/app/calculator/page.tsx

"use client"; // クライアントコンポーネントとして宣言

import { useMahjongCalculator } from '../../hooks/useMahjongCalculator';
import { useCalculatorPageLogic } from '../../hooks/useCalculatorPageLogic';
import { mahjongTiles } from '../../data/mahjongTiles';
import React, { useMemo } from 'react';
import Image from 'next/image';

// 分割したコンポーネントをインポート
import TileSelectionSection from '../../components/TileSelectionSection';
import HandDisplaySection from '../../components/HandDisplaySection';
import FuroActionButtons from '../../components/FuroActionButtons';
import GameInfoSection from '../../components/GameInfoSection';

export default function CalculatorPage() {
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

  // 牌ごとの合計枚数を計算
  const tileCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    // 手牌
    selectedTiles.forEach(tile => {
      counts[tile.id] = (counts[tile.id] || 0) + 1;
    });
    // ドラ
    doraIndicators.forEach(tile => {
      counts[tile.id] = (counts[tile.id] || 0) + 1;
    });
    // フーロ
    furoList.forEach(furo => {
      furo.tiles.forEach(tile => {
        counts[tile.id] = (counts[tile.id] || 0) + 1;
      });
    });
    return counts;
  }, [selectedTiles, doraIndicators, furoList]);

  // クリアボタン
  const handleClearAll = () => {
    if (window.confirm('全ての設定をクリアしますか？')) {
      setSelectedTiles([]);
      setFuroList([]);
      setDoraIndicators([]);
      setBakaze('ton'); // '東'→'ton'
      setJikaze('ton'); // '自風'→'ton'（初期値は東）
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
      <main className="calculator-page min-h-screen py-8 px-2 bg-gray-900 text-white flex flex-col items-center overflow-x-hidden">
        {/* ヘッダー */}
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
            麻雀役計算機
          </h1>
        </header>

        {/* 上部セクション: 場情報とドラ表示牌の選択・一覧 (2カラム) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full max-w-4xl mb-8">
          {/* 左側: 場情報と役の有無 */}
          <div className="flex flex-col gap-6">
            {/* 戻るボタンとクリアボタン */}
            <div className="flex justify-between mb-4">
              <button
                onClick={() => window.location.href = '/'}
                className="base-button bg-gray-600 hover:bg-gray-700 text-white font-bold px-6 py-2 rounded-lg shadow h-10"
              >
                戻る
              </button>
              <button
                onClick={handleClearAll}
                className="base-button bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2 rounded-lg shadow h-10"
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
              panelClassName="section-panel"
              titleClassName="section-title"
            />
          </div>

          {/* 右側: ドラ表示牌の選択と一覧 */}
          <div className="flex flex-col gap-6">
            <div className="section-panel w-full">
              <h2 className="section-title">ドラ表示牌</h2>
              {/* ドラ選択UI（常時表示） */}
              <div className="mb-4">
                <h3 className="text-xl font-semibold mb-3 text-amber-400">現在のドラ表示牌</h3>
                <TileSelectionSection
                  title=""
                  tiles={doraIndicators}
                  onTileClick={(tile, index) => removeDoraIndicator(index!)}
                  type="hand"
                />
              </div>
              <div className="mb-4">
                <h3 className="text-xl font-semibold mb-3 text-amber-400">選択可能な牌</h3>
                <TileSelectionSection
                  title=""
                  tiles={mahjongTiles}
                  onTileClick={tile => {
                    // 既に同じ赤ドラがあれば追加不可
                    if (tile.isRedDora && doraIndicators.some(t => t.id === tile.id)) {
                      alert(`赤ドラ（${tile.name}）は1枚しか選択できません。`);
                      return;
                    }
                    // ドラ表示牌＋手牌 合計4枚まで
                    const baseId = tile.id.replace('_red', '');
                    const countInDora = doraIndicators.filter(t => t.id.replace('_red', '') === baseId).length;
                    const countInHand = selectedTiles.filter(t => t.id.replace('_red', '') === baseId).length;
                    if (countInDora + countInHand >= 4) {
                      alert(`${tile.name}はドラ表示牌と手牌を合わせて4枚までしか選択できません。`);
                      return;
                    }
                    // 追加
                    setDoraIndicators([...doraIndicators, { ...tile, instanceId: Math.random().toString(36).substring(2, 11) }]);
                  }}
                  type="available"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 中間セクション: 牌を選択 (単一カラム) */}
        <div className="w-full max-w-4xl">
          <TileSelectionSection
            title="牌を選択"
            tiles={mahjongTiles}
            onTileClick={addTileToHand}
            type="available"
            panelClassName="section-panel"
            titleClassName="section-title"
            handTiles={selectedTiles}
            doraTiles={doraIndicators}
            furoTiles={furoList.flatMap(f => f.tiles)}
            nakiTiles={[]}
          />
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
                className="base-button bg-red-500 hover:bg-red-600 text-white font-bold px-4 py-1 rounded-lg shadow text-sm"
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
                className="base-button bg-red-500 hover:bg-red-600 text-white font-bold px-4 py-1 rounded-lg shadow text-sm"
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
                className="base-button bg-red-500 hover:bg-red-600 text-white font-bold px-4 py-1 rounded-lg shadow text-sm"
              >
                フーロクリア
              </button>
            </div>
            <TileSelectionSection
              title="鳴き（フーロ）一覧"
              tiles={[]}
              furoList={furoList}
              onTileClick={() => {}}
              type="furo"
              removeFuro={removeFuro}
              titleClassName="section-title"
            />
          </div>
        </div>

        {/* 計算ボタンを一番下に移動 */}
        <div className="flex justify-center w-full max-w-4xl mt-8 mb-8">
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
        </div>

        {/* 一番上に戻るボタン */}
        <button
          className="fixed bottom-6 right-6 z-50 shadow-2xl bg-gray-600 hover:bg-gray-700 text-white border-2 border-transparent hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
          style={{minWidth: '48px', minHeight: '48px', borderRadius: '50%'}}
          onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
          aria-label="一番上に戻る"
        >
          ↑
        </button>
      </main>
    </>
  );
}