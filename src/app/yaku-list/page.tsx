import React from "react";
import Link from 'next/link';
import '../mahjong-theme.css';

// 各翻数ごとの役（日本麻雀プロ協会ルール準拠）
const yakuByHan = {
  1: ["リーチ", "一発", "門前清自摸和", "断么九", "平和", "一盃口", "役牌（自風・場風・三元）", "嶺上開花", "海底摸月", "河底撈魚", "槍槓"],
  2: ["ダブルリーチ", "三色同順", "一気通貫", "混全帯么九", "三色同刻", "三暗刻", "対々和", "三槓子", "混老頭", "小三元", "七対子"],
  3: ["二盃口"],
  4: ["純全帯么九", "混一色"],
  5: ["清一色"],
  6: ["清一色"],
  13: ["国士無双", "四暗刻", "大三元", "字一色", "緑一色", "清老頭", "小四喜", "大四喜", "九蓮宝燈", "四槓子"]
};

const hanSet = Object.keys(yakuByHan).map(h => Number(h));

export default function YakuListPage() {
  return (
    <main className="min-h-screen bg-gray-900 text-white p-6">
      <div className="flex gap-4 mb-6 justify-center">
        <Link href="/" className="base-button bg-gray-700 hover:bg-gray-800 text-yellow-400 font-bold rounded shadow text-center px-6 py-3">メニューに戻る</Link>
        <Link href="/list" className="base-button bg-gray-700 hover:bg-gray-800 text-yellow-400 font-bold rounded shadow text-center px-6 py-3">一覧画面に戻る</Link>
      </div>
      <h1 className="text-3xl font-bold mb-6 text-yellow-400">役一覧</h1>
      <div className="flex flex-wrap gap-4 mb-8 justify-center">
        {hanSet.map(han => (
          <Link key={han} href={`/yaku-list/${han}`} className="base-button bg-yellow-700 hover:bg-yellow-500 text-white font-bold rounded shadow text-center px-8 py-4 text-2xl">
            {han}翻
          </Link>
        ))}
      </div>
    </main>
  );
}
