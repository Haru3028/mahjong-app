// mahjong_app_frontend/src/app/page.tsx

import Link from 'next/link'; // リンクのためにnext/linkをインポート
import React from 'react';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-12">麻雀アプリ</h1>

      <div className="w-full max-w-sm space-y-6">
        {/* 点数計算・役表示 ボタン */}
        <Link href="/calculator" className="block w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-6 rounded-lg text-center text-xl shadow-md transition duration-300">
          点数計算・役表示
        </Link>

        {/* 計算練習 ボタン */}
        <Link
          href="/keisanrenshu"
          className="block w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-lg text-center text-xl shadow-md transition duration-300"
        >
          計算練習
        </Link>

        {/* 何切る問題 ボタン */}
        <Link
          href="/nanikiru"
          className="block w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-4 px-6 rounded-lg text-center text-xl shadow-md transition duration-300"
        >
          何切る問題
        </Link>

        {/* 履歴 ボタン */}
        <Link
          href="/history"
          className="block w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-4 px-6 rounded-lg text-center text-xl shadow-md transition duration-300"
        >
          履歴
        </Link>

        {/* 一覧 ボタン */}
        <Link
          href="/list"
          className="block w-full bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-6 rounded-lg text-center text-xl shadow-md transition duration-300"
        >
          一覧
        </Link>
      </div>
    </div>
  );
};

export default HomePage;