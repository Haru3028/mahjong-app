// 役一覧の特殊役・ダブル役満定義
export const yakumanList = [
  { name: "天和（テンホウ）", description: "親が配牌時に和了。ダブル役満。", isDouble: true },
  { name: "地和（チーホウ）", description: "子が第一ツモで和了。ダブル役満。", isDouble: true },
  { name: "国士無双十三面待ち", description: "国士無双で13種すべて待ち。ダブル役満。", isDouble: true },
  { name: "純正九蓮宝燈", description: "九蓮宝燈で1・9のいずれかで和了。ダブル役満。", isDouble: true },
  { name: "大四喜", description: "風牌4組。ダブル役満。", isDouble: true },
  { name: "四暗刻単騎", description: "四暗刻の単騎待ち。ダブル役満。", isDouble: true },
  { name: "国士無双", description: "13種の一九字牌＋任意1枚。", isDouble: false },
  { name: "四暗刻", description: "暗刻4組。", isDouble: false },
  { name: "大三元", description: "三元牌3組。", isDouble: false },
  { name: "字一色", description: "字牌のみで構成。", isDouble: false },
  { name: "緑一色", description: "緑牌（發・2・3・4・6・8索）のみで構成。", isDouble: false },
  { name: "清老頭", description: "一九牌のみで構成。", isDouble: false },
  { name: "小四喜", description: "風牌3組＋雀頭。", isDouble: false },
  { name: "九蓮宝燈", description: "同種の1・9が3枚ずつ＋2～8各1枚。", isDouble: false },
  { name: "四槓子", description: "槓子4組。", isDouble: false },
];

export const yaku1List = [
  { name: "リーチ", description: "門前（鳴きなし）で和了宣言を行う。鳴いている場合は成立しません。", menzenOnly: true },
  { name: "一発", description: "リーチ後、1巡以内に和了（鳴きが入ると無効）。", menzenOnly: true },
  { name: "門前清自摸和（メンゼンツモ）", description: "門前（鳴きなし）で自摸和了。鳴いている場合は成立しません。", menzenOnly: true },
  { name: "断么九（タンヤオ）", description: "字牌・一九牌を使わず、2～8の数牌のみで構成。鳴いても1翻。", menzenOnly: false },
  { name: "平和（ピンフ）", description: "順子のみ、役牌なし、両面待ち。鳴くと成立しません。", menzenOnly: true },
  { name: "一盃口（イーペーコー）", description: "門前で同じ順子2組。鳴くと成立しません。", menzenOnly: true },
  { name: "役牌（自風・場風・三元牌）", description: "自風・場風・三元牌の刻子または槓子。鳴いても1翻。", menzenOnly: false },
  { name: "嶺上開花（リンシャンカイホウ）", description: "嶺上牌（カンした際の牌）で和了。鳴きの有無は問わない。", menzenOnly: false },
  { name: "海底摸月（ハイテイツモ）", description: "最後の自摸牌（海底牌）で自摸和了。鳴きの有無は問わない。", menzenOnly: false },
  { name: "河底撈魚（ホウテイロン）", description: "最後の捨て牌（河底牌）でロン和了。鳴きの有無は問わない。", menzenOnly: false },
  { name: "槍槓（チャンカン）", description: "他家が加槓した牌でロン和了。鳴きの有無は問わない。", menzenOnly: false },
];
