"use client";
import React, { useEffect, useState } from "react";

// 入力履歴から練習問題を出すページ
export default function PracticeFromHistoryPage() {
  const [problems, setProblems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [level, setLevel] = useState<string>("all");
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    setLoading(true);
    fetch("/api/input_history")
      .then((res) => res.json())
      .then((data) => {
        // inputValueはJSON文字列なのでパース
        const parsed = data.map((item: any) => ({
          ...item,
          ...JSON.parse(item.inputValue || "{}"),
        }));
        setProblems(parsed);
      })
      .finally(() => setLoading(false));
  }, []);

  // レベルでフィルタ
  const filtered = level === "all" ? problems : problems.filter((p) => p.level === level);
  const problem = filtered[current] || null;

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-bold mb-4">履歴から練習問題</h1>
      <div className="mb-4 flex gap-2">
        <button className={`base-button ${level === "all" ? "bg-blue-400" : ""}`} onClick={() => setLevel("all")}>全て</button>
        <button className={`base-button ${level === "easy" ? "bg-green-400" : ""}`} onClick={() => setLevel("easy")}>初級</button>
        <button className={`base-button ${level === "normal" ? "bg-yellow-400" : ""}`} onClick={() => setLevel("normal")}>中級</button>
        <button className={`base-button ${level === "hard" ? "bg-red-400" : ""}`} onClick={() => setLevel("hard")}>上級</button>
      </div>
      {loading ? (
        <div>読み込み中...</div>
      ) : filtered.length === 0 ? (
        <div>該当する問題がありません</div>
      ) : problem ? (
        <div className="w-full max-w-xl bg-white rounded shadow p-4 mb-4">
          <div className="mb-2 font-semibold">状況: {problem.situation}</div>
          <div className="mb-2">手牌: {problem.hand}</div>
          {problem.furo && <div className="mb-2">副露: {JSON.stringify(problem.furo)}</div>}
          {problem.dora && <div className="mb-2">ドラ: {problem.dora}</div>}
          <div className="mb-2">答え: {problem.answer}</div>
          <div className="mb-2">あなたの入力: {problem.user_input}</div>
          <div className="mb-2">難易度: {problem.level}</div>
          <div className="mb-2">解説: {problem.explanation}</div>
        </div>
      ) : null}
      <div className="flex gap-2">
        <button className="base-button w-60 text-center text-lg py-4" onClick={() => setCurrent((c) => Math.max(0, c - 1))} disabled={current === 0}>前へ</button>
        <button className="base-button w-60 text-center text-lg py-4" onClick={() => setCurrent((c) => Math.min(filtered.length - 1, c + 1))} disabled={current === filtered.length - 1}>次へ</button>
      </div>
      <div className="mt-2 text-sm text-gray-500">{filtered.length > 0 ? `${current + 1} / ${filtered.length}` : "0 / 0"}</div>
    </div>
  );
}
