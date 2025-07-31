import Link from 'next/link';
import React from 'react';

const MenuBar: React.FC = () => (
  <nav className="fixed top-0 left-0 w-full bg-black bg-opacity-70 z-50 flex justify-center py-2 gap-4">
    <Link href="/" className="base-button w-60 text-center text-lg py-4">メニュー</Link>
    <Link href="/calculator" className="base-button w-60 text-center text-lg py-4">点数計算</Link>
    <Link href="/keisanrenshu" className="base-button w-60 text-center text-lg py-4">計算練習</Link>
    {/* <Link href="/nanikiru" className="base-button text-center" style={{minWidth:'120px'}}>何切る</Link> */}
    <Link href="/history" className="base-button w-60 text-center text-lg py-4">履歴</Link>
    <Link href="/list" className="base-button w-60 text-center text-lg py-4">一覧メニュー</Link>
  </nav>
);

export default MenuBar;
