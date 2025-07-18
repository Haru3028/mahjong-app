import Link from 'next/link';

export default function ListPage() {
  return (
    <main className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold mb-8 text-yellow-400">一覧メニュー</h1>
      <div className="flex flex-col gap-6 w-full max-w-md">
        <Link href="/yaku-list" className="base-button bg-gray-800 hover:bg-yellow-700 text-white font-bold rounded shadow text-center py-4 text-xl">
          役一覧
        </Link>
        <Link href="/score-table" className="base-button bg-gray-800 hover:bg-yellow-700 text-white font-bold rounded shadow text-center py-4 text-xl">
          点数表
        </Link>
      </div>
    </main>
  );
}
