
// src/app/layout.tsx


import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // グローバルCSSをインポート
import ClientRoot from "../components/ClientRoot";

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
      <body className={`${inter.className} bg-green-950`}>
        <ClientRoot>
          {children}
        </ClientRoot>
      </body>
    </html>
  );
}