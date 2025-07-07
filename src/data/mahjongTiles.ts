// src/data/mahjongTiles.ts

import { MahjongTile } from '../types/mahjong';

export const mahjongTiles: MahjongTile[] = [
  // 萬子 (manzu)
  { id: 'man1', name: '萬子1', type: 'manzu', value: 1, isRedDora: false },
  { id: 'man2', name: '萬子2', type: 'manzu', value: 2, isRedDora: false },
  { id: 'man3', name: '萬子3', type: 'manzu', value: 3, isRedDora: false },
  { id: 'man4', name: '萬子4', type: 'manzu', value: 4, isRedDora: false },
  { id: 'man5', name: '萬子5', type: 'manzu', value: 5, isRedDora: false },
  { id: 'man5_red', name: '赤萬子5', type: 'manzu', value: 5, isRedDora: true }, // 赤ドラ
  { id: 'man6', name: '萬子6', type: 'manzu', value: 6, isRedDora: false },
  { id: 'man7', name: '萬子7', type: 'manzu', value: 7, isRedDora: false },
  { id: 'man8', name: '萬子8', type: 'manzu', value: 8, isRedDora: false },
  { id: 'man9', name: '萬子9', type: 'manzu', value: 9, isRedDora: false },

  // 筒子 (pinzu)
  { id: 'pin1', name: '筒子1', type: 'pinzu', value: 1, isRedDora: false },
  { id: 'pin2', name: '筒子2', type: 'pinzu', value: 2, isRedDora: false },
  { id: 'pin3', name: '筒子3', type: 'pinzu', value: 3, isRedDora: false },
  { id: 'pin4', name: '筒子4', type: 'pinzu', value: 4, isRedDora: false },
  { id: 'pin5', name: '筒子5', type: 'pinzu', value: 5, isRedDora: false },
  { id: 'pin5_red', name: '赤筒子5', type: 'pinzu', value: 5, isRedDora: true }, // 赤ドラ
  { id: 'pin6', name: '筒子6', type: 'pinzu', value: 6, isRedDora: false },
  { id: 'pin7', name: '筒子7', type: 'pinzu', value: 7, isRedDora: false },
  { id: 'pin8', name: '筒子8', type: 'pinzu', value: 8, isRedDora: false },
  { id: 'pin9', name: '筒子9', type: 'pinzu', value: 9, isRedDora: false },

  // 索子 (souzu)
  { id: 'sou1', name: '索子1', type: 'souzu', value: 1, isRedDora: false },
  { id: 'sou2', name: '索子2', type: 'souzu', value: 2, isRedDora: false },
  { id: 'sou3', name: '索子3', type: 'souzu', value: 3, isRedDora: false },
  { id: 'sou4', name: '索子4', type: 'souzu', value: 4, isRedDora: false },
  { id: 'sou5', name: '索子5', type: 'souzu', value: 5, isRedDora: false },
  { id: 'sou5_red', name: '赤索子5', type: 'souzu', value: 5, isRedDora: true }, // 赤ドラ
  { id: 'sou6', name: '索子6', type: 'souzu', value: 6, isRedDora: false },
  { id: 'sou7', name: '索子7', type: 'souzu', value: 7, isRedDora: false },
  { id: 'sou8', name: '索子8', type: 'souzu', value: 8, isRedDora: false },
  { id: 'sou9', name: '索子9', type: 'souzu', value: 9, isRedDora: false },

  // 字牌 (jihai)
  { id: 'ji_ton', name: '東', type: 'jihai', value: 1, isRedDora: false },
  { id: 'ji_nan', name: '南', type: 'jihai', value: 2, isRedDora: false },
  { id: 'ji_sha', name: '西', type: 'jihai', value: 3, isRedDora: false },
  { id: 'ji_pei', name: '北', type: 'jihai', value: 4, isRedDora: false },
  { id: 'ji_haku', name: '白', type: 'jihai', value: 5, isRedDora: false },
  { id: 'ji_hatsu', name: '發', type: 'jihai', value: 6, isRedDora: false },
  { id: 'ji_chun', name: '中', type: 'jihai', value: 7, isRedDora: false },
];