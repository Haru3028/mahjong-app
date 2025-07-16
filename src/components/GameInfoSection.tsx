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
  panelClassName?: string;
  titleClassName?: string;
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
    <div className={`w-full p-6 rounded-xl shadow-xl ${panelClassName || 'bg-gradient-to-br from-teal-800 via-teal-900 to-slate-900 border-yellow-400 border-3 text-white'}`}>
      <h2 className={`${titleClassName || 'text-2xl font-bold mb-4 text-center text-cyan-200'}`}>場と自風、点数情報</h2>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="flex items-center gap-2">
          <label htmlFor="bakaze" className="text-xs font-bold text-slate-200 whitespace-nowrap">場風:</label>
          <select
            id="bakaze"
            style={{
              backgroundColor: 'transparent',
              color: '#e2e8f0',
              border: '1px solid rgba(250, 204, 21, 0.4)',
              borderRadius: '4px',
              padding: '6px 8px',
              fontSize: '12px',
              fontWeight: '500',
              boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)'
            }}
            className="w-20 focus:outline-none focus:ring-1 focus:ring-yellow-300 focus:border-yellow-300 transition-all duration-300 cursor-pointer"
            value={bakaze}
            onChange={(e) => setBakaze(e.target.value as Kaze)}
          >
            <option value="ton" style={{backgroundColor: '#134e4a', color: '#e2e8f0'}}>東</option>
            <option value="nan" style={{backgroundColor: '#134e4a', color: '#e2e8f0'}}>南</option>
            <option value="shaa" style={{backgroundColor: '#134e4a', color: '#e2e8f0'}}>西</option>
            <option value="pei" style={{backgroundColor: '#134e4a', color: '#e2e8f0'}}>北</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="jikaze" className="text-xs font-bold text-slate-200 whitespace-nowrap">自風:</label>
          <select
            id="jikaze"
            style={{
              backgroundColor: 'transparent',
              color: '#e2e8f0',
              border: '1px solid rgba(250, 204, 21, 0.4)',
              borderRadius: '4px',
              padding: '6px 8px',
              fontSize: '12px',
              fontWeight: '500',
              boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)'
            }}
            className="w-20 focus:outline-none focus:ring-1 focus:ring-yellow-300 focus:border-yellow-300 transition-all duration-300 cursor-pointer"
            value={jikaze}
            onChange={(e) => setJikaze(e.target.value as Kaze)}
          >
            <option value="ton" style={{backgroundColor: '#134e4a', color: '#e2e8f0'}}>東</option>
            <option value="nan" style={{backgroundColor: '#134e4a', color: '#e2e8f0'}}>南</option>
            <option value="shaa" style={{backgroundColor: '#134e4a', color: '#e2e8f0'}}>西</option>
            <option value="pei" style={{backgroundColor: '#134e4a', color: '#e2e8f0'}}>北</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="honba" className="text-xs font-bold text-slate-200 whitespace-nowrap">本場:</label>
          <input
            type="number"
            id="honba"
            style={{
              backgroundColor: 'transparent',
              color: '#e2e8f0',
              border: '1px solid rgba(250, 204, 21, 0.4)',
              borderRadius: '4px',
              padding: '6px 8px',
              fontSize: '12px',
              fontWeight: '500',
              boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)'
            }}
            className="w-20 focus:outline-none focus:ring-1 focus:ring-yellow-300 focus:border-yellow-300 transition-all duration-300"
            value={honba}
            onChange={(e) => setHonba(Math.max(0, parseInt(e.target.value)))}
            min="0"
          />
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="reachbo" className="text-xs font-bold text-slate-200 whitespace-nowrap">リーチ棒:</label>
          <input
            type="number"
            id="reachbo"
            style={{
              backgroundColor: 'transparent',
              color: '#e2e8f0',
              border: '1px solid rgba(250, 204, 21, 0.4)',
              borderRadius: '4px',
              padding: '6px 8px',
              fontSize: '12px',
              fontWeight: '500',
              boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)'
            }}
            className="w-20 focus:outline-none focus:ring-1 focus:ring-yellow-300 focus:border-yellow-300 transition-all duration-300"
            value={reachbo}
            onChange={(e) => setReachbo(Math.max(0, parseInt(e.target.value)))}
            min="0"
          />
        </div>
      </div>

      <h3 className="text-md font-bold mb-2 text-center text-slate-200">上がり方・役の有無</h3>
      
      {/* 上がり方選択 */}
      <div className="mb-2 flex items-center gap-2">
        <label htmlFor="agariType" className="text-xs font-bold text-slate-200 whitespace-nowrap">上がり方:</label>
        <select
          id="agariType"
          style={{
            backgroundColor: 'transparent',
            color: '#e2e8f0',
            border: '1px solid rgba(250, 204, 21, 0.4)',
            borderRadius: '4px',
            padding: '6px 8px',
            fontSize: '12px',
            fontWeight: '500',
            boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)'
          }}
          className="w-36 focus:outline-none focus:ring-1 focus:ring-yellow-300 focus:border-yellow-300 transition-all duration-300 cursor-pointer"
          value={isTsumo === true ? 'tsumo' : isTsumo === false ? 'ron' : ''}
          onChange={(e) => {
            if (e.target.value === 'tsumo') setIsTsumo(true);
            else if (e.target.value === 'ron') setIsTsumo(false);
          }}
        >
          <option value="" style={{backgroundColor: '#134e4a', color: '#e2e8f0'}}>選択してください</option>
          <option value="tsumo" style={{backgroundColor: '#134e4a', color: '#e2e8f0'}}>ツモ上がり</option>
          <option value="ron" style={{backgroundColor: '#134e4a', color: '#e2e8f0'}}>ロン上がり</option>
        </select>
      </div>

      {/* 特殊あがり選択 */}
      <div className="mb-2 flex items-center gap-2">
        <label htmlFor="specialYaku" className="text-xs font-bold text-slate-200 whitespace-nowrap">特殊あがり:</label>
        <select
          id="specialYaku"
          style={{
            backgroundColor: 'transparent',
            color: '#e2e8f0',
            border: '1px solid rgba(250, 204, 21, 0.4)',
            borderRadius: '4px',
            padding: '6px 8px',
            fontSize: '12px',
            fontWeight: '500',
            boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)'
          }}
          className="w-36 focus:outline-none focus:ring-1 focus:ring-yellow-300 focus:border-yellow-300 transition-all duration-300 cursor-pointer"
          value={
            isTenho ? 'tenho' :
            isChiiho ? 'chiiho' :
            isHaitei ? 'haitei' :
            isHoutei ? 'houtei' :
            isRinshan ? 'rinshan' :
            isChankan ? 'chankan' : ''
          }
          onChange={(e) => {
            // 全ての特殊役をリセット
            setIsTenho(false);
            setIsChiiho(false);
            setIsHaitei(false);
            setIsHoutei(false);
            setIsRinshan(false);
            setIsChankan(false);
            
            // 選択された特殊役を設定
            switch (e.target.value) {
              case 'tenho': setIsTenho(true); break;
              case 'chiiho': setIsChiiho(true); break;
              case 'haitei': setIsHaitei(true); break;
              case 'houtei': setIsHoutei(true); break;
              case 'rinshan': setIsRinshan(true); break;
              case 'chankan': setIsChankan(true); break;
            }
          }}
        >
          <option value="" style={{backgroundColor: '#134e4a', color: '#e2e8f0'}}>なし</option>
          <option value="tenho" style={{backgroundColor: '#134e4a', color: '#e2e8f0'}}>天和</option>
          <option value="chiiho" style={{backgroundColor: '#134e4a', color: '#e2e8f0'}}>地和</option>
          <option value="haitei" style={{backgroundColor: '#134e4a', color: '#e2e8f0'}}>海底摸月</option>
          <option value="houtei" style={{backgroundColor: '#134e4a', color: '#e2e8f0'}}>河底撈魚</option>
          <option value="rinshan" style={{backgroundColor: '#134e4a', color: '#e2e8f0'}}>嶺上開花</option>
          <option value="chankan" style={{backgroundColor: '#134e4a', color: '#e2e8f0'}}>槍槓</option>
        </select>
      </div>

      {/* リーチ関連 */}
      <div className="grid grid-cols-1 gap-1 text-sm">
        <div className="flex items-center p-1 hover:bg-yellow-400/10 rounded cursor-pointer transition-all duration-200" onClick={() => {
          const newValue = !isRiichi;
          setIsRiichi(newValue);
          if (!newValue) {
            setIsDoubleRiichi(false);
            setIsIppatsu(false);
          }
        }}>
          <input
            type="checkbox"
            id="riichi"
            checked={isRiichi}
            onChange={() => {}} // onClick で処理するため空
            className="mr-2 w-3 h-3 text-yellow-400 bg-transparent border border-yellow-400 rounded focus:ring-1 focus:ring-yellow-300 transition-all duration-200 cursor-pointer"
          />
          <label htmlFor="riichi" className="text-xs font-medium text-slate-200 cursor-pointer">リーチ</label>
        </div>
        
        {isRiichi && (
          <>
            <div className="flex items-center ml-4 p-1 hover:bg-yellow-400/10 rounded cursor-pointer transition-all duration-200" onClick={() => setIsDoubleRiichi(!isDoubleRiichi)}>
              <input
                type="checkbox"
                id="doubleRiichi"
                checked={isDoubleRiichi}
                onChange={() => {}} // onClick で処理するため空
                className="mr-2 w-3 h-3 text-yellow-400 bg-transparent border border-yellow-400 rounded focus:ring-1 focus:ring-yellow-300 transition-all duration-200 cursor-pointer"
              />
              <label htmlFor="doubleRiichi" className="text-xs font-medium text-slate-200 cursor-pointer">ダブルリーチ</label>
            </div>
            <div className="flex items-center ml-4 p-1 hover:bg-yellow-400/10 rounded cursor-pointer transition-all duration-200" onClick={() => setIsIppatsu(!isIppatsu)}>
              <input
                type="checkbox"
                id="ippatsu"
                checked={isIppatsu}
                onChange={() => {}} // onClick で処理するため空
                className="mr-2 w-3 h-3 text-yellow-400 bg-transparent border border-yellow-400 rounded focus:ring-1 focus:ring-yellow-300 transition-all duration-200 cursor-pointer"
              />
              <label htmlFor="ippatsu" className="text-xs font-medium text-slate-200 cursor-pointer">一発</label>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default GameInfoSection;