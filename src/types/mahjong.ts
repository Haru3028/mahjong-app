// src/types/mahjong.ts

export type MahjongTileType = 'manzu' | 'pinzu' | 'souzu' | 'jihai';
export type Kaze = '東' | '南' | '西' | '北';

export interface MahjongTile {
  id: string;
  name: string;
  type: MahjongTileType;
  value: number; // 萬子、筒子、索子の場合は数字、字牌は順に1-7
  isRedDora?: boolean; // 赤ドラかどうか
}

export type FuroType = 'pon' | 'kan' | 'chi'; // chi は手牌内鳴きでは使わないが型定義として残す

export interface Furo {
  type: FuroType;
  tiles: MahjongTile[];
  kanType?: 'ankan' | 'minkan'; // 暗カン、明カン
}

// 槍槓の有無を点数計算に渡すための型
export interface HandContext {
  bakaze: Kaze; // 場風
  jikaze: Kaze; // 自風
  honba: number; // 本場数
  reachbo: number; // リーチ棒の数
  isRiichi: boolean; // リーチしているか
  isDoubleRiichi: boolean; // ダブルリーチしているか
  isIppatsu: boolean; // 一発か
  isChankan: boolean; // 槍槓か (★ 追加)
  isRinshan: boolean; // 嶺上開花か
  isHaitei: boolean; // 海底摸月か
  isHoutei: boolean; // 河底撈魚か
  isChiiho: boolean; // 地和か
  isTenho: boolean; // 天和か
}