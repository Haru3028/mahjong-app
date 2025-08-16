"use client";
// mahjong_app_frontend/src/app/page.tsx



import React from 'react';
import MenuButtonList from '../components/MenuButtonList';
import { usePlayerCount } from '../context/PlayerCountContext';



const HomePage: React.FC = () => {
  const { playerCount, setPlayerCount } = usePlayerCount();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center calculator-page-main p-8">
      <div className="w-full flex justify-end items-center px-4 py-2">
        <a href="/login" className="base-button text-center text-lg py-2 px-6">ログイン</a>
      </div>
      <h1 className="calculator-main-title mb-8">メニュー画面</h1>
      <MenuButtonList />
    </div>
  );
};

export default HomePage;