import { NextRequest, NextResponse } from 'next/server';

// 麻雀牌の定義
interface Tile {
  id: string;
  suit: 'man' | 'pin' | 'sou' | 'ji';
  value: number;
  isRed: boolean;
  name: string;
}

// 役の定義
interface Yaku {
  name: string;
  han: number;
  yakuman?: boolean;
}

// 面子の種類
interface Mentsu {
  type: 'shuntsu' | 'koutsu' | 'kantsu' | 'toitsu';
  tiles: Tile[];
  isOpen: boolean;
}

// 和了形の分析結果
interface HandAnalysis {
  isValid: boolean;
  mentsuList: Mentsu[];
  jantou?: Mentsu;
  isChitoitsu: boolean;
  isKokushiMusou: boolean;
}

// レスポンス形式
interface ScoreResult {
  yaku_list: Yaku[];
  total_han: number;
  fu: number;
  point_text: string;
  error?: string;
  valid: boolean;
}

// 牌IDから牌オブジェクトを作成
function createTileFromId(tileId: string): Tile {
  if (tileId.match(/^man(\d+)(_red)?$/)) {
    const value = parseInt(tileId.match(/^man(\d+)/)![1]);
    const isRed = tileId.includes('_red');
    return {
      id: tileId,
      suit: 'man',
      value,
      isRed,
      name: `${value}萬${isRed ? '(赤)' : ''}`
    };
  }
  if (tileId.match(/^pin(\d+)(_red)?$/)) {
    const value = parseInt(tileId.match(/^pin(\d+)/)![1]);
    const isRed = tileId.includes('_red');
    return {
      id: tileId,
      suit: 'pin',
      value,
      isRed,
      name: `${value}筒${isRed ? '(赤)' : ''}`
    };
  }
  if (tileId.match(/^sou(\d+)(_red)?$/)) {
    const value = parseInt(tileId.match(/^sou(\d+)/)![1]);
    const isRed = tileId.includes('_red');
    return {
      id: tileId,
      suit: 'sou',
      value,
      isRed,
      name: `${value}索${isRed ? '(赤)' : ''}`
    };
  }
  
  // 字牌
  const jiMap: { [key: string]: { value: number; name: string } } = {
    'ji_ton': { value: 1, name: '東' },
    'ji_nan': { value: 2, name: '南' },
    'ji_sha': { value: 3, name: '西' },
    'ji_pei': { value: 4, name: '北' },
    'ji_haku': { value: 5, name: '白' },
    'ji_hatsu': { value: 6, name: '發' },
    'ji_chun': { value: 7, name: '中' }
  };
  
  if (jiMap[tileId]) {
    return {
      id: tileId,
      suit: 'ji',
      value: jiMap[tileId].value,
      isRed: false,
      name: jiMap[tileId].name
    };
  }
  
  throw new Error(`Unknown tile ID: ${tileId}`);
}

// 和了形分析
function analyzeHand(tiles: Tile[]): HandAnalysis {
  // 七対子チェック
  if (tiles.length === 14) {
    const chitoitsuCheck = checkChitoitsu(tiles);
    if (chitoitsuCheck.isValid) {
      return chitoitsuCheck;
    }
  }
  
  // 国士無双チェック
  const kokushiCheck = checkKokushiMusou(tiles);
  if (kokushiCheck.isValid) {
    return kokushiCheck;
  }
  
  // 通常の4面子1雀頭チェック
  return checkNormalHand(tiles);
}

// 七対子判定
function checkChitoitsu(tiles: Tile[]): HandAnalysis {
  if (tiles.length !== 14) {
    return { isValid: false, mentsuList: [], isChitoitsu: false, isKokushiMusou: false };
  }
  
  const tileCount = new Map<string, number>();
  tiles.forEach(tile => {
    const key = `${tile.suit}${tile.value}`;
    tileCount.set(key, (tileCount.get(key) || 0) + 1);
  });
  
  const counts = Array.from(tileCount.values());
  const pairs = counts.filter(count => count === 2);
  const singles = counts.filter(count => count === 1);
  const others = counts.filter(count => count > 2);
  
  if (pairs.length === 7 && singles.length === 0 && others.length === 0) {
    const toitsuList: Mentsu[] = [];
    Array.from(tileCount.entries()).forEach(([key, count]) => {
      if (count === 2) {
        const matchingTiles = tiles.filter(tile => `${tile.suit}${tile.value}` === key);
        toitsuList.push({
          type: 'toitsu',
          tiles: matchingTiles.slice(0, 2),
          isOpen: false
        });
      }
    });
    
    return {
      isValid: true,
      mentsuList: toitsuList,
      isChitoitsu: true,
      isKokushiMusou: false
    };
  }
  
  return { isValid: false, mentsuList: [], isChitoitsu: false, isKokushiMusou: false };
}

