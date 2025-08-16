"use client";
import React from "react";

export default function PracticeFromHistoryPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="calculator-main-title mb-8">練習問題</h1>
      <div className="w-full max-w-sm flex flex-col items-center gap-4">
        <div className="w-full max-w-xl p-4 bg-white rounded shadow flex flex-col items-center justify-center">
          <div className="text-gray-500 text-center py-8">この画面は現在未対応です</div>
          <a href="/" className="base-button w-60 text-center text-lg py-4 mt-2">メニューに戻る</a>
        </div>
      </div>
    </div>
  );
}
