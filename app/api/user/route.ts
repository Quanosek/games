import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import db from "@/lib/db";
import { hash, compare } from "bcrypt";

// authenticated user session check
async function UserSession() {
  const session = await auth();

  const id = session?.user?.id;
  const user = await db.user.findUnique({ where: { id } });

  if (!(session && user)) {
    return NextResponse.json(
      { message: "Nieuprawniony dostęp" },
      { status: 401 }
    );
  }
}

// create new user
export async function POST(req: Request) {
  UserSession();

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

// update user data
export async function PUT(req: Request) {
  UserSession();

  const data = await req.json();

  try {
    // user not found
    const existingUser = await db.user.findUnique({
      where: { id: data.id },
    });

    if (!existingUser) {
      return NextResponse.json(
        { message: "Nie znaleziono konta użytkownika" },
        { status: 404 }
      );
    }

    // username taken
    if (data.username) {
      const usernameExists = await db.user.findUnique({
        where: { username: data.username },
      });

      if (usernameExists && usernameExists.id !== data.id) {
        return NextResponse.json(
          { message: "Nazwa użytkownika jest już zajęta" },
          { status: 406 }
        );
      }
    }

    let newData = { ...data };

    if (data.password) {
      // new password must be different
      if (existingUser.password) {
        const passwordMatch = await compare(
          data.password,
          existingUser.password
        );

        if (passwordMatch) {
          return NextResponse.json(
            { message: "Nowe hasło musi się różnić od obecnego" },
            { status: 406 }
          );
        }
      }

      // secure password
      const hashPassword = await hash(data.password, 12);
      newData = { ...data, password: hashPassword };
    }

    const { password: _, ...result } = await db.user.update({
      where: { id: data.id },
      data: newData,
    });

    // return response
    return NextResponse.json(
      { message: "Zaktualizowano dane użytkownika", result },
      { status: 200 }
    );
  } catch (error) {
    // error response
    return NextResponse.json(
      { message: "Wystąpił nieoczekiwany błąd serwera", error },
      { status: 500 }
    );
  }
}

// delete user account
export async function DELETE(req: Request) {
  UserSession();

  const { id } = await req.json();

  try {
    // user not found
    const existingUser = await db.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json(
        { message: "Nie znaleziono konta użytkownika" },
        { status: 404 }
      );
    }

    await db.user.delete({ where: { id } });

    // return response
    return NextResponse.json(
      { message: "Konto użytkownika zostało usunięte", existingUser },
      { status: 200 }
    );
  } catch (error) {
    // error response
    return NextResponse.json(
      { message: "Wystąpił nieoczekiwany błąd serwera", error },
      { status: 500 }
    );
  }
}
