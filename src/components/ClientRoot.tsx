"use client";

import { SessionProvider } from "next-auth/react";
import UserStatus from "./UserStatus";
import { PlayerCountProvider } from "../context/PlayerCountContext";


export default function ClientRoot({ children }: { children: React.ReactNode }) {
  return (
    <PlayerCountProvider>
      <SessionProvider>
        {/* <MenuBackButton /> 削除: グローバル固定表示を解除 */}
        <div className="w-full flex justify-end items-center px-4 py-2">
          <UserStatus />
        </div>
        {children}
      </SessionProvider>
    </PlayerCountProvider>
  );
}
