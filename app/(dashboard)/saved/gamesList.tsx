"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { Game } from "next-auth";
import toast from "react-hot-toast";

import styles from "@/styles/dashboard.module.scss";

export default function SavedGamesList({ user }: { user: any }) {
  const router = useRouter();

  const [games, setGames] = useState<Game[]>([]);

  useEffect(() => {
    axios
      .get(`/api/game/saved`, { params: { userId: user.id } })
      .then((response) => {
        setGames(response.data.result);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  }, []);

  return (
    <div className={styles.gamesList}>
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
