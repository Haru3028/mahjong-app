#!/usr/bin/env ruby

require_relative 'ruby_backend/score_calculator'

# デバッグ用のシンプルテスト
puts "=== 一盃口テスト ==="
hand = ["m1", "m2", "m3", "m1", "m2", "m3", "p1", "p1", "s1", "s2", "s3", "s7", "s8", "s9"]
options = {
  is_riichi: false,
  is_tsumo: false,
  bakaze: "東",
  jikaze: "東"
}

puts "手牌: #{hand}"
result = MahjongScoreCalculator.new.calculate_score(hand, [], options)
puts "結果: #{result}"

puts "\n=== 平和テスト ==="
hand2 = ["m1", "m2", "m3", "p2", "p3", "p4", "p5", "p6", "p7", "s1", "s2", "s3", "s4", "s5"]
result2 = MahjongScoreCalculator.new.calculate_score(hand2, [], options)
puts "手牌: #{hand2}"
puts "結果: #{result2}"

puts "\n=== 三暗刻テスト ==="
hand3 = ["m1", "m1", "m1", "p2", "p2", "p2", "s3", "s3", "s3", "m5", "m6", "m7", "ton", "ton"]
result3 = MahjongScoreCalculator.new.calculate_score(hand3, [], options)
puts "手牌: #{hand3}"
puts "結果: #{result3}"

puts "\n=== 一気通貫テスト ==="
hand4 = ["m1", "m2", "m3", "m4", "m5", "m6", "m7", "m8", "m9", "p1", "p1", "p1", "s2", "s2"]
result4 = MahjongScoreCalculator.new.calculate_score(hand4, [], options)
puts "手牌: #{hand4}"
puts "結果: #{result4}"
