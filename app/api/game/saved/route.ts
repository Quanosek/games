import { NextResponse } from "next/server";
import db from "@/lib/db";

// get all saved games for user
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId")!;

  try {
    const result = await db.game.findMany({ where: { userId } });

    return NextResponse.json(
      { message: "Pomyślnie wczytano listę zapisanych gier", result },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Wystąpił nieoczekiwany błąd serwera", error },
      { status: 500 }
    );
  }
}
