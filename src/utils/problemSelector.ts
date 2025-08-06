import { problems, Problem } from '../data/problems';

/**
 * 履歴数と履歴内容をもとに、出題する問題を決定する
 * @param level 難易度
 * @param historyProblems 履歴から取得した問題（Problem型配列 or 問題ID配列）
 * @returns Problem
 */
export function selectProblem(level: number, historyProblems: Problem[] = []): Problem {
  // 履歴が10未満なら初期問題＋履歴からランダム
  if (historyProblems.length < 10) {
    // levelに該当する初期問題
    const initial = problems.filter(p => p.level === level);
    const pool = [...initial, ...historyProblems];
    return pool[Math.floor(Math.random() * pool.length)];
  }
  // 10以上なら履歴のみからランダム
  if (historyProblems.length > 0) {
    return historyProblems[Math.floor(Math.random() * historyProblems.length)];
  }
  // どちらもなければ初期問題から
  const fallback = problems.filter(p => p.level === level);
  return fallback[Math.floor(Math.random() * fallback.length)];
}
