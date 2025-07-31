"use client";
import React from "react";
import { useRouter } from "next/navigation";

const classOptions = [
  { key: "easy", label: "初級", color: "bg-green-500" },
  { key: "normal", label: "中級", color: "bg-yellow-500" },
  { key: "hard", label: "上級", color: "bg-red-500" },
  { key: "random", label: "ランダム", color: "bg-blue-500" },
];

export default function ClassSelectPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center calculator-page-main p-8">
      <h1 className="calculator-main-title mb-8">クラス選択</h1>
      <div className="w-full max-w-sm flex flex-col items-center gap-6">
        {classOptions.map((opt) => (
          <button
            key={opt.key}
            className={`base-button w-60 text-center text-lg py-4 font-bold ${opt.color}`}
            onClick={() => router.push(`/keisanrenshu?level=${opt.key}`)}
          >
            {opt.label}
          </button>
        ))}
        <a href="/" className="base-button w-60 text-center text-lg py-4 mt-8">メニューに戻る</a>
      </div>
    </div>
  );
}
