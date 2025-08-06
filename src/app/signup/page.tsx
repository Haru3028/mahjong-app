"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, email, displayName }),
    });
    const data = await res.json();
    if (res.ok) {
      setSuccess("登録が完了しました。ログインしてください。");
      setTimeout(() => router.push("/login"), 1500);
    } else {
      setError(data.error || "登録に失敗しました");
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-2xl font-bold mb-6">新規登録</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-80 bg-white p-6 rounded shadow text-black">
        <input
          type="text"
          placeholder="ユーザー名"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="form-input-dark w-full"
          required
        />
        <input
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="form-input-dark w-full"
          required
        />
        <input
          type="email"
          placeholder="メールアドレス (任意)"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="form-input-dark w-full"
        />
        <input
          type="text"
          placeholder="表示名 (任意)"
          value={displayName}
          onChange={e => setDisplayName(e.target.value)}
          className="form-input-dark w-full"
        />
        {error && <div className="text-red-600 text-sm">{error}</div>}
        {success && <div className="text-green-600 text-sm">{success}</div>}
        <button type="submit" className="base-button w-60 text-center text-lg py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded shadow">新規登録</button>
      </form>
    </main>
  );
}
