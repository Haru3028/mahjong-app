"use client";
import Link from 'next/link';
import { useState } from 'react';

const yakuList = [
  { name: "リーチ", description: "門前で和了宣言。" },
  { name: "一発", description: "リーチ後1巡以内に和了。" },
  { name: "門前清自摸和（メンゼンツモ）", description: "門前で自摸和了。" },
  { name: "断么九（タンヤオ）", description: "字牌・一九牌を使わない。" },
  { name: "平和（ピンフ）", description: "順子のみ、役牌なし、両面待ち。" },
  { name: "一盃口（イーペーコー）", description: "同じ順子2組。" },
  { name: "役牌（自風・場風・三元牌）", description: "自風・場風・三元牌の刻子または槓子。" },
  { name: "嶺上開花（リンシャンカイホウ）", description: "嶺上牌で和了。" },
  { name: "海底摸月（ハイテイツモ）", description: "海底牌で自摸和了。" },
  { name: "河底撈魚（ホウテイロン）", description: "河底牌でロン和了。" },
  { name: "槍槓（チャンカン）", description: "加槓に対してロン和了。" },
  { name: "ドラ", description: "ドラ表示牌に対応する牌を含む（得点のみ、役ではない）。" },
  { name: "赤ドラ", description: "赤色の5牌を含む（得点のみ、役ではない）。" },
];

export default function Yaku1Page() {
  const [openIdx, setOpenIdx] = useState<number|null>(null);
  return (
    <main className="min-h-screen bg-gray-900 text-white p-6">
      <Link href="/yaku-list" className="base-button bg-yellow-700 hover:bg-yellow-500 text-white font-bold rounded shadow text-center px-6 py-3 mb-6 inline-block">← 役一覧へ戻る</Link>
      <h1 className="text-3xl font-bold mb-6 text-yellow-400">1翻の役</h1>
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
