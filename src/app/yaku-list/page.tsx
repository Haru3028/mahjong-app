import React from "react";
import Link from 'next/link';
import '../mahjong-theme.css';

export default function YakuListPage() {
  return (
    <main className="min-h-screen bg-gray-900 text-white p-6">
      <div className="flex gap-4 mb-6 justify-center">
        <Link href="/" className="base-button bg-gray-700 hover:bg-gray-800 text-yellow-400 font-bold rounded shadow text-center px-6 py-3">メニューに戻る</Link>
        <Link href="/list" className="base-button bg-gray-700 hover:bg-gray-800 text-yellow-400 font-bold rounded shadow text-center px-6 py-3">一覧画面に戻る</Link>
      </div>
      <h1 className="text-3xl font-bold mb-6 text-yellow-400">役一覧</h1>
      <div className="flex flex-wrap gap-4 mb-8 justify-center">
        <Link href="/yaku-list/1" className="base-button bg-yellow-700 hover:bg-yellow-500 text-white font-bold rounded shadow text-center px-8 py-4 text-2xl">1翻役</Link>
        <Link href="/yaku-list/2" className="base-button bg-yellow-700 hover:bg-yellow-500 text-white font-bold rounded shadow text-center px-8 py-4 text-2xl">2翻役</Link>
        <Link href="/yaku-list/3" className="base-button bg-yellow-700 hover:bg-yellow-500 text-white font-bold rounded shadow text-center px-8 py-4 text-2xl">3翻役</Link>
        {/* <Link href="/yaku-list/4" className="base-button bg-yellow-700 hover:bg-yellow-500 text-white font-bold rounded shadow text-center px-8 py-4 text-2xl">4翻役</Link> */}
        <Link href="/yaku-list/5" className="base-button bg-yellow-700 hover:bg-yellow-500 text-white font-bold rounded shadow text-center px-8 py-4 text-2xl">5翻役</Link>
        <Link href="/yaku-list/6" className="base-button bg-yellow-700 hover:bg-yellow-500 text-white font-bold rounded shadow text-center px-8 py-4 text-2xl">6翻役</Link>
        <Link href="/yaku-list/13" className="base-button bg-red-700 hover:bg-red-500 text-white font-bold rounded shadow text-center px-8 py-4 text-2xl">役満・ダブル役満</Link>
      </div>
      <div className="max-w-2xl mx-auto text-sm text-gray-300 text-center">
        <p>※食い下がり（鳴きで翻数が下がる役）は説明欄に記載。重複役は門前時のみ表示。</p>
        <p>ダブル役満は別枠で明記しています。</p>
      </div>
    </main>
  );
}