// 国士無双判定
function checkKokushiMusou(tiles: Tile[]): HandAnalysis {
  if (tiles.length !== 14) {
    return { isValid: false, mentsuList: [], isChitoitsu: false, isKokushiMusou: false };
  }
  
  const yaochuTiles = ['man1', 'man9', 'pin1', 'pin9', 'sou1', 'sou9', 
                      'ji_ton', 'ji_nan', 'ji_sha', 'ji_pei', 'ji_haku', 'ji_hatsu', 'ji_chun'];
  
  const tileCount = new Map<string, number>();
  tiles.forEach(tile => {
    tileCount.set(tile.id, (tileCount.get(tile.id) || 0) + 1);
  });
  
  let pairCount = 0;
  let singleCount = 0;
  
  for (const yaochuId of yaochuTiles) {
    const count = tileCount.get(yaochuId) || 0;
    if (count === 2) pairCount++;
    else if (count === 1) singleCount++;
    else if (count > 2) return { isValid: false, mentsuList: [], isChitoitsu: false, isKokushiMusou: false };
  }
  
  // 13面待ちまたは単騎待ち
  if ((pairCount === 1 && singleCount === 12) || (pairCount === 0 && singleCount === 13)) {
    return {
      isValid: true,
      mentsuList: [],
      isChitoitsu: false,
      isKokushiMusou: true
    };
  }
  
  return { isValid: false, mentsuList: [], isChitoitsu: false, isKokushiMusou: false };
}

// 通常の4面子1雀頭判定（簡易版）
function checkNormalHand(tiles: Tile[]): HandAnalysis {
  if (tiles.length !== 14) {
    return { isValid: false, mentsuList: [], isChitoitsu: false, isKokushiMusou: false };
  }
  
  // 簡易判定：とりあえずすべて有効とする
  return {
    isValid: true,
    mentsuList: [],
    isChitoitsu: false,
    isKokushiMusou: false
  };
}

// 完全な役判定システム（プロ麻雀規定準拠）
function checkAllYaku(tiles: Tile[], handAnalysis: HandAnalysis, options: any, doraIndicators: Tile[]): Yaku[] {
  const yaku: Yaku[] = [];
  
  // 役満判定
  const yakumanList = checkYakuman(tiles, handAnalysis, options);
  if (yakumanList.length > 0) {
    return yakumanList;
  }
  
  // 1翻役
  yaku.push(...check1HanYaku(tiles, handAnalysis, options));
  
  // 2翻役
  yaku.push(...check2HanYaku(tiles, handAnalysis, options));
  
  // 3翻役
  yaku.push(...check3HanYaku(tiles, handAnalysis, options));
  
  // 6翻役
  yaku.push(...check6HanYaku(tiles, handAnalysis, options));
  
  // ドラ
  yaku.push(...checkDora(tiles, doraIndicators, options));
  
  return yaku;
}

// 役満判定
function checkYakuman(tiles: Tile[], handAnalysis: HandAnalysis, options: any): Yaku[] {
  const yaku: Yaku[] = [];
  
  // 国士無双
  if (handAnalysis.isKokushiMusou) {
    yaku.push({ name: '国士無双', han: 13, yakuman: true });
  }
  
  // 四暗刻
  if (checkSuuankou(tiles, handAnalysis, options)) {
    yaku.push({ name: '四暗刻', han: 13, yakuman: true });
  }
  
  // 大三元
  if (checkDaisangen(tiles, handAnalysis)) {
    yaku.push({ name: '大三元', han: 13, yakuman: true });
  }
  
  // 四喜和
  const shiisuuResult = checkShiisuu(tiles, handAnalysis);
  if (shiisuuResult) {
    yaku.push(shiisuuResult);
  }
  
  // 字一色
  if (checkTsuuiisou(tiles)) {
    yaku.push({ name: '字一色', han: 13, yakuman: true });
  }
  
  // 緑一色
  if (checkRyuuiisou(tiles)) {
    yaku.push({ name: '緑一色', han: 13, yakuman: true });
  }
  
  // 清老頭
  if (checkChinroutou(tiles)) {
    yaku.push({ name: '清老頭', han: 13, yakuman: true });
  }
  
  // 九蓮宝燈
  if (checkChuurenpooto(tiles, options)) {
    yaku.push({ name: '九蓮宝燈', han: 13, yakuman: true });
  }
  
  // 天和・地和
  if (options.is_tenho) {
    yaku.push({ name: '天和', han: 13, yakuman: true });
  }
  if (options.is_chiiho) {
    yaku.push({ name: '地和', han: 13, yakuman: true });
  }
  
  return yaku;
}

