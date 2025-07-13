require_relative 'mahjong_types'
require_relative 'yaku_checker'

class MahjongScoreCalculator
  def initialize
    @yaku_checker = MahjongYakuChecker.new
  end

  def calculate_score(params)
    # パラメータの解析
    hand_tiles = parse_tiles(params['handTiles'] || [])
    furo_list = parse_furo_list(params['furoList'] || [])
    dora_indicators = parse_tiles(params['doraIndicators'] || [])
    
    options = {
      is_tsumo: params['isTsumo'] || false,
      is_riichi: params['isRiichi'] || false,
      is_double_riichi: params['isDoubleRiichi'] || false,
      is_ippatsu: params['isIppatsu'] || false,
      is_chankan: params['isChankan'] || false,
      is_rinshan: params['isRinshan'] || false,
      is_haitei: params['isHaitei'] || false,
      is_houtei: params['isHoutei'] || false,
      is_tenho: params['isTenho'] || false,
      is_chiiho: params['isChiiho'] || false,
      bakaze: params['bakaze'] || '東',
      jikaze: params['jikaze'] || '東',
      dora_indicators: dora_indicators
    }

    # 役判定
    yaku_list = @yaku_checker.check_yaku(hand_tiles, furo_list, options)
    
    # 翻数計算
    total_han = yaku_list.sum(&:han)
    
    # 符計算（簡易版）
    fu = calculate_fu(hand_tiles, furo_list, options)
    
    # 点数計算
    point_text = calculate_points(total_han, fu, options[:is_tsumo], is_oya?(options[:jikaze]))
    
    ScoreResult.new(yaku_list, total_han, fu, point_text)
  end

  private

  def parse_tiles(tiles_data)
    tiles_data.map do |tile_data|
      MahjongTile.new(
        tile_data['id'],
        tile_data['name'],
        tile_data['type'],
        tile_data['value'],
        tile_data['isRedDora'] || false
      )
    end
  end

  def parse_furo_list(furo_data)
    furo_data.map do |furo|
      tiles = parse_tiles(furo['tiles'])
      Furo.new(furo['type'], tiles)
    end
  end

  def calculate_fu(hand_tiles, furo_list, options)
    # 簡易符計算
    base_fu = 20
    
    # ツモ
    base_fu += 2 if options[:is_tsumo]
    
    # 門前ロン
    base_fu += 10 if !options[:is_tsumo] && furo_list.empty?
    
    # 雀頭・面子による符（簡易版）
    base_fu += 10  # 仮の値
    
    # 10符単位で切り上げ
    ((base_fu + 9) / 10) * 10
  end

  def calculate_points(han, fu, is_tsumo, is_oya)
    # 役なし
    return '役なし' if han == 0
    
    # 満貫以上
    case han
    when 13..Float::INFINITY
      return is_oya ? '48000' : '32000'  # 役満
    when 11..12
      return is_oya ? '36000' : '24000'  # 三倍満
    when 8..10
      return is_oya ? '24000' : '16000'  # 倍満
    when 6..7
      return is_oya ? '18000' : '12000'  # 跳満
    when 5
      return is_oya ? '12000' : '8000'   # 満貫
    end

    # 通常の点数計算
    base_points = fu * (2 ** (han + 2))
    
    if is_oya
      # 親
      if is_tsumo
        ko_payment = ((base_points * 2 + 99) / 100) * 100
        "#{ko_payment}オール"
      else
        ron_points = ((base_points * 6 + 99) / 100) * 100
        ron_points.to_s
      end
    else
      # 子
      if is_tsumo
        ko_payment = ((base_points + 99) / 100) * 100
        oya_payment = ((base_points * 2 + 99) / 100) * 100
        "#{ko_payment}/#{oya_payment}"
      else
        ron_points = ((base_points * 4 + 99) / 100) * 100
        ron_points.to_s
      end
    end
  end

  def is_oya?(jikaze)
    jikaze == '東'
  end
end
