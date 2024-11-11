import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import db from "@/lib/db";

// authenticated user session check
export default async function UserSession() {
  const session = await auth();
  const sessionUser = session?.user;

  const id = sessionUser?.id;
  const userData = await db.user.findUnique({ where: { id } });

  if (!(session && userData)) {
    return NextResponse.json(
      { message: "Nieuprawniony dostęp" },
      { status: 401 }
    );
  }
}