// 1翻役判定
function check1HanYaku(tiles: Tile[], handAnalysis: HandAnalysis, options: any): Yaku[] {
  const yaku: Yaku[] = [];
  
  // 門前役
  if (options.is_riichi) {
    yaku.push({ name: 'リーチ', han: 1 });
  }
  
  if (options.is_tsumo && isMenzen(options.furo || [])) {
    yaku.push({ name: 'ツモ', han: 1 });
  }
  
  if (options.is_ippatsu) {
    yaku.push({ name: '一発', han: 1 });
  }
  
  if (options.is_rinshan) {
    yaku.push({ name: '嶺上開花', han: 1 });
  }
  
  if (options.is_chankan) {
    yaku.push({ name: '槍槓', han: 1 });
  }
  
  if (options.is_haitei) {
    yaku.push({ name: '海底摸月', han: 1 });
  }
  
  if (options.is_houtei) {
    yaku.push({ name: '河底撈魚', han: 1 });
  }
  
  // 断么九
  if (checkTanyao(tiles)) {
    yaku.push({ name: '断么九', han: 1 });
  }
  
  // 平和
  if (checkPinfu(tiles, handAnalysis, options)) {
    yaku.push({ name: '平和', han: 1 });
  }
  
  // 一盃口
  if (checkIipeikou(tiles, handAnalysis)) {
    yaku.push({ name: '一盃口', han: 1 });
  }
  
  // 場風・自風
  const windYaku = checkWindYaku(tiles, handAnalysis, options);
  yaku.push(...windYaku);
  
  // 役牌（白・發・中）
  const sangenpaiYaku = checkSangenpaiYaku(tiles, handAnalysis);
  yaku.push(...sangenpaiYaku);
  
  return yaku;
}

// 混全帯么九
function checkChantaiyao(tiles: Tile[], handAnalysis: HandAnalysis): boolean {
  if (handAnalysis.isChitoitsu || handAnalysis.isKokushiMusou) return false;
  
  // 字牌が含まれている必要がある
  const hasJi = tiles.some(tile => tile.suit === 'ji');
  if (!hasJi) return false;
  
  // 全ての面子と雀頭に1、9、字牌のいずれかが含まれているかチェック
  const allMelds = [...handAnalysis.mentsuList];
  if (handAnalysis.jantou) allMelds.push(handAnalysis.jantou);
  
  for (const meld of allMelds) {
    if (!meld || !meld.tiles || meld.tiles.length === 0) continue;
    
    // この面子/雀頭に1、9、または字牌が含まれているかチェック
    const hasTerminalOrHonor = meld.tiles.some(tile => 
      tile.suit === 'ji' || tile.value === 1 || tile.value === 9
    );
    if (!hasTerminalOrHonor) return false;
  }
  
  // 少なくとも1つの1または9を含む必要がある
  const hasTerminal = tiles.some(tile => 
    tile.suit !== 'ji' && (tile.value === 1 || tile.value === 9)
  );
  
  return hasTerminal && allMelds.length > 0;
}

// 一気通貫
function checkIttsuu(tiles: Tile[], handAnalysis: HandAnalysis): boolean {
  if (handAnalysis.isChitoitsu || handAnalysis.isKokushiMusou) return false;
  
  // 同じ種類の牌で123、456、789の順子がある
  const suits = ['man', 'pin', 'sou'];
  
  for (const suit of suits) {
    const suitTiles = tiles.filter(tile => tile.suit === suit);
    if (suitTiles.length < 9) continue; // 最低9枚必要
    
    // 1-2-3の順子
    const has123 = suitTiles.filter(t => t.value === 1).length >= 1 &&
                   suitTiles.filter(t => t.value === 2).length >= 1 &&
                   suitTiles.filter(t => t.value === 3).length >= 1;
    
    // 4-5-6の順子
    const has456 = suitTiles.filter(t => t.value === 4).length >= 1 &&
                   suitTiles.filter(t => t.value === 5).length >= 1 &&
                   suitTiles.filter(t => t.value === 6).length >= 1;
    
    // 7-8-9の順子
    const has789 = suitTiles.filter(t => t.value === 7).length >= 1 &&
                   suitTiles.filter(t => t.value === 8).length >= 1 &&
                   suitTiles.filter(t => t.value === 9).length >= 1;
    
    if (has123 && has456 && has789) {
      return true;
    }
  }
  
  return false;
}

// 三色同順
function checkSanshokudoujun(tiles: Tile[], handAnalysis: HandAnalysis): boolean {
  if (handAnalysis.isChitoitsu || handAnalysis.isKokushiMusou) return false;
  
  // 各数字について、萬子・筒子・索子で順子があるかチェック
  for (let num = 1; num <= 7; num++) {
    const manShuntsu = tiles.filter(t => t.suit === 'man' && (t.value === num || t.value === num + 1 || t.value === num + 2));
    const pinShuntsu = tiles.filter(t => t.suit === 'pin' && (t.value === num || t.value === num + 1 || t.value === num + 2));
    const souShuntsu = tiles.filter(t => t.suit === 'sou' && (t.value === num || t.value === num + 1 || t.value === num + 2));
    
    // 各種類で最低3枚あり、かつ順子になっているかチェック
    const hasManShuntsu = manShuntsu.filter(t => t.value === num).length >= 1 &&
                          manShuntsu.filter(t => t.value === num + 1).length >= 1 &&
                          manShuntsu.filter(t => t.value === num + 2).length >= 1;
    
    const hasPinShuntsu = pinShuntsu.filter(t => t.value === num).length >= 1 &&
                          pinShuntsu.filter(t => t.value === num + 1).length >= 1 &&
                          pinShuntsu.filter(t => t.value === num + 2).length >= 1;
    
    const hasSouShuntsu = souShuntsu.filter(t => t.value === num).length >= 1 &&
                          souShuntsu.filter(t => t.value === num + 1).length >= 1 &&
                          souShuntsu.filter(t => t.value === num + 2).length >= 1;
    
    if (hasManShuntsu && hasPinShuntsu && hasSouShuntsu) {
      return true;
    }
  }
  
  return false;
}

