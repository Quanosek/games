"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { User, Game } from "next-auth";
import axios from "axios";
import toast from "react-hot-toast";

import styles from "@/styles/dashboard.module.scss";

export default function SavedGamesList({ user }: { user: User | undefined }) {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [games, setGames] = useState<Game[]>([]);

  useEffect(() => {
    axios
      .get("/api/game/saved", { params: { userId: user?.id } })
      .then((response) => setGames(response.data.result))
      .catch((error) => toast.error(error.response.data.message))
      .finally(() => setLoading(false));
  }, []);

  const loadGame = (game: Game) => {
    const gameData = {
      id: game.id,
      title: game.title,
      data: JSON.parse(game.data),
    };

    localStorage.setItem(game.type, JSON.stringify(gameData));
    router.push(`/${game.type}`);
    router.refresh();
  };

  if (loading) {
    return (
      <div className="loading">
        <p>Trwa ładowanie...</p>
      </div>
    );
  }

  return (
    <div className={styles.gamesList}>
      {!games.length && (
        <p className={styles.emptyList}>Brak zapisanych gier</p>
      )}

      {games.map((game, i) => (
        <button key={i} onClick={() => loadGame(game)}>
          <p>ID: "{game.id}"</p>
          <p>Gra: "{game.type}"</p>
          <p>Zapisany tytuł: "{game.title}"</p>
          <p>
            Data utworzenia:{" "}
            {`${new Date(game.createdAt).toLocaleDateString()}, ${new Date(
              game.createdAt
            ).toLocaleTimeString()}`}
          </p>
          <hr />
          <p>{game.data}</p>
        </button>
      ))}
    </div>
  );
}
