// tailwind.config.js

/** @type {import('tailwindcss').Config} */
module.exports = {
  // Tailwind CSSがクラス名をスキャンするパスを定義
  // srcフォルダ内の全てのjs/ts/jsx/tsx/mdxファイルを対象とします
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // カスタムカラーパレットの定義
      // これにより、Tailwindのデフォルトカラーに加え、麻雀らしい色を使用できます
      colors: {
        'green-950': '#0A260A', // 深い麻雀卓の緑
        'green-900': '#133F13',
        'green-800': '#1C591C',
        'green-700': '#2A7A2A',
        'lime-600': '#65A30D', // 明るい緑系の枠線
        'amber-200': '#FCD34D', // 点数計算ボタンの明るい黄色
        'amber-300': '#FBBF24', // 見出しや文字色
        'amber-400': '#FBBE07', // より強調したい色
        'amber-500': '#F59E0B', // 枠線やアクセント
        'amber-700': '#B45309', // シャドウ用
        'amber-950': '#451A03', // 計算ボタンの文字色
        'yellow-600': '#D97706', // ドラ選択ボタンの金色
        'yellow-500': '#EAB308', // ドラ選択ボタンのホバー色
      },
      // その他のTailwind拡張（既存のものを維持）
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
  safelist: [
    "p-4", "py-3", "px-8", "rounded-xl", "font-bold", "shadow-lg", "hover:shadow-xl",
    "transition-all", "duration-300", "transform", "hover:scale-105", "border",
    "bg-green-950", "text-amber-200", "text-green-950", "bg-amber-200", "border-amber-400",
    "hover:bg-amber-300", "hover:text-green-900", "bg-green-700", "text-amber-100", "border-green-800",
    "hover:bg-green-600", "hover:text-amber-200", "bg-red-500", "text-white", "border-red-700",
    "hover:bg-red-600", "bg-yellow-500", "border-yellow-600", "hover:bg-yellow-400",
    "bg-stone-800", "hover:bg-stone-700", "text-amber-200", "border-amber-700"
  ],
};