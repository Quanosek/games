"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";

export default function LoginButtonComponent({ user }: any) {
  // handle add buttons list show
  const [showButtonsList, setShowButtonsList] = useState(false);

  useEffect(() => {
    const hideButtonsList = () => setShowButtonsList(false);

    if (showButtonsList) document.addEventListener("click", hideButtonsList);
    return () => document.removeEventListener("click", hideButtonsList);
  }, [showButtonsList]);

  return (
    <>
      {user ? (
        <div className="loginButton">
          <button onClick={() => setShowButtonsList(true)}>
            <p>{user.username ?? user.email}</p>
            {user.image && (
              <Image alt="" src={user.image ?? ""} width={100} height={100} />
            )}
          </button>

          <div
            className="list"
            style={{ display: showButtonsList ? "" : "none" }}
          >
            <Link href="/profile" className="disabled">
              <p>Przejdź do profilu</p>
            </Link>

            <Link href="/saved" className="disabled">
              <p>Zapisane gry</p>
            </Link>

            <hr />

            <button onClick={() => signOut()}>
              <p>Wyloguj się</p>
            </button>
          </div>
        </div>
      ) : (
        <Link href="/login">Zaloguj się</Link>
      )}
    </>
  );
}
