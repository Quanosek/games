"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
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
    if (!user) return;

    axios
      .get("/api/game/saved", { params: { userId: user.id } })
      .then((response) => setGames(response.data.result))
      .catch((error) => toast.error(error.response.data.message))
      .finally(() => setLoading(false));
  }, [user]);

  const loadGame = (game: Game) => {
    const gameData = {
      id: game.id,
      data: JSON.parse(game.data),
    };

    localStorage.setItem(game.type, JSON.stringify(gameData));
    router.push(`/${game.type}`);
  };

  const deleteGame = (game: Game) => {
    if (!confirm("Czy na pewno chcesz usunąć tę grę?")) return;

    axios
      .delete("/api/game", { params: { id: game.id } })
      .then(() => {
        setGames(games.filter((g) => g.id !== game.id));
        toast.success("Gra została usunięta");
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      })
      .finally(() => {
        localStorage.removeItem(game.type);
      });
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
        <div key={i} className={styles.gameData}>
          <button className={styles.info} onClick={() => loadGame(game)}>
            <h2>{game.type}</h2>
            <p>Zapisany tytuł: {`"${game.title}"`}</p>
            <p>
              Data utworzenia:{" "}
              {`${new Date(game.createdAt).toLocaleDateString()}, ${new Date(
                game.createdAt
              ).toLocaleTimeString()}`}
            </p>
            <hr />
            <p>{game.data}</p>
          </button>

          <button
            className={styles.deleteButton}
            onClick={() => deleteGame(game)}
          >
            <Image
              className="icon"
              src="/icons/close.svg"
              alt="usuń"
              width={20}
              height={20}
              draggable={false}
            />
          </button>
        </div>
      ))}
    </div>
  );
}
