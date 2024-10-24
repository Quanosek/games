import { NextResponse } from "next/server";
import db from "@/lib/db";

// get game info by id
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

// create new game
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

// update game data by id
export async function PUT(req: Request) {
  const request = await req.json();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id")!;

  try {
    const result = await db.game.update({ where: { id }, data: request });

    return NextResponse.json(
      { message: "Pomyślnie zaktualizowano grę", result },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Wystąpił nieoczekiwany błąd serwera", error },
      { status: 500 }
    );
  }
}

// delete game
export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id")!;

  try {
    const result = await db.game.delete({ where: { id } });

    return NextResponse.json(
      { message: "Pomyślnie usunięto grę", result },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Wystąpił nieoczekiwany błąd serwera", error },
      { status: 500 }
    );
  }
}
