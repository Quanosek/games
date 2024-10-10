import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId")!;
  const type = searchParams.get("type")!;

  try {
    const result = await db.game.findFirst({
      where: { userId, type },
    });

    return NextResponse.json(
      { message: "Pomyślnie wczytano grę z twojego konta", result },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Wystąpił nieoczekiwany błąd serwera", error },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const { userId, type, data } = await req.json();

  try {
    const result = await db.game.create({
      data: { userId, type, data },
    });

    return NextResponse.json(
      { message: "Pomyślnie zapisano nową grę", result },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Wystąpił nieoczekiwany błąd serwera", error },
      { status: 500 }
    );
  }
}
