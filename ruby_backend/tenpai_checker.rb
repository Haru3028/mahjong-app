# 聴牌判定クラス
class TenpaiChecker
  def self.is_tenpai?(hand_tiles, furo_list)
    # 手牌の牌数チェック
    total_tiles = hand_tiles.length + (furo_list.length * 3)
    
    # 14牌（和了形）でない場合は聴牌していない
    return false if total_tiles != 14
    
    # 手牌を牌IDでグループ化
    tile_counts = {}
    hand_tiles.each do |tile|
      base_id = tile.id.gsub('_red', '')  # 赤ドラを通常牌として扱う
      tile_counts[base_id] = (tile_counts[base_id] || 0) + 1
    end
    
    # 面子（メンツ）を除去して雀頭が残るかチェック
    check_winning_pattern(tile_counts)
  end
  
  private
  
  def self.check_winning_pattern(tile_counts)
    # 七対子チェック
    if tile_counts.values.all? { |count| count == 2 } && tile_counts.length == 7
      return true
    end
    
    # 通常の和了形チェック（1雀頭 + 4面子）
    check_standard_pattern(tile_counts.dup)
  end
  
  def self.check_standard_pattern(tile_counts)
    # 雀頭を探す
    tile_counts.each do |tile_id, count|
      if count >= 2
        # 雀頭として2枚使用
        tile_counts[tile_id] -= 2
        
        # 残りで4面子が作れるかチェック
        if check_mentsu_combinations(tile_counts, 4)
          tile_counts[tile_id] += 2  # 復元
          return true
        end
        
        tile_counts[tile_id] += 2  # 復元
      end
    end
    
    false
  end
  
  def self.check_mentsu_combinations(tile_counts, needed_mentsu)
    return true if needed_mentsu == 0
    
    # 刻子チェック
    tile_counts.each do |tile_id, count|
      if count >= 3
        tile_counts[tile_id] -= 3
        if check_mentsu_combinations(tile_counts, needed_mentsu - 1)
          tile_counts[tile_id] += 3  # 復元
          return true
        end
        tile_counts[tile_id] += 3  # 復元
      end
    end
    
    # 順子チェック（萬子、筒子、索子のみ）
    %w[man pin sou].each do |suit|
      (1..7).each do |num|
        tile1 = "#{suit}#{num}"
        tile2 = "#{suit}#{num + 1}"
        tile3 = "#{suit}#{num + 2}"
        
        if tile_counts[tile1] && tile_counts[tile2] && tile_counts[tile3] &&
           tile_counts[tile1] > 0 && tile_counts[tile2] > 0 && tile_counts[tile3] > 0
          
          tile_counts[tile1] -= 1
          tile_counts[tile2] -= 1
          tile_counts[tile3] -= 1
          
          if check_mentsu_combinations(tile_counts, needed_mentsu - 1)
            tile_counts[tile1] += 1  # 復元
            tile_counts[tile2] += 1
            tile_counts[tile3] += 1
            return true
          end
          
          tile_counts[tile1] += 1  # 復元
          tile_counts[tile2] += 1
          tile_counts[tile3] += 1
        end
      end
    end
    
    false
  end
end
