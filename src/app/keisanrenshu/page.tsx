
"use client";
import React, { useState } from "react";
import { sampleProblems, Problem } from "./ProblemList";
import { getTileImageId, renderTilesFromString, isRedTileDuplicated, isTileCountValid } from "./mahjongHelper";

// 問題表示
function ProblemDisplay({ problem }: { problem: Problem }) {
  return (
    <>
      <div className="mb-2 font-semibold">{problem.situation}</div>
      <div className="mb-2 flex flex-row items-center">手牌: {renderTilesFromString(problem.hand)}</div>
    </>
  );
}

// 入力フォーム
function InputForm({ input, setInput, doraInput, setDoraInput, showResult }: {
  input: string;
  setInput: (v: string) => void;
  doraInput: string;
  setDoraInput: (v: string) => void;
  showResult: boolean;
}) {
  // 赤ドラが2枚以上の場合はsetInput/setDoraInputしない
  return (
    <div className="flex flex-row items-center gap-2">
      <input
        type="text"
        value={input}
        onChange={e => {
          const newVal = e.target.value;
          const inputTiles = newVal.trim() ? newVal.trim().split(/\s+/) : [];
          const doraTiles = doraInput.trim() ? doraInput.trim().split(/\s+/) : [];
          if (
            (inputTiles.length + doraTiles.length) <= 4 &&
            isTileCountValid(newVal, doraInput) &&
            !isRedTileDuplicated(newVal, doraInput)
          ) {
            setInput(newVal);
          }
        }}
        placeholder="手牌を入力 (例: 1m)"
        className="border px-2 py-1 rounded"
        disabled={showResult}
      />
      <input
        type="text"
        value={doraInput}
        onChange={e => {
          const newVal = e.target.value;
          const inputTiles = input.trim() ? input.trim().split(/\s+/) : [];
          const doraTiles = newVal.trim() ? newVal.trim().split(/\s+/) : [];
          if (
            (inputTiles.length + doraTiles.length) <= 4 &&
            isTileCountValid(input, newVal) &&
            !isRedTileDuplicated(input, newVal)
          ) {
            setDoraInput(newVal);
          }
        }}
        placeholder="ドラを入力 (例: 5p)"
        className="border px-2 py-1 rounded"
        disabled={showResult}
      />
    </div>
  );
}

// 判定結果
function JudgeResult({ input, problem, showResult }: {
  input: string;
  problem: Problem;
  showResult: boolean;
}) {
  if (!showResult) return null;
  return (
    <>
      <div className="mb-2 font-bold text-lg">
        {input === problem.answer ? "正解！" : "不正解"}
      </div>
      <div className="mb-2 text-gray-700">
        解説: {problem.explanation}
      </div>
    </>
  );
}

// メイン画面
export default function KeisanRenshuPage() {
  const [current, setCurrent] = useState(0);
  const [input, setInput] = useState("");
  const [doraInput, setDoraInput] = useState("");
  const [showResult, setShowResult] = useState(false);
  const problem = sampleProblems[current];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setShowResult(true);
  }
  function handleNext() {
    setInput("");
    setDoraInput("");
    setShowResult(false);
    setCurrent((prev) => (prev + 1 < sampleProblems.length ? prev + 1 : 0));
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center calculator-page-main p-8">
      <h1 className="calculator-main-title mb-8">点数計算練習</h1>
      <div className="w-full max-w-sm flex flex-col items-center gap-4">
        <a href="/" className="base-button text-center text-lg py-2 px-4 mb-4">メニューに戻る</a>
        <div className="w-full max-w-xl p-4 bg-white rounded shadow">
          <ProblemDisplay problem={problem} />
          <form onSubmit={handleSubmit} className="mb-4 flex flex-col items-center justify-center gap-2">
            <InputForm input={input} setInput={setInput} doraInput={doraInput} setDoraInput={setDoraInput} showResult={showResult} />
            <button
              type="submit"
              className="base-button text-center text-lg py-2 px-4 mt-2"
              disabled={showResult}
            >
              判定
            </button>
          </form>
          <JudgeResult input={input} problem={problem} showResult={showResult} />
          {showResult && (
            <button
              className="base-button text-center text-lg py-2 px-4 mt-2"
              onClick={handleNext}
            >
              次の問題
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
