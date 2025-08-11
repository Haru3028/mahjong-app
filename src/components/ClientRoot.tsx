"use client";
import { SessionProvider } from "next-auth/react";
import UserStatus from "./UserStatus";
import MenuBackButton from "./MenuBackButton";

export default function ClientRoot({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <MenuBackButton />
      <div className="w-full flex justify-end items-center px-4 py-2">
        <UserStatus />
      </div>
      {children}
    </SessionProvider>
  );
}
