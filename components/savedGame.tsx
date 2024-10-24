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
  const [loading, setLoading] = useState(true);

  // on component load
  useEffect(() => {
    const localGame = JSON.parse(localStorage.getItem(`${type}`) || "{}");
    if (!localGame.id) return setLoading(false);

    axios
      .get("/api/game", { params: { id: localGame.id } })
      .then((res) => {
        setGame(res.data.result);
        setTitle(res.data.result.title);
      })
      .catch((error) => toast.error(error.response.data.message))
      .finally(() => setLoading(false));
  }, [type]);

  const saveGame = async () => {
    const request = { userId: user?.id, type, title, data };
    let response;

    if (game?.id) {
      // update existing db record
      response = await axios.put("/api/game", request, {
        params: { id: game.id },
      });
      toast.success("Gra została zapisana");
    } else {
      // create new db record
      response = await axios.post("/api/game", request);
      toast.success("Zapisano nową grę na twoim koncie");
    }

    // temporary local data
    setGame(response.data.result);
    setTitle(response.data.result.title);

    // save game params to local storage
    const localData = JSON.parse(localStorage.getItem(`${type}`) || "{}");
    const { id: _, ...params } = localData;
    const id = response.data.result.id;
    localStorage.setItem(`${type}`, JSON.stringify({ id, ...params }));
  };

  const clearGame = async () => {
    localStorage.removeItem(`${type}`);
    window.location.reload();
  };

  if (!user) return null;

  return (
    <div
      className={styles.savedGamePrompt}
      style={{
        transform: loading ? "translateY(-150%)" : "translateY(0)",
        transition: "transform 200ms ease-out",
      }}
    >
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
            <>
              <p>
                Ostatni zapis:{" "}
                {game &&
                  `${new Date(game.updatedAt).toLocaleDateString()}, ${new Date(
                    game.updatedAt
                  ).toLocaleTimeString()}`}
              </p>

              <button onClick={clearGame}>
                <Image
                  className="icon"
                  alt="exit"
                  src="/icons/close.svg"
                  width={18}
                  height={18}
                  draggable={false}
                />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
