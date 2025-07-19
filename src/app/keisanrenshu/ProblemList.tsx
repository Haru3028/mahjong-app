// 問題リスト分割用
export type Problem = {
  hand: string;
  situation: string;
  answer: string;
  explanation: string;
  furo: string | null;
};

export const sampleProblems: Problem[] = [
  {
    hand: "234m 456m 789p 234s 55s",
    situation: "南3局 子 ツモ: 5s 副露: 555p(ポン)",
    answer: "1600点",
    explanation: "555pをポンしているため、役はなし。ツモのみで1600点です。",
    furo: "555p(ポン)"
  },
  {
    hand: "123m 456m 789p 234s 55s",
    situation: "東1局 親 ツモ: 5s",
    answer: "1300点",
    explanation: "ツモ5sは単騎待ちなのでピンフは成立しません。ツモのみで1300点です。",
    furo: null
  },
  {
    hand: "234p 567p 789p 123s 456s",
    situation: "南2局 子 ツモ: 2p",
    answer: "1300点",
    explanation: "平和のみで1300点です。",
    furo: null
  },
  {
    hand: "234m 456m 789p 234s 55s",
    situation: "東2局 子 ツモ: 5s 副露: 234m(チー)",
    answer: "1000点",
    explanation: "副露ありの場合はピンフが成立しません。ツモのみで1000点です。",
    furo: "234m(チー)"
  }
];
