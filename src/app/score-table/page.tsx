"use client";
import React, { useState } from "react";
import '../mahjong-theme.css';

const scoreTable = [
  { han: 1, fu: 30, child: "1000", parent: "1500" },
  { han: 1, fu: 40, child: "1300", parent: "2000" },
  { han: 2, fu: 30, child: "2000", parent: "2900" },
  { han: 2, fu: 40, child: "2600", parent: "3900" },
  { han: 3, fu: 30, child: "3900", parent: "5800" },
  { han: 3, fu: 40, child: "5200", parent: "7700" },
  { han: 4, fu: 30, child: "7700", parent: "11600" },
  { han: 4, fu: 40, child: "8000", parent: "12000" },
  { han: 5, fu: "満貫", child: "8000", parent: "12000" },
  { han: 6, fu: "跳満", child: "12000", parent: "18000" },
  { han: 8, fu: "倍満", child: "16000", parent: "24000" },
  { han: 11, fu: "三倍満", child: "24000", parent: "36000" },
  { han: 13, fu: "役満", child: "32000", parent: "48000" },
];

export default function ScoreTablePage() {
  const fus = [20, 25, 30, 40, 50, 60, 70, 80, 90, 100, 110];
  const hans = [1, 2, 3, 4];
  const scoreMatrix = {
    ko: {
      tsumo: {
        20: ["400/700", "700/1300", "1300/2600", "2600/5200"],
        25: ["500/800", "800/1600", "1600/3200", "3200/6400"],
        30: ["500/1000", "1000/2000", "2000/3900", "3900/7700"],
        40: ["700/1300", "1300/2600", "2600/5200", "5200/10400"],
        50: ["800/1600", "1600/3200", "3200/6400", "6400/12800"],
        60: ["1000/2000", "2000/3900", "3900/7700", "7700/15300"],
        70: ["1200/2300", "2300/4500", "4500/9000", "9000/18000"],
        80: ["1300/2600", "2600/5200", "5200/10400", "10400/20800"],
        90: ["1500/2900", "2900/5800", "5800/11600", "11600/23200"],
        100: ["1600/3200", "3200/6400", "6400/12800", "12800/25600"],
        110: ["1800/3600", "3600/7100", "7100/14200", "14200/28400"],
      },
      ron: {
        20: ["1000", "2000", "3900", "7700"],
        25: ["1200", "2400", "4800", "9600"],
        30: ["1300", "2600", "5200", "10400"],
        40: ["2000", "3900", "7700", "15300"],
        50: ["2400", "4800", "9600", "19200"],
        60: ["2600", "5200", "10400", "20800"],
        70: ["3200", "6400", "12800", "25600"],
        80: ["3900", "7700", "15300", "30600"],
        90: ["4400", "8800", "17600", "35200"],
        100: ["4800", "9600", "19200", "38400"],
        110: ["5200", "10400", "20800", "41600"],
      },
    },
    oya: {
      tsumo: {
        20: ["700", "1300", "2600", "5200"],
        25: ["800", "1600", "3200", "6400"],
        30: ["1000", "2000", "3900", "7700"],
        40: ["1300", "2600", "5200", "10400"],
        50: ["1600", "3200", "6400", "12800"],
        60: ["2000", "3900", "7700", "15300"],
        70: ["2300", "4500", "9000", "18000"],
        80: ["2600", "5200", "10400", "20800"],
        90: ["2900", "5800", "11600", "23200"],
        100: ["3200", "6400", "12800", "25600"],
        110: ["3600", "7100", "14200", "28400"],
      },
      ron: {
        20: ["1500", "2900", "5800", "11600"],
        25: ["1600", "3200", "6400", "12800"],
        30: ["2000", "3900", "7700", "15300"],
        40: ["2600", "5200", "10400", "20800"],
        50: ["3200", "6400", "12800", "25600"],
        60: ["3900", "7700", "15300", "30600"],
        70: ["4500", "9000", "18000", "36000"],
        80: ["5200", "10400", "20800", "41600"],
        90: ["5800", "11600", "23200", "46400"],
        100: ["6400", "12800", "25600", "51200"],
        110: ["7100", "14200", "28400", "56800"],
      },
    },
  };

  const [type, setType] = useState("ko");

  const renderTable = (type) => (
    <div className="mb-8">
      <div className="overflow-x-auto">
        <table className="w-full border-separate border-spacing-0" style={{ background: "none" }}>
          <thead>
            <tr>
              <th className="px-2 py-1 text-white border-b border-yellow-400">符数</th>
              {hans.map(han => (
                <th key={han} className="px-2 py-1 text-yellow-400 border-b border-yellow-400">{han}翻</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {fus.map(fu => (
              <tr key={fu}>
                <td className="px-2 py-1 text-white border-b border-yellow-400 text-center">{fu}</td>
                {hans.map((han, idx) => (
                  <td key={han} className="px-2 py-1 border-b border-yellow-400 text-center">
                    <div className="text-yellow-400 text-xs">{scoreMatrix[type].tsumo[fu][idx]}</div>
                    <div className="text-white text-xs">{scoreMatrix[type].ron[fu][idx]}</div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
    </div>
    </div>
  );

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 text-yellow-400 text-center">点数表</h1>
      <div className="flex justify-center gap-4 mb-6">
        <a href="/" className="base-button w-60 text-center text-lg py-4 rounded font-bold bg-gray-700 text-yellow-400 hover:bg-yellow-400 hover:text-white transition">メニューに戻る</a>
        <a href="/yaku-list" className="base-button w-60 text-center text-lg py-4 rounded font-bold bg-gray-700 text-yellow-400 hover:bg-yellow-400 hover:text-white transition">一覧に戻る</a>
      </div>
      <div className="flex justify-center gap-4 mb-6">
        <button
          className={`base-button px-6 py-2 rounded font-bold text-lg ${type === "ko" ? "bg-yellow-400 text-white" : "bg-gray-700 text-yellow-400"}`}
          onClick={() => setType("ko")}
        >
          子
        </button>
        <button
          className={`base-button px-6 py-2 rounded font-bold text-lg ${type === "oya" ? "bg-yellow-400 text-white" : "bg-gray-700 text-yellow-400"}`}
          onClick={() => setType("oya")}
        >
          親
        </button>
      </div>
      {renderTable(type)}

      {/* 満貫以上の点数表（ボタンで切り替え） */}
      <div className="mt-10">
        <h2 className="text-xl font-bold text-yellow-400 mb-2">満貫以上の点数</h2>
        {type === "ko" ? (
          <table className="w-full border-separate border-spacing-0 mb-4" style={{ background: "none" }}>
            <thead>
              <tr>
                <th className="px-2 py-1 text-white border-b border-yellow-400">役</th>
                <th className="px-2 py-1 text-yellow-400 border-b border-yellow-400">ツモ</th>
                <th className="px-2 py-1 text-white border-b border-yellow-400">ロン</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-2 py-1 text-white border-b border-yellow-400">満貫</td>
                <td className="px-2 py-1 text-yellow-400 border-b border-yellow-400 text-center">2000/4000</td>
                <td className="px-2 py-1 text-white border-b border-yellow-400 text-center">8000</td>
              </tr>
              <tr>
                <td className="px-2 py-1 text-white border-b border-yellow-400">跳満</td>
                <td className="px-2 py-1 text-yellow-400 border-b border-yellow-400 text-center">3000/6000</td>
                <td className="px-2 py-1 text-white border-b border-yellow-400 text-center">12000</td>
              </tr>
              <tr>
                <td className="px-2 py-1 text-white border-b border-yellow-400">倍満</td>
                <td className="px-2 py-1 text-yellow-400 border-b border-yellow-400 text-center">4000/8000</td>
                <td className="px-2 py-1 text-white border-b border-yellow-400 text-center">16000</td>
              </tr>
              <tr>
                <td className="px-2 py-1 text-white border-b border-yellow-400">三倍満</td>
                <td className="px-2 py-1 text-yellow-400 border-b border-yellow-400 text-center">6000/12000</td>
                <td className="px-2 py-1 text-white border-b border-yellow-400 text-center">24000</td>
              </tr>
              <tr>
                <td className="px-2 py-1 text-white border-b border-yellow-400">役満</td>
                <td className="px-2 py-1 text-yellow-400 border-b border-yellow-400 text-center">8000/16000</td>
                <td className="px-2 py-1 text-white border-b border-yellow-400 text-center">32000</td>
              </tr>
            </tbody>
          </table>
        ) : (
          <table className="w-full border-separate border-spacing-0 mb-4" style={{ background: "none" }}>
            <thead>
              <tr>
                <th className="px-2 py-1 text-white border-b border-yellow-400">役</th>
                <th className="px-2 py-1 text-yellow-400 border-b border-yellow-400">ツモ</th>
                <th className="px-2 py-1 text-white border-b border-yellow-400">ロン</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-2 py-1 text-white border-b border-yellow-400">満貫</td>
                <td className="px-2 py-1 text-yellow-400 border-b border-yellow-400 text-center">4000</td>
                <td className="px-2 py-1 text-white border-b border-yellow-400 text-center">12000</td>
              </tr>
              <tr>
                <td className="px-2 py-1 text-white border-b border-yellow-400">跳満</td>
                <td className="px-2 py-1 text-yellow-400 border-b border-yellow-400 text-center">6000</td>
                <td className="px-2 py-1 text-white border-b border-yellow-400 text-center">18000</td>
              </tr>
              <tr>
                <td className="px-2 py-1 text-white border-b border-yellow-400">倍満</td>
                <td className="px-2 py-1 text-yellow-400 border-b border-yellow-400 text-center">8000</td>
                <td className="px-2 py-1 text-white border-b border-yellow-400 text-center">24000</td>
              </tr>
              <tr>
                <td className="px-2 py-1 text-white border-b border-yellow-400">三倍満</td>
                <td className="px-2 py-1 text-yellow-400 border-b border-yellow-400 text-center">12000</td>
                <td className="px-2 py-1 text-white border-b border-yellow-400 text-center">36000</td>
              </tr>
              <tr>
                <td className="px-2 py-1 text-white border-b border-yellow-400">役満</td>
                <td className="px-2 py-1 text-yellow-400 border-b border-yellow-400 text-center">16000</td>
                <td className="px-2 py-1 text-white border-b border-yellow-400 text-center">48000</td>
              </tr>
            </tbody>
          </table>
        )}
        <div className="text-sm text-white mt-2">
          <span className="font-bold text-yellow-400">本場</span>：1本場ごとに+300点（ツモは全員、ロンは和了者に加算）<br />
          <span className="font-bold text-yellow-400">リーチ棒</span>：1本ごとに+1000点（ロン和了者が全て獲得、ツモは和了者のみ）<br />
          ※点数は切り上げ計算です。<br />
        </div>
      </div>
    </div>
  );
}
