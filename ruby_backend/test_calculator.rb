require 'json'
require_relative 'score_calculator'

# テスト用のサンプルデータ
def create_test_data
  # テスト用手牌：[1m, 2m, 3m, 4m, 5m, 6m, 7m, 8m, 9m, 1p, 1p, 1p, 東, 東]
  hand_tiles = [
    { 'id' => 'man1', 'name' => '一萬', 'type' => 'manzu', 'value' => 1, 'isRedDora' => false },
    { 'id' => 'man2', 'name' => '二萬', 'type' => 'manzu', 'value' => 2, 'isRedDora' => false },
    { 'id' => 'man3', 'name' => '三萬', 'type' => 'manzu', 'value' => 3, 'isRedDora' => false },
    { 'id' => 'man4', 'name' => '四萬', 'type' => 'manzu', 'value' => 4, 'isRedDora' => false },
    { 'id' => 'man5', 'name' => '五萬', 'type' => 'manzu', 'value' => 5, 'isRedDora' => false },
    { 'id' => 'man6', 'name' => '六萬', 'type' => 'manzu', 'value' => 6, 'isRedDora' => false },
    { 'id' => 'man7', 'name' => '七萬', 'type' => 'manzu', 'value' => 7, 'isRedDora' => false },
    { 'id' => 'man8', 'name' => '八萬', 'type' => 'manzu', 'value' => 8, 'isRedDora' => false },
    { 'id' => 'man9', 'name' => '九萬', 'type' => 'manzu', 'value' => 9, 'isRedDora' => false },
    { 'id' => 'pin1', 'name' => '一筒', 'type' => 'pinzu', 'value' => 1, 'isRedDora' => false },
    { 'id' => 'pin1', 'name' => '一筒', 'type' => 'pinzu', 'value' => 1, 'isRedDora' => false },
    { 'id' => 'pin1', 'name' => '一筒', 'type' => 'pinzu', 'value' => 1, 'isRedDora' => false },
    { 'id' => 'ton', 'name' => '東', 'type' => 'jihai', 'value' => 1, 'isRedDora' => false },
    { 'id' => 'ton', 'name' => '東', 'type' => 'jihai', 'value' => 1, 'isRedDora' => false }
  ]

  # ドラ表示牌
  dora_indicators = [
    { 'id' => 'man4', 'name' => '四萬', 'type' => 'manzu', 'value' => 4, 'isRedDora' => false }
  ]

  {
    'handTiles' => hand_tiles,
    'furoList' => [],
    'doraIndicators' => dora_indicators,
    'isTsumo' => true,
    'isRiichi' => true,
    'isDoubleRiichi' => false,
    'isIppatsu' => false,
    'isChankan' => false,
    'isRinshan' => false,
    'isHaitei' => false,
    'isHoutei' => false,
    'isTenho' => false,
    'isChiiho' => false,
    'bakaze' => '東',
    'jikaze' => '東'
  }
end

# テスト実行
puts "🀄 麻雀役判定・点数計算テスト"
puts "=" * 50

calculator = MahjongScoreCalculator.new
test_data = create_test_data

puts "テストデータ:"
puts "手牌: #{test_data['handTiles'].map { |t| t['name'] }.join(', ')}"
puts "ドラ表示牌: #{test_data['doraIndicators'].map { |t| t['name'] }.join(', ')}"
puts "リーチ: #{test_data['isRiichi'] ? 'あり' : 'なし'}"
puts "ツモ: #{test_data['isTsumo'] ? 'あり' : 'なし'}"
puts "場風: #{test_data['bakaze']}"
puts "自風: #{test_data['jikaze']}"
puts

result = calculator.calculate_score(test_data)

puts "計算結果:"
puts "総翻数: #{result.han}翻"
puts "符: #{result.fu}符"
puts "点数: #{result.point_text}"
puts
puts "役:"
if result.yaku_list.empty?
  puts "  役なし"
else
  result.yaku_list.each do |yaku|
    puts "  #{yaku.name}: #{yaku.han}翻"
  end
end

puts "\nJSON出力:"
puts JSON.pretty_generate(result.to_h)
