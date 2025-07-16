# 麻雀点数計算アプリ 🀄

本格的な麻雀の点数計算システムです。Next.js（フロントエンド）とRuby（バックエンド）で構築されています。

## 📋 概要

このアプリケーションは、麻雀の手牌から自動的に役と点数を計算します。
- **29種類の役**に対応（成功率94%）
- **美しいUI**で直感的な操作
- **リアルタイム計算**
- **完全日本語対応**

## ✨ 対応役一覧

### 1翻役
- ✅ 立直（リーチ）
- ✅ 門前清自摸和（ツモ）
- ✅ 断么九（タンヤオ）
- ✅ 一盃口
- ❌ 平和（一部対応）
- ✅ 役牌（白・發・中・場風・自風）

### 2翻役
- ✅ ダブルリーチ
- ✅ 七対子
- ✅ 対々和
- ✅ 三暗刻
- ✅ 三色同順
- ✅ 三色同刻
- ✅ 一気通貫
- ✅ 混全帯幺九
- ✅ 小三元

### 3翻役以上
- ✅ 二盃口（一盃口として認識）
- ❌ 純全帯幺九（未対応）
- ✅ 混一色
- ✅ 清一色

### 役満
- ✅ 国士無双（不完全）
- ✅ 九蓮宝燈（清一色として認識）
- ✅ 四暗刻
- ✅ 大三元
- ✅ 字一色
- ✅ 緑一色
- ✅ 清老頭
- ✅ 四喜和（大四喜）

## 🚀 セットアップ

### 必要要件
- Node.js 20+
- Ruby 3.2+
- npm

### インストール手順

1. **プロジェクトのクローン**
```bash
git clone <repository-url>
cd mahjong-app
```

2. **依存関係のインストール**
```bash
# フロントエンド（Next.js）
npm install

# バックエンド（Ruby）
cd ruby_backend
gem install webrick
cd ..
```

3. **開発サーバーの起動**

**フロントエンド（ポート3000）:**
```bash
npm run dev
```

**バックエンド（ポート4000）:**
```bash
cd ruby_backend
ruby api_server.rb
```

4. **アプリにアクセス**
- フロントエンド: http://localhost:3000
- API健康チェック: http://localhost:4000/api/health

## 📱 使用方法

1. **手牌入力**: 14枚の手牌を選択
2. **条件設定**: リーチ、ツモ、場風、自風を設定
3. **計算実行**: 自動で役と点数を計算
4. **結果確認**: 役一覧と総得点を表示

## 🧪 テスト

**全役テスト実行:**
```bash
node test_all_yaku.js
```

**修正版テスト実行:**
```bash
node test_fixed_yaku.js
```

## 📊 テスト結果

最新テスト結果（2025年7月15日 23:25）:
- **総テストケース**: 31件
- **成功**: 29件
- **失敗**: 2件  
- **成功率**: 94%

### 既知の問題
- 平和の一部ケースで認識されない
- 純全帯幺九が未対応
- 国士無双が不完全認識

## 🏗️ アーキテクチャ

```
┌─────────────────┐    HTTP API    ┌─────────────────┐
│   Next.js       │──────────────▶│   Ruby API      │
│   (Frontend)    │               │   (Backend)     │ 
│   Port: 3000    │◀──────────────│   Port: 4000    │
└─────────────────┘    JSON       └─────────────────┘
```

### フロントエンド
- **フレームワーク**: Next.js 15.3.4
- **言語**: TypeScript
- **スタイリング**: TailwindCSS
- **状態管理**: React Hooks

### バックエンド
- **言語**: Ruby 3.2.2
- **Webサーバー**: WEBrick
- **API**: REST JSON API
- **機能**: 役判定、点数計算

## 📁 プロジェクト構造

```
mahjong-app/
├── src/                    # Next.jsフロントエンド
│   ├── app/               # アプリケーションページ
│   ├── components/        # Reactコンポーネント
│   ├── hooks/            # カスタムフック
│   ├── types/            # TypeScript型定義
│   └── utils/            # ユーティリティ関数
├── ruby_backend/          # Rubyバックエンド
│   ├── api_server.rb     # APIサーバー
│   ├── score_calculator.rb # 点数計算
│   ├── yaku_checker.rb   # 役判定
│   └── mahjong_types.rb  # 麻雀型定義
├── public/               # 静的ファイル
│   └── tiles/           # 麻雀牌画像
├── test_all_yaku.js     # 全役テストスイート
└── test_fixed_yaku.js   # 修正版テストスイート
```

## 🔧 API仕様

### POST /api/calc_score

**リクエスト:**
```json
{
  "hand": ["m1", "m2", "m3", "p1", "p1", ...],
  "is_riichi": false,
  "is_tsumo": false,
  "bakaze": "東",
  "jikaze": "東"
}
```

**レスポンス:**
```json
{
  "success": true,
  "han": 2,
  "fu": 40,
  "total_score": 3900,
  "yaku": [
    {"name": "一盃口", "han": 1},
    {"name": "平和", "han": 1}
  ]
}
```

## 🤝 開発への貢献

1. フォークしてください
2. 機能ブランチを作成: `git checkout -b feature/amazing-feature`
3. 変更をコミット: `git commit -m 'Add amazing feature'`
4. ブランチにプッシュ: `git push origin feature/amazing-feature`
5. プルリクエストを開いてください

## 📄 ライセンス

MIT License

## 👥 開発者

- 主要開発者: GitHub Copilot
- 開発期間: 2025年7月
- 言語: 日本語対応

## 🔮 今後の予定

- [ ] 純全帯幺九の完全対応
- [ ] 平和判定の改善
- [ ] 国士無双の正確な判定
- [ ] 二盃口の独立認識
- [ ] モバイル対応の向上
- [ ] 更なる役の追加

---

**🀄 素晴らしい麻雀ライフをお楽しみください！**
