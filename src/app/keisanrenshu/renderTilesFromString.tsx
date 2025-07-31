import React from "react";
import TileComponent from "@/components/TileComponent";
import { mahjongTiles } from "@/data/mahjongTiles";

// 牌IDの配列またはスペース区切り文字列からTileComponent配列を返す
export function renderTilesFromString(str: any) {
  if (!str) return null;
  let ids: string[] = [];
  if (Array.isArray(str)) {
    ids = str;
  } else if (typeof str === 'string') {
    // JSON配列文字列
    if (str.trim().startsWith('[')) {
      try {
        const arr = JSON.parse(str);
        if (Array.isArray(arr)) ids = arr;
      } catch {}
    }
    // カンマ区切り
    else if (str.includes(',')) {
      ids = str.split(',').map(s => s.trim()).filter(Boolean);
    }
    // スペース区切り
    else {
      ids = str.trim().split(/\s+/);
    }
  }
  if (!ids.length) return null;
  return ids.map((id, i) => {
    const tile = mahjongTiles.find(t => t.id === id);
    if (!tile) return null;
    return <TileComponent key={i} tile={tile} />;
  });
}
