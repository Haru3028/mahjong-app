"use client";
import { useState } from "react";
import MenuButtonList from "./MenuButtonList";

export default function MenuHamburger() {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col items-center w-full max-w-sm gap-4 mt-8">
      <button
        onClick={() => setOpen((v) => !v)}
        className="base-button w-60 text-center text-lg py-4 flex items-center justify-center gap-3"
        title="メニュー"
        style={{letterSpacing: '0.05em'}}
      >
        <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        メニューを開く
      </button>
      {open && (
        <div className="w-full flex flex-col items-center">
          <MenuButtonList />
        </div>
      )}
    </div>
  );
}
