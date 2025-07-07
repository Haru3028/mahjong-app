// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // Next.jsのApp Routerを使用している場合、以下のパスが含まれていることを確認してください
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brown: {
          800: '#4A2C20', // 深い茶色
        },
      },
      // もしbackgroundImageや他の設定があれば、ここにそのまま記述してください
    },
  },
  plugins: [],
};