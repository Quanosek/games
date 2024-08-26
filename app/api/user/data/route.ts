import { NextResponse } from "next/server";
import db from "@/lib/db";
import { hash, compare } from "bcrypt";

// update user data
export async function POST(req: Request) {
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
    return NextResponse.json({ message: result }, { status: 200 });
  } catch (error) {
    // error response
    return NextResponse.json(
      { message: "Wystąpił nieoczekiwany błąd serwera", error },
      { status: 500 }
    );
  }
}
