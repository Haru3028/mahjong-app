#!/bin/bash

echo "🀄 麻雀アプリ包括テスト開始"
echo "=============================="

# APIサーバーヘルスチェック
echo "📡 APIサーバー確認..."
health_response=$(curl -s http://localhost:4000/api/health)
if echo "$health_response" | grep -q '"status":"ok"'; then
    echo "✅ APIサーバー正常"
else
    echo "❌ APIサーバーエラー"
    exit 1
fi

# テストケース1: 面前清自摸和 + タンヤオ + ピンフ + イーペーコー
echo
echo "🧪 テスト1: 面前清自摸和 + タンヤオ + ピンフ + イーペーコー"
result1=$(curl -s -X POST http://localhost:4000/api/calc_score -H "Content-Type: application/json" -d '{
  "hand": ["m2","m3","m4","m5","m6","m7","p2","p3","p4","p5","p6","p7","s4","s4"],
  "is_tsumo": true,
  "bakaze": "東",
  "jikaze": "東"
}')

if echo "$result1" | grep -q '"success":true'; then
    han=$(echo "$result1" | grep -o '"han":[0-9]*' | cut -d':' -f2)
    echo "✅ 成功: ${han}翻"
else
    echo "❌ 失敗"
fi

# テストケース2: リャンペーコー + タンヤオ + 面前清自摸和
echo
echo "🧪 テスト2: リャンペーコー + タンヤオ + 面前清自摸和"
result2=$(curl -s -X POST http://localhost:4000/api/calc_score -H "Content-Type: application/json" -d '{
  "hand": ["m2","m3","m4","m2","m3","m4","p5","p6","p7","p5","p6","p7","s8","s8"],
  "is_tsumo": true,
  "bakaze": "東",
  "jikaze": "東"
}')

if echo "$result2" | grep -q '"success":true'; then
    han=$(echo "$result2" | grep -o '"han":[0-9]*' | cut -d':' -f2)
    echo "✅ 成功: ${han}翻"
else
    echo "❌ 失敗"
fi

# テストケース3: 国士無双
echo
echo "🧪 テスト3: 国士無双"
result3=$(curl -s -X POST http://localhost:4000/api/calc_score -H "Content-Type: application/json" -d '{
  "hand": ["m1","m9","p1","p9","s1","s9","ton","nan","shaa","pei","haku","hatsu","chun","m1"],
  "is_tsumo": true,
  "bakaze": "東",
  "jikaze": "東"
}')

if echo "$result3" | grep -q '"success":true'; then
    han=$(echo "$result3" | grep -o '"han":[0-9]*' | cut -d':' -f2)
    echo "✅ 成功: ${han}翻"
else
    echo "❌ 失敗"
fi

echo
echo "=============================="
echo "🎯 テスト完了！"

# フロントエンドURLを表示
echo
echo "🌐 アプリアクセスURL:"
echo "   メイン: http://localhost:3002"
echo "   計算機: http://localhost:3002/calculator"
echo
echo "⚙️  APIエンドポイント:"
echo "   ヘルス: http://localhost:4000/api/health"
echo "   計算: http://localhost:4000/api/calc_score"