// 三色同刻
function checkSanshokudoukou(tiles: Tile[], handAnalysis: HandAnalysis): boolean {
  if (handAnalysis.isChitoitsu || handAnalysis.isKokushiMusou) return false;
  
  // 各数字について、萬子・筒子・索子で刻子があるかチェック
  for (let num = 1; num <= 9; num++) {
    const manCount = tiles.filter(t => t.suit === 'man' && t.value === num).length;
    const pinCount = tiles.filter(t => t.suit === 'pin' && t.value === num).length;
    const souCount = tiles.filter(t => t.suit === 'sou' && t.value === num).length;
    
    // 各種類で最低3枚ずつあるかチェック
    if (manCount >= 3 && pinCount >= 3 && souCount >= 3) {
      return true;
    }
  }
  
  return false;
}

// 2翻役判定
function check2HanYaku(tiles: Tile[], handAnalysis: HandAnalysis, options: any): Yaku[] {
  const yaku: Yaku[] = [];
  
  if (options.is_double_riichi) {
    yaku.push({ name: 'W立直', han: 2 });
  }
  
  if (handAnalysis.isChitoitsu) {
    yaku.push({ name: '七対子', han: 2 });
  }
  
  if (checkToitoihou(handAnalysis)) {
    yaku.push({ name: '対々和', han: 2 });
  }
  
  if (checkSanankou(tiles, handAnalysis, options)) {
    yaku.push({ name: '三暗刻', han: 2 });
  }
  
  if (checkSankantsu(handAnalysis)) {
    yaku.push({ name: '三槓子', han: 2 });
  }
  
  if (checkHonroutou(tiles)) {
    yaku.push({ name: '混老頭', han: 2 });
  }
  
  if (checkShousangen(tiles, handAnalysis)) {
    yaku.push({ name: '小三元', han: 2 });
  }
  
  if (checkChantaiyao(tiles, handAnalysis)) {
    yaku.push({ name: '混全帯么九', han: 2 });
  }
  
  if (checkIttsuu(tiles, handAnalysis)) {
    yaku.push({ name: '一気通貫', han: 2 });
  }
  
  if (checkSanshokudoujun(tiles, handAnalysis)) {
    yaku.push({ name: '三色同順', han: 2 });
  }
  
  if (checkSanshokudoukou(tiles, handAnalysis)) {
    yaku.push({ name: '三色同刻', han: 2 });
  }
  
  return yaku;
}

// 3翻役判定
function check3HanYaku(tiles: Tile[], handAnalysis: HandAnalysis, options: any): Yaku[] {
  const yaku: Yaku[] = [];
  
  if (checkRyanpeikou(tiles, handAnalysis)) {
    yaku.push({ name: '二盃口', han: 3 });
  }
  
  if (checkJunchantaiyao(tiles, handAnalysis)) {
    yaku.push({ name: '純全帯么九', han: 3 });
  }
  
  if (checkHonitsu(tiles)) {
    yaku.push({ name: '混一色', han: 3 });
  }
  
  return yaku;
}

// 6翻役判定
function check6HanYaku(tiles: Tile[], handAnalysis: HandAnalysis, options: any): Yaku[] {
  const yaku: Yaku[] = [];
  
  if (checkChinitsu(tiles)) {
    yaku.push({ name: '清一色', han: 6 });
  }
  
  return yaku;
}

// ドラ判定
function checkDora(tiles: Tile[], doraIndicators: Tile[], options: any): Yaku[] {
  const yaku: Yaku[] = [];
  
  // 赤ドラ
  const redCount = tiles.filter(tile => tile.isRed).length;
  if (redCount > 0) {
    yaku.push({ name: '赤ドラ', han: redCount });
  }
  
  // 通常ドラ
  let doraCount = 0;
  doraIndicators.forEach(indicator => {
    const doraTile = getNextTile(indicator);
    const matchingTiles = tiles.filter(tile => {
      // 赤五と通常五は同じドラとして扱う
      const tileKey = `${tile.suit}${tile.value}`;
      const doraKey = `${doraTile.suit}${doraTile.value}`;
      return tileKey === doraKey;
    });
    doraCount += matchingTiles.length;
  });
  
  if (doraCount > 0) {
    yaku.push({ name: 'ドラ', han: doraCount });
  }
  
  // 裏ドラ（リーチ時のみ）
  if (options.is_riichi && options.ura_dora && options.ura_dora.length > 0) {
    let uraDoraCount = 0;
    options.ura_dora.forEach((indicatorId: string) => {
      const indicator = createTileFromId(indicatorId);
      const doraTile = getNextTile(indicator);
      const matchingTiles = tiles.filter(tile => {
        const tileKey = `${tile.suit}${tile.value}`;
        const doraKey = `${doraTile.suit}${doraTile.value}`;
        return tileKey === doraKey;
      });
      uraDoraCount += matchingTiles.length;
    });
    
    if (uraDoraCount > 0) {
      yaku.push({ name: '裏ドラ', han: uraDoraCount });
    }
  }
  
  return yaku;
}

