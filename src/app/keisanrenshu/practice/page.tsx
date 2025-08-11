"use client";
import React, { useEffect, useState } from "react";

// 入力履歴から練習問題を出すページ

// keisanrenshu/practice配下の画面は不要のため、トップページへのリダイレクトのみ
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PracticeFromHistoryPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/");
  }, [router]);
  return null;
}
