"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { User } from "next-auth";
import { signOut } from "next-auth/react";

export default function LoginButtonComponent({
  user,
}: {
  user: User | undefined;
}) {
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
            <p>{user.username ? `@${user.username}` : user.email}</p>

            <Image
              style={{
                borderColor:
                  user.role === "admin" ? "var(--gold)" : "var(--white)",
              }}
              alt=""
              src={user.image ?? "/icons/profile.svg"}
              width={100}
              height={100}
            />
          </button>

          <div
            className="dropdown"
            style={{ display: showButtonsList ? "" : "none" }}
          >
            <Link href="/profile">
              <p>Przejdź do profilu</p>
            </Link>

            <Link href="/saved">
              <p>Zapisane gry</p>
            </Link>

            {user.role === "admin" && (
              <Link href="/admin" style={{ backgroundColor: "var(--gold" }}>
                <p>Panel administratora</p>
              </Link>
            )}

            <hr />

            <button onClick={async () => await signOut()}>
              <p>Wyloguj się</p>
            </button>
          </div>
        </div>
      ) : (
        <Link className="loginButton" href="/login">
          Zaloguj się
        </Link>
      )}
    </>
  );
}
