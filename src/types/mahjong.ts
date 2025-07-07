// src/types/mahjong.ts

export type MahjongTileType = 'manzu' | 'pinzu' | 'souzu' | 'jihai';
export type Kaze = '東' | '南' | '西' | '北';

export interface MahjongTile {
  id: string; // 牌の種類を識別するID (例: 'm1', 'p5r')
  name: string;
  type: MahjongTileType;
  value: number; // 萬子、筒子、索子の場合は数字、字牌は順に1-7
  isRedDora?: boolean; // 赤ドラかどうか
  src?: string; // 牌の画像パス (表示用)
  instanceId?: string; // 手牌内の各牌インスタンスをユニークに識別するID
}

export type FuroType = 'pon' | 'kan' | 'chi';
export type KanType = 'ankan' | 'minkan' | 'kakan';

export interface Furo {
  type: FuroType;
  tiles: MahjongTile[];
  kanType?: KanType;
}

// 点数計算に必要な場の情報や役の有無
export interface HandContext {
  bakaze: Kaze; // 場風
  jikaze: Kaze; // 自風
  honba: number; // 本場数
  reachbo: number; // リーチ棒の数
  isRiichi: boolean; // リーチしているか
  isDoubleRiichi: boolean; // ダブルリーチしているか
  isIppatsu: boolean; // 一発か
  isChankan: boolean; // 槍槓か
  isRinshan: boolean; // 嶺上開花か
  isHaitei: boolean; // 海底摸月か
  isHoutei: boolean; // 河底撈魚か
  isChiiho: boolean; // 地和か
  isTenho: boolean; // 天和か

  // ★追加: アガリ方とドラ、特殊役に関する情報
  isTsumo: boolean; // ツモアガリか (falseならロンアガリ)
  doraIndicators: MahjongTile[]; // ドラ表示牌のリスト (最大5枚)
}