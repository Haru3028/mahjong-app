// src/types/mahjong.ts

export type MahjongTileType = 'manzu' | 'pinzu' | 'souzu' | 'jihai';
export type Kaze = 'ton' | 'nan' | 'shaa' | 'pei'; // 場風・自風の型を明確に定義

export interface MahjongTile {
  id: string; // 例: 'm1', 'r5m', 'ji_ton'
  name: string; // 例: '萬子1', '赤5萬', '東'
  type: MahjongTileType;
  value: number; // 数牌の場合の数値、字牌の場合は識別用数値 (1:東, 2:南...)
  isRedDora: boolean; // 赤ドラかどうか
  src: string; // ★ ここを追加します！画像パスのプロパティです。

  // インスタンスを区別するためのユニークID (手牌やドラ表示牌などで使用)
  instanceId?: string;
  // どのフーロに属しているかを示すID (フーロの削除時に使用)
  furoInstanceId?: string;
}

export type FuroType = 'pon' | 'chi' | 'kan';
export type KanType = 'minkan' | 'ankan' | 'kakan';

export interface Furo {
  type: FuroType;
  tiles: MahjongTile[];
  kanType?: KanType; // カンの種類 (明槓, 暗槓, 加槓)
  furoInstanceId: string; // フーロのインスタンスを区別するID
}