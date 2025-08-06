"use client";
import { SessionProvider } from "next-auth/react";
import UserStatus from "./UserStatus";

export default function ClientRoot({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <div className="w-full flex justify-end items-center px-4 py-2">
        <UserStatus />
      </div>
      {children}
    </SessionProvider>
  );
}
