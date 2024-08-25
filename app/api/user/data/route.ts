import { NextResponse } from "next/server";
import db from "@/lib/db";

// set new user data
export async function POST(req: Request) {
  const data = await req.json();

  // get user data
  const user = await db.user.findUnique({
    where: { id: data.id },
  });

  if (!user) {
    return NextResponse.json(
      { message: "Nie znaleziono konta użytkownika" },
      { status: 404 }
    );
  }

  // update user data
  const { password, ...result } = await db.user.update({
    where: { id: data.id },
    data: { ...data },
  });

  return NextResponse.json({ message: result }, { status: 200 });
}
