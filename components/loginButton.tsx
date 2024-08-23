"use client";

import Image from "next/image";
import Link from "next/link";
import { signOut } from "next-auth/react";

export default function LoginButtonComponent({ user }: { user: any }) {
  return (
    <div className="loginButton">
      {user ? (
        <button onClick={() => signOut()}>
          <p>{user.name}</p>
          <Image src={user.image ?? ""} alt="" width={30} height={30} />
        </button>
      ) : (
        <Link href="/login">Zaloguj się</Link>
      )}
    </div>
  );
}
