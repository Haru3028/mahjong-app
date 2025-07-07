// src/data/mahjongTiles.ts

import { MahjongTile, TileType } from '../types/mahjong';

export const mahjongTiles: MahjongTile[] = [
  // 萬子
  { id: 'm1', name: '一萬', src: '/tiles/man1.png', type: 'manzu', value: 1 },
  { id: 'm2', name: '二萬', src: '/tiles/man2.png', type: 'manzu', value: 2 },
  { id: 'm3', name: '三萬', src: '/tiles/man3.png', type: 'manzu', value: 3 },
  { id: 'm4', name: '四萬', src: '/tiles/man4.png', type: 'manzu', value: 4 },
  { id: 'm5', name: '五萬', src: '/tiles/man5.png', type: 'manzu', value: 5 },
  { id: 'm5r', name: '赤五萬', src: '/tiles/man5_red.png', type: 'manzu', value: 5 }, // ★ここを修正
  { id: 'm6', name: '六萬', src: '/tiles/man6.png', type: 'manzu', value: 6 },
  { id: 'm7', name: '七萬', src: '/tiles/man7.png', type: 'manzu', value: 7 },
  { id: 'm8', name: '八萬', src: '/tiles/man8.png', type: 'manzu', value: 8 },
  { id: 'm9', name: '九萬', src: '/tiles/man9.png', type: 'manzu', value: 9 },

  // 筒子
  { id: 'p1', name: '一筒', src: '/tiles/pin1.png', type: 'pinzu', value: 1 },
  { id: 'p2', name: '二筒', src: '/tiles/pin2.png', type: 'pinzu', value: 2 },
  { id: 'p3', name: '三筒', src: '/tiles/pin3.png', type: 'pinzu', value: 3 },
  { id: 'p4', name: '四筒', src: '/tiles/pin4.png', type: 'pinzu', value: 4 },
  { id: 'p5', name: '五筒', src: '/tiles/pin5.png', type: 'pinzu', value: 5 },
  { id: 'p5r', name: '赤五筒', src: '/tiles/pin5_red.png', type: 'pinzu', value: 5 }, // ★ここを修正
  { id: 'p6', name: '六筒', src: '/tiles/pin6.png', type: 'pinzu', value: 6 },
  { id: 'p7', name: '七筒', src: '/tiles/pin7.png', type: 'pinzu', value: 7 },
  { id: 'p8', name: '八筒', src: '/tiles/pin8.png', type: 'pinzu', value: 8 },
  { id: 'p9', name: '九筒', src: '/tiles/pin9.png', type: 'pinzu', value: 9 },

  // 索子
  { id: 's1', name: '一索', src: '/tiles/sou1.png', type: 'souzu', value: 1 },
  { id: 's2', name: '二索', src: '/tiles/sou2.png', type: 'souzu', value: 2 },
  { id: 's3', name: '三索', src: '/tiles/sou3.png', type: 'souzu', value: 3 },
  { id: 's4', name: '四索', src: '/tiles/sou4.png', type: 'souzu', value: 4 },
  { id: 's5', name: '五索', src: '/tiles/sou5.png', type: 'souzu', value: 5 },
  { id: 's5r', name: '赤五索', src: '/tiles/sou5_red.png', type: 'souzu', value: 5 }, // ★ここを修正
  { id: 's6', name: '六索', src: '/tiles/sou6.png', type: 'souzu', value: 6 },
  { id: 's7', name: '七索', src: '/tiles/sou7.png', type: 'souzu', value: 7 },
  { id: 's8', name: '八索', src: '/tiles/sou8.png', type: 'souzu', value: 8 },
  { id: 's9', name: '九索', src: '/tiles/sou9.png', type: 'souzu', value: 9 },

  // 字牌
  { id: 'ton', name: '東', src: '/tiles/ji_ton.png', type: 'jihai', value: 1 },
  { id: 'nan', name: '南', src: '/tiles/ji_nan.png', type: 'jihai', value: 2 },
  { id: 'sha', name: '西', src: '/tiles/ji_shaa.png', type: 'jihai', value: 3 },
  { id: 'pei', name: '北', src: '/tiles/ji_pei.png', type: 'jihai', value: 4 },
  { id: 'haku', name: '白', src: '/tiles/ji_haku.png', type: 'jihai', value: 5 },
  { id: 'hatsu', name: '發', src: '/tiles/ji_hatsu.png', type: 'jihai', value: 6 },
  { id: 'chun', name: '中', src: '/tiles/ji_chun.png', type: 'jihai', value: 7 },
];

export const tilesByType: { [key in TileType]: MahjongTile[] } = {
  manzu: mahjongTiles.filter(tile => tile.type === 'manzu'),
  pinzu: mahjongTiles.filter(tile => tile.type === 'pinzu'),
  souzu: mahjongTiles.filter(tile => tile.type === 'souzu'),
  jihai: mahjongTiles.filter(tile => tile.type === 'jihai'),
};