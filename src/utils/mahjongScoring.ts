// src/utils/mahjongScoring.ts
// 麻雀の役判定・点数計算ロジック雛形
import { MahjongTile, Furo } from '../types/mahjong';

export interface YakuResult {
  name: string;
  han: number;
}

export interface ScoreResult {
  yakuList: YakuResult[];
  han: number;
  fu: number;
  pointText: string;
}

/**
 * 役判定・点数計算のメイン関数（仮実装）
 * @param handTiles 手牌
 * @param doraTiles ドラ
 * @param furoList 副露
 * @param bakaze 場風
 * @param jikaze 自風
 * @param isTsumo ツモ和了か
 * @param isOya 親か
 */
export function calculateMahjongScore(
  handTiles: MahjongTile[],
  doraTiles: MahjongTile[],
  furoList: Furo[],
  bakaze: string,
  jikaze: string,
  isTsumo: boolean,
  isOya: boolean
): ScoreResult {
  // TODO: ここに役判定・点数計算ロジックを実装
  // 仮のダミー結果
  return {
    yakuList: [
      { name: '立直', han: 1 },
      { name: '門前清自摸和', han: 1 },
      { name: 'ドラ', han: doraTiles.length },
    ],
    han: 2 + doraTiles.length,
    fu: 40,
    pointText: isTsumo ? (isOya ? '4000オール' : '3000/6000') : '12000',
  };
}

/**
 * Rails APIで役判定・点数計算を行うクライアント関数
 * @param params 計算用パラメータ
 * @returns ScoreResult (APIレスポンス)
 */
export async function fetchMahjongScoreFromRails(params: {
  handTiles: MahjongTile[];
  doraTiles: MahjongTile[];
  furoList: Furo[];
  bakaze: string;
  jikaze: string;
  isTsumo: boolean;
  isOya: boolean;
}): Promise<ScoreResult> {
  const res = await fetch('http://localhost:5000/api/calc_score', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      handTiles: params.handTiles,
      furoList: params.furoList,
      doraIndicators: params.doraTiles,
      isTsumo: params.isTsumo,
      bakaze: params.bakaze,
      jikaze: params.jikaze,
      isRiichi: true, // 仮の値
      isDoubleRiichi: false,
      isIppatsu: false,
      isChankan: false,
      isRinshan: false,
      isHaitei: false,
      isHoutei: false,
      isTenho: false,
      isChiiho: false
    }),
  });
  if (!res.ok) throw new Error('Rails API error');
  return await res.json();
}
