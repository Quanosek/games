import { NextResponse } from "next/server";
import db from "@/lib/db";

// get game from database
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id")!;

  try {
    const result = await db.game.findFirst({ where: { id } });

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

// create/update game in database
export async function POST(req: Request) {
  const request = await req.json();

  try {
    const result = await db.game.create({ data: request });

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
