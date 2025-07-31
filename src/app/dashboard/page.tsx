// mahjong_app_frontend/src/app/page.tsx

import Link from 'next/link';
import React from 'react';

const DashboardPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center calculator-page-main p-8">
      <h1 className="calculator-main-title">麻雀アプリ</h1>
      <div className="w-full max-w-sm space-y-6">
        {/* 計算役表示 ボタン */}
        <Link href="/yakuhyo" legacyBehavior>
          <a className="base-button w-60 text-center text-lg py-4">計算役表示</a>
        </Link>
        {/* 計算練習 ボタン */}
        <Link href="/keisanrenshu" legacyBehavior>
          <a className="base-button w-60 text-center text-lg py-4">計算練習</a>
        </Link>
        {/* 何切る問題 ボタン */}
        <Link href="/nanikiru" legacyBehavior>
          <a className="base-button w-60 text-center text-lg py-4">何切る問題</a>
        </Link>
        {/* 履歴 ボタン */}
        <Link href="/history" legacyBehavior>
          <a className="base-button w-60 text-center text-lg py-4">履歴</a>
        </Link>
        {/* 一覧 ボタン */}
        <Link href="/list" legacyBehavior>
          <a className="base-button w-60 text-center text-lg py-4">一覧</a>
        </Link>
      </div>
    </div>
  );
};

export default DashboardPage;