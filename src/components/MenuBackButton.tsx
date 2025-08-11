"use client";
import React from "react";

export default function MenuBackButton() {
  // Next.js App Router環境でクライアント側のパス取得
  if (typeof window !== "undefined" && window.location.pathname === "/") {
    return null;
  }
  return (
    <button
      onClick={() => (window.location.href = "/")}
      className="fixed top-2 left-2 z-[9999] base-button w-40 text-center text-md py-2 bg-gray-700 hover:bg-gray-800 text-white font-bold rounded-lg shadow"
      style={{ minWidth: 120, maxWidth: '90vw' }}
    >
      ← メニューに戻る
    </button>
  );
}
