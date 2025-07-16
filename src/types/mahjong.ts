// src/types/mahjong.ts

export type MahjongTileType = 'manzu' | 'pinzu' | 'souzu' | 'jihai';
export type Kaze = 'ton' | 'nan' | 'shaa' | 'pei'; // 東南西北

export interface MahjongTile {
  id: string; // 例: 'man5', 'man5_red', 'ji_ton'
  name: string; // 例: '萬子5', '赤萬子5', '東'
  type: MahjongTileType;
  value: number; // 数牌の場合は1-9, 字牌の場合は順序 (東1, 南2, ...)
  isRedDora: boolean; // 赤ドラかどうか
  src: string; // 画像ファイルのパス
  instanceId?: string; // 各牌のユニークなインスタンスID (手牌や鳴きで個体を識別するため)
  furoInstanceId?: string; // どの鳴きに属するかを識別するID (鳴き牌の場合)
}

export type FuroType = 'pon' | 'chi' | 'kan';
export type KanType = 'minkan' | 'ankan' | 'kakan'; // 明槓, 暗槓, 加槓

export interface Furo {
  type: FuroType;
  tiles: MahjongTile[];
  kanType?: KanType; // 槓の場合のみ
  furoInstanceId: string; // 各鳴きのユニークなインスタンスID
}

// 他の型定義が必要であればここに追加