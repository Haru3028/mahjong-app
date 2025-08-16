import React, { createContext, useContext, useState, ReactNode } from 'react';

// 3人麻雀 or 4人麻雀
export type PlayerCount = 3 | 4;


export type KitaCount = 0 | 1 | 2 | 3 | 4;

interface PlayerCountContextType {
  playerCount: PlayerCount;
  setPlayerCount: (count: PlayerCount) => void;
  kitaCount: KitaCount;
  setKitaCount: (count: KitaCount) => void;
}


const PlayerCountContext = createContext<PlayerCountContextType | undefined>(undefined);


export const PlayerCountProvider = ({ children }: { children: ReactNode }) => {
  const [playerCount, setPlayerCount] = useState<PlayerCount>(4);
  const [kitaCount, setKitaCount] = useState<KitaCount>(0);
  return (
    <PlayerCountContext.Provider value={{ playerCount, setPlayerCount, kitaCount, setKitaCount }}>
      {children}
    </PlayerCountContext.Provider>
  );
};

export const usePlayerCount = () => {
  const ctx = useContext(PlayerCountContext);
  if (!ctx) throw new Error('usePlayerCount must be used within PlayerCountProvider');
  return ctx;
};
