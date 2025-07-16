#!/bin/bash

echo "🔧 麻雀アプリ修復スクリプト"
echo "================================"

# 1. 既存プロセスをクリーンアップ
echo "🧹 プロセスクリーンアップ..."
pkill -f "next\|npm\|ruby" 2>/dev/null || true
sleep 2

# 2. ポート確認
echo "📡 ポート状況確認..."
if lsof -Pi :3002 -sTCP:LISTEN -t >/dev/null; then
    echo "⚠️  ポート3002が使用中"
    lsof -ti:3002 | xargs kill -9 2>/dev/null || true
else
    echo "✅ ポート3002は空いています"
fi

if lsof -Pi :4000 -sTCP:LISTEN -t >/dev/null; then
    echo "⚠️  ポート4000が使用中"
    lsof -ti:4000 | xargs kill -9 2>/dev/null || true
else
    echo "✅ ポート4000は空いています"
fi

# 3. Node modules チェック
echo "📦 依存関係確認..."
if [ ! -d "node_modules" ]; then
    echo "🔄 npm install実行中..."
    npm install
fi

# 4. TypeScript型チェック
echo "🔍 TypeScript型チェック..."
npx tsc --noEmit || echo "⚠️  型エラーがあります"

# 5. サーバー再起動
echo "🚀 サーバー起動..."
npm run dev &
DEV_PID=$!

# 6. サーバー起動待機
echo "⏳ サーバー起動待機中..."
sleep 10

# 7. ヘルスチェック
echo "🏥 ヘルスチェック..."
if curl -s http://localhost:4000/api/health >/dev/null; then
    echo "✅ APIサーバー正常"
else
    echo "❌ APIサーバーエラー"
fi

if curl -s http://localhost:3002 >/dev/null; then
    echo "✅ フロントエンドサーバー正常"
else
    echo "❌ フロントエンドサーバーエラー"
fi

echo "================================"
echo "🎯 修復完了！"
echo "🌐 アクセスURL: http://localhost:3002"
echo "⚙️  API URL: http://localhost:4000/api/health"
echo ""
echo "⚠️  エラーが続く場合は、ブラウザの開発者ツールでエラー詳細を確認してください"
