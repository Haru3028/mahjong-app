
"use client";
// mahjong_app_frontend/src/app/page.tsx


import React from 'react';

import MenuButtonList from '../components/MenuButtonList';


const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center calculator-page-main p-8">
      <h1 className="calculator-main-title mb-8">
        メニュー画面
      </h1>
      <MenuButtonList />
    </div>
  );
};

export default HomePage;