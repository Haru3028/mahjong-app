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
      .then((data: any) => {
        if (Array.isArray(data)) {
          setProblemHistory(data.filter((item) => item.type === "practice"));
          setCalcHistory(data.filter((item) => item.type === "calculation"));
        } else {
          setProblemHistory([]);
          setCalcHistory([]);
          // 必要ならエラー表示もここで追加可能
        }
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
              {calcHistory.map((item) => {
                let hand = '-';
                let point = '-';
                let yaku = '-';
                let han = '-';
                let fu = '-';
                if (item.result && typeof item.result === 'string') {
                  try {
                    const r = JSON.parse(item.result);
                    if (r.hand) hand = r.hand.join(' ');
                    if (r.pointText || r.points) point = r.pointText || r.points;
                    if (r.yakuList && Array.isArray(r.yakuList)) yaku = r.yakuList.map((y: any) => `${y.name}(${y.han}翻)`).join('、');
                    if (typeof r.han === 'number') han = r.han;
                    if (typeof r.fu === 'number') fu = r.fu;
                  } catch {}
                } else if (item.hand_data?.hand) {
                  hand = item.hand_data.hand.join(' ');
                }
                return (
                  <li key={item.id} className="mb-2 border-b border-gray-600 pb-2 cursor-pointer hover:bg-gray-700 rounded"
                    onClick={() => setSelectedProblem(item)}>
                    <span className="font-mono">{hand}</span>
                    <span className="ml-4 text-yellow-200">{point}</span>
                    <span className="ml-4 text-green-300">{yaku}</span>
                    <span className="ml-2 text-blue-300">{han !== '-' ? `${han}翻` : ''}</span>
                    <span className="ml-2 text-purple-300">{fu !== '-' ? `${fu}符` : ''}</span>
                    <span className="ml-4 text-xs text-gray-400">{item.created_at?.slice(0, 19).replace("T", " ")}</span>
                  </li>
                );
              })}
            </ul>
          )}
        {/* 詳細表示カード（計算履歴も共通で使う） */}
        {selectedProblem && (
          <div className="mt-6 p-4 rounded-lg shadow-lg bg-gray-900 border border-yellow-400">
            <div className="flex items-center mb-2">
              <span className="text-lg font-bold text-yellow-300 mr-2">詳細</span>
              <button className="ml-auto text-xs text-gray-400 hover:text-white" onClick={() => setSelectedProblem(null)}>閉じる</button>
            </div>
            {/* 手牌画像表示（全候補から必ず取得） */}
            <div className="mb-2 flex items-center">
              <span className="font-bold text-yellow-200 mr-2">手牌:</span>
              {(() => {
                let hand: string[] | undefined = undefined;
                // 1. problem.hand
                if (selectedProblem.problem?.hand && Array.isArray(selectedProblem.problem.hand)) hand = selectedProblem.problem.hand;
                // 2. result.hand
                if (!hand && selectedProblem.result && typeof selectedProblem.result === 'string') {
                  try { const r = JSON.parse(selectedProblem.result); if (r.hand && Array.isArray(r.hand)) hand = r.hand; } catch {}
                }
                // 3. hand_data.hand
                if (!hand && selectedProblem.hand_data?.hand && Array.isArray(selectedProblem.hand_data.hand)) hand = selectedProblem.hand_data.hand;
                // 4. problem.tiles
                if (!hand && selectedProblem.problem?.tiles && Array.isArray(selectedProblem.problem.tiles)) hand = selectedProblem.problem.tiles;
                // 5. result.tiles
                if (!hand && selectedProblem.result && typeof selectedProblem.result === 'string') {
                  try { const r = JSON.parse(selectedProblem.result); if (r.tiles && Array.isArray(r.tiles)) hand = r.tiles; } catch {}
                }
                if (hand && hand.length > 0) {
                  return hand.map((tile, idx) => (
                    <img key={idx} src={`/tiles/${tile}.png`} alt={tile} className="inline-block w-8 h-12 mr-1" />
                  ));
                }
                return <span className="font-mono text-red-400">手牌情報未保存</span>;
              })()}
            </div>
            {/* 状況（場風・本場・その他も含めて柔軟に表示） */}
            <div className="mb-2">
              <span className="font-bold text-yellow-200">状況:</span> {(() => {
                // 代表的な状況情報をまとめて表示
                const info: string[] = [];
                const p = selectedProblem.problem || {};
                // 場風
                if (p.bakaze) info.push(`場風: ${p.bakaze}`);
                // 本場
                if (p.honba !== undefined) info.push(`本場: ${p.honba}`);
                // ドラ
                if (p.dora) info.push(`ドラ: ${Array.isArray(p.dora) ? p.dora.join(' ') : p.dora}`);
                // 副露
                if (p.furo) info.push(`副露: ${typeof p.furo === 'string' ? p.furo : JSON.stringify(p.furo)}`);
                // その他
                if (p.situation) info.push(p.situation);
                // resultからも状況を補完
                if (selectedProblem.result && typeof selectedProblem.result === 'string') {
                  try {
                    const r = JSON.parse(selectedProblem.result);
                    if (r.bakaze) info.push(`場風: ${r.bakaze}`);
                    if (r.honba !== undefined) info.push(`本場: ${r.honba}`);
                    if (r.dora) info.push(`ドラ: ${Array.isArray(r.dora) ? r.dora.join(' ') : r.dora}`);
                  } catch {}
                }
                // hand_dataからも状況を補完
                const hd = selectedProblem.hand_data || {};
                if (hd.bakaze) info.push(`場風: ${hd.bakaze}`);
                if (hd.honba !== undefined) info.push(`本場: ${hd.honba}`);
                if (hd.dora) info.push(`ドラ: ${Array.isArray(hd.dora) ? hd.dora.join(' ') : hd.dora}`);
                return info.length ? info.join(' / ') : <span className="text-red-400">状況情報未保存</span>;
              })()}
            </div>
            {/* 役・点数・翻・符 */}
            <div className="mb-2"><span className="font-bold text-yellow-200">役:</span> {(() => {
              // 役はresult > problem > hand_dataの順で探す
              let yakuList: any[] = [];
              if (selectedProblem.result && typeof selectedProblem.result === 'string') {
                try {
                  const r = JSON.parse(selectedProblem.result);
                  if (r.yakuList && Array.isArray(r.yakuList) && r.yakuList.length > 0) {
                    yakuList = r.yakuList;
                  }
                } catch {}
              }
              if (!yakuList.length && selectedProblem.problem?.yakuList && Array.isArray(selectedProblem.problem.yakuList)) {
                yakuList = selectedProblem.problem.yakuList;
              }
              if (!yakuList.length && selectedProblem.hand_data?.yakuList && Array.isArray(selectedProblem.hand_data.yakuList)) {
                yakuList = selectedProblem.hand_data.yakuList;
              }
              return yakuList.length > 0
                ? yakuList.map((y: any) => `${y.name}(${y.han}翻)`).join('、')
                : <span className="text-red-400">役情報未保存</span>;
            })()}</div>
            <div className="mb-2"><span className="font-bold text-yellow-200">点数:</span> {(() => {
              if (selectedProblem.result && typeof selectedProblem.result === 'string') {
                try {
                  const r = JSON.parse(selectedProblem.result);
                  return r.pointText || r.points || '-';
                } catch { return '-'; }
              }
              return '-';
            })()}</div>
            <div className="mb-2"><span className="font-bold text-yellow-200">翻:</span> {(() => {
              if (selectedProblem.result && typeof selectedProblem.result === 'string') {
                try {
                  const r = JSON.parse(selectedProblem.result);
                  return typeof r.han === 'number' ? r.han : '-';
                } catch { return '-'; }
              }
              return '-';
            })()}</div>
            <div className="mb-2"><span className="font-bold text-yellow-200">符:</span> {(() => {
              if (selectedProblem.result && typeof selectedProblem.result === 'string') {
                try {
                  const r = JSON.parse(selectedProblem.result);
                  return typeof r.fu === 'number' ? r.fu : '-';
                } catch { return '-'; }
              }
              return '-';
            })()}</div>
            {/* 入力内容 */}
            {selectedProblem.user_input && (
              <div className="mb-2"><span className="font-bold text-yellow-200">あなたの入力:</span> {selectedProblem.user_input}</div>
            )}
            {/* 答え */}
            {selectedProblem.problem?.answer && (
              <div className="mb-2"><span className="font-bold text-yellow-200">答え:</span> {selectedProblem.problem.answer}</div>
            )}
            {/* 正誤 */}
            {typeof selectedProblem.correct === 'boolean' && (
              <div className="mb-2"><span className="font-bold text-yellow-200">正誤:</span> {selectedProblem.correct ? <span className="text-green-400">正解</span> : <span className="text-red-400">不正解</span>}</div>
            )}
            {/* 解説・副露・ドラ等 */}
            {selectedProblem.problem?.explanation && (
              <div className="mb-2"><span className="font-bold text-yellow-200">解説:</span> {selectedProblem.problem.explanation}</div>
            )}
            {selectedProblem.problem?.furo && (
              <div className="mb-2"><span className="font-bold text-yellow-200">副露:</span> {JSON.stringify(selectedProblem.problem.furo)}</div>
            )}
            {selectedProblem.problem?.dora && (
              <div className="mb-2"><span className="font-bold text-yellow-200">ドラ:</span> {selectedProblem.problem.dora}</div>
            )}
            <div className="mb-2 text-xs text-gray-400">日時: {selectedProblem.created_at?.slice(0, 19).replace("T", " ")}</div>
          </div>
        )}
      </div>
    )}
  </main>
);
}
