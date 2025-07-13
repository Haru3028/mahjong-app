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
    check_sanshoku_doujun(hand_tiles, furo_list)
    check_ittsu(hand_tiles, furo_list)
    check_toitoi(hand_tiles, furo_list)
    check_sanankou(hand_tiles, furo_list, is_tsumo)
    check_sankantsu(furo_list)
    check_chiitoitsu(hand_tiles, menzen)
    check_honroutou(hand_tiles, furo_list)
    check_shousangen(hand_tiles, furo_list)
    check_honitsu(hand_tiles, furo_list)
    check_chinitsu(hand_tiles, furo_list)
    
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
    
    # 簡易判定：雀頭が役牌でない、面子が全て順子
    # 実際の実装では、和了形の解析が必要
    @yaku_list << YakuResult.new('平和', 1) if can_be_pinfu(hand_tiles)
  end

  # 一盃口
  def check_iipeikou(hand_tiles, menzen)
    return unless menzen
    
    # 同じ順子が2組あるかチェック（簡易版）
    if has_identical_sequences(hand_tiles)
      @yaku_list << YakuResult.new('一盃口', 1)
    end
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

  # ヘルパーメソッド
  def count_tiles(tiles)
    counts = Hash.new(0)
    tiles.each { |tile| counts[tile.id] += 1 }
    counts
  end

  def can_be_pinfu(hand_tiles)
    # 簡易実装：実際には和了形の詳細な解析が必要
    false
  end

  def has_identical_sequences(hand_tiles)
    # 簡易実装：同じ順子があるかチェック
    false
  end

  def has_sanshoku_sequence(tiles)
    # 簡易実装：三色同順があるかチェック
    false
  end

  def has_ittsu(tiles)
    # 簡易実装：一気通貫があるかチェック
    false
  end

  def is_all_triplets(tiles)
    # 簡易実装：全て刻子かチェック
    false
  end

  def count_concealed_triplets(hand_tiles, is_tsumo)
    # 簡易実装：暗刻の数をカウント
    0
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