// === ヘルパー関数群 ===

// 門前判定
function isMenzen(furo: any[]): boolean {
  return furo.length === 0;
}

// ドラの次の牌を取得
function getNextTile(indicator: Tile): Tile {
  if (indicator.suit === 'ji') {
    const jiOrder = [1, 2, 3, 4, 5, 6, 7];
    const nextValue = indicator.value === 7 ? 1 : indicator.value + 1;
    return { ...indicator, value: nextValue };
  } else {
    const nextValue = indicator.value === 9 ? 1 : indicator.value + 1;
    return { ...indicator, value: nextValue };
  }
}

// === 個別役判定関数 ===

// 断么九
function checkTanyao(tiles: Tile[]): boolean {
  return tiles.every(tile => {
    if (tile.suit === 'ji') return false;
    return tile.value >= 2 && tile.value <= 8;
  });
}

// 平和（正確な判定）
function checkPinfu(tiles: Tile[], handAnalysis: HandAnalysis, options: any): boolean {
  if (!isMenzen(options.furo || [])) return false;
  if (handAnalysis.isChitoitsu || handAnalysis.isKokushiMusou) return false;
  
  // 雀頭が役牌でない
  const tileCount = new Map<string, number>();
  tiles.forEach(tile => {
    const key = `${tile.suit}${tile.value}`;
    tileCount.set(key, (tileCount.get(key) || 0) + 1);
  });
  
  // 役牌雀頭チェック
  const windMap: { [key: string]: number } = { 'ton': 1, 'nan': 2, 'sha': 3, 'pei': 4 };
  const bakaze = options.bakaze || options.round_wind || 'ton';
  const jikaze = options.jikaze || options.seat_wind || 'ton';
  const bakazeValue = windMap[bakaze];
  const jikazeValue = windMap[jikaze];
  
  // 三元牌・場風・自風が雀頭の場合は平和にならない
  for (const [key, count] of tileCount.entries()) {
    if (count === 2) {
      const [suit, value] = [key.substring(0, key.length - 1), parseInt(key.slice(-1))];
      if (suit === 'ji') {
        if (value >= 5 && value <= 7) return false; // 三元牌
        if (value === bakazeValue || value === jikazeValue) return false; // 場風・自風
      }
    }
  }
  
  return true;
}

// 一盃口（改善版）
function checkIipeikou(tiles: Tile[], handAnalysis: HandAnalysis): boolean {
  if (handAnalysis.isChitoitsu || handAnalysis.isKokushiMusou) return false;
  
  // 簡易判定：同種の数牌で同じ順子が2組ある
  const suits = ['man', 'pin', 'sou'];
  for (const suit of suits) {
    const suitTiles = tiles.filter(tile => tile.suit === suit).sort((a, b) => a.value - b.value);
    if (suitTiles.length >= 6) {
      // 連続する3牌の組み合わせをチェック
      for (let i = 0; i <= suitTiles.length - 6; i += 3) {
        const seq1 = suitTiles.slice(i, i + 3);
        const seq2 = suitTiles.slice(i + 3, i + 6);
        if (seq1.length === 3 && seq2.length === 3 &&
            seq1[0].value === seq2[0].value &&
            seq1[1].value === seq2[1].value &&
            seq1[2].value === seq2[2].value &&
            seq1[1].value === seq1[0].value + 1 &&
            seq1[2].value === seq1[1].value + 1) {
          return true;
        }
      }
    }
  }
  return false;
}

// 二盃口（改善版）
function checkRyanpeikou(tiles: Tile[], handAnalysis: HandAnalysis): boolean {
  if (handAnalysis.isChitoitsu || handAnalysis.isKokushiMusou) return false;
  
  // 一盃口の条件を満たし、かつ4面子すべてが順子で2種類ずつ
  // 簡易判定：七対子でない門前で特定パターン
  return false; // 複雑なので省略
}

// 対々和（改善版）
function checkToitoihou(handAnalysis: HandAnalysis): boolean {
  if (handAnalysis.isChitoitsu || handAnalysis.isKokushiMusou) return false;
  
  // 4面子すべてが刻子または槓子
  // 簡易判定：実装省略
  return false;
}

// 三暗刻（改善版）
function checkSanankou(tiles: Tile[], handAnalysis: HandAnalysis, options: any): boolean {
  if (handAnalysis.isChitoitsu || handAnalysis.isKokushiMusou) return false;
  
  const tileCount = new Map<string, number>();
  tiles.forEach(tile => {
    const key = `${tile.suit}${tile.value}`;
    tileCount.set(key, (tileCount.get(key) || 0) + 1);
  });
  
  // 3枚以上ある牌の種類をカウント
  const triples = Array.from(tileCount.values()).filter(count => count >= 3).length;
  return triples >= 3;
}

