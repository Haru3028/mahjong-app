# 麻雀の牌クラス
class MahjongTile
  attr_reader :id, :name, :type, :value, :is_red_dora

  def initialize(id, name, type, value, is_red_dora = false)
    @id = id
    @name = name
    @type = type  # 'manzu', 'pinzu', 'souzu', 'jihai'
    @value = value
    @is_red_dora = is_red_dora
  end

  def ==(other)
    @id == other.id
  end

  def to_h
    {
      id: @id,
      name: @name,
      type: @type,
      value: @value,
      is_red_dora: @is_red_dora
    }
  end
end

# 鳴きクラス
class Furo
  attr_reader :type, :tiles

  def initialize(type, tiles)
    @type = type  # 'pon', 'chi', 'kan'
    @tiles = tiles
  end

  def to_h
    {
      type: @type,
      tiles: @tiles.map(&:to_h)
    }
  end
end

# 役の結果クラス
class YakuResult
  attr_reader :name, :han

  def initialize(name, han)
    @name = name
    @han = han
  end

  def to_h
    {
      name: @name,
      han: @han
    }
  end
end

# 点数計算結果クラス
class ScoreResult
  attr_reader :yaku_list, :han, :fu, :point_text

  def initialize(yaku_list, han, fu, point_text)
    @yaku_list = yaku_list
    @han = han
    @fu = fu
    @point_text = point_text
  end

  def to_h
    {
      yakuList: @yaku_list.map(&:to_h),
      han: @han,
      fu: @fu,
      pointText: @point_text
    }
  end
end
