// src/app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // グローバルCSSをインポート

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "麻雀点数計算機", // プロジェクト全体でのタイトル設定
  description: "麻雀の点数を計算するアプリケーション",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      {/* bodyタグに直接背景色クラスを適用することで、アプリ全体の背景を制御 */}
      <body className={`${inter.className} bg-green-950`}> 
        {children}
      </body>
    </html>
  );
}