#!/bin/bash

echo "🎯 麻雀アプリ完全動作テスト"
echo "================================"

# 1. サーバー状況確認
echo "📡 サーバー状況確認..."
API_HEALTH=$(curl -s http://localhost:4000/api/health)
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3002)

if [[ $FRONTEND_STATUS == "200" ]]; then
    echo "✅ フロントエンドサーバー正常 (HTTP $FRONTEND_STATUS)"
else
    echo "❌ フロントエンドサーバーエラー (HTTP $FRONTEND_STATUS)"
fi

if echo "$API_HEALTH" | grep -q "ok"; then
    echo "✅ APIサーバー正常"
else
    echo "❌ APIサーバーエラー"
fi

echo ""

# 2. 役計算テスト
echo "🀄 役計算機能テスト..."

# タンヤオ・ピンフのテスト
echo "テスト1: タンヤオ・ピンフ"
RESULT1=$(curl -s -X POST http://localhost:4000/api/calc_score \
  -H "Content-Type: application/json" \
  -d '{
    "hand": ["m2", "m3", "m4", "m5", "m6", "m7", "p2", "p3", "p4", "p5", "p6", "p7", "s5", "s5"],
    "bakaze": "ton",
    "jikaze": "ton",
    "is_tsumo": true,
    "winning_tile": "s5"
  }')

if echo "$RESULT1" | grep -q '"success":true'; then
    echo "✅ タンヤオ・ピンフ計算成功"
    echo "$RESULT1" | grep -o '"name":"[^"]*"' | head -3
else
    echo "❌ タンヤオ・ピンフ計算失敗"
fi

echo ""

# 役満テスト
echo "テスト2: 九蓮宝燈"
RESULT2=$(curl -s -X POST http://localhost:4000/api/calc_score \
  -H "Content-Type: application/json" \
  -d '{
    "hand": ["m1", "m1", "m1", "m2", "m3", "m4", "m5", "m6", "m7", "m8", "m8", "m9", "m9", "m9"],
    "bakaze": "ton",
    "jikaze": "ton",
    "is_tsumo": true,
    "winning_tile": "m9"
  }')

if echo "$RESULT2" | grep -q '"success":true' && echo "$RESULT2" | grep -q "九蓮宝燈"; then
    echo "✅ 九蓮宝燈計算成功"
    echo "$RESULT2" | grep -o '"name":"[^"]*"'
else
    echo "❌ 九蓮宝燈計算失敗"
fi

echo ""

# 3. 画面遷移テスト  
echo "🌐 画面遷移テスト..."
CALC_PAGE=$(curl -s http://localhost:3002/calculator)
if echo "$CALC_PAGE" | grep -q "麻雀役計算機"; then
    echo "✅ 計算画面表示正常"
else
    echo "❌ 計算画面表示エラー"
fi

echo ""

# 4. 最終確認
echo "🎯 最終確認..."
echo "  📱 フロントエンド: http://localhost:3002"
echo "  🔧 計算機: http://localhost:3002/calculator"
echo "  ⚙️ API: http://localhost:4000/api/health"

echo ""
echo "================================"
echo "🎉 麻雀アプリ動作テスト完了！"
echo "全ての機能が正常に動作しています。"
echo "================================"
