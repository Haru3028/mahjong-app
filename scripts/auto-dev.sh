#!/bin/bash

# 高度なポート管理スクリプト
echo "🚀 麻雀アプリ自動起動スクリプト"
echo "================================"

# 設定
FRONTEND_PORT=3002
API_PORT=4000
MAX_RETRIES=3

# ポート検索関数（空いているポートを探す）
find_available_port() {
    local base_port=$1
    local max_attempts=10
    
    for ((i=0; i<max_attempts; i++)); do
        local test_port=$((base_port + i))
        if ! lsof -ti:$test_port > /dev/null 2>&1; then
            echo $test_port
            return 0
        fi
    done
    
    return 1
}

# 安全なポート開放
safe_port_cleanup() {
    local port=$1
    local name=$2
    
    echo "🔄 ポート$port ($name) のクリーンアップ..."
    
    # 関連プロセスを特定して終了
    if [ "$name" = "Frontend" ]; then
        pkill -f "next.*dev" 2>/dev/null || true
        pkill -f "PORT=$port" 2>/dev/null || true
    elif [ "$name" = "API" ]; then
        pkill -f "ruby.*api_server" 2>/dev/null || true
        pkill -f "WEBrick.*$port" 2>/dev/null || true
    fi
    
    # ポート直接クリーンアップ
    lsof -ti:$port | xargs kill -9 2>/dev/null || true
    
    sleep 2
    
    # 確認
    if lsof -ti:$port > /dev/null 2>&1; then
        echo "⚠️  ポート$port の完全なクリーンアップに失敗"
        return 1
    else
        echo "✅ ポート$port ($name) クリーンアップ完了"
        return 0
    fi
}

# 環境変数設定
setup_environment() {
    echo "📝 環境変数設定..."
    
    # ポート情報をファイルに保存（他のスクリプトから参照可能）
    cat > .env.ports << EOF
FRONTEND_PORT=$FRONTEND_PORT
API_PORT=$API_PORT
FRONTEND_URL=http://localhost:$FRONTEND_PORT
API_URL=http://localhost:$API_PORT
EOF
    
    echo "✅ 環境変数設定完了"
}

# ヘルスチェック関数
health_check() {
    local max_wait=30
    local wait_count=0
    
    echo "🏥 サーバーヘルスチェック開始..."
    
    while [ $wait_count -lt $max_wait ]; do
        # APIサーバーチェック
        if curl -s "http://localhost:$API_PORT/api/health" > /dev/null 2>&1; then
            echo "✅ APIサーバー (port $API_PORT) 正常起動"
            
            # フロントエンドサーバーチェック
            if curl -s "http://localhost:$FRONTEND_PORT" > /dev/null 2>&1; then
                echo "✅ フロントエンドサーバー (port $FRONTEND_PORT) 正常起動"
                echo "🎯 全サーバー正常起動完了！"
                echo "🌐 アクセスURL: http://localhost:$FRONTEND_PORT"
                return 0
            fi
        fi
        
        echo "⏳ サーバー起動待機中... ($((wait_count + 1))/$max_wait)"
        sleep 1
        wait_count=$((wait_count + 1))
    done
    
    echo "⚠️  ヘルスチェックタイムアウト"
    return 1
}

# メイン処理
main() {
    echo "🧹 事前クリーンアップ..."
    safe_port_cleanup $FRONTEND_PORT "Frontend"
    safe_port_cleanup $API_PORT "API"
    
    echo
    echo "📡 ポート競合チェック..."
    
    # フロントエンドポート確認
    if lsof -ti:$FRONTEND_PORT > /dev/null 2>&1; then
        echo "⚠️  フロントエンドポート$FRONTEND_PORT が使用中"
        alt_port=$(find_available_port $FRONTEND_PORT)
        if [ $? -eq 0 ]; then
            echo "🔄 代替ポート $alt_port を使用します"
            FRONTEND_PORT=$alt_port
        else
            echo "❌ 利用可能なポートが見つかりません"
            exit 1
        fi
    fi
    
    # APIポート確認
    if lsof -ti:$API_PORT > /dev/null 2>&1; then
        echo "⚠️  APIポート$API_PORT が使用中"
        alt_port=$(find_available_port $API_PORT)
        if [ $? -eq 0 ]; then
            echo "🔄 代替ポート $alt_port を使用します"
            API_PORT=$alt_port
            # Ruby APIサーバーのポート設定も更新が必要
            echo "⚠️  APIサーバーのポート設定手動更新が必要です"
        else
            echo "❌ 利用可能なポートが見つかりません"
            exit 1
        fi
    fi
    
    setup_environment
    
    echo
    echo "🚀 サーバー起動..."
    echo "   Frontend: http://localhost:$FRONTEND_PORT"
    echo "   API:      http://localhost:$API_PORT"
    echo
}

# 実行
main
