#!/usr/bin/env ruby
# -*- coding: utf-8 -*-

require 'webrick'
require 'json'

# 必要なファイルを読み込み
begin
  require_relative 'score_calculator'
  require_relative 'mahjong_types'
  require_relative 'yaku_checker'
  puts "✅ 麻雀計算エンジンを正常に読み込みました"
rescue LoadError => e
  puts "❌ 計算エンジンの読み込みに失敗: #{e.message}"
  exit 1
end

# WEBrickサーバーの設定
server = WEBrick::HTTPServer.new(
  Port: 4000,
  Logger: WEBrick::Log.new(nil),
  AccessLog: []
)

# 麻雀計算エンジンの初期化
calculator = MahjongScoreCalculator.new

# CORSヘッダーを追加するヘルパーメソッド
def add_cors_headers(response)
  response['Access-Control-Allow-Origin'] = '*'
  response['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
  response['Access-Control-Allow-Headers'] = 'Content-Type'
  response['Content-Type'] = 'application/json'
end

# 健康チェックエンドポイント
server.mount_proc '/api/health' do |request, response|
  add_cors_headers(response)
  
  health_data = {
    status: 'ok',
    message: 'API Server Running',
    timestamp: Time.now.to_s,
    version: '1.0.0'
  }
  
  response.body = health_data.to_json
end

# 麻雀点数計算エンドポイント
server.mount_proc '/api/calc_score' do |request, response|
  add_cors_headers(response)
  
  # OPTIONS リクエストの処理
  if request.request_method == 'OPTIONS'
    response.status = 200
    response.body = ''
    next
  end
  
  begin
    # POSTデータの読み取り
    request_body = request.body
    if request_body.nil? || request_body.empty?
      raise ArgumentError, "リクエストボディが空です"
    end
    
    # JSONパース
    params = JSON.parse(request_body)
    puts "📥 計算リクエスト受信: #{params}"
    
    # 麻雀計算エンジンの実行
    result = calculator.calculate_score(params)
    
    # 結果をJSONに変換
    response_data = result.to_h
    puts "📤 計算結果送信: #{response_data}"
    
    response.body = response_data.to_json
    
  rescue JSON::ParserError => e
    puts "❌ JSON解析エラー: #{e.message}"
    error_response = {
      success: false,
      error: "JSONの形式が正しくありません",
      details: e.message
    }
    response.body = error_response.to_json
    
  rescue ArgumentError => e
    puts "❌ 引数エラー: #{e.message}"
    error_response = {
      success: false,
      error: e.message
    }
    response.body = error_response.to_json
    
  rescue => e
    puts "❌ 計算エラー: #{e.message}"
    puts e.backtrace.join("\n")
    error_response = {
      success: false,
      error: "計算中にエラーが発生しました",
      details: e.message
    }
    response.body = error_response.to_json
  end
end

# シャットダウン処理
trap("INT") do
  puts "\n🛑 APIサーバーを停止中..."
  server.shutdown
end

# サーバー開始
puts "🚀 麻雀API サーバーを起動しています..."
puts "📍 URL: http://localhost:4000"
puts "🩺 健康チェック: http://localhost:4000/api/health"
puts "🧮 計算エンドポイント: POST http://localhost:4000/api/calc_score"
puts "⏹️  停止する場合は Ctrl+C を押してください"
puts "=" * 50

begin
  server.start
rescue => e
  puts "❌ サーバー起動エラー: #{e.message}"
  exit 1
end
