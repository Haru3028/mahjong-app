"use client";
import Link from 'next/link';

const yakuList = [];

export default function Yaku11Page() {
  return (
    <main className="min-h-screen bg-gray-900 text-white p-6">
      <Link href="/yaku-list" className="text-yellow-400 underline mb-6 inline-block">← 役一覧へ戻る</Link>
      <h1 className="text-3xl font-bold mb-6 text-yellow-400">11翻の役</h1>
      <div className="text-gray-400">該当する役はありません。</div>
    </main>
  );
}
