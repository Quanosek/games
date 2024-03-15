"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";

import type { Data } from "@/app/postaw-na-milion/page";
import styles from "./styles.module.scss";

export default function PnmBoardID({ params }: { params: { id: number } }) {
  const id = Number(params.id);
  const router = useRouter();

  const [data, setData] = useState<Data[]>();
  const [gameData, setGameData] = useState({
    packagesLeft: 40,
    boxes: new Array(4).fill({ packages: 0 }),
  });

  // get data on load
  useEffect(() => {
    const storedData = localStorage.getItem("pnm") || "[]";
    const data = JSON.parse(storedData)[id - 1];

    if (data) setData(data);
  }, [id]);

  // mouse behavior
  const [alwaysShowCursor, setAlwaysShowCursor] = useState(false);
  const [showCursor, setShowCursor] = useState(false);

  const cursorHideTimeout = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    const mouseMoveEvent = (e: MouseEvent) => {
      if ((e.movementX && e.movementY) == 0) return;

      setShowCursor(true);
      clearTimeout(cursorHideTimeout.current);

      if (!alwaysShowCursor) {
        cursorHideTimeout.current = setTimeout(
          () => setShowCursor(false),
          1500
        );
      }
    };

    document.addEventListener("mousemove", mouseMoveEvent);
    return () => document.removeEventListener("mousemove", mouseMoveEvent);
  }, [alwaysShowCursor]);

  // video behavior
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hiddenIntro, setHiddenIntro] = useState(false);

  const hideVideo = () => {
    setHiddenIntro(true);

    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.style.display = "none";
    }
  };

  // game params
  const [selectedQuestion, setQuestion] = useState<Data>();
  const [remainingTime, setRemainingTime] = useState(60_000);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout>();

  // set time counter
  useEffect(() => {
    if (!selectedQuestion) return;

    const interval = setInterval(() => {
      setRemainingTime((prevTime) => {
        prevTime -= 1_000;

        if (prevTime === 0) clearInterval(interval);
        return prevTime;
      });
    }, 1_000);

    return () => clearInterval(interval);
  }, [selectedQuestion]);

  // game-start screen
  if (id === 0) {
    return (
      <>
        <div
          className={styles.startIntro}
          style={{
            display: hiddenIntro ? "none" : "block",
            cursor: showCursor ? "default" : "none",
          }}
        >
          <div
            className={styles.skipButton}
            style={{ display: showCursor ? "block" : "none" }}
            onMouseEnter={() => setAlwaysShowCursor(true)}
            onMouseLeave={() => setAlwaysShowCursor(false)}
          >
            <button onClick={hideVideo}>
              <p>Pomiń czołówkę</p>
            </button>
          </div>

          <video
            ref={videoRef}
            src="/pnm/intro.mp4"
            autoPlay
            onEnded={hideVideo}
          >
            <source src="/pnm/intro.mp4" type="video/mp4" />
            Twoja przeglądarka nie obsługuje odtwarzacza wideo.
          </video>
        </div>

        <div
          className={styles.startLayout}
          style={{ display: hiddenIntro ? "flex" : "none" }}
        >
          <button onClick={() => router.push("/postaw-na-milion/board/1")}>
            <p>Start</p>
          </button>

          <Image
            className={styles.background}
            src="/pnm/background.webp"
            alt="Postaw na milion"
            width={1920}
            height={1080}
            draggable={false}
          />
        </div>
      </>
    );
  }

  if (data && !selectedQuestion) {
    return data.map((question, index) => (
      <button key={index} onClick={() => setQuestion(question)}>
        <p>{question.category}</p>
      </button>
    ));
  }

  if (selectedQuestion) {
    return (
      <div>
        <p>{selectedQuestion.question}</p>

        <p>
          {`${Math.floor(remainingTime / 60000)
            .toString()
            .padStart(2, "0")}:${Math.floor((remainingTime % 60000) / 1000)
            .toString()
            .padStart(2, "0")}`}
        </p>

        <div>
          {selectedQuestion.answers.map((answer, index) => (
            <div className={styles.boxes} key={index}>
              <p>{answer.value}</p>

              <button
                onMouseDown={() => {
                  function removePackage() {
                    setGameData((prev) => {
                      if (
                        prev.packagesLeft === 40 ||
                        prev.boxes[index].packages === 0
                      ) {
                        return prev;
                      }

                      return {
                        ...prev,
                        packagesLeft: prev.packagesLeft + 1,
                        boxes: prev.boxes.map((box, i) => {
                          if (i === index) {
                            return { packages: box.packages - 1 };
                          }
                          return box;
                        }),
                      };
                    });
                  }

                  const id = setInterval(removePackage, 300);
                  removePackage(), setIntervalId(id);
                }}
                onMouseUp={() => clearInterval(intervalId)}
              >
                <p>-</p>
              </button>

              <button
                onMouseDown={() => {
                  function addPackage() {
                    setGameData((prev) => {
                      if (
                        prev.packagesLeft === 0 ||
                        prev.boxes[index].packages === 40
                      ) {
                        return prev;
                      }

                      return {
                        ...prev,
                        packagesLeft: prev.packagesLeft - 1,
                        boxes: prev.boxes.map((box, i) => {
                          if (i === index) {
                            return { packages: box.packages + 1 };
                          }
                          return box;
                        }),
                      };
                    });
                  }

                  const id = setInterval(addPackage, 300);
                  addPackage(), setIntervalId(id);
                }}
                onMouseUp={() => clearInterval(intervalId)}
              >
                <p>+</p>
              </button>

              <p>{gameData.boxes[index].packages}</p>
            </div>
          ))}

          <p>Pakiety: {gameData.packagesLeft}</p>
        </div>

        <button
          onClick={() => {
            // if (confirm("Czy na pewno chcesz zakończyć wcześniej tę rundę?")) {
            //   setRemainingTime(0);
            // }
          }}
        >
          <p>Zakończ wcześniej</p>
        </button>

        <button
          onClick={() => {
            // if (
            //   confirm(
            //     "Czy na pewno chcesz przedłużyć czas w tej rundzie o dodatkowe 30 sekund? Nie będziesz mógł użyć tej opcji ponownie."
            //   )
            // ) {
            //   setRemainingTime((prev) => {
            //     return prev + 30000;
            //   });
            // }
          }}
        >
          <p>Przedłuż czas +30s</p>
        </button>
      </div>
    );
  }
}
