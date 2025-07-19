// mahjong_app_frontend/src/app/page.tsx

import Link from 'next/link';
import React from 'react';


const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center calculator-page-main p-8">
      <h1 className="calculator-main-title mb-8">
        メニュー画面
      </h1>
      <div className="w-full max-w-sm flex flex-col items-center gap-4">
        {/* 点数計算・役表示 ボタン */}
        <Link
          href="/calculator"
          className="base-button w-60 text-center text-lg py-4"
          aria-label="点数計算・役表示"
          tabIndex={0}
        >
          点数計算・役表示
        </Link>

        {/* 計算練習 ボタン */}
        <Link
          href="/keisanrenshu"
          className="base-button w-60 text-center text-lg py-4"
          aria-label="計算練習"
          tabIndex={0}
        >
          計算練習
        </Link>


        {/* 履歴 ボタン */}
        <Link
          href="/history"
          className="base-button w-60 text-center text-lg py-4"
          aria-label="履歴"
          tabIndex={0}
        >
          履歴
        </Link>

        {/* 一覧 ボタン */}
        <Link
          href="/list"
          className="base-button w-60 text-center text-lg py-4"
          aria-label="一覧"
          tabIndex={0}
        >
          一覧
        </Link>


      </div>
    </div>
  );
};

export default HomePage;