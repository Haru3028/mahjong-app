#!/bin/bash

echo "🔧 ポート設定チェック & 自動開放"
echo "================================"

# 必要なポートリスト
FRONTEND_PORT=3002
API_PORT=4000

# ポート開放関数
open_port_if_needed() {
    local port=$1
    local name=$2
    
    # ポートが使用中かチェック
    if lsof -ti:$port > /dev/null 2>&1; then
        echo "⚠️  ポート$port ($name) が使用中です"
        echo "🔄 ポート$port のプロセスを終了中..."
        
        # プロセスを強制終了
        lsof -ti:$port | xargs kill -9 2>/dev/null || true
        sleep 1
        
        # 再チェック
        if lsof -ti:$port > /dev/null 2>&1; then
            echo "❌ ポート$port の解放に失敗しました"
            return 1
        else
            echo "✅ ポート$port ($name) を解放しました"
        fi
    else
        echo "✅ ポート$port ($name) は利用可能です"
    fi
    
    return 0
}

# ファイアウォール設定チェック (Linuxの場合)
check_firewall() {
    local port=$1
    local name=$2
    
    # UFWが有効かチェック
    if command -v ufw >/dev/null 2>&1 && ufw status | grep -q "Status: active"; then
        echo "🔥 ファイアウォール設定チェック: ポート$port ($name)"
        
        # ポートが許可されているかチェック
        if ! ufw status | grep -q "$port"; then
            echo "🔓 ポート$port を開放中..."
            sudo ufw allow $port/tcp 2>/dev/null || echo "⚠️  ファイアウォール設定をスキップ (権限不足)"
        else
            echo "✅ ポート$port は既に許可されています"
        fi
    else
        echo "ℹ️  ファイアウォールは無効または未インストール"
    fi
}

# メイン処理
main() {
    echo "📡 必要なポートの確認と開放..."
    echo
    
    # フロントエンドポート
    open_port_if_needed $FRONTEND_PORT "Frontend/Next.js"
    check_firewall $FRONTEND_PORT "Frontend"
    echo
    
    # APIポート
    open_port_if_needed $API_PORT "API/Ruby"
    check_firewall $API_PORT "API"
    echo
    
    echo "🌐 ポート設定完了"
    echo "   Frontend: http://localhost:$FRONTEND_PORT"
    echo "   API:      http://localhost:$API_PORT"
    echo "================================"
}

# スクリプト実行
main
