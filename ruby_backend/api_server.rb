require 'json'
require_relative 'score_calculator'

# シンプルなHTTPサーバー
require 'webrick'

class MahjongAPIServer
  def initialize(port = 4000)
    @port = port
    @calculator = MahjongScoreCalculator.new
    @server = WEBrick::HTTPServer.new(
      Port: @port,
      Logger: WEBrick::Log.new($stderr, WEBrick::Log::INFO),
      AccessLog: []
    )
    setup_routes
  end

  def setup_routes
    # CORS対応
    @server.mount_proc '/' do |req, res|
      res['Access-Control-Allow-Origin'] = 'http://localhost:3002'  # フロントエンドポート
      res['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
      res['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
      
      if req.request_method == 'OPTIONS'
        res.status = 200
        res.body = ''
        next
      end

      # ルーティング
      case req.path
      when '/api/calc_score'
        handle_calc_score(req, res)
      when '/api/health'
        handle_health(req, res)
      else
        res.status = 404
        res.body = JSON.generate({ error: 'Not Found' })
      end
    end
  end

  def handle_calc_score(req, res)
    if req.request_method != 'POST'
      res.status = 405
      res.body = JSON.generate({ error: 'Method Not Allowed' })
      return
    end

    begin
      # JSONパラメータの解析
      params = JSON.parse(req.body)
      
      # 点数計算実行
      result = @calculator.calculate_score(params)
      
      # レスポンス
      res['Content-Type'] = 'application/json'
      res.status = 200
      res.body = JSON.generate(result.to_h)
      
    rescue JSON::ParserError => e
      res.status = 400
      res.body = JSON.generate({ error: 'Invalid JSON', message: e.message })
    rescue => e
      res.status = 500
      res.body = JSON.generate({ error: 'Internal Server Error', message: e.message })
    end
  end

  def handle_health(req, res)
    res['Content-Type'] = 'application/json'
    res.status = 200
    res.body = JSON.generate({ 
      status: 'ok', 
      message: 'Mahjong API Server is running',
      timestamp: Time.now.iso8601
    })
  end

  def start
    puts "🀄 麻雀API サーバーを起動中... http://localhost:#{@port}"
    puts "健康チェック: http://localhost:#{@port}/api/health"
    puts "計算エンドポイント: POST http://localhost:#{@port}/api/calc_score"
    puts "Ctrl+Cで停止"
    
    trap('INT') { @server.shutdown }
    @server.start
  end
end

# サーバー起動
if __FILE__ == $0
  server = MahjongAPIServer.new(4000)
  server.start
end
