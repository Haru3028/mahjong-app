// src/components/GameInfoSection.tsx

import React from 'react';
import { Kaze } from '../types/mahjong';

interface GameInfoSectionProps {
  bakaze: Kaze;
  setBakaze: (kaze: Kaze) => void;
  jikaze: Kaze;
  setJikaze: (kaze: Kaze) => void;
  honba: number;
  setHonba: (value: number) => void;
  reachbo: number;
  setReachbo: (value: number) => void;
  
  isTsumo: boolean;
  setIsTsumo: (checked: boolean) => void;
  isRiichi: boolean;
  setIsRiichi: (checked: boolean) => void;
  isDoubleRiichi: boolean;
  setIsDoubleRiichi: (checked: boolean) => void;
  isIppatsu: boolean;
  setIsIppatsu: (checked: boolean) => void;
  isChankan: boolean;
  setIsChankan: (checked: boolean) => void;
  isRinshan: boolean;
  setIsRinshan: (checked: boolean) => void;
  isHaitei: boolean;
  setIsHaitei: (checked: boolean) => void;
  isHoutei: boolean;
  setIsHoutei: (checked: boolean) => void;
  isChiiho: boolean; // 地和
  setIsChiiho: (checked: boolean) => void;
  isTenho: boolean; // 天和
  setIsTenho: (checked: boolean) => void;
}

const GameInfoSection: React.FC<GameInfoSectionProps> = ({
  bakaze,
  setBakaze,
  jikaze,
  setJikaze,
  honba,
  setHonba,
  reachbo,
  setReachbo,
  isChankan,
  setIsChankan,

  isTsumo,
  setIsTsumo,
  isRiichi,
  setIsRiichi,
  isDoubleRiichi,
  setIsDoubleRiichi,
  isIppatsu,
  setIsIppatsu,
  isRinshan,
  setIsRinshan,
  isHaitei,
  setIsHaitei,
  isHoutei,
  setIsHoutei,
  isChiiho,
  setIsChiiho,
  isTenho,
  setIsTenho,
}) => {
  return (
    <div className="mb-8 p-4 border rounded-lg bg-white shadow-md w-full max-w-2xl text-gray-800">
      <h2 className="text-xl font-semibold mb-2 text-center">場情報と役の有無</h2>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="bakaze" className="block text-sm font-medium text-gray-700">場風:</label>
          <select
            id="bakaze"
            value={bakaze}
            onChange={(e) => setBakaze(e.target.value as Kaze)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm"
          >
            <option value="東">東</option>
            <option value="南">南</option>
            <option value="西">西</option>
            <option value="北">北</option>
          </select>
        </div>
        <div>
          <label htmlFor="jikaze" className="block text-sm font-medium text-gray-700">自風:</label>
          <select
            id="jikaze"
            value={jikaze}
            onChange={(e) => setJikaze(e.target.value as Kaze)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm"
          >
            <option value="東">東</option>
            <option value="南">南</option>
            <option value="西">西</option>
            <option value="北">北</option>
          </select>
        </div>
        <div>
          <label htmlFor="honba" className="block text-sm font-medium text-gray-700">本場:</label>
          <input
            type="number"
            id="honba"
            value={honba}
            onChange={(e) => setHonba(Number(e.target.value))}
            min="0"
            className="mt-1 block w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm"
          />
        </div>
        <div>
          <label htmlFor="reachbo" className="block text-sm font-medium text-gray-700">リーチ棒 (場に出ている合計):</label>
          <input
            type="number"
            id="reachbo"
            value={reachbo}
            onChange={(e) => setReachbo(Number(e.target.value))}
            min="0"
            className="mt-1 block w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm"
          />
        </div>
      </div>

      {/* アガリ方選択 */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">アガリ方:</h3>
        <div className="flex gap-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="agariType"
              value="tsumo"
              checked={isTsumo}
              onChange={() => setIsTsumo(true)}
              className="form-radio text-blue-600"
            />
            <span className="ml-2">ツモ</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="agariType"
              value="ron"
              checked={!isTsumo}
              onChange={() => setIsTsumo(false)}
              className="form-radio text-blue-600"
            />
            <span className="ml-2">ロン</span>
          </label>
        </div>
      </div>

      {/* 特殊な役の有無 */}
      <div>
        <h3 className="text-lg font-semibold mb-2">特殊な役の有無:</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={isRiichi}
              onChange={(e) => setIsRiichi(e.target.checked)}
              className="form-checkbox text-blue-600"
            />
            <span className="ml-2">リーチ</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={isDoubleRiichi}
              onChange={(e) => setIsDoubleRiichi(e.target.checked)}
              className="form-checkbox text-blue-600"
            />
            <span className="ml-2">ダブルリーチ</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={isIppatsu}
              onChange={(e) => setIsIppatsu(e.target.checked)}
              className="form-checkbox text-blue-600"
            />
            <span className="ml-2">一発</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={isChankan}
              onChange={(e) => setIsChankan(e.target.checked)}
              className="form-checkbox text-blue-600"
            />
            <span className="ml-2">槍槓</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={isRinshan}
              onChange={(e) => setIsRinshan(e.target.checked)}
              className="form-checkbox text-blue-600"
            />
            <span className="ml-2">嶺上開花</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={isHaitei}
              onChange={(e) => setIsHaitei(e.target.checked)}
              className="form-checkbox text-blue-600"
            />
            <span className="ml-2">海底摸月</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={isHoutei}
              onChange={(e) => setIsHoutei(e.target.checked)}
              className="form-checkbox text-blue-600"
            />
            <span className="ml-2">河底撈魚</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={isChiiho}
              onChange={(e) => setIsChiiho(e.target.checked)}
              className="form-checkbox text-blue-600"
            />
            <span className="ml-2">地和</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={isTenho}
              onChange={(e) => setIsTenho(e.target.checked)}
              className="form-checkbox text-blue-600"
            />
            <span className="ml-2">天和</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default GameInfoSection;