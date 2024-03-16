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
  const [selectedQuestion, setQuestion] = useState<Data>();

  // get data on load
  useEffect(() => {
    const storedData = localStorage.getItem("pnm") || "[]";
    const data = JSON.parse(storedData)[id - 1];

    if (data) setData(data);
  }, [id]);

  if (id === 0) {
    // PLAY INTRO VIDEO
    const IntroLayout = () => {
      // video behavior
      const videoRef = useRef<HTMLVideoElement>(null);
      const [hiddenIntro, setHiddenIntro] = useState(false);
      const [videoPlayed, setVideoPlayed] = useState<boolean>();

      const hideVideo = () => {
        setHiddenIntro(true);
        if (videoRef.current) videoRef.current.pause();
      };

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

      return (
        <div
          className={styles.introVideo}
          style={{
            display: hiddenIntro ? "none" : "block",
            cursor: showCursor ? "default" : "none",
          }}
        >
          <div className={styles.controls}>
            {!videoPlayed && (
              <button
                className={styles.playButton}
                onClick={() => videoRef.current?.play()}
              >
                <Image
                  className="icon"
                  src="/icons/play.svg"
                  alt="Odtwórz"
                  width={100}
                  height={100}
                />
              </button>
            )}

            {(!videoPlayed || (videoPlayed && showCursor)) && (
              <div
                className={styles.skipButton}
                onMouseEnter={() => setAlwaysShowCursor(true)}
                onMouseLeave={() => setAlwaysShowCursor(false)}
              >
                <button onClick={hideVideo}>
                  <p>Pomiń czołówkę</p>
                </button>
              </div>
            )}
          </div>

          <video
            ref={videoRef}
            onPlay={() => setVideoPlayed(true)}
            onEnded={hideVideo}
          >
            <source src="/pnm/video/intro.mp4" type="video/mp4" />
            Twoja przeglądarka nie obsługuje odtwarzacza wideo.
          </video>
        </div>
      );
    };

    return (
      <>
        <IntroLayout />

        {/* GAME START LAYOUT */}
        <div className={styles.startLayout}>
          <button onClick={() => router.push("/postaw-na-milion/board/1")}>
            <p>Start</p>
          </button>
        </div>
      </>
    );
  }

  // CATEGORY SELECT LAYOUT
  if (data && !selectedQuestion) {
    const CategoriesLayout = () => {
      const [selected, setSelected] = useState<number>(-1);
      const audioCategory = useRef<HTMLAudioElement>(null);

      return (
        <div className={styles.categorySelect}>
          <div className={styles.selectButtons}>
            {data.map((question, index) => (
              <button
                key={index}
                onClick={() => {
                  setSelected(index);
                  audioCategory.current?.play();
                  setTimeout(() => setQuestion(question), 1_500);
                }}
                style={{
                  zIndex: index === selected ? 1 : 0,
                  transform: index === selected ? "scale(1.1)" : "none",
                  pointerEvents: [0, 1].includes(selected) ? "none" : "auto",
                  top: [0, 1].includes(selected)
                    ? index === selected
                      ? index === 0
                        ? "6vw"
                        : "-7vw"
                      : index === 1
                      ? "-7vw"
                      : "6vw"
                    : "",
                }}
              >
                <p>{question.category}</p>
              </button>
            ))}
          </div>

          <audio src="/pnm/audio/categories.mp3" autoPlay />
          <audio ref={audioCategory} src="/pnm/audio/category_select.mp3" />
        </div>
      );
    };

    return <CategoriesLayout />;
  }

  // GAME BOARD
  if (selectedQuestion) {
    const GameLayout = () => {
      // current stage data
      const [stageData, setStageData] = useState({
        packagesLeft: 40,
        boxes: new Array(4).fill({ packages: 0 }),
      });

      // time counter
      const [remainingTime, setRemainingTime] = useState(60_000);
      const [intervalId, setIntervalId] = useState<NodeJS.Timeout>();

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
      }, []);

      return (
        <div>
          <div className={styles.boxes}>
            {selectedQuestion.answers.map((answer, index) => (
              <div className={styles.box} key={index}>
                <p className={styles.answer}>{answer.value}</p>

                <p>{`[${stageData.boxes[index].packages}]`}</p>

                <div className={styles.buttons}>
                  <button
                    onMouseDown={() => {
                      function removePackage() {
                        setStageData((prev) => {
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
                        setStageData((prev) => {
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
                </div>
              </div>
            ))}
          </div>

          <p className={styles.packages}>
            {`Pakiety: [${stageData.packagesLeft}]`}
          </p>

          <div className={styles.info}>
            <p>{selectedQuestion.question}</p>

            <div>
              <button
                onClick={() => {
                  if (
                    confirm(
                      "Czy na pewno chcesz przedłużyć czas w tej rundzie o dodatkowe 30 sekund? Nie będziesz mógł użyć tej opcji ponownie."
                    )
                  ) {
                    // setRemainingTime((prev) => {
                    //   return prev + 30000;
                    // });
                  }
                }}
              >
                <p>+30s</p>
              </button>

              <p>
                {`${Math.floor(remainingTime / 60000)
                  .toString()
                  .padStart(2, "0")}:${Math.floor(
                  (remainingTime % 60000) / 1000
                )
                  .toString()
                  .padStart(2, "0")}`}
              </p>
            </div>
          </div>

          <audio src="/pnm/audio/question_timer.mp3" autoPlay />
        </div>
      );
    };

    return <GameLayout />;
  }
}
