# -*- coding: utf-8 -*-
# encoding: utf-8
require_relative 'mahjong_types'
require_relative 'yaku_checker'
require_relative 'tenpai_checker'

class MahjongScoreCalculator
  def initialize
    @yaku_checker = MahjongYakuChecker.new
    # @tenpai_checker = TenpaiChecker.new  # 現在は使用していないのでコメントアウト
  end

  def calculate_score(params)
    # 牌データの変換 - 新しいAPI形式に対応
    puts "DEBUG: 手牌データ: #{params['hand']}"
    hand_tiles = parse_tiles(params['hand'] || [])
    puts "DEBUG: 解析後手牌: #{hand_tiles.map(&:name)}"
    furo_list = parse_furo_list(params['furo'] || [])
    dora_indicators = parse_tiles(params['dora_indicators'] || [])
    
    options = {
      is_tsumo: params['is_tsumo'] || false,
      is_riichi: params['is_riichi'] || false,
      is_double_riichi: params['is_double_riichi'] || false,
      is_ippatsu: params['is_ippatsu'] || false,
      is_chankan: params['is_chankan'] || false,
      is_rinshan: params['is_rinshan'] || false,
      is_haitei: params['is_haitei'] || false,
      is_houtei: params['is_houtei'] || false,
      is_tenho: params['is_tenho'] || false,
      is_chiiho: params['is_chiiho'] || false,
      bakaze: params['bakaze'] || '東',
      jikaze: params['jikaze'] || '東',
      dora_indicators: dora_indicators
    }

    # 簡易聴牌判定（14牌チェックのみ）
    furo_tile_count = furo_list.sum { |furo| furo.tiles.length }
    total_tiles = hand_tiles.length + furo_tile_count
    unless total_tiles == 14
      return ScoreResult.new([], 0, 0, 'Not 14 tiles')
    end

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

  def parse_tiles(tile_ids)
    tile_ids.map { |id| create_tile_from_id(id) }
  end

  def create_tile_from_id(tile_id)
    puts "DEBUG: creating tile from ID: #{tile_id}"
    case tile_id
    when /^man(\d+)(?:_red)?$/
      # 萬子 (man1, man5_red など)
      value = $1.to_i
      is_red = tile_id.include?('_red')
      MahjongTile.new(tile_id, "man#{value}", 'manzu', value, is_red)
    when /^pin(\d+)(?:_red)?$/
      # 筒子 (pin1, pin5_red など)
      value = $1.to_i
      is_red = tile_id.include?('_red')
      MahjongTile.new(tile_id, "pin#{value}", 'pinzu', value, is_red)
    when /^sou(\d+)(?:_red)?$/
      # 索子 (sou1, sou5_red など)
      value = $1.to_i
      is_red = tile_id.include?('_red')
      MahjongTile.new(tile_id, "sou#{value}", 'souzu', value, is_red)
    when /^m(\d+)r?$/
      # 萬子 (m1, m5r など - 旧形式対応)
      value = $1.to_i
      is_red = tile_id.include?('r')
      MahjongTile.new(tile_id, "man#{value}", 'manzu', value, is_red)
    when /^p(\d+)r?$/
      # 筒子 (p1, p5r など - 旧形式対応)
      value = $1.to_i
      is_red = tile_id.include?('r')
      MahjongTile.new(tile_id, "pin#{value}", 'pinzu', value, is_red)
    when /^s(\d+)r?$/
      # 索子 (s1, s5r など - 旧形式対応)
      value = $1.to_i
      is_red = tile_id.include?('r')
      MahjongTile.new(tile_id, "sou#{value}", 'souzu', value, is_red)
    when 'ji_ton', 'ton'
      MahjongTile.new(tile_id, '東', 'jihai', 1, false)
    when 'ji_nan', 'nan'
      MahjongTile.new(tile_id, '南', 'jihai', 2, false)
    when 'ji_sha', 'shaa'
      MahjongTile.new(tile_id, '西', 'jihai', 3, false)
    when 'ji_pei', 'pei'
      MahjongTile.new(tile_id, '北', 'jihai', 4, false)
    when 'ji_haku', 'haku'
      MahjongTile.new(tile_id, '白', 'jihai', 5, false)
    when 'ji_hatsu', 'hatsu'
      MahjongTile.new(tile_id, '發', 'jihai', 6, false)
    when 'ji_chun', 'chun'
      MahjongTile.new(tile_id, '中', 'jihai', 7, false)
    else
      raise ArgumentError, "Invalid tile ID: #{tile_id}"
    end
  end

  def parse_furo_list(furo_data)
    furo_data.map do |furo|
      tiles = parse_tiles(furo['tiles'] || [])
      furo_type = furo['type']
      Furo.new(furo_type, tiles)
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
    return '役なし'.force_encoding('UTF-8') if han == 0
    
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

# 結果を格納するクラス
class ScoreResult
  attr_reader :yaku_list, :han, :fu, :point_text

  def initialize(yaku_list, han, fu, point_text)
    @yaku_list = yaku_list
    @han = han
    @fu = fu
    @point_text = point_text
  end

  def to_h
    if @point_text.is_a?(String) && (@point_text.include?('役なし') || @point_text.include?('Not 14 tiles'))
      # エラーケース
      {
        success: false,
        error: @point_text,
        han: @han,
        fu: @fu,
        yaku: @yaku_list.map(&:to_h)
      }
    else
      # 成功ケース
      # 点数テキストから数値を抽出
      total_score = extract_total_score(@point_text)
      
      {
        success: true,
        total_score: total_score,
        han: @han,
        fu: @fu,
        yaku: @yaku_list.map(&:to_h),
        dora_count: 0, # TODO: ドラ数の計算を実装
        payment_info: parse_payment_info(@point_text)
      }
    end
  end

  private

  def extract_total_score(point_text)
    case point_text
    when /(\d+)オール/
      $1.to_i * 3
    when /(\d+)\/(\d+)/
      $1.to_i + $2.to_i * 2
    when /^(\d+)$/
      $1.to_i
    else
      0
    end
  end

  def parse_payment_info(point_text)
    case point_text
    when /(\d+)オール/
      { ko_payment: $1.to_i, oya_payment: $1.to_i }
    when /(\d+)\/(\d+)/
      { ko_payment: $1.to_i, oya_payment: $2.to_i }
    else
      nil
    end
  end
end
