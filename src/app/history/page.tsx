"use client";

import React, { useState, useEffect } from "react";

type HistoryItem = {
  id: number;
  type: string;
  hand_data?: any;
  result?: any;
  problem?: any;
  user_input?: string;
  correct?: boolean;
  message?: string;
  created_by?: string;
  created_at?: string;
};


export default function HistoryPage() {
  const [view, setView] = useState<"problem" | "calc" | null>(null);
  const [problemHistory, setProblemHistory] = useState<HistoryItem[]>([]);
  const [calcHistory, setCalcHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState<HistoryItem | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch("/api/history")
      .then((res) => res.text())
      .then((text) => {
        if (!text) return [];
        try {
          return JSON.parse(text);
        } catch {
          return [];
        }
      })
      .then((data: HistoryItem[]) => {
        setProblemHistory(data.filter((item) => item.type === "practice"));
        setCalcHistory(data.filter((item) => item.type === "calculation"));
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-8">
      <h1 className="text-3xl font-bold mb-8 text-yellow-400">履歴</h1>
      <a href="/" className="base-button w-60 text-center text-lg py-4 mb-6">メニューに戻る</a>
      <div className="flex gap-6 mb-8">
        <button
          className={`base-button px-6 py-3 text-lg font-bold rounded shadow ${view === "problem" ? "bg-yellow-500" : "bg-gray-700"}`}
          onClick={() => setView("problem")}
        >
          問題履歴
        </button>
        <button
          className={`base-button px-6 py-3 text-lg font-bold rounded shadow ${view === "calc" ? "bg-yellow-500" : "bg-gray-700"}`}
          onClick={() => setView("calc")}
        >
          点数計算履歴
        </button>
      </div>
      {loading && <div className="text-gray-400 mb-4">読み込み中...</div>}
      {view === "problem" && (
        <div className="w-full max-w-xl bg-gray-800 rounded p-4">
          <h2 className="text-xl font-bold mb-4 text-yellow-300">問題履歴</h2>
          {problemHistory.length === 0 ? (
            <div className="text-gray-400">履歴はありません</div>
          ) : (
            <ul>
              {problemHistory.map((item) => (
                <li
                  key={item.id}
                  className={`mb-2 border-b border-gray-600 pb-2 cursor-pointer hover:bg-gray-700 rounded ${selectedProblem?.id === item.id ? "bg-yellow-900/30" : ""}`}
                  onClick={() => setSelectedProblem(item)}
                >
                  <span className="font-mono">
                    {item.problem?.hand || "-"}
                  </span>
                  <span className="ml-4 text-yellow-200">
                    {item.problem?.answer || item.user_input || "-"}
                  </span>
                  {typeof item.correct === "boolean" && (
                    <span className={`ml-4 ${item.correct ? "text-green-400" : "text-red-400"}`}>{item.correct ? "正解" : "不正解"}</span>
                  )}
                  <span className="ml-4 text-xs text-gray-400">{item.created_at?.slice(0, 19).replace("T", " ")}</span>
                </li>
              ))}
            </ul>
          )}
          {/* 詳細表示カード */}
          {selectedProblem && (
            <div className="mt-6 p-4 rounded-lg shadow-lg bg-gray-900 border border-yellow-400">
              <div className="flex items-center mb-2">
                <span className="text-lg font-bold text-yellow-300 mr-2">詳細</span>
                <button className="ml-auto text-xs text-gray-400 hover:text-white" onClick={() => setSelectedProblem(null)}>閉じる</button>
              </div>
              <div className="mb-2"><span className="font-bold text-yellow-200">手牌:</span> <span className="font-mono">{selectedProblem.problem?.hand || "-"}</span></div>
              <div className="mb-2"><span className="font-bold text-yellow-200">状況:</span> {selectedProblem.problem?.situation || "-"}</div>
              <div className="mb-2"><span className="font-bold text-yellow-200">答え:</span> {selectedProblem.problem?.answer || selectedProblem.user_input || "-"}</div>
              <div className="mb-2"><span className="font-bold text-yellow-200">あなたの入力:</span> {selectedProblem.user_input || "-"}</div>
              <div className="mb-2"><span className="font-bold text-yellow-200">正誤:</span> {typeof selectedProblem.correct === "boolean" ? (selectedProblem.correct ? <span className="text-green-400">正解</span> : <span className="text-red-400">不正解</span>) : "-"}</div>
              {selectedProblem.problem?.explanation && (
                <div className="mb-2"><span className="font-bold text-yellow-200">解説:</span> {selectedProblem.problem.explanation}</div>
              )}
              {selectedProblem.problem?.furo && (
                <div className="mb-2"><span className="font-bold text-yellow-200">副露:</span> {selectedProblem.problem.furo}</div>
              )}
              {selectedProblem.problem?.dora && (
                <div className="mb-2"><span className="font-bold text-yellow-200">ドラ:</span> {selectedProblem.problem.dora}</div>
              )}
              {typeof selectedProblem.problem?.han === "number" && (
                <div className="mb-2"><span className="font-bold text-yellow-200">翻:</span> {selectedProblem.problem.han}</div>
              )}
              {typeof selectedProblem.problem?.fu === "number" && (
                <div className="mb-2"><span className="font-bold text-yellow-200">符:</span> {selectedProblem.problem.fu}</div>
              )}
              <div className="mb-2 text-xs text-gray-400">日時: {selectedProblem.created_at?.slice(0, 19).replace("T", " ")}</div>
            </div>
          )}
        </div>
      )}
      {view === "calc" && (
        <div className="w-full max-w-xl bg-gray-800 rounded p-4">
          <h2 className="text-xl font-bold mb-4 text-yellow-300">点数計算履歴</h2>
          {calcHistory.length === 0 ? (
            <div className="text-gray-400">履歴はありません</div>
          ) : (
            <ul>
              {calcHistory.map((item) => (
                <li key={item.id} className="mb-2 border-b border-gray-600 pb-2">
                  <span className="font-mono">
                    {item.hand_data?.hand?.join(" ") || "-"}
                  </span>
                  <span className="ml-4 text-yellow-200">
                    {item.result?.points || item.result?.point_text || "-"}
                  </span>
                  <span className="ml-4 text-xs text-gray-400">{item.created_at?.slice(0, 19).replace("T", " ")}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </main>
  );
}
