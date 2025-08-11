
'use client';
import { debugLogProblem } from "./debug_log_problem";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { renderTilesFromString } from "./renderTilesFromString";

// 判定結果
function JudgeResult(props: any) {
  const { input, problem, showResult } = props;
  if (!showResult) return null;
  const isCorrect = input.replace(/点/g, "") === (problem?.answer || "").replace(/点/g, "");
  return (
    <>
      <div className="mb-2 font-bold text-lg">
        {isCorrect ? "正解！" : `不正解（正解: ${problem?.answer}）`}
      </div>
      <div className="mb-2 text-base">
        点数: {problem?.answer}　翻数: {problem?.han ?? "-"}　符数: {problem?.fu ?? "-"}
      </div>
      <div className="mb-2 text-gray-700">
        解説: {problem?.explanation}
      </div>
    </>
  );
}

// 問題表示（手牌・副露・ドラ）
function ProblemDisplay({ problem }: { problem: any }) {
  return (
    <>
      <div className="mb-2 font-semibold">{problem.situation}</div>
      <div className="mb-2 flex flex-row items-center gap-1">
        <span>手牌: </span>
        <div className="flex flex-row items-center gap-1">
          {renderTilesFromString(problem.hand)}
          {(!problem.furo && problem.tsumo) && (
            <span className="flex flex-row items-center gap-1 ml-2">
              {renderTilesFromString(problem.tsumo)}
              <span className="ml-1 text-blue-700 font-bold text-xs whitespace-nowrap">ツモ</span>
            </span>
          )}
        </div>
      </div>
      {problem.furo && (
        <div className="mb-2 flex flex-row items-center">副露: {Array.isArray(problem.furo) ? problem.furo.map((f, i) => (
          <span key={i} className="flex flex-row items-center mr-2">{renderTilesFromString(f.tiles)}</span>
        )) : null}</div>
      )}
      {problem.dora && (
        <div className="mb-2 flex flex-row items-center">ドラ: {renderTilesFromString(problem.dora)}</div>
      )}
    </>
  );
}


// 点数のみ入力フォーム
function PointInputForm({ value, setValue, showResult }: { value: string; setValue: (v: string) => void; showResult: boolean }) {
  return (
    <div className="flex flex-row items-center gap-2">
      <input
        type="text"
        value={value}
        onChange={e => setValue(e.target.value.replace(/[^0-9点]/g, ""))}
        placeholder="点数を入力 (例: 1300点)"
        className="form-input-dark w-full"
        disabled={showResult}
      />
    </div>
  );
}

// --- ここで壊れた関数定義の残骸をすべて削除 ---

export default function KeisanRenshuPage() {
  const searchParams = useSearchParams();
  const [problem, setProblem] = useState<any>(null);
  const [pointInput, setPointInput] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [level, setLevel] = useState<string>(searchParams.get("level") || "easy");
  const [loading, setLoading] = useState(false);

  // 問題取得
  const fetchProblem = async (lv: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/problem?level=${lv}`);
      const data = await res.json();
      setProblem(data);
    } catch (e) {
      setProblem(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const lv = searchParams.get("level") || "easy";
    setLevel(lv);
    fetchProblem(lv);
    setPointInput("");
    setShowResult(false);
    // eslint-disable-next-line
  }, [searchParams.get("level")]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setShowResult(true);

    // 難易度自動判定ロジック
    function estimateLevel(problem: any, userInput: string) {
      // 点数（数字のみ抽出）
      const point = Number((problem.answer || '').replace(/[^0-9]/g, ''));
      const han = Number(problem.han || 0);
      const fu = Number(problem.fu || 0);
      const yaku = (problem.explanation || '') + (problem.situation || '');
      const hasHonba = /本場|[0-9]+本/.test(problem.situation || '');
      const hasReachbo = /リーチ棒|[0-9]+本/.test(problem.situation || '');
      // 満貫点数リスト
      const manganList = [8000, 12000, 16000, 24000, 32000, 48000];
      // 珍しい点数例
      const rarePoints = [1100, 1600, 2900, 5200, 7700, 2000, 3900, 5800, 11600, 23200];

      // 上級: 珍しい点数 or 翻数/符数/役が珍しい
      if (rarePoints.includes(point) || han >= 6 || fu === 70 || fu === 110 || /三色|純全|清一|国士|四暗|大三元|字一色|緑一色|清老頭|四喜和|九蓮|天和|地和/.test(yaku)) {
        return 'hard';
      }
      // 中級: 満貫以下 or リーチ棒・本場で点数が変化
      if ((point < 8000 && !manganList.includes(point)) || hasHonba || hasReachbo) {
        return 'normal';
      }
      // 初級: 満貫以上で点数計算がしやすいもの
      if (manganList.includes(point) && !hasHonba && !hasReachbo) {
        return 'easy';
      }
      // それ以外は中級
      return 'normal';
    }

    (async () => {
      if (problem) {
        try {
          const autoLevel = estimateLevel(problem, pointInput);
          const res = await fetch('/api/input_history', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              inputType: 'keisan_practice',
              inputValue: JSON.stringify({
                hand: problem.hand,
                situation: problem.situation,
                answer: problem.answer,
                explanation: problem.explanation,
                furo: problem.furo,
                dora: problem.dora,
                han: problem.han,
                fu: problem.fu,
                tsumo: problem.tsumo,
                user_input: pointInput,
                level: autoLevel
              })
            }),
          });
          const result = await res.json();
          console.log('input_history保存レスポンス', result);
        } catch (e) {
          console.error('input_history保存エラー', e);
        }
      }
    })();
  }

  // 次の問題ボタン
  function handleNext() {
    fetchProblem(level);
    setPointInput("");
    setShowResult(false);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="calculator-main-title mb-8">点数計算練習</h1>
      <div className="w-full max-w-sm flex flex-col items-center gap-4">
        <div className="w-full max-w-xl p-4 bg-white rounded shadow">
          {loading ? (
            <div className="text-gray-500 text-center py-8">問題を読み込み中...</div>
          ) : problem ? (
            <>
              {/* 問題の状況・手牌・副露・ドラ・ツモをまとめて表示 */}
              <ProblemDisplay problem={problem} />
              <form onSubmit={handleSubmit} className="mb-4 flex flex-col items-center justify-center gap-2">
                <PointInputForm value={pointInput} setValue={setPointInput} showResult={showResult} />
                <button
                  type="submit"
                  className="base-button w-60 text-center text-lg py-4 mt-2"
                  disabled={showResult}
                >
                  判定
                </button>
              </form>
              <JudgeResult input={pointInput} problem={problem} showResult={showResult} />
              <button
                className="base-button w-60 text-center text-lg py-4 mt-2"
                onClick={handleNext}
                disabled={loading}
              >
                次の問題
              </button>
            </>
          ) : (
            <div className="text-red-500 text-center py-8">問題が取得できませんでした</div>
          )}
        </div>
      </div>
    </div>
  );
}
