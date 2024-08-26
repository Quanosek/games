import { NextResponse } from "next/server";
import db from "@/lib/db";
import { hash } from "bcrypt";

// create new user
export async function POST(req: Request) {
  const { email, password } = await req.json();

  try {
    // email taken
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Podany adres e-mail jest już zajęty" },
        { status: 409 }
      );
    }

    // secure password
    const hashPassword = await hash(password, 12);
    const { password: _, ...result } = await db.user.create({
      data: { email, password: hashPassword },
    });

    // return response
    return NextResponse.json(
      { message: "Pomyślnie utworzono nowe konto", result },
      { status: 201 }
    );
  } catch (error) {
    // error response
    return NextResponse.json(
      { message: "Wystąpił nieoczekiwany błąd serwera", error },
      { status: 500 }
    );
  }
}