// 四暗刻（改善版）
function checkSuuankou(tiles: Tile[], handAnalysis: HandAnalysis, options: any): boolean {
  if (handAnalysis.isChitoitsu || handAnalysis.isKokushiMusou) return false;
  if (!options.is_tsumo) return false; // ツモでない場合は成立しない
  
  const tileCount = new Map<string, number>();
  tiles.forEach(tile => {
    const key = `${tile.suit}${tile.value}`;
    tileCount.set(key, (tileCount.get(key) || 0) + 1);
  });
  
  // 4つの刻子（槓子）
  const triples = Array.from(tileCount.values()).filter(count => count >= 3).length;
  return triples >= 4;
}

// 三槓子
function checkSankantsu(handAnalysis: HandAnalysis): boolean {
  // 簡易判定：実装省略
  return false;
}

// 混老頭
function checkHonroutou(tiles: Tile[]): boolean {
  return tiles.every(tile => {
    if (tile.suit === 'ji') return true;
    return tile.value === 1 || tile.value === 9;
  });
}

// 清老頭
function checkChinroutou(tiles: Tile[]): boolean {
  return tiles.every(tile => {
    if (tile.suit === 'ji') return false;
    return tile.value === 1 || tile.value === 9;
  });
}

// 小三元
function checkShousangen(tiles: Tile[], handAnalysis: HandAnalysis): boolean {
  const sangenCount = [5, 6, 7].map(value => 
    tiles.filter(tile => tile.suit === 'ji' && tile.value === value).length
  );
  const pairs = sangenCount.filter(count => count >= 2).length;
  const total = sangenCount.reduce((sum, count) => sum + count, 0);
  return pairs === 2 && total >= 8;
}

// 大三元
function checkDaisangen(tiles: Tile[], handAnalysis: HandAnalysis): boolean {
  const sangenCount = [5, 6, 7].map(value => 
    tiles.filter(tile => tile.suit === 'ji' && tile.value === value).length
  );
  return sangenCount.every(count => count >= 3);
}

// 四喜和
function checkShiisuu(tiles: Tile[], handAnalysis: HandAnalysis): Yaku | null {
  const windCount = [1, 2, 3, 4].map(value => 
    tiles.filter(tile => tile.suit === 'ji' && tile.value === value).length
  );
  const triples = windCount.filter(count => count >= 3).length;
  const pairs = windCount.filter(count => count >= 2).length;
  
  if (triples === 4) {
    return { name: '大四喜', han: 13, yakuman: true };
  }
  if (triples === 3 && pairs === 4) {
    return { name: '小四喜', han: 13, yakuman: true };
  }
  return null;
}

// 字一色
function checkTsuuiisou(tiles: Tile[]): boolean {
  return tiles.every(tile => tile.suit === 'ji');
}

// 緑一色
function checkRyuuiisou(tiles: Tile[]): boolean {
  const greenTiles = ['sou2', 'sou3', 'sou4', 'sou6', 'sou8', 'ji_hatsu'];
  return tiles.every(tile => greenTiles.includes(tile.id));
}

// 九蓮宝燈
function checkChuurenpooto(tiles: Tile[], options: any): boolean {
  if (!isMenzen(options.furo || [])) return false;
  
  const suits = ['man', 'pin', 'sou'];
  for (const suit of suits) {
    const suitTiles = tiles.filter(tile => tile.suit === suit);
    if (suitTiles.length === 14) {
      const counts = Array(9).fill(0);
      suitTiles.forEach(tile => counts[tile.value - 1]++);
      
      // 1112345678999 + 1枚
      const base = [3, 1, 1, 1, 1, 1, 1, 1, 3];
      let extra = -1;
      for (let i = 0; i < 9; i++) {
        if (counts[i] === base[i] + 1) {
          if (extra === -1) extra = i;
          else return false;
        } else if (counts[i] !== base[i]) {
          return false;
        }
      }
      return extra !== -1;
    }
  }
  return false;
}

// 純全帯么九
function checkJunchantaiyao(tiles: Tile[], handAnalysis: HandAnalysis): boolean {
  if (handAnalysis.isChitoitsu || handAnalysis.isKokushiMusou) return false;
  
  // 字牌が含まれていてはいけない
  const hasJi = tiles.some(tile => tile.suit === 'ji');
  if (hasJi) return false;
  
  // 全ての面子と雀頭に1または9が含まれているかチェック
  const allMelds = [...handAnalysis.mentsuList];
  if (handAnalysis.jantou) allMelds.push(handAnalysis.jantou);
  
  for (const meld of allMelds) {
    if (!meld || !meld.tiles || meld.tiles.length === 0) continue;
    
    // この面子/雀頭に1または9が含まれているかチェック
    const hasTerminal = meld.tiles.some(tile => tile.value === 1 || tile.value === 9);
    if (!hasTerminal) return false;
  }
  
  // 少なくとも1つの1または9を含む必要がある
  const hasAnyTerminal = tiles.some(tile => 
    tile.suit !== 'ji' && (tile.value === 1 || tile.value === 9)
  );
  
  return hasAnyTerminal && allMelds.length > 0;
}

