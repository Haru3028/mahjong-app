import Link from 'next/link';

export default function ListPage() {
  return (
    <main className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold mb-8 text-yellow-400">一覧メニュー</h1>
      <div className="flex flex-col gap-6 w-full max-w-md items-center">
        <Link href="/yaku-list" className="base-button w-60 text-center text-lg py-4 bg-gray-800 hover:bg-yellow-700 text-white font-bold rounded shadow">
          役一覧
        </Link>
        <Link href="/score-table" className="base-button w-60 text-center text-lg py-4 bg-gray-800 hover:bg-yellow-700 text-white font-bold rounded shadow">
          点数表
        </Link>
        <Link href="/" className="base-button w-60 text-center text-lg py-4 bg-yellow-600 hover:bg-yellow-700 text-white font-bold rounded shadow mt-8">
          メニューに戻る
        </Link>
      </div>
    </main>
  );
}
