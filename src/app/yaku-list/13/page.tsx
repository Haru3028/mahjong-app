
"use client";
import Link from 'next/link';
import { useState } from 'react';

const yakuList = [
  { name: "国士無双", description: "13種の一九字牌＋任意1枚。" },
  { name: "国士無双十三面待ち", description: "国士無双で13種すべて待ち。" },
  { name: "四暗刻", description: "暗刻4組（単騎待ちでダブル役満）。" },
  { name: "大三元", description: "三元牌3組。" },
  { name: "字一色", description: "字牌のみで構成。" },
  { name: "緑一色", description: "緑牌（發・2・3・4・6・8索）のみで構成。" },
  { name: "清老頭", description: "一九牌のみで構成。" },
  { name: "小四喜", description: "風牌3組＋雀頭。" },
  { name: "大四喜", description: "風牌4組。" },
  { name: "九蓮宝燈", description: "同種の1・9が3枚ずつ＋2～8各1枚。" },
  { name: "純正九蓮宝燈", description: "九蓮宝燈で1・9のいずれかで和了（ダブル役満）。" },
  { name: "四槓子", description: "槓子4組。" },
];

export default function Yaku13Page() {
  const [openIdx, setOpenIdx] = useState<number|null>(null);
  return (
    <main className="min-h-screen bg-gray-900 text-white p-6">
      <Link href="/yaku-list" className="base-button bg-yellow-700 hover:bg-yellow-500 text-white font-bold rounded shadow text-center px-6 py-3 mb-6 inline-block">
        ← 役一覧へ戻る
      </Link>
      <h1 className="text-3xl font-bold mb-6 text-yellow-400">13翻の役（役満）</h1>
      <div className="max-w-xl mx-auto">
        {yakuList.map((yaku, idx) => (
          <div key={idx} className="mb-4">
            <button
              className={`base-button w-full text-left bg-gray-800 hover:bg-yellow-700 text-white font-bold rounded shadow px-4 py-3 text-xl flex justify-between items-center`}
              onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
            >
              <span>{yaku.name}</span>
              <span className="text-yellow-400">{openIdx === idx ? '▲' : '▼'}</span>
            </button>
            {openIdx === idx && (
              <div className="bg-gray-900 border-l-4 border-yellow-400 p-4 text-gray-200 text-base rounded-b shadow">
                {yaku.description}
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
