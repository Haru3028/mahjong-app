import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { username, password, email, displayName } = await req.json();
    if (!username || !password) {
      return NextResponse.json({ error: "ユーザー名とパスワードは必須です" }, { status: 400 });
    }
    const existing = await prisma.user.findUnique({ where: { username } });
    if (existing) {
      return NextResponse.json({ error: "既に同じユーザー名が存在します" }, { status: 409 });
    }
    const passwordHash = await hash(password, 10);
    const user = await prisma.user.create({
      data: {
        username,
        passwordHash,
        email,
        displayName,
      },
    });
    return NextResponse.json({ ok: true, user: { id: user.id, username: user.username, email: user.email } });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
}
