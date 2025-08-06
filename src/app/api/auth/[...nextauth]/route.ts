import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import { compare } from "bcryptjs";

const prisma = new PrismaClient();

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "ユーザー名", type: "text" },
        password: { label: "パスワード", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error("ユーザー名とパスワードは必須です");
        }
        const user = await prisma.user.findUnique({ where: { username: credentials.username } });
        if (!user) {
          throw new Error("ユーザーが見つかりません");
        }
        const isValid = await compare(credentials.password, user.passwordHash);
        if (!isValid) {
          throw new Error("パスワードが正しくありません");
        }
        return { id: user.id + "", name: user.username, email: user.email };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 365 * 10, // 10年
    updateAge: 60 * 60 * 24 * 30,    // 30日ごとに自動延長
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.sub;
      }
      return session;
    },
    async signIn({ user, account, profile, email, credentials }) {
      // ここでエラーがあればfalseを返すことでエラー画面に遷移できる
      return true;
    },
  },
});

export { handler as GET, handler as POST };
