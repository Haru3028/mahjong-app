// src/components/GameInfoSection.tsx

import React from 'react';
import { Kaze } from '../types/mahjong';

interface GameInfoSectionProps {
  bakaze: Kaze;
  setBakaze: (kaze: Kaze) => void;
  jikaze: Kaze;
  setJikaze: (kaze: Kaze) => void;
  honba: number;
  handleHonbaChange: (increment: number) => void;
  reachbo: number;
  handleReachboChange: (increment: number) => void;
}

export const GameInfoSection: React.FC<GameInfoSectionProps> = ({
  bakaze,
  setBakaze,
  jikaze,
  setJikaze,
  honba,
  handleHonbaChange,
  reachbo,
  handleReachboChange,
}) => {
  return (
    <section className="mb-4 p-3 border border-gray-300 rounded-md bg-gray-50/70 backdrop-blur-sm">
      <h2 className="text-lg font-semibold text-gray-900 mb-3">対局情報</h2>

      {/* 場風の選択 */}
      <div className="mb-4">
        <h3 className="text-base font-medium text-gray-800 mb-2">場風</h3>
        <div className="flex gap-4">
          {['東', '南'].map((kaze) => (
            <label key={kaze} className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-amber-500 focus:ring-amber-500"
                name="bakaze"
                value={kaze}
                checked={bakaze === kaze}
                onChange={() => setBakaze(kaze as Kaze)}
              />
              <span className="ml-2 text-gray-800">{kaze}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 自風の選択 */}
      <div className="mb-4">
        <h3 className="text-base font-medium text-gray-800 mb-2">自風</h3>
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          {['東', '南', '西', '北'].map((kaze) => (
            <label key={kaze} className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-amber-500 focus:ring-amber-500"
                name="jikaze"
                value={kaze}
                checked={jikaze === kaze}
                onChange={() => setJikaze(kaze as Kaze)}
              />
              <span className="ml-2 text-gray-800">{kaze}家</span>
            </label>
          ))}
        </div>
      </div>

      {/* 本場数入力 */}
      <div className="mb-4">
        <h3 className="text-base font-medium text-gray-800 mb-2">本場数</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleHonbaChange(-1)}
            className="bg-amber-200 text-amber-800 px-3 py-1 rounded-md hover:bg-amber-300 transition-colors shadow-sm"
            aria-label="本場数を減らす"
          >
            -
          </button>
          <span className="text-lg font-bold w-8 text-center text-gray-900">{honba}</span>
          <button
            onClick={() => handleHonbaChange(1)}
            className="bg-amber-200 text-amber-800 px-3 py-1 rounded-md hover:bg-amber-300 transition-colors shadow-sm"
            aria-label="本場数を増やす"
          >
            +
          </button>
        </div>
      </div>

      {/* リーチ棒の数入力 */}
      <div>
        <h3 className="text-base font-medium text-gray-800 mb-2">リーチ棒の数</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleReachboChange(-1)}
            className="bg-amber-200 text-amber-800 px-3 py-1 rounded-md hover:bg-amber-300 transition-colors shadow-sm"
            aria-label="リーチ棒を減らす"
          >
            -
          </button>
          <span className="text-lg font-bold w-8 text-center text-gray-900">{reachbo}</span>
          <button
            onClick={() => handleReachboChange(1)}
            className="bg-amber-200 text-amber-800 px-3 py-1 rounded-md hover:bg-amber-300 transition-colors shadow-sm"
            aria-label="リーチ棒を増やす"
          >
            +
          </button>
        </div>
      </div>
    </section>
  );
};