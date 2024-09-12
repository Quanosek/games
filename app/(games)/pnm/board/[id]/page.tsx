"use client";

import { useEffect, useState, useRef } from "react";
import AnimatedBoard from "../animatedBoard";

import type { Data } from "../../page";
import styles from "../styles.module.scss";
import { Myriad } from "@/lib/fonts";

export default function PnmIdBoard({ params }: { params: { id: number } }) {
  const id = Number(params.id);

  const [data, setData] = useState<Data[]>();
  const [selectedQuestion, setQuestion] = useState<Data>();

  // audio files references
  const categoriesAudio = useRef<HTMLAudioElement>(null);
  const selectAudio = useRef<HTMLAudioElement>(null);
  const answerAudio = useRef<HTMLAudioElement>(null);
  const questionAudio = useRef<HTMLAudioElement>(null);
  const timerAudio = useRef<HTMLAudioElement>(null);
  const stopAudio = useRef<HTMLAudioElement>(null);

  // get data on load
  useEffect(() => {
    const storedData = localStorage.getItem("pnm") || "[]";
    const data = JSON.parse(storedData)[id - 1];

    if (data) setData(data);

    setTimeout(() => categoriesAudio.current?.play(), 300);
  }, [id]);

  if (!data) return null;

  // CATEGORY SELECT LAYOUT
  const CategoriesLayout = () => {
    const [selected, setSelected] = useState<number>(-1);

    // category selection handler
    const categorySelected = (index: number) => {
      setSelected(index);
      selectAudio.current?.play();
      setTimeout(() => setQuestion(data[index]), 1_500);
    };

    // keyboard interactions
    useEffect(() => {
      const KeyupEvent = (event: KeyboardEvent) => {
        if (event.ctrlKey || event.shiftKey || event.altKey || event.metaKey) {
          return;
        }

        if (event.key === "1") categorySelected(0);
        if (event.key === "2") categorySelected(1);
      };

      document.addEventListener("keyup", KeyupEvent);
      return () => document.removeEventListener("keyup", KeyupEvent);
    }, []);

    return (
      <AnimatedBoard>
        <div className={styles.categorySelect}>
          {data.map((question, index) => (
            <button
              key={index}
              onClick={() => categorySelected(index)}
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
      </AnimatedBoard>
    );
  };

  // GAME BOARD LAYOUT
  const GameLayout = () => {
    // show answers in delay and animation
    const [displayCounter, setDisplayCounter] = useState(0);

    useEffect(() => {
      questionAudio.current?.play();

      const interval = setInterval(() => {
        setDisplayCounter((prev) => {
          if (!answerAudio.current) return prev;
          const newValue = prev + 1;

          if (newValue < 5) {
            answerAudio.current.pause();
            answerAudio.current.currentTime = 0;
            answerAudio.current.play();
          } else {
            categoriesAudio.current?.play();
            clearInterval(interval);
          }

          return newValue;
        });
      }, 2_200);

      return () => clearInterval(interval);
    }, []);

    // time counter
    const [remainingTime, setRemainingTime] = useState(60_000); // 60 seconds

    useEffect(() => {
      if (displayCounter !== 6) return;

      timerAudio.current?.play();

      const interval = setInterval(() => {
        setRemainingTime((prev) => {
          const newValue = prev - 100;

          if (newValue === 0) clearInterval(interval);
          return newValue;
        });
      }, 100);

      return () => clearInterval(interval);
    }, [displayCounter]);

    // display formatted money amount
    const MoneyFormat = (value: number) => {
      const money = value * 25_000;

      return money.toLocaleString("pl-PL", {
        minimumFractionDigits: 0,
        style: "currency",
        currency: "PLN",
      });
    };

    // display time counter
    const DynamicClock = () => {
      const minutes = Math.floor((remainingTime / (1_000 * 60)) % 60);
      const seconds = Math.floor((remainingTime / 1_000) % 60);
      const milliseconds = (remainingTime % 1_000) / 100;

      const showMinutes = minutes.toString().padStart(2, "0");
      const showSeconds = seconds.toString().padStart(2, "0");
      const showMilliseconds = milliseconds.toString().padStart(1, "0");

      return (
        <div style={{ color: remainingTime <= 10_000 ? "red" : "" }}>
          <h3>{`${showMinutes}:${showSeconds}.${showMilliseconds}`}</h3>
        </div>
      );
    };

    // keyboard interactions
    useEffect(() => {
      const KeyupEvent = (event: KeyboardEvent) => {
        if (event.ctrlKey || event.shiftKey || event.altKey || event.metaKey) {
          return;
        }

        if (event.key === " ") {
          // start counter
          if (displayCounter === 5) {
            setDisplayCounter(6);

            // smooth muting of the question loop
            const interval = setInterval(() => {
              if (!questionAudio.current) return;

              if (questionAudio.current.volume > 0.05) {
                questionAudio.current.volume -= 0.05;
              } else {
                questionAudio.current.pause();
                clearInterval(interval);
              }
            }, 1_000);
          }

          // stop time before end
          if (remainingTime !== 0 && displayCounter === 6) {
            setDisplayCounter(7);
            setRemainingTime(0);

            setTimeout(() => stopAudio.current?.play(), 300);

            // smooth muting of all background music
            const interval = setInterval(() => {
              if (!questionAudio.current || !timerAudio.current) return;

              if (questionAudio.current.volume > 0.05) {
                questionAudio.current.volume -= 0.05;
              }

              if (timerAudio.current.volume > 0.05) {
                timerAudio.current.volume -= 0.05;
              } else {
                clearInterval(interval);
                questionAudio.current.pause();
                timerAudio.current?.pause();
              }
            }, 100);
          }

          // reveal answers
          if (
            (remainingTime === 0 && displayCounter === 6) ||
            displayCounter === 7
          ) {
            setDisplayCounter(8);
            console.log("Reveal answers");
          }
        }
      };

      document.addEventListener("keyup", KeyupEvent);
      return () => document.removeEventListener("keyup", KeyupEvent);
    }, [displayCounter, remainingTime]);

    // delay show board
    const [showBoard, setShowBoard] = useState(false);

    useEffect(() => {
      setTimeout(() => setShowBoard(true), 150);
    }, []);

    // manage money packages
    const [packages, setPackages] = useState({
      left: 40,
      boxes: new Array(4).fill({ packages: 0 }),
    });

    // interval on hold money packages button
    const [intervalId, setIntervalId] = useState<NodeJS.Timeout>();

    return (
      <div
        className={styles.questionBoard}
        style={{
          opacity: showBoard ? 1 : 0,
          transition: "opacity 200ms ease-out",
        }}
      >
        <div className={styles.boxes}>
          {selectedQuestion?.answers.map((answer, index) => (
            <div
              key={index}
              className={styles.box}
              style={{
                opacity: displayCounter >= index + 1 ? 1 : 0,
                transition: "opacity 300ms ease-in-out",
              }}
            >
              <div className={styles.screen}>
                <div className={styles.answerHandler}>
                  <h2>{answer.value}</h2>
                </div>

                <div className={styles.amountHandler}>
                  <p>{MoneyFormat(packages.boxes[index].packages)}</p>
                </div>
              </div>

              <div className={styles.trap} />

              <div
                className={styles.buttons}
                style={{
                  visibility:
                    displayCounter < 6 || remainingTime === 0
                      ? "hidden"
                      : "visible",
                }}
              >
                <button
                  onMouseDown={() => {
                    const removePackage = () => {
                      setPackages((prev) => {
                        if (
                          prev.left === 40 ||
                          prev.boxes[index].packages === 0
                        ) {
                          return prev;
                        }

                        return {
                          ...prev,
                          left: prev.left + 1,
                          boxes: prev.boxes.map((box, i) => {
                            if (i === index) {
                              return { packages: box.packages - 1 };
                            }
                            return box;
                          }),
                        };
                      });
                    };

                    const id = setInterval(removePackage, 250);
                    removePackage(), setIntervalId(id);
                  }}
                  onMouseUp={() => clearInterval(intervalId)}
                >
                  <p>-</p>
                </button>

                <button
                  onMouseDown={() => {
                    const addPackage = () => {
                      setPackages((prev) => {
                        if (
                          prev.left === 0 ||
                          prev.boxes[index].packages === 40
                        ) {
                          return prev;
                        }

                        return {
                          ...prev,
                          left: prev.left - 1,
                          boxes: prev.boxes.map((box, i) => {
                            if (i === index) {
                              return { packages: box.packages + 1 };
                            }
                            return box;
                          }),
                        };
                      });
                    };

                    const id = setInterval(addPackage, 250);
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

        <div className={styles.packagesLeft}>
          <p>{MoneyFormat(packages.left)}</p>
        </div>

        <div
          className={styles.question}
          style={{
            opacity: displayCounter >= 5 ? 1 : 0,
            transition: "opacity 300ms ease-in-out",
          }}
        >
          <div className={styles.questionHandler}>
            <h1>{selectedQuestion?.question}</h1>
          </div>

          <div className={styles.timer}>
            <button
              onClick={(e) => {
                setRemainingTime((prev) => prev + 30_000);
                e.currentTarget.disabled = true;
              }}
            >
              <p>+30s</p>
            </button>

            <DynamicClock />
          </div>
        </div>
      </div>
    );
  };

  // main return
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
      }}
      className={Myriad.className}
    >
      {!selectedQuestion && <CategoriesLayout />}
      {selectedQuestion && <GameLayout />}

      <audio ref={categoriesAudio} src="/pnm/audio/categories.mp3" />
      <audio ref={selectAudio} src="/pnm/audio/category_select.mp3" />
      <audio ref={answerAudio} src="/pnm/audio/answer_reveal.mp3" />
      <audio ref={questionAudio} src="/pnm/audio/question_loop.mp3" loop />
      <audio ref={timerAudio} src="/pnm/audio/question_timer.mp3" />
      <audio ref={stopAudio} src="/pnm/audio/time_stop.mp3" />
    </div>
  );
}
