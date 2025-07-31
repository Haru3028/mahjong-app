// 問題リスト分割用
export type Problem = {
  hand: string;
  situation: string;
  answer: string;
  explanation: string;
  furo: string | null;
  dora?: string; // 追加: ドラ表示牌
  han?: number; // 翻数
  fu?: number;  // 符数
  tsumo?: string; // ツモ牌
};

export const sampleProblems: Problem[] = [
  {
    hand: "234m 456m 789p 22s", // 面子3組＋雀頭1組＝11枚＋副露1組（3枚）＝14枚
    situation: "南3局 子",
    answer: "0点",
    explanation: "副露（ポン）しているため、ツモのみでは和了できず0点です。",
    furo: "555p(ポン)",
    dora: "5s",
    han: 0,
    fu: 0
  },
  {
    hand: "234m 456m 789p 22s", // 面子3組＋雀頭1組＝11枚＋副露1組（3枚）＝14枚
    situation: "南1局 子",
    answer: "8000点",
    explanation: "役牌（白）ポン1翻＋ドラ3翻で合計4翻。満貫で8000点です。",
    furo: "白白白(ポン)",
    dora: "白",
    han: 4,
    fu: 30
  },
  {
    hand: "123m 456m 789p 234s 5s",
    situation: "東1局 親 ツモ: 3s",
    answer: "1300点",
    explanation: "副露なし、平和のみで1300点です。",
    furo: null,
    dora: "5s",
    han: 1,
    fu: 30,
    tsumo: "3s" // 3s両面待ちで和了
  },
  {
    hand: "234p 567p 789p 123s 5s",
    situation: "南2局 子 ツモ: 5s",
    answer: "1300点",
    explanation: "副露なし、平和のみで1300点です。",
    furo: null,
    dora: "2p",
    han: 1,
    fu: 30,
    tsumo: "5s" // 5s両面待ちで和了
  },
  {
    hand: "456m 789p 234s 22s",
    situation: "東2局 子",
    answer: "0点",
    explanation: "副露（チー）しているため、ツモのみでは和了できず0点です。",
    furo: "234m(チー)",
    dora: "5s",
    han: 0,
    fu: 0,
    tsumo: "3s" // 3s単騎待ち（和了形でないが副露のみの例）
  },
  {
    hand: "234m 456m 789p 22s",
    situation: "南4局 子",
    answer: "2000点",
    explanation: "役牌（發）ポンで1役。副露でも和了可能。",
    furo: "發發發(ポン)",
    dora: "發",
    han: 1,
    fu: 30,
    tsumo: "2s" // 2s単騎待ち（雀頭で和了）
  }
];
