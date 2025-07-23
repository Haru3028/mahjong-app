// 赤ドラ重複判定（全選択領域対応）
export function isRedTileDuplicatedAll(...tileGroups: string[]): boolean {
  const reds = ["5m_red", "5p_red", "5s_red"];
  const allTiles = tileGroups.flatMap(str => str.trim().split(/\s+/));
  for (const red of reds) {
    if (allTiles.filter(t => t === red).length > 1) return true;
  }
  return false;
}
// 牌ごとの枚数制限バリデーション
export function isTileCountValid(inputStr: string, doraStr: string): boolean {
  const allTiles = [...inputStr.trim().split(/\s+/), ...doraStr.trim().split(/\s+/)].filter(Boolean);
  const tileCount: Record<string, number> = {};
  for (const tile of allTiles) {
    // 通常牌・赤ドラ問わず1種類4枚まで
    tileCount[tile] = (tileCount[tile] || 0) + 1;
    if (tileCount[tile] > 4) return false;
  }
  return true;
}
// 牌画像ID変換・牌文字列描画・赤牌重複判定
import { mahjongTiles } from "../../data/mahjongTiles";
import Image from "next/image";
import React from "react";

export function getTileImageId(tileStr: string): string | null {
  // 赤牌対応: 5m_red, 5p_red, 5s_red
  if (/^5m_red$/.test(tileStr)) return "man5_red";
  if (/^5p_red$/.test(tileStr)) return "pin5_red";
  if (/^5s_red$/.test(tileStr)) return "sou5_red";
  if (/^[1-9]m$/.test(tileStr)) return `man${tileStr[0]}`;
  if (/^[1-9]p$/.test(tileStr)) return `pin${tileStr[0]}`;
  if (/^[1-9]s$/.test(tileStr)) return `sou${tileStr[0]}`;
  if (tileStr === "東") return "ji_ton";
  if (tileStr === "南") return "ji_nan";
  if (tileStr === "西") return "ji_sha";
  if (tileStr === "北") return "ji_pei";
  if (tileStr === "白") return "ji_haku";
  if (tileStr === "發") return "ji_hatsu";
  if (tileStr === "中") return "ji_chun";
  return null;
}
// JSX返却のため.tsx拡張子必須
export function renderTilesFromString(str: string): React.JSX.Element[] {
  const tiles: React.JSX.Element[] = [];
  const regex = /([1-9]+[mps])|([東南西北白發中])/g;
  let match;
  while ((match = regex.exec(str))) {
    if (match[1]) {
      const type = match[1].slice(-1);
      for (const num of match[1].slice(0, -1)) {
        const id = getTileImageId(num + type);
        const tile = mahjongTiles.find((t) => t.id === id);
        tiles.push(
          tile ? (
            <Image
              key={tiles.length}
              src={tile.src}
              alt={id}
              width={28}
              height={42}
              style={{ imageRendering: "auto" }}
            />
          ) : (
            <span key={tiles.length}>{num + type}</span>
          )
        );
      }
    } else if (match[2]) {
      const id = getTileImageId(match[2]);
      const tile = mahjongTiles.find((t) => t.id === id);
      tiles.push(
        tile ? (
          <Image
            key={tiles.length}
            src={tile.src}
            alt={id}
            width={28}
            height={42}
            style={{ imageRendering: "auto" }}
          />
        ) : (
          <span key={tiles.length}>{match[2]}</span>
        )
      );
    }
  }
  return tiles;
}

export function isRedTileDuplicated(inputStr: string, doraStr: string): boolean {
  const reds = ["5m_red", "5p_red", "5s_red"];
  const inputTiles = inputStr.trim().split(/\s+/);
  const doraTiles = doraStr.trim().split(/\s+/);
  for (const red of reds) {
    const inputCount = inputTiles.filter(t => t === red).length;
    const doraCount = doraTiles.filter(t => t === red).length;
    if (inputCount + doraCount > 1) {
      return true;
    }
  }
  return false;
}
