"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { User, Game } from "next-auth";
import axios from "axios";
import toast from "react-hot-toast";

import styles from "@/styles/dashboard.module.scss";

export default function SavedGamesList({ user }: { user: User | undefined }) {
  const router = useRouter();

  const [games, setGames] = useState<Game[]>([]);

  useEffect(() => {
    axios
      .get("/api/game/saved", { params: { userId: user?.id } })
      .then((response) => setGames(response.data.result))
      .catch((error) => toast.error(error.response.data.message));
  }, []);

  return (
    <div className={styles.gamesList}>
      {!games.length && (
        <h2 className={styles.emptyList}>Brak zapisanych gier</h2>
      )}

      {games.map((game, i) => (
        <button
          key={i}
          onClick={() => {
            localStorage.setItem(game.type, game.data);
            router.push(`/${game.type}`);
            router.refresh();
          }}
        >
          <h2>gra: {game.type}</h2>
          <p>data utworzenia: {game.createdAt}</p>
          <hr />
          <p>dane: {game.data}</p>
        </button>
      ))}
    </div>
  );
}
