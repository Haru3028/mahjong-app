"use client";
import Link from 'next/link';
import { useState } from 'react';

const yakuList = [
  { name: "二盃口（リャンペーコー）", description: "同じ順子2組を2回作る（門前のみ）。" },
  { name: "純全帯么九（ジュンチャン）", description: "すべての面子と雀頭に一九牌を含み、字牌は含まない。鳴くと2翻に減少。" },
  { name: "混一色（ホンイツ）", description: "1種の数牌＋字牌のみで構成。鳴くと2翻に減少。" },
];

export default function Yaku3Page() {
  const [openIdx, setOpenIdx] = useState<number|null>(null);
  return (
    <main className="min-h-screen bg-gray-900 text-white p-6">
      <Link href="/yaku-list" className="base-button bg-yellow-700 hover:bg-yellow-500 text-white font-bold rounded shadow text-center px-6 py-3 mb-6 inline-block">← 役一覧へ戻る</Link>
      <h1 className="text-3xl font-bold mb-6 text-yellow-400">3翻の役</h1>
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
