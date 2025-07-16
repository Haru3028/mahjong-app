#!/bin/bash

echo "=== 複数役組み合わせテスト開始 ==="
echo

# テスト1: 面前清自摸和 + タンヤオ + ピンフ + イーペーコー
echo "テスト 1: 面前清自摸和 + タンヤオ + ピンフ + イーペーコー"
echo "手牌: m2,m3,m4,m5,m6,m7,p2,p3,p4,p5,p6,p7,s4,s4"
curl -s -X POST http://localhost:4000/calculate_score \
  -H "Content-Type: application/json" \
  -d '{
    "hand": ["m2","m3","m4","m5","m6","m7","p2","p3","p4","p5","p6","p7","s4","s4"],
    "is_tsumo": true,
    "bakaze": "東",
    "jikaze": "東"
  }' | python3 -m json.tool 2>/dev/null || echo "JSONエラー"
echo "---"
echo

# テスト2: タンヤオ + ピンフ + イーペーコー（ロン）
echo "テスト 2: タンヤオ + ピンフ + イーペーコー（ロン）"
echo "手牌: m2,m3,m4,m5,m6,m7,p2,p3,p4,p5,p6,p7,s4,s4"
curl -s -X POST http://localhost:4000/calculate_score \
  -H "Content-Type: application/json" \
  -d '{
    "hand": ["m2","m3","m4","m5","m6","m7","p2","p3","p4","p5","p6","p7","s4","s4"],
    "is_tsumo": false,
    "bakaze": "東",
    "jikaze": "東"
  }' | python3 -m json.tool 2>/dev/null || echo "JSONエラー"
echo "---"
echo

# テスト3: 面前清自摸和 + リーチ + 一発 + ピンフ + タンヤオ
echo "テスト 3: 面前清自摸和 + リーチ + 一発 + ピンフ + タンヤオ"
echo "手牌: m3,m4,m5,m6,m7,m8,p3,p4,p5,p6,p7,p8,s2,s2"
curl -s -X POST http://localhost:4000/calculate_score \
  -H "Content-Type: application/json" \
  -d '{
    "hand": ["m3","m4","m5","m6","m7","m8","p3","p4","p5","p6","p7","p8","s2","s2"],
    "is_tsumo": true,
    "is_riichi": true,
    "is_ippatsu": true,
    "bakaze": "東",
    "jikaze": "東"
  }' | python3 -m json.tool 2>/dev/null || echo "JSONエラー"
echo "---"
echo

# テスト4: リャンペーコー + タンヤオ + 面前清自摸和
echo "テスト 4: リャンペーコー + タンヤオ + 面前清自摸和"
echo "手牌: m2,m3,m4,m2,m3,m4,p5,p6,p7,p5,p6,p7,s8,s8"
curl -s -X POST http://localhost:4000/calculate_score \
  -H "Content-Type: application/json" \
  -d '{
    "hand": ["m2","m3","m4","m2","m3","m4","p5","p6","p7","p5","p6","p7","s8","s8"],
    "is_tsumo": true,
    "bakaze": "東",
    "jikaze": "東"
  }' | python3 -m json.tool 2>/dev/null || echo "JSONエラー"
echo "---"
echo

# テスト5: ホンイツ + イーペーコー + 面前清自摸和
echo "テスト 5: ホンイツ + イーペーコー + 面前清自摸和"
echo "手牌: m1,m2,m3,m4,m5,m6,m7,m8,m9,m2,m3,m4,haku,haku"
curl -s -X POST http://localhost:4000/calculate_score \
  -H "Content-Type: application/json" \
  -d '{
    "hand": ["m1","m2","m3","m4","m5","m6","m7","m8","m9","m2","m3","m4","haku","haku"],
    "is_tsumo": true,
    "bakaze": "東",
    "jikaze": "東"
  }' | python3 -m json.tool 2>/dev/null || echo "JSONエラー"
echo "---"
echo

echo "=== テスト完了 ==="
