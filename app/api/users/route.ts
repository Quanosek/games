import { NextResponse } from "next/server";
import db from "@/lib/db";
import { hash } from "bcrypt";

// create new user
export async function POST(req: Request) {
  const data = await req.json();

  try {
    const existingUser = await db.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Podany adres e-mail jest zajęty" },
        { status: 409 }
      );
    }

    const password = await hash(data.password, 12);

    const { password: _, ...user } = await db.user.create({
      data: { email: data.email, password },
    });

    return NextResponse.json(
      { message: "Pomyślnie utworzono nowe konto", user },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Wystąpił nieoczekiwany błąd serwera", error },
      { status: 500 }
    );
  }
}
