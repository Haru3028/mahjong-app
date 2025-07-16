# 麻雀アプリケーション起動手順

## 1. 依存関係のインストール
```bash
npm install
```

## 2. 開発サーバーの起動
```bash
npm run dev
```

## 3. ブラウザでアクセス
http://localhost:3000 にアクセス

## トラブルシューティング

### 問題が発生した場合：

1. **キャッシュクリア**
   ```bash
   npm run build
   ```

2. **依存関係の再インストール**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **TypeScriptエラーチェック**
   ```bash
   npx tsc --noEmit
   ```

### よくある問題：

- 画像が表示されない → `/public/tiles/`ディレクトリに画像ファイルがあることを確認
- コンポーネントがレンダリングされない → ブラウザの開発者ツールでエラーを確認
- スタイルが適用されない → TailwindCSSの設定を確認
