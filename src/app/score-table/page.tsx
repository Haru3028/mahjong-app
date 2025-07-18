import React from "react";
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
  return (
    <main className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6 text-yellow-400">点数早見表</h1>
      <table className="w-full bg-gray-800 rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-700 text-yellow-300">
            <th className="py-2 px-3">翻</th>
            <th className="py-2 px-3">符</th>
            <th className="py-2 px-3">子</th>
            <th className="py-2 px-3">親</th>
          </tr>
        </thead>
        <tbody>
          {scoreTable.map((row, idx) => (
            <tr key={idx} className="border-b border-gray-600">
              <td className="py-2 px-3 text-center font-bold text-white">{row.han}</td>
              <td className="py-2 px-3 text-center text-gray-300">{row.fu}</td>
              <td className="py-2 px-3 text-center text-yellow-200">{row.child}</td>
              <td className="py-2 px-3 text-center text-yellow-400">{row.parent}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