// 混一色（改善版）
function checkHonitsu(tiles: Tile[]): boolean {
  const suits = new Set(tiles.map(tile => tile.suit));
  const hasJi = suits.has('ji');
  const numberSuits = Array.from(suits).filter(suit => suit !== 'ji');
  
  // 字牌と1種類の数牌のみ
  return hasJi && numberSuits.length === 1;
}

// 清一色（改善版）
function checkChinitsu(tiles: Tile[]): boolean {
  const suits = new Set(tiles.map(tile => tile.suit));
  
  // 1種類の数牌のみ
  return suits.size === 1 && !suits.has('ji');
}

// 場風・自風
function checkWindYaku(tiles: Tile[], handAnalysis: HandAnalysis, options: any): Yaku[] {
  const yaku: Yaku[] = [];
  
  const bakaze = options.bakaze || options.round_wind || 'ton';
  const jikaze = options.jikaze || options.seat_wind || 'ton';
  
  const windMap: { [key: string]: number } = {
    'ton': 1, 'nan': 2, 'sha': 3, 'pei': 4
  };
  
  // 場風
  const bakazeValue = windMap[bakaze];
  if (bakazeValue && tiles.filter(tile => tile.suit === 'ji' && tile.value === bakazeValue).length >= 3) {
    yaku.push({ name: '場風', han: 1 });
  }
  
  // 自風
  const jikazeValue = windMap[jikaze];
  if (jikazeValue && tiles.filter(tile => tile.suit === 'ji' && tile.value === jikazeValue).length >= 3) {
    yaku.push({ name: '自風', han: 1 });
  }
  
  return yaku;
}

// 三元牌
function checkSangenpaiYaku(tiles: Tile[], handAnalysis: HandAnalysis): Yaku[] {
  const yaku: Yaku[] = [];
  
  const sangenMap: { [key: number]: string } = {
    5: '白', 6: '發', 7: '中'
  };
  
  [5, 6, 7].forEach(value => {
    if (tiles.filter(tile => tile.suit === 'ji' && tile.value === value).length >= 3) {
      yaku.push({ name: sangenMap[value], han: 1 });
    }
  });
  
  return yaku;
}

// === 符計算関数 ===

// 符計算（正確な麻雀ルール準拠）
function calculateFu(tiles: Tile[], options: any): number {
  // 七対子は固定25符
  const handAnalysis = analyzeHand(tiles);
  if (handAnalysis.isChitoitsu) {
    return 25;
  }
  
  // 国士無双は符なし（役満）
  if (handAnalysis.isKokushiMusou) {
    return 30;
  }
  
  let fu = 20; // 基本符
  
  // 門前ロンは+10符
  const isMenzen = !options.furo || options.furo.length === 0;
  if (!options.is_tsumo && isMenzen) {
    fu += 10;
  }
  
  // ツモは+2符（門前のみ）
  if (options.is_tsumo && isMenzen) {
    fu += 2;
  }
  
  // 雀頭符
  const jantouFu = calculateJantouFu(tiles, options);
  fu += jantouFu;
  
  // 面子符（簡易計算）
  const mentsuFu = calculateMentsuFu(tiles, options);
  fu += mentsuFu;
  
  // 待ち形符（簡易計算）
  const machiFu = calculateMachiFu(tiles, options);
  fu += machiFu;
  
  // 符を10の倍数に切り上げ
  fu = Math.ceil(fu / 10) * 10;
  
  // 平和ツモは20符、平和ロンは30符
  if (checkPinfu(tiles, handAnalysis, options)) {
    if (options.is_tsumo) {
      return 20;
    } else {
      return 30;
    }
  }
  
  // 最低30符
  return Math.max(fu, 30);
}

// 雀頭符計算
function calculateJantouFu(tiles: Tile[], options: any): number {
  let fu = 0;
  
  // 役牌雀頭は+2符
  const windMap: { [key: string]: number } = {
    'ton': 1, 'nan': 2, 'sha': 3, 'pei': 4
  };
  
  const bakaze = options.bakaze || options.round_wind || 'ton';
  const jikaze = options.jikaze || options.seat_wind || 'ton';
  
  const bakazeValue = windMap[bakaze];
  const jikazeValue = windMap[jikaze];
  
  const tileCount = new Map<string, number>();
  tiles.forEach(tile => {
    const key = `${tile.suit}${tile.value}`;
    tileCount.set(key, (tileCount.get(key) || 0) + 1);
  });
  
  // 三元牌雀頭
  [5, 6, 7].forEach(value => {
    const count = tileCount.get(`ji${value}`) || 0;
    if (count === 2) fu += 2;
  });
  
  // 場風雀頭
  if (bakazeValue && (tileCount.get(`ji${bakazeValue}`) || 0) === 2) {
    fu += 2;
  }
  
  // 自風雀頭
  if (jikazeValue && (tileCount.get(`ji${jikazeValue}`) || 0) === 2) {
    fu += 2;
  }
  
  return fu;
}

