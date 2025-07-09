// src/components/GameInfoSection.tsx

import React from 'react';
import { Kaze } from '../types/mahjong'; // Kaze型をインポート

// Propsの型定義
interface GameInfoSectionProps {
  bakaze: Kaze;
  setBakaze: (kaze: Kaze) => void;
  jikaze: Kaze;
  setJikaze: (kaze: Kaze) => void;
  honba: number;
  setHonba: (value: number) => void;
  reachbo: number;
  setReachbo: (value: number) => void;
  isTsumo: boolean | undefined;
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
  isChiiho: boolean;
  setIsChiiho: (checked: boolean) => void;
  isTenho: boolean;
  setIsTenho: (checked: boolean) => void;
  panelClassName?: string; // 親から受け取るクラス名を追加 (オプション)
  titleClassName?: string; // 親から受け取るタイトル用クラス名を追加 (オプション)
}

const GameInfoSection: React.FC<GameInfoSectionProps> = ({
  bakaze, setBakaze,
  jikaze, setJikaze,
  honba, setHonba,
  reachbo, setReachbo,
  isTsumo, setIsTsumo,
  isRiichi, setIsRiichi,
  isDoubleRiichi, setIsDoubleRiichi,
  isIppatsu, setIsIppatsu,
  isChankan, setIsChankan,
  isRinshan, setIsRinshan,
  isHaitei, setIsHaitei,
  isHoutei, setIsHoutei,
  isChiiho, setIsChiiho,
  isTenho, setIsTenho,
  panelClassName, 
  titleClassName, 
}) => {
  return (
    // panelClassNameを適用。デフォルトのスタイルも定義
    <div className={`p-6 rounded-xl shadow-lg ${panelClassName || 'bg-green-700 border-lime-600 border-4 text-white'}`}>
      {/* titleClassNameを適用。デフォルトのスタイルも定義 */}
      <h2 className={`${titleClassName || 'text-2xl font-bold mb-4 text-center text-white'}`}>場と自風、点数情報</h2>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="bakaze" className="block text-sm font-medium mb-1">場風:</label>
          <select
            id="bakaze"
            className="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500"
            value={bakaze}
            onChange={(e) => setBakaze(e.target.value as Kaze)}
          >
            <option value="ton">東</option>
            <option value="nan">南</option>
            <option value="shaa">西</option>
            <option value="pei">北</option>
          </select>
        </div>
        <div>
          <label htmlFor="jikaze" className="block text-sm font-medium mb-1">自風:</label>
          <select
            id="jikaze"
            className="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500"
            value={jikaze}
            onChange={(e) => setJikaze(e.target.value as Kaze)}
          >
            <option value="ton">東</option>
            <option value="nan">南</option>
            <option value="shaa">西</option>
            <option value="pei">北</option>
          </select>
        </div>
        <div>
          <label htmlFor="honba" className="block text-sm font-medium mb-1">本場:</label>
          <input
            type="number"
            id="honba"
            className="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500"
            value={honba}
            onChange={(e) => setHonba(Math.max(0, parseInt(e.target.value)))}
            min="0"
          />
        </div>
        <div>
          <label htmlFor="reachbo" className="block text-sm font-medium mb-1">リーチ棒:</label>
          <input
            type="number"
            id="reachbo"
            className="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500"
            value={reachbo}
            onChange={(e) => setReachbo(Math.max(0, parseInt(e.target.value)))}
            min="0"
          />
        </div>
      </div>

      <h3 className="text-xl font-bold mb-3 text-center text-amber-400">上がり方・役の有無</h3>
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        <div className="flex items-center">
          <input
            type="radio"
            id="tsumo"
            name="agariType"
            checked={isTsumo === true}
            onChange={() => setIsTsumo(true)}
            className="mr-2 h-4 w-4 text-amber-500 border-gray-300 focus:ring-amber-500"
          />
          <label htmlFor="tsumo">ツモ上がり</label>
        </div>
        <div className="flex items-center">
          <input
            type="radio"
            id="ron"
            name="agariType"
            checked={isTsumo === false}
            onChange={() => setIsTsumo(false)}
            className="mr-2 h-4 w-4 text-amber-500 border-gray-300 focus:ring-amber-500"
          />
          <label htmlFor="ron">ロン上がり</label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="riichi"
            checked={isRiichi}
            onChange={(e) => setIsRiichi(e.target.checked)}
            className="mr-2 h-4 w-4 text-amber-500 border-gray-300 rounded focus:ring-amber-500"
          />
          <label htmlFor="riichi">リーチ</label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="doubleRiichi"
            checked={isDoubleRiichi}
            onChange={(e) => setIsDoubleRiichi(e.target.checked)}
            disabled={!isRiichi} // リーチ時のみ選択可能
            className={`mr-2 h-4 w-4 text-amber-500 border-gray-300 rounded focus:ring-amber-500 ${!isRiichi ? 'opacity-50 cursor-not-allowed' : ''}`}
          />
          <label htmlFor="doubleRiichi" className={`${!isRiichi ? 'opacity-50 cursor-not-allowed' : ''}`}>ダブルリーチ</label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="ippatsu"
            checked={isIppatsu}
            onChange={(e) => setIsIppatsu(e.target.checked)}
            disabled={!isRiichi} // リーチ時のみ選択可能
            className={`mr-2 h-4 w-4 text-amber-500 border-gray-300 rounded focus:ring-amber-500 ${!isRiichi ? 'opacity-50 cursor-not-allowed' : ''}`}
          />
          <label htmlFor="ippatsu" className={`${!isRiichi ? 'opacity-50 cursor-not-allowed' : ''}`}>一発</label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="chankan"
            checked={isChankan}
            onChange={(e) => setIsChankan(e.target.checked)}
            className="mr-2 h-4 w-4 text-amber-500 border-gray-300 rounded focus:ring-amber-500"
          />
          <label htmlFor="chankan">槍槓</label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="rinshan"
            checked={isRinshan}
            onChange={(e) => setIsRinshan(e.target.checked)}
            className="mr-2 h-4 w-4 text-amber-500 border-gray-300 rounded focus:ring-amber-500"
          />
          <label htmlFor="rinshan">嶺上開花</label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="haitei"
            checked={isHaitei}
            onChange={(e) => setIsHaitei(e.target.checked)}
            className="mr-2 h-4 w-4 text-amber-500 border-gray-300 rounded focus:ring-amber-500"
          />
          <label htmlFor="haitei">海底摸月</label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="houtei"
            checked={isHoutei}
            onChange={(e) => setIsHoutei(e.target.checked)}
            className="mr-2 h-4 w-4 text-amber-500 border-gray-300 rounded focus:ring-amber-500"
          />
          <label htmlFor="houtei">河底撈魚</label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="chiiho"
            checked={isChiiho}
            onChange={(e) => setIsChiiho(e.target.checked)}
            className="mr-2 h-4 w-4 text-amber-500 border-gray-300 rounded focus:ring-amber-500"
          />
          <label htmlFor="chiiho">地和</label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="tenho"
            checked={isTenho}
            onChange={(e) => setIsTenho(e.target.checked)}
            className="mr-2 h-4 w-4 text-amber-500 border-gray-300 rounded focus:ring-amber-500"
          />
          <label htmlFor="tenho">天和</label>
        </div>
      </div>
    </div>
  );
};

export default GameInfoSection;