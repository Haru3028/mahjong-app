require_relative 'mahjong_types'

class MahjongYakuChecker
  def initialize
    @yaku_list = []
  end

  # メイン役判定メソッド
  def check_yaku(hand_tiles, furo_list, options = {})
    @yaku_list = []
    
    # オプションの取得
    is_tsumo = options[:is_tsumo] || false
    is_riichi = options[:is_riichi] || false
    is_double_riichi = options[:is_double_riichi] || false
    is_ippatsu = options[:is_ippatsu] || false
    is_chankan = options[:is_chankan] || false
    is_rinshan = options[:is_rinshan] || false
    is_haitei = options[:is_haitei] || false
    is_houtei = options[:is_houtei] || false
    is_tenho = options[:is_tenho] || false
    is_chiiho = options[:is_chiiho] || false
    bakaze = options[:bakaze] || '東'
    jikaze = options[:jikaze] || '東'
    dora_indicators = options[:dora_indicators] || []

    # 門前かどうか
    menzen = furo_list.empty?

    # 基本役のチェック
    check_riichi(is_riichi, is_double_riichi, menzen)
    check_tsumo(is_tsumo, menzen)
    check_ippatsu(is_ippatsu, is_riichi)
    check_situational_yaku(is_chankan, is_rinshan, is_haitei, is_houtei, is_tenho, is_chiiho)
    check_tanyao(hand_tiles, furo_list)
    check_yakuhai(hand_tiles, furo_list, bakaze, jikaze)
    check_pinfu(hand_tiles, furo_list)
    check_iipeikou(hand_tiles, menzen)
    check_ryanpeikou(hand_tiles, menzen)
    check_sanshoku_doujun(hand_tiles, furo_list)
    check_ittsu(hand_tiles, furo_list)
    check_toitoi(hand_tiles, furo_list)
    check_sanankou(hand_tiles, furo_list, is_tsumo)
    check_sankantsu(furo_list)
    
    # イーペーコーが成立していない場合のみ七対子をチェック
    unless @yaku_list.any? { |yaku| yaku.name == '一盃口' }
      check_chiitoitsu(hand_tiles, menzen)
    end
    
    check_honroutou(hand_tiles, furo_list)
    check_shousangen(hand_tiles, furo_list)
    check_honitsu(hand_tiles, furo_list)
    check_junchan(hand_tiles, furo_list)
    check_chinitsu(hand_tiles, furo_list)
    
    # 役満チェック（優先処理）
    yakuman_found = false
    check_kokushi(hand_tiles, menzen)
    yakuman_found = true if @yaku_list.any? { |yaku| yaku.han >= 13 }
    
    unless yakuman_found
      check_suuankou(hand_tiles, furo_list, is_tsumo)
      yakuman_found = true if @yaku_list.any? { |yaku| yaku.han >= 13 }
    end
    
    unless yakuman_found
      check_chuuren(hand_tiles, menzen)
      yakuman_found = true if @yaku_list.any? { |yaku| yaku.han >= 13 }
    end
    
    unless yakuman_found
      check_daisangen(hand_tiles, furo_list)
      check_shousuushii(hand_tiles, furo_list)
      check_daisuushii(hand_tiles, furo_list)
      check_tsuuiisou(hand_tiles, furo_list)
      check_ryuuiisou(hand_tiles, furo_list)
      check_chinroutou(hand_tiles, furo_list)
      check_suukantsu(furo_list)
    end
    
    # ドラ
    check_dora(hand_tiles, furo_list, dora_indicators)

    @yaku_list
  end

  private

  # リーチ系
  def check_riichi(is_riichi, is_double_riichi, menzen)
    if is_double_riichi && menzen
      @yaku_list << YakuResult.new('ダブルリーチ', 2)
    elsif is_riichi && menzen
      @yaku_list << YakuResult.new('立直', 1)
    end
  end

  # ツモ
  def check_tsumo(is_tsumo, menzen)
    if is_tsumo && menzen
      @yaku_list << YakuResult.new('門前清自摸和', 1)
    end
  end

  # 一発
  def check_ippatsu(is_ippatsu, is_riichi)
    if is_ippatsu && is_riichi
      @yaku_list << YakuResult.new('一発', 1)
    end
  end

  # 状況役
  def check_situational_yaku(is_chankan, is_rinshan, is_haitei, is_houtei, is_tenho, is_chiiho)
    @yaku_list << YakuResult.new('槍槓', 1) if is_chankan
    @yaku_list << YakuResult.new('嶺上開花', 1) if is_rinshan
    @yaku_list << YakuResult.new('海底摸月', 1) if is_haitei
    @yaku_list << YakuResult.new('河底撈魚', 1) if is_houtei
    @yaku_list << YakuResult.new('天和', 13) if is_tenho
    @yaku_list << YakuResult.new('地和', 13) if is_chiiho
  end

  # タンヤオ
  def check_tanyao(hand_tiles, furo_list)
    all_tiles = hand_tiles + furo_list.flat_map(&:tiles)
    
    # 1,9,字牌が含まれていないかチェック
    has_yaochuhai = all_tiles.any? do |tile|
      tile.type == 'jihai' || tile.value == 1 || tile.value == 9
    end
    
    unless has_yaochuhai
      @yaku_list << YakuResult.new('断么九', 1)
    end
  end

  # 役牌
  def check_yakuhai(hand_tiles, furo_list, bakaze, jikaze)
    all_tiles = hand_tiles + furo_list.flat_map(&:tiles)
    tile_counts = count_tiles(all_tiles)
    
    # 三元牌
    yakuhai_tiles = ['haku', 'hatsu', 'chun']
    yakuhai_tiles.each do |tile_id|
      if tile_counts[tile_id] && tile_counts[tile_id] >= 3
        case tile_id
        when 'haku'
          @yaku_list << YakuResult.new('白', 1)
        when 'hatsu'
          @yaku_list << YakuResult.new('發', 1)
        when 'chun'
          @yaku_list << YakuResult.new('中', 1)
        end
      end
    end
    
    # 風牌
    kaze_map = { '東' => 'ton', '南' => 'nan', '西' => 'shaa', '北' => 'pei' }
    
    # 場風
    bakaze_tile = kaze_map[bakaze]
    if tile_counts[bakaze_tile] && tile_counts[bakaze_tile] >= 3
      @yaku_list << YakuResult.new("場風 #{bakaze}", 1)
    end
    
    # 自風
    jikaze_tile = kaze_map[jikaze]
    if tile_counts[jikaze_tile] && tile_counts[jikaze_tile] >= 3
      @yaku_list << YakuResult.new("自風 #{jikaze}", 1)
    end
  end

  # 平和
  def check_pinfu(hand_tiles, furo_list)
    return if !furo_list.empty? # 門前のみ
    
    tile_counts = count_tiles(hand_tiles)
    
    # 雀頭（2枚の牌）を探す
    pairs = tile_counts.select { |tile_id, count| count == 2 }
    return unless pairs.size == 1
    
    pair_tile_id = pairs.keys.first
    
    # 雀頭が役牌でないかチェック（三元牌、風牌でない）
    yakuhai_tiles = ['haku', 'hatsu', 'chun', 'ton', 'nan', 'shaa', 'pei']
    return if yakuhai_tiles.include?(pair_tile_id)
    
    # 刻子がないかチェック
    triplets = tile_counts.select { |tile_id, count| count >= 3 }
    return unless triplets.empty?
    
    # 順子の形になっているかをより詳細にチェック
    sequences = find_sequences(tile_counts)
    return unless sequences.length >= 4 # 4つの順子が必要
    
    @yaku_list << YakuResult.new('平和', 1)
  end

  # 一盃口
  def check_iipeikou(hand_tiles, menzen)
    return unless menzen
    
    tile_counts = count_tiles(hand_tiles)
    
    # 同じ順子が2組あるかチェック
    sequences = find_sequences(tile_counts)
    sequence_counts = {}
    
    sequences.each do |seq|
      sequence_counts[seq] ||= 0
      sequence_counts[seq] += 1
    end
    
    # 同じ順子が2組以上ある場合
    if sequence_counts.values.any? { |count| count >= 2 }
      @yaku_list << YakuResult.new('一盃口', 1)
    end
  end
  
  # 二盃口
  def check_ryanpeikou(hand_tiles, menzen)
    return unless menzen
    
    tile_counts = count_tiles(hand_tiles)
    sequences = find_sequences(tile_counts)
    sequence_counts = {}
    
    sequences.each do |seq|
      sequence_counts[seq] ||= 0
      sequence_counts[seq] += 1
    end
    
    # 2組の同じ順子が2セットある場合（二盃口）
    double_sequences = sequence_counts.values.count { |count| count >= 2 }
    if double_sequences >= 2
      # 二盃口が成立した場合、一盃口は無効
      @yaku_list.reject! { |yaku| yaku.name == '一盃口' }
      @yaku_list << YakuResult.new('二盃口', 3)
    end
  end

  # 順子を見つけるヘルパーメソッド
  def find_sequences(tile_counts)
    sequences = []
    
    ['m', 'p', 's'].each do |suit|
      (1..7).each do |start|
        tile1 = "#{suit}#{start}"
        tile2 = "#{suit}#{start + 1}"
        tile3 = "#{suit}#{start + 2}"
        
        next unless tile_counts[tile1] && 
                   tile_counts[tile2] && 
                   tile_counts[tile3]
        
        # この順子が存在する回数を計算
        min_count = [
          tile_counts[tile1],
          tile_counts[tile2],
          tile_counts[tile3]
        ].min
        
        min_count.times do
          sequences << "#{suit}#{start}-#{start + 1}-#{start + 2}"
        end
      end
    end
    
    sequences
  end

  # 三色同順
  def check_sanshoku_doujun(hand_tiles, furo_list)
    all_tiles = hand_tiles + furo_list.flat_map(&:tiles)
    
    if has_sanshoku_sequence(all_tiles)
      han = furo_list.empty? ? 2 : 1  # 門前なら2翻、鳴きありなら1翻
      @yaku_list << YakuResult.new('三色同順', han)
    end
  end

  # 一気通貫
  def check_ittsu(hand_tiles, furo_list)
    all_tiles = hand_tiles + furo_list.flat_map(&:tiles)
    
    if has_ittsu(all_tiles)
      han = furo_list.empty? ? 2 : 1  # 門前なら2翻、鳴きありなら1翻
      @yaku_list << YakuResult.new('一気通貫', han)
    end
  end

  # 対々和
  def check_toitoi(hand_tiles, furo_list)
    all_tiles = hand_tiles + furo_list.flat_map(&:tiles)
    
    if is_all_triplets(all_tiles)
      @yaku_list << YakuResult.new('対々和', 2)
    end
  end

  # 三暗刻
  def check_sanankou(hand_tiles, furo_list, is_tsumo)
    # 手牌の中の暗刻をカウント
    concealed_triplets = count_concealed_triplets(hand_tiles, is_tsumo)
    
    if concealed_triplets >= 3
      @yaku_list << YakuResult.new('三暗刻', 2)
    end
  end

  # 三槓子
  def check_sankantsu(furo_list)
    kan_count = furo_list.count { |furo| furo.type == 'kan' }
    
    if kan_count >= 3
      @yaku_list << YakuResult.new('三槓子', 2)
    end
  end

  # 七対子
  def check_chiitoitsu(hand_tiles, menzen)
    return unless menzen
    return unless hand_tiles.length == 14
    
    tile_counts = count_tiles(hand_tiles)
    
    # 7つの対子
    if tile_counts.values.all? { |count| count == 2 } && tile_counts.size == 7
      @yaku_list << YakuResult.new('七対子', 2)
    end
  end

  # 混老頭
  def check_honroutou(hand_tiles, furo_list)
    all_tiles = hand_tiles + furo_list.flat_map(&:tiles)
    
    # 全て1,9,字牌
    if all_tiles.all? { |tile| tile.type == 'jihai' || tile.value == 1 || tile.value == 9 }
      @yaku_list << YakuResult.new('混老頭', 2)
    end
  end

  # 小三元
  def check_shousangen(hand_tiles, furo_list)
    all_tiles = hand_tiles + furo_list.flat_map(&:tiles)
    tile_counts = count_tiles(all_tiles)
    
    sangen_tiles = ['haku', 'hatsu', 'chun']
    sangen_counts = sangen_tiles.map { |tile| tile_counts[tile] || 0 }
    
    # 三元牌のうち2つが刻子、1つが雀頭
    triplets = sangen_counts.count { |count| count >= 3 }
    pairs = sangen_counts.count { |count| count == 2 }
    
    if triplets == 2 && pairs == 1
      @yaku_list << YakuResult.new('小三元', 2)
    end
  end

  # 混一色
  def check_honitsu(hand_tiles, furo_list)
    all_tiles = hand_tiles + furo_list.flat_map(&:tiles)
    
    # 1種類の数牌 + 字牌
    suit_types = all_tiles.reject { |tile| tile.type == 'jihai' }.map(&:type).uniq
    has_jihai = all_tiles.any? { |tile| tile.type == 'jihai' }
    
    if suit_types.size == 1 && has_jihai
      han = furo_list.empty? ? 3 : 2  # 門前なら3翻、鳴きありなら2翻
      @yaku_list << YakuResult.new('混一色', han)
    end
  end

  # 清一色
  def check_chinitsu(hand_tiles, furo_list)
    all_tiles = hand_tiles + furo_list.flat_map(&:tiles)
    
    # 1種類の数牌のみ
    suit_types = all_tiles.map(&:type).uniq
    
    if suit_types.size == 1 && !suit_types.include?('jihai')
      han = furo_list.empty? ? 6 : 5  # 門前なら6翻、鳴きありなら5翻
      @yaku_list << YakuResult.new('清一色', han)
    end
  end

  # ドラ
  def check_dora(hand_tiles, furo_list, dora_indicators)
    return if dora_indicators.empty?
    
    all_tiles = hand_tiles + furo_list.flat_map(&:tiles)
    dora_count = 0
    
    dora_indicators.each do |indicator|
      dora_tile_id = get_dora_tile_id(indicator.id)
      dora_count += all_tiles.count { |tile| tile.id == dora_tile_id }
    end
    
    # 赤ドラ
    red_dora_count = all_tiles.count(&:is_red_dora)
    
    total_dora = dora_count + red_dora_count
    
    if total_dora > 0
      @yaku_list << YakuResult.new('ドラ', total_dora)
    end
  end

  # 役満の判定メソッド群
  
  # 国士無双
  def check_kokushi(hand_tiles, menzen)
    return unless menzen
    return unless hand_tiles.length == 14
    
    # 13種の么九牌（正しいID形式）
    yaochuhai = ['m1', 'm9', 'p1', 'p9', 's1', 's9', 'ton', 'nan', 'shaa', 'pei', 'haku', 'hatsu', 'chun']
    tile_counts = count_tiles(hand_tiles)
    
    # 13種の么九牌すべてが含まれているかチェック
    yaochuhai_present = yaochuhai.count { |tile_id| tile_counts[tile_id] && tile_counts[tile_id] >= 1 }
    return unless yaochuhai_present == 13
    
    # 1つの牌が2枚ある（雀頭）
    pair_count = tile_counts.values.count { |count| count == 2 }
    return unless pair_count == 1
    
    # 国士無双が成立した場合、他の役は無効化
    @yaku_list.clear
    @yaku_list << YakuResult.new('国士無双', 13)
  end

  # 四暗刻
  def check_suuankou(hand_tiles, furo_list, is_tsumo)
    return unless furo_list.empty?  # 門前のみ
    
    # 簡易実装
    tile_counts = count_tiles(hand_tiles)
    triplet_count = tile_counts.values.count { |count| count == 3 }
    pair_count = tile_counts.values.count { |count| count == 2 }
    
    if triplet_count == 4 && pair_count == 1
      @yaku_list << YakuResult.new('四暗刻', 13)
    end
  end

  # 大三元
  def check_daisangen(hand_tiles, furo_list)
    all_tiles = hand_tiles + furo_list.flat_map(&:tiles)
    tile_counts = count_tiles(all_tiles)
    
    sangen = ['ji_haku', 'ji_hatsu', 'ji_chun']
    if sangen.all? { |tile_id| tile_counts[tile_id] && tile_counts[tile_id] >= 3 }
      @yaku_list << YakuResult.new('大三元', 13)
    end
  end

  # 小四喜
  def check_shousuushii(hand_tiles, furo_list)
    all_tiles = hand_tiles + furo_list.flat_map(&:tiles)
    tile_counts = count_tiles(all_tiles)
    
    winds = ['ji_ton', 'ji_nan', 'ji_sha', 'ji_pei']
    triplet_count = winds.count { |tile_id| tile_counts[tile_id] && tile_counts[tile_id] >= 3 }
    pair_count = winds.count { |tile_id| tile_counts[tile_id] && tile_counts[tile_id] == 2 }
    
    if triplet_count == 3 && pair_count == 1
      @yaku_list << YakuResult.new('小四喜', 13)
    end
  end

  # 大四喜
  def check_daisuushii(hand_tiles, furo_list)
    all_tiles = hand_tiles + furo_list.flat_map(&:tiles)
    tile_counts = count_tiles(all_tiles)
    
    winds = ['ji_ton', 'ji_nan', 'ji_sha', 'ji_pei']
    triplet_count = winds.count { |tile_id| tile_counts[tile_id] && tile_counts[tile_id] >= 3 }
    
    if triplet_count == 4
      @yaku_list << YakuResult.new('大四喜', 13)
    end
  end

  # 字一色
  def check_tsuuiisou(hand_tiles, furo_list)
    all_tiles = hand_tiles + furo_list.flat_map(&:tiles)
    
    if all_tiles.all? { |tile| tile.type == 'jihai' }
      @yaku_list << YakuResult.new('字一色', 13)
    end
  end

  # 緑一色
  def check_ryuuiisou(hand_tiles, furo_list)
    all_tiles = hand_tiles + furo_list.flat_map(&:tiles)
    green_tiles = ['sou2', 'sou3', 'sou4', 'sou6', 'sou8', 'ji_hatsu']
    
    if all_tiles.all? { |tile| green_tiles.include?(tile.id) }
      @yaku_list << YakuResult.new('緑一色', 13)
    end
  end

  # 清老頭
  def check_chinroutou(hand_tiles, furo_list)
    all_tiles = hand_tiles + furo_list.flat_map(&:tiles)
    terminal_tiles = ['man1', 'man9', 'pin1', 'pin9', 'sou1', 'sou9']
    
    if all_tiles.all? { |tile| terminal_tiles.include?(tile.id) }
      @yaku_list << YakuResult.new('清老頭', 13)
    end
  end

  # 四槓子
  def check_suukantsu(furo_list)
    kan_count = furo_list.count { |furo| furo.type == 'kan' || furo.type == 'ankan' || furo.type == 'minkan' }
    
    if kan_count == 4
      @yaku_list << YakuResult.new('四槓子', 13)
    end
  end

  # 九蓮宝燈
  def check_chuuren(hand_tiles, menzen)
    return unless menzen
    return unless hand_tiles.length == 14
    
    # 同じ色のみかチェック
    suits = hand_tiles.map(&:type).uniq
    return unless suits.length == 1 && ['manzu', 'pinzu', 'souzu'].include?(suits.first)
    
    tile_counts = count_tiles(hand_tiles)
    suit_prefix = suits.first == 'manzu' ? 'm' : (suits.first == 'pinzu' ? 'p' : 's')
    
    # 1112345678999のパターンかチェック
    actual_counts = (1..9).map { |n| tile_counts["#{suit_prefix}#{n}"] || 0 }
    
    # 基本形：1が3枚、2-8が1枚ずつ、9が3枚、そのうち1枚が追加
    base_pattern = [3, 1, 1, 1, 1, 1, 1, 1, 3]
    total_tiles = actual_counts.sum
    
    if total_tiles == 14
      # どれか1つの数字が基本パターンより1枚多いかチェック
      valid_chuuren = false
      (0..8).each do |i|
        test_pattern = base_pattern.dup
        test_pattern[i] += 1
        if actual_counts == test_pattern
          valid_chuuren = true
          break
        end
      end
      
      if valid_chuuren
        # 九蓮宝燈が成立した場合、他の役は無効化
        @yaku_list.clear
        @yaku_list << YakuResult.new('九蓮宝燈', 13)
      end
    end
  end

  # 純全帯幺九
  def check_junchan(hand_tiles, furo_list)
    all_tiles = hand_tiles + furo_list.flat_map(&:tiles)
    
    # 字牌が含まれていたら純全帯幺九ではない
    return if all_tiles.any? { |tile| tile.type == 'jihai' }
    
    # すべての面子・雀頭に1または9が含まれているかチェック
    tile_counts = count_tiles(all_tiles)
    
    # 1、9牌があるかチェック
    terminal_tiles = all_tiles.select { |tile| tile.value == 1 || tile.value == 9 }
    return if terminal_tiles.empty?
    
    # より詳細な面子構成チェックは簡略化
    # 1または9を含む刻子・順子が存在するかの簡易チェック
    has_terminal_mentsu = false
    
    # 刻子チェック
    tile_counts.each do |tile_id, count|
      if count >= 3
        tile = all_tiles.find { |t| t.id == tile_id }
        if tile && (tile.value == 1 || tile.value == 9)
          has_terminal_mentsu = true
          break
        end
      end
    end
    
    # 順子チェック（1-2-3, 7-8-9）
    unless has_terminal_mentsu
      ['m', 'p', 's'].each do |suit|
        # 1-2-3の順子
        if tile_counts["#{suit}1"] && tile_counts["#{suit}2"] && tile_counts["#{suit}3"]
          has_terminal_mentsu = true
          break
        end
        # 7-8-9の順子
        if tile_counts["#{suit}7"] && tile_counts["#{suit}8"] && tile_counts["#{suit}9"]
          has_terminal_mentsu = true
          break
        end
      end
    end
    
    if has_terminal_mentsu
      han = furo_list.empty? ? 3 : 2  # 門前なら3翻、鳴きありなら2翻
      @yaku_list << YakuResult.new('純全帯幺九', han)
    end
  end

  # ヘルパーメソッド
  def count_tiles(tiles)
    counts = Hash.new(0)
    tiles.each { |tile| counts[tile.id] += 1 }
    counts
  end

  def has_sanshoku_sequence(tiles)
    tile_counts = count_tiles(tiles)
    
    # 各数字で三色同順をチェック
    (1..7).each do |num|
      m_tile = "m#{num}"
      p_tile = "p#{num}"
      s_tile = "s#{num}"
      
      # 各色で同じ数字の順子があるかチェック
      if has_sequence_with_number(tile_counts, 'm', num) &&
         has_sequence_with_number(tile_counts, 'p', num) &&
         has_sequence_with_number(tile_counts, 's', num)
        return true
      end
    end
    
    false
  end
  
  def has_sequence_with_number(tile_counts, suit, start_num)
    return false if start_num > 7
    
    tile1 = "#{suit}#{start_num}"
    tile2 = "#{suit}#{start_num + 1}"
    tile3 = "#{suit}#{start_num + 2}"
    
    tile_counts[tile1] && tile_counts[tile1] > 0 &&
    tile_counts[tile2] && tile_counts[tile2] > 0 &&
    tile_counts[tile3] && tile_counts[tile3] > 0
  end

  def has_ittsu(tiles)
    tile_counts = count_tiles(tiles)
    
    # 各色で一気通貫をチェック
    ['m', 'p', 's'].each do |suit|
      if has_sequence_with_number(tile_counts, suit, 1) &&
         has_sequence_with_number(tile_counts, suit, 4) &&
         has_sequence_with_number(tile_counts, suit, 7)
        return true
      end
    end
    
    false
  end

  def is_all_triplets(tiles)
    tile_counts = count_tiles(tiles)
    
    # 雀頭（1組の対子）を除いて、すべて刻子（3枚）かチェック
    pairs = tile_counts.values.count { |count| count == 2 }
    triplets = tile_counts.values.count { |count| count == 3 || count == 4 }
    
    pairs == 1 && triplets >= 4
  end

  def count_concealed_triplets(hand_tiles, is_tsumo)
    tile_counts = count_tiles(hand_tiles)
    triplet_count = 0
    
    tile_counts.each do |tile_id, count|
      if count >= 3
        triplet_count += 1
      end
    end
    
    triplet_count
  end

  def get_dora_tile_id(indicator_id)
    # ドラ表示牌からドラ牌を取得
    dora_map = {
      'man1' => 'man2', 'man2' => 'man3', 'man3' => 'man4', 'man4' => 'man5',
      'man5' => 'man6', 'man6' => 'man7', 'man7' => 'man8', 'man8' => 'man9',
      'man9' => 'man1',
      'pin1' => 'pin2', 'pin2' => 'pin3', 'pin3' => 'pin4', 'pin4' => 'pin5',
      'pin5' => 'pin6', 'pin6' => 'pin7', 'pin7' => 'pin8', 'pin8' => 'pin9',
      'pin9' => 'pin1',
      'sou1' => 'sou2', 'sou2' => 'sou3', 'sou3' => 'sou4', 'sou4' => 'sou5',
      'sou5' => 'sou6', 'sou6' => 'sou7', 'sou7' => 'sou8', 'sou8' => 'sou9',
      'sou9' => 'sou1',
      'ton' => 'nan', 'nan' => 'shaa', 'shaa' => 'pei', 'pei' => 'ton',
      'haku' => 'hatsu', 'hatsu' => 'chun', 'chun' => 'haku'
    }
    dora_map[indicator_id] || indicator_id
  end
end
