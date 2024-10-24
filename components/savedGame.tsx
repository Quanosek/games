"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Game } from "next-auth";
import { useSession } from "next-auth/react";
import axios from "axios";
import toast from "react-hot-toast";

import styles from "@/styles/components.module.scss";

export interface Params {
  type: string;
  data: string;
}

export default function SavedGameComponent({ type, data }: Params) {
  const { data: session } = useSession();
  const user = session?.user;

  const [game, setGame] = useState<Game>();
  const [title, setTitle] = useState("Nowa gra");

  useEffect(() => {
    const localGame = JSON.parse(localStorage.getItem(`${type}`) || "{}");
    if (!localGame.id) return;

    axios
      .get("/api/game", { params: { id: localGame.id } })
      .then((res) => setGame(res.data.result));
  }, []);

  if (!user) return null;

  const saveGame = async () => {
    const request = { userId: user.id, type, title, data };
    const response = await axios.post("/api/game", request);
    setGame(response.data.result);

    const localData = JSON.parse(localStorage.getItem(`${type}`) || "{}");
    const { id: _, ...params } = localData;
    const id = response.data.result.id;

    localStorage.setItem("wisielec", JSON.stringify({ id, ...params }));
    toast.success("Zapisano nową grę");
  };

  const deleteGame = () => {
    if (!game) return;

    axios
      .delete("/api/game/delete", { params: { id: game.id } })
      .then(() => toast.success("Gra została usunięta"))
      .catch((error) => toast.error(error.response.data.message));
  };

  return (
    <div className={styles.savedGamePrompt}>
      <div className={styles.promptContainer}>
        <div>
          <button onClick={saveGame}>
            <Image
              className="icon"
              alt="save"
              src="/icons/save.svg"
              width={20}
              height={20}
              draggable={false}
            />
          </button>

          <input
            id="title"
            type="text"
            placeholder="Nowa gra"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className={styles.editDate}>
          {game && (
            <p>
              Ostatni zapis:{" "}
              {`${new Date(game.createdAt).toLocaleDateString()}, ${new Date(
                game.createdAt
              ).toLocaleTimeString()}`}
            </p>
          )}

          {/* <button onClick={deleteGame}>
            <Image
              className="icon"
              alt="exit"
              src="/icons/close.svg"
              width={18}
              height={18}
              draggable={false}
            />
          </button> */}
        </div>
      </div>
    </div>
  );
}
