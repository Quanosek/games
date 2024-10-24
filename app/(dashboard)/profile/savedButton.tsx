"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { User } from "next-auth";
import axios from "axios";
import toast from "react-hot-toast";

import styles from "@/styles/dashboard.module.scss";

export default function SavedButton({ user }: { user: User | undefined }) {
  const [gamesList, setGamesList] = useState([]);

  useEffect(() => {
    if (user) {
      axios
        .get("/api/game/saved", { params: { userId: user.id } })
        .then((res) => setGamesList(res.data.result))
        .catch((error) => toast.error(error.response.data.message));
    }
  }, []);

  if (gamesList.length) {
    return (
      <Link className={styles.savedButton} href={"/saved"}>
        <p>Zapisane gry [{gamesList.length}]</p>
      </Link>
    );
  }

  return null;
}