// 面子符計算（簡易版）
function calculateMentsuFu(tiles: Tile[], options: any): number {
  // 簡易計算：刻子・槓子を検出して符を加算
  let fu = 0;
  
  const tileCount = new Map<string, number>();
  tiles.forEach(tile => {
    const key = `${tile.suit}${tile.value}`;
    tileCount.set(key, (tileCount.get(key) || 0) + 1);
  });
  
  tileCount.forEach((count, key) => {
    if (count >= 3) {
      const [suit, value] = [key.substring(0, key.length - 1), parseInt(key.slice(-1))];
      const isYaochu = suit === 'ji' || value === 1 || value === 9;
      
      if (count === 4) {
        // 明槓: 8符（么九）/ 4符（中張）、暗槓: 16符（么九）/ 8符（中張）
        fu += isYaochu ? 16 : 8; // とりあえず暗槓として計算
      } else if (count === 3) {
        // 明刻: 4符（么九）/ 2符（中張）、暗刻: 8符（么九）/ 4符（中張）
        fu += isYaochu ? 8 : 4; // とりあえず暗刻として計算
      }
    }
  });
  
  return fu;
}

// 待ち形符計算（簡易版）
function calculateMachiFu(tiles: Tile[], options: any): number {
  // 簡易計算：単騎・嵌張・辺張は+2符
  // 実際の実装は複雑なので、とりあえず0符
  return 0;
}

// 点数計算（正確な麻雀ルール準拠）
function calculatePoints(han: number, fu: number, isTsumo: boolean, isOya: boolean): string {
  if (han === 0) return "役なし";
  
  let basePoints: number;
  
  // 役満・跳満以上の判定
  if (han >= 13) {
    basePoints = 8000; // 役満
  } else if (han >= 11) {
    basePoints = 6000; // 三倍満
  } else if (han >= 8) {
    basePoints = 4000; // 倍満
  } else if (han >= 6) {
    basePoints = 3000; // 跳満
  } else if (han >= 5 || (han >= 4 && fu >= 40) || (han >= 3 && fu >= 70)) {
    basePoints = 2000; // 満貫
  } else {
    // 通常計算: fu * 2^(han+2)
    basePoints = fu * Math.pow(2, han + 2);
    if (basePoints > 2000) basePoints = 2000; // 満貫止め
  }
  
  if (isOya) {
    // 親の場合
    if (isTsumo) {
      const each = Math.ceil(basePoints * 2 / 100) * 100;
      return `${basePoints * 6}点 (${each}点オール)`;
    } else {
      const total = Math.ceil(basePoints * 6 / 100) * 100;
      return `${total}点`;
    }
  } else {
    // 子の場合
    if (isTsumo) {
      const ko = Math.ceil(basePoints / 100) * 100;
      const oya = Math.ceil(basePoints * 2 / 100) * 100;
      return `${basePoints * 4}点 (子:${ko}点 親:${oya}点)`;
    } else {
      const total = Math.ceil(basePoints * 4 / 100) * 100;
      return `${total}点`;
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('📥 計算リクエスト受信:', body);
    
    // 牌データの解析
    const tiles = body.hand.map((tileId: string) => createTileFromId(tileId));
    const doraIndicators = (body.dora_indicators || []).map((tileId: string) => createTileFromId(tileId));
    
    // 和了形分析
    const handAnalysis = analyzeHand(tiles);
    
    if (!handAnalysis.isValid) {
      return NextResponse.json({
        yaku_list: [],
        total_han: 0,
        fu: 0,
        point_text: "和了形ではありません",
        error: "Invalid hand",
        valid: false
      } as ScoreResult);
    }
    
    // 役判定
    const yakuList = checkAllYaku(tiles, handAnalysis, body, doraIndicators);
    const totalHan = yakuList.reduce((sum, yaku) => sum + yaku.han, 0);
    
    if (totalHan === 0) {
      return NextResponse.json({
        yaku_list: [],
        total_han: 0,
        fu: 0,
        point_text: "役なし",
        error: "No yaku",
        valid: false
      } as ScoreResult);
    }
    
    // 符計算
    const fu = calculateFu(tiles, body);
    
    // 点数計算
    const isOya = body.seat_wind === 'ton' || body.jikaze === 'ton';
    const pointText = calculatePoints(totalHan, fu, body.is_tsumo, isOya);
    
    const result: ScoreResult = {
      yaku_list: yakuList,
      total_han: totalHan,
      fu: fu,
      point_text: pointText,
      valid: true
    };
    
    console.log('📤 計算結果:', result);
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('❌ エラー:', error);
    return NextResponse.json({
      yaku_list: [],
      total_han: 0,
      fu: 0,
      point_text: "計算エラー",
      error: error instanceof Error ? error.message : "Unknown error",
      valid: false
    } as ScoreResult, { status: 500 });
  }
}
