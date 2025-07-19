import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

export async function GET() {
  const prisma = new PrismaClient();
  const quizzes = await prisma.quiz.findMany();
  return NextResponse.json(quizzes);
}
