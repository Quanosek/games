"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { User } from "next-auth";
import { signIn } from "next-auth/react";
import axios from "axios";
import toast from "react-hot-toast";

import styles from "@/styles/dashboard.module.scss";

export default function AccountProviders({ user }: { user: User | undefined }) {
  const [providers, setProviders] = useState<string[]>([]);
  useEffect(() => {
    if (!user) return;

    axios
      .get("/api/user", { params: { id: user?.id } })
      .then((response) => {
        const providers = response.data.user.providers.map(
          ({ provider }: { provider: string }) => {
            return provider;
          }
        );
        setProviders(providers);
      })
      .catch((error) => toast.error(error.response.data.message));
  }, [user]);

  const HandleProvider = ({ name }: { name: string }) => {
    const provider = name.toLowerCase();

    return (
      <button
        className={`${providers.includes(provider) || styles.notConnected}`}
        onClick={async () => {
          if (providers.includes(provider)) {
            // TODO: Disconnect provider
          } else {
            await signIn(provider);
          }
        }}
      >
        <div>
          <Image
            className="icon"
            alt=""
            src={`/icons/${provider}.svg`}
            width={40}
            height={40}
            draggable={false}
          />
          <h3>{name}</h3>
        </div>

        <div>
          <p>Połączono</p>
          <Image
            className="icon"
            alt=""
            src="/icons/link.svg"
            width={35}
            height={35}
            draggable={false}
          />
        </div>
      </button>
    );
  };

  return (
    <div className={styles.accountProviders}>
      <HandleProvider name="Google" />
      {/* <HandleProvider name="Facebook" /> */}
      <HandleProvider name="GitHub" />
      <HandleProvider name="Discord" />
    </div>
  );
}
