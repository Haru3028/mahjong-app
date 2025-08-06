"use client";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { menuItems } from "./menuItems";

export default function UserStatus() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);

  if (status === "loading") return null;

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm text-gray-700 bg-white rounded px-3 py-2 shadow border border-gray-300">
        {session && session.user ? `${session.user.name} さんログイン中` : '未ログイン'}
      </span>
      <div className="relative">
        <button
          onClick={() => setOpen((v) => !v)}
          className="base-button text-center text-lg py-4 flex items-center justify-center gap-3"
          style={{ width: '181.59px' }}
          title="メニュー"
        >
          <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          メニュー
        </button>
        <div
          className={`absolute right-0 mt-2 z-50 flex flex-col items-center gap-2 bg-white shadow-lg rounded transition-transform transition-opacity duration-300 ease-out
            origin-bottom
            ${open ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto' : 'opacity-0 -translate-y-16 scale-90 pointer-events-none'}`}
          style={{ width: '181.59px', padding: '0.5rem 0' }}
        >
          {menuItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="base-button text-center"
              style={{
                width: '181.59px',
                height: '54.4px',
                fontSize: '1.125rem',
                padding: '0',
                lineHeight: '54.4px',
                margin: 0,
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: '#d1d5db',
                boxSizing: 'border-box',
                display: 'block',
                textAlign: 'center',
                fontWeight: 500,
              }}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </a>
          ))}
          {session && session.user ? (
            <button
              onClick={() => { setOpen(false); signOut({ callbackUrl: "/" }); }}
              className="base-button text-center text-red-500 border-red-400"
              style={{
                width: '181.59px',
                height: '54.4px',
                fontSize: '1.125rem',
                padding: '0',
                lineHeight: '54.4px',
                margin: 0,
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: '#f87171',
                boxSizing: 'border-box',
                display: 'block',
                textAlign: 'center',
                fontWeight: 500,
              }}
            >
              ログアウト
            </button>
          ) : (
            <>
              <a
                href="/login"
                className="base-button text-center text-blue-700 border-blue-400"
                style={{
                  width: '181.59px',
                  height: '54.4px',
                  fontSize: '1.125rem',
                  padding: '0',
                  lineHeight: '54.4px',
                  margin: 0,
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: '#60a5fa',
                  boxSizing: 'border-box',
                  display: 'block',
                  textAlign: 'center',
                  fontWeight: 500,
                }}
                onClick={() => setOpen(false)}
              >
                ログイン
              </a>
              <a
                href="/signup"
                className="base-button text-center text-green-700 border-green-400"
                style={{
                  width: '181.59px',
                  height: '54.4px',
                  fontSize: '1.125rem',
                  padding: '0',
                  lineHeight: '54.4px',
                  margin: 0,
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: '#34d399',
                  boxSizing: 'border-box',
                  display: 'block',
                  textAlign: 'center',
                  fontWeight: 500,
                }}
                onClick={() => setOpen(false)}
              >
                新規登録
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
