import { useEffect, useState } from 'react';
import { Problem } from '../data/problems';
import { selectProblem } from '../utils/problemSelector';

// 仮: 履歴はlocalStorageやAPIから取得する想定
export function useProblem(level: number) {
  const [historyProblems, setHistoryProblems] = useState<Problem[]>([]);
  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null);

  useEffect(() => {
    // 履歴取得処理（ここではlocalStorageの例）
    const historyRaw = localStorage.getItem('mahjong_history');
    let history: Problem[] = [];
    if (historyRaw) {
      try {
        history = JSON.parse(historyRaw);
      } catch {}
    }
    setHistoryProblems(history.filter(p => p.level === level));
  }, [level]);

  useEffect(() => {
    setCurrentProblem(selectProblem(level, historyProblems));
  }, [level, historyProblems]);

  return { problem: currentProblem };
}
