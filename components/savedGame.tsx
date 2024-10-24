"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
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
  const userId = session?.user?.id;

  const [game, setGame] = useState();
  const [title, setTitle] = useState("Nowa gra");

  useEffect(() => {
    const localGame = localStorage.getItem(`${type}`);

    if (localGame) {
      const game = JSON.parse(localGame);

      if (game.id) {
        axios
          .get("/api/game", { params: { id: game.id } })
          .then((res) => setGame(res.data.result))
          .catch((error) => toast.error(error.response.data.message));
      }
    }
  }, []);

  return (
    <div className={styles.savedGamePrompt}>
      <div className={styles.promptContainer}>
        <div>
          <button
            onClick={() => {
              axios
                .post("/api/game", { userId, type, title, data })
                .then((res) => {
                  const localGame = localStorage.getItem(`${type}`);
                  if (localGame) {
                    const game = JSON.parse(localGame);
                    game.id = res.data.result.id;
                    localStorage.setItem(`${type}`, JSON.stringify(game));
                  }
                  toast.success("Gra została zapisana");
                })
                .catch((error) => toast.error(error.response.data.message));
            }}
          >
            <Image
              className="icon"
              alt="save"
              src="/icons/save.svg"
              width={20}
              height={20}
              draggable={false}
            />
          </button>

          {/* {game ? (
            <h3>
              {game.title}
              <span>{" *"}</span>
            </h3>
          ) : ( */}
          <h3>Nowa gra</h3>
          {/* )} */}
        </div>

        <div className={styles.editDate}>
          {game && <p>Ostatni zapis: dd.MM.yyyy, hh:mm:ss</p>}
          {/* {game && <p>Ostatni zapis: {game.updatedAt}</p>} */}

          <button
            onClick={() => {
              // axios
              //   .delete(`/api/game/delete?id=${id}`)
              //   .then(() => {
              //     toast.success("Gra została usunięta");
              //   })
              //   .catch((error) => toast.error(error.response.data.message));
            }}
          >
            <Image
              className="icon"
              alt="exit"
              src="/icons/close.svg"
              width={18}
              height={18}
              draggable={false}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
