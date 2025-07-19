"use client";
import React, { useEffect, useState } from "react";
import { mahjongTiles } from "../../data/mahjongTiles";
import Image from "next/image";

function getTileImageId(tileStr) {
  // 赤牌対応: 5m_red, 5p_red, 5s_red
  if (/^5m_red$/.test(tileStr)) return "man5_red";
  if (/^5p_red$/.test(tileStr)) return "pin5_red";
  if (/^5s_red$/.test(tileStr)) return "sou5_red";
  if (/^[1-9]m$/.test(tileStr)) return `man${tileStr[0]}`;
  if (/^[1-9]p$/.test(tileStr)) return `pin${tileStr[0]}`;
  if (/^[1-9]s$/.test(tileStr)) return `sou${tileStr[0]}`;
  if (tileStr === "東") return "ji_ton";
  if (tileStr === "南") return "ji_nan";
  if (tileStr === "西") return "ji_sha";
  if (tileStr === "北") return "ji_pei";
  if (tileStr === "白") return "ji_haku";
  if (tileStr === "發") return "ji_hatsu";
  if (tileStr === "中") return "ji_chun";
  return null;
}

function renderTilesFromString(str) {
  // 例: "123456m 234p 567s 南南" → 牌ごとに分割して画像表示
  const tiles = [];
  const regex = /([1-9]+[mps])|([東南西北白發中])/g;
  let match;
  while ((match = regex.exec(str))) {
    if (match[1]) {
      // 数牌
      const type = match[1].slice(-1);
      for (const num of match[1].slice(0, -1)) {
        const id = getTileImageId(num + type);
        const tile = mahjongTiles.find((t) => t.id === id);
        tiles.push(
          tile ? (
            <Image
              key={tiles.length}
              src={tile.src}
              alt={id}
              width={28}
              height={42}
              style={{ imageRendering: "auto" }}
            />
          ) : (
            <span key={tiles.length}>{num + type}</span>
          )
        );
      }
    } else if (match[2]) {
      const id = getTileImageId(match[2]);
      const tile = mahjongTiles.find((t) => t.id === id);
      tiles.push(
        tile ? (
          <Image
            key={tiles.length}
            src={tile.src}
            alt={id}
            width={28}
            height={42}
            style={{ imageRendering: "auto" }}
          />
        ) : (
          <span key={tiles.length}>{match[2]}</span>
        )
      );
    }
  }
  return tiles;
}

export default function QuizPage() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    fetch("/api/quiz")
      .then((res) => res.json())
      .then((data) => {
        setQuizzes(data);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <h1 className="text-2xl font-bold mb-6">何切るクイズ</h1>
        <p>読み込み中...</p>
      </main>
    );
  }
  if (quizzes.length === 0) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <h1 className="text-2xl font-bold mb-6">何切るクイズ</h1>
        <p>問題がありません。</p>
        {/* ボタン類は一切表示しない */}
      </main>
    );
  }

  const quiz = quizzes[current];
  const choices = JSON.parse(quiz.choices);

  function handleChoice(idx) {
    setSelected(idx);
    setShowResult(true);
  }

  function handleNext() {
    setSelected(null);
    setShowResult(false);
    setCurrent((prev) => (prev + 1 < quizzes.length ? prev + 1 : 0));
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold mb-6">何切るクイズ</h1>
      {quizzes.length > 0 && (
        <div className="w-full max-w-xl p-4 bg-white rounded shadow">
          <div className="font-semibold mb-2">
            {renderTilesFromString(
              quiz.question.replace(/.*配牌：(.+?)。.*$/, "$1")
            )}
          </div>
          <div className="mb-4">
            {quiz.question.replace(/(.*配牌：.+?。)/, "")}
          </div>
          <div className="flex flex-wrap gap-4 mb-4">
            {choices.map((choice, idx) => {
              const tileId = getTileImageId(choice);
              const tile = mahjongTiles.find((t) => t.id === tileId);
              return (
                <button
                  key={idx}
                  className={`px-2 py-1 border rounded flex items-center gap-1 ${
                    showResult
                      ? idx === quiz.answer
                        ? "bg-green-200"
                        : idx === selected
                        ? "bg-red-200"
                        : ""
                      : "hover:bg-blue-100"
                  }`}
                  onClick={() => !showResult && handleChoice(idx)}
                  disabled={showResult}
                >
                  {tile ? (
                    <Image
                      src={tile.src}
                      alt={choice}
                      width={28}
                      height={42}
                      style={{ imageRendering: "auto" }}
                    />
                  ) : (
                    <span>{choice}</span>
                  )}
                </button>
              );
            })}
          </div>
          {showResult && (
            <div className="mb-2 font-bold text-lg">
              {selected === quiz.answer ? "正解！" : "不正解"}
            </div>
          )}
          {showResult && (
            <div className="mb-2 text-gray-700">
              解説: {quiz.explanation}
            </div>
          )}
          {showResult && (
            <button
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
              onClick={handleNext}
            >
              次の問題
            </button>
          )}
        </div>
      )}
    </main>
  );
}
