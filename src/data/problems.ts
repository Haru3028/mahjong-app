// 各レベルごとに10問ずつサンプル問題を用意
// hand: 牌ID配列, answer: 正解役名, level: 難易度
export interface Problem {
  id: number;
  hand: string[];
  answer: string;
  level: number;
}

export const problems: Problem[] = [
  // level 1
  { id: 1, hand: ['man1','man2','man3','pin1','pin2','pin3','sou1','sou2','sou3','ton','ton','haku','haku','haku'], answer: 'リーチ', level: 1 },
  { id: 2, hand: ['man2','man3','man4','pin2','pin3','pin4','sou2','sou3','sou4','nan','nan','hatsu','hatsu','hatsu'], answer: 'タンヤオ', level: 1 },
  { id: 3, hand: ['man3','man4','man5','pin3','pin4','pin5','sou3','sou4','sou5','sha','sha','chun','chun','chun'], answer: 'ピンフ', level: 1 },
  { id: 4, hand: ['man4','man5','man6','pin4','pin5','pin6','sou4','sou5','sou6','pei','pei','haku','haku','haku'], answer: 'ドラ', level: 1 },
  { id: 5, hand: ['man5','man6','man7','pin5','pin6','pin7','sou5','sou6','sou7','ton','ton','hatsu','hatsu','hatsu'], answer: '役牌', level: 1 },
  { id: 6, hand: ['man6','man7','man8','pin6','pin7','pin8','sou6','sou7','sou8','nan','nan','chun','chun','chun'], answer: 'リーチ', level: 1 },
  { id: 7, hand: ['man7','man8','man9','pin7','pin8','pin9','sou7','sou8','sou9','sha','sha','haku','haku','haku'], answer: 'タンヤオ', level: 1 },
  { id: 8, hand: ['man1','man1','man1','pin2','pin2','pin2','sou3','sou3','sou3','ton','ton','hatsu','hatsu','hatsu'], answer: '三色同刻', level: 1 },
  { id: 9, hand: ['man2','man2','man2','pin3','pin3','pin3','sou4','sou4','sou4','nan','nan','chun','chun','chun'], answer: '三暗刻', level: 1 },
  { id: 10, hand: ['man3','man3','man3','pin4','pin4','pin4','sou5','sou5','sou5','pei','pei','haku','haku','haku'], answer: '対々和', level: 1 },
  // level 2
  { id: 11, hand: ['man1','man2','man3','man4','man5','man6','man7','man8','man9','pin1','pin1','pin1','sou1','sou1'], answer: '一気通貫', level: 2 },
  { id: 12, hand: ['man2','man3','man4','man5','man6','man7','man8','man9','man1','pin2','pin2','pin2','sou2','sou2'], answer: '混一色', level: 2 },
  { id: 13, hand: ['man3','man4','man5','man6','man7','man8','man9','man1','man2','pin3','pin3','pin3','sou3','sou3'], answer: '純全帯么九', level: 2 },
  { id: 14, hand: ['man4','man5','man6','man7','man8','man9','man1','man2','man3','pin4','pin4','pin4','sou4','sou4'], answer: '混老頭', level: 2 },
  { id: 15, hand: ['man5','man6','man7','man8','man9','man1','man2','man3','man4','pin5','pin5','pin5','sou5','sou5'], answer: '清一色', level: 2 },
  { id: 16, hand: ['man6','man7','man8','man9','man1','man2','man3','man4','man5','pin6','pin6','pin6','sou6','sou6'], answer: '混一色', level: 2 },
  { id: 17, hand: ['man7','man8','man9','man1','man2','man3','man4','man5','man6','pin7','pin7','pin7','sou7','sou7'], answer: '一気通貫', level: 2 },
  { id: 18, hand: ['man8','man9','man1','man2','man3','man4','man5','man6','man7','pin8','pin8','pin8','sou8','sou8'], answer: '純全帯么九', level: 2 },
  { id: 19, hand: ['man9','man1','man2','man3','man4','man5','man6','man7','man8','pin9','pin9','pin9','sou9','sou9'], answer: '清一色', level: 2 },
  { id: 20, hand: ['man1','man1','man1','man2','man2','man2','man3','man3','man3','pin1','pin1','pin1','sou1','sou1'], answer: '三色同刻', level: 2 },
  // ...他レベルも同様に追加可
];
