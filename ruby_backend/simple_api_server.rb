require 'json'
require 'socket'
require_relative 'score_calculator'

class SimpleMahjongAPIServer
  def initialize(port = 4000)
    @port = port
    @calculator = MahjongScoreCalculator.new
  end

  def start
    puts "🀄 麻雀API サーバーを起動中... http://localhost:#{@port}"
    puts "健康チェック: http://localhost:#{@port}/api/health"
    puts "計算エンドポイント: POST http://localhost:#{@port}/api/calc_score"
    puts "Ctrl+Cで停止"
    
    server = TCPServer.open(@port)
    
    loop do
      Thread.start(server.accept) do |client|
        handle_request(client)
      end
    end
  rescue Interrupt
    puts "\n🀄 サーバーを停止しています..."
    server.close if server
  end

  private

  def handle_request(client)
    request = client.gets
    return unless request
    
    # HTTPリクエストの解析
    method, path, _ = request.split(' ')
    
    # ヘッダーとボディの読み込み
    headers = {}
    content_length = 0
    
    while line = client.gets
      line = line.chomp
      break if line.empty?
      
      key, value = line.split(':', 2)
      headers[key.downcase] = value.strip if value
      
      if key.downcase == 'content-length'
        content_length = value.strip.to_i
      end
    end
    
    # ボディの読み込み
    body = content_length > 0 ? client.read(content_length) : ''
    
    # CORS ヘッダー
    cors_headers = [
      "Access-Control-Allow-Origin: http://localhost:3000",
      "Access-Control-Allow-Methods: GET, POST, OPTIONS",
      "Access-Control-Allow-Headers: Content-Type, Authorization"
    ]
    
    # OPTIONSリクエストの処理
    if method == 'OPTIONS'
      response = "HTTP/1.1 200 OK\r\n"
      response += cors_headers.join("\r\n") + "\r\n"
      response += "Content-Length: 0\r\n\r\n"
      client.print response
      client.close
      return
    end
    
    # ルーティング
    case path
    when '/api/calc_score'
      handle_calc_score(client, method, body, cors_headers)
    when '/api/health'
      handle_health(client, cors_headers)
    else
      handle_not_found(client, cors_headers)
    end
    
    client.close
  end

  def handle_calc_score(client, method, body, cors_headers)
    if method != 'POST'
      send_response(client, 405, { error: 'Method Not Allowed' }, cors_headers)
      return
    end

    begin
      # JSONパラメータの解析
      params = JSON.parse(body)
      
      # 点数計算実行
      result = @calculator.calculate_score(params)
      
      # レスポンス
      send_response(client, 200, result.to_h, cors_headers)
      
    rescue JSON::ParserError => e
      send_response(client, 400, { error: 'Invalid JSON', message: e.message }, cors_headers)
    rescue => e
      send_response(client, 500, { error: 'Internal Server Error', message: e.message }, cors_headers)
    end
  end

  def handle_health(client, cors_headers)
    send_response(client, 200, { 
      status: 'ok', 
      message: 'Mahjong API Server is running',
      timestamp: Time.now.strftime('%Y-%m-%d %H:%M:%S')
    }, cors_headers)
  end

  def handle_not_found(client, cors_headers)
    send_response(client, 404, { error: 'Not Found' }, cors_headers)
  end

  def send_response(client, status, data, cors_headers)
    json_data = JSON.generate(data)
    
    response = "HTTP/1.1 #{status} #{status_text(status)}\r\n"
    response += "Content-Type: application/json\r\n"
    response += cors_headers.join("\r\n") + "\r\n"
    response += "Content-Length: #{json_data.bytesize}\r\n\r\n"
    response += json_data
    
    client.print response
  end

  def status_text(status)
    case status
    when 200 then 'OK'
    when 400 then 'Bad Request'
    when 404 then 'Not Found'
    when 405 then 'Method Not Allowed'
    when 500 then 'Internal Server Error'
    else 'Unknown'
    end
  end
end

# サーバー起動
if __FILE__ == $0
  server = SimpleMahjongAPIServer.new(4000)
  server.start
end
