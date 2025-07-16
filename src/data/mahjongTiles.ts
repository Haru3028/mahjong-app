// src/data/mahjongTiles.ts

import { MahjongTile } from '../types/mahjong';

export const mahjongTiles: MahjongTile[] = [
  // 萬子 (manzu)
  { id: 'man1', name: '萬子1', type: 'manzu', value: 1, isRedDora: false, src: '/tiles/man1.png' },
  { id: 'man2', name: '萬子2', type: 'manzu', value: 2, isRedDora: false, src: '/tiles/man2.png' },
  { id: 'man3', name: '萬子3', type: 'manzu', value: 3, isRedDora: false, src: '/tiles/man3.png' },
  { id: 'man4', name: '萬子4', type: 'manzu', value: 4, isRedDora: false, src: '/tiles/man4.png' },
  { id: 'man5', name: '萬子5', type: 'manzu', value: 5, isRedDora: false, src: '/tiles/man5.png' },
  { id: 'man5_red', name: '赤萬子5', type: 'manzu', value: 5, isRedDora: true, src: '/tiles/man5_red.png' }, // 赤ドラ
  { id: 'man6', name: '萬子6', type: 'manzu', value: 6, isRedDora: false, src: '/tiles/man6.png' },
  { id: 'man7', name: '萬子7', type: 'manzu', value: 7, isRedDora: false, src: '/tiles/man7.png' },
  { id: 'man8', name: '萬子8', type: 'manzu', value: 8, isRedDora: false, src: '/tiles/man8.png' },
  { id: 'man9', name: '萬子9', type: 'manzu', value: 9, isRedDora: false, src: '/tiles/man9.png' },

  // 筒子 (pinzu)
  { id: 'pin1', name: '筒子1', type: 'pinzu', value: 1, isRedDora: false, src: '/tiles/pin1.png' },
  { id: 'pin2', name: '筒子2', type: 'pinzu', value: 2, isRedDora: false, src: '/tiles/pin2.png' },
  { id: 'pin3', name: '筒子3', type: 'pinzu', value: 3, isRedDora: false, src: '/tiles/pin3.png' },
  { id: 'pin4', name: '筒子4', type: 'pinzu', value: 4, isRedDora: false, src: '/tiles/pin4.png' },
  { id: 'pin5', name: '筒子5', type: 'pinzu', value: 5, isRedDora: false, src: '/tiles/pin5.png' },
  { id: 'pin5_red', name: '赤筒子5', type: 'pinzu', value: 5, isRedDora: true, src: '/tiles/pin5_red.png' }, // 赤ドラ
  { id: 'pin6', name: '筒子6', type: 'pinzu', value: 6, isRedDora: false, src: '/tiles/pin6.png' },
  { id: 'pin7', name: '筒子7', type: 'pinzu', value: 7, isRedDora: false, src: '/tiles/pin7.png' },
  { id: 'pin8', name: '筒子8', type: 'pinzu', value: 8, isRedDora: false, src: '/tiles/pin8.png' },
  { id: 'pin9', name: '筒子9', type: 'pinzu', value: 9, isRedDora: false, src: '/tiles/pin9.png' },

  // 索子 (souzu)
  { id: 'sou1', name: '索子1', type: 'souzu', value: 1, isRedDora: false, src: '/tiles/sou1.png' },
  { id: 'sou2', name: '索子2', type: 'souzu', value: 2, isRedDora: false, src: '/tiles/sou2.png' },
  { id: 'sou3', name: '索子3', type: 'souzu', value: 3, isRedDora: false, src: '/tiles/sou3.png' },
  { id: 'sou4', name: '索子4', type: 'souzu', value: 4, isRedDora: false, src: '/tiles/sou4.png' },
  { id: 'sou5', name: '索子5', type: 'souzu', value: 5, isRedDora: false, src: '/tiles/sou5.png' },
  { id: 'sou5_red', name: '赤索子5', type: 'souzu', value: 5, isRedDora: true, src: '/tiles/sou5_red.png' }, // 赤ドラ
  { id: 'sou6', name: '索子6', type: 'souzu', value: 6, isRedDora: false, src: '/tiles/sou6.png' },
  { id: 'sou7', name: '索子7', type: 'souzu', value: 7, isRedDora: false, src: '/tiles/sou7.png' },
  { id: 'sou8', name: '索子8', type: 'souzu', value: 8, isRedDora: false, src: '/tiles/sou8.png' },
  { id: 'sou9', name: '索子9', type: 'souzu', value: 9, isRedDora: false, src: '/tiles/sou9.png' },

  // 字牌 (jihai)
  { id: 'ji_ton', name: '東', type: 'jihai', value: 1, isRedDora: false, src: '/tiles/ji_ton.png' },
  { id: 'ji_nan', name: '南', type: 'jihai', value: 2, isRedDora: false, src: '/tiles/ji_nan.png' },
  { id: 'ji_sha', name: '西', type: 'jihai', value: 3, isRedDora: false, src: '/tiles/ji_sha.png' },
  { id: 'ji_pei', name: '北', type: 'jihai', value: 4, isRedDora: false, src: '/tiles/ji_pei.png' },
  { id: 'ji_haku', name: '白', type: 'jihai', value: 5, isRedDora: false, src: '/tiles/ji_haku.png' },
  { id: 'ji_hatsu', name: '發', type: 'jihai', value: 6, isRedDora: false, src: '/tiles/ji_hatsu.png' },
  { id: 'ji_chun', name: '中', type: 'jihai', value: 7, isRedDora: false, src: '/tiles/ji_chun.png' },
];