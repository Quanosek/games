"use client";

import { useEffect, useState, useRef } from "react";

import type { Data } from "../../page";
import styles from "../styles.module.scss";
import { Myriad } from "@/lib/fonts";

export default function PnmIdBoard({ params }: { params: { id: number } }) {
  const id = Number(params.id);

  const [data, setData] = useState<Data[]>();
  const [selectedQuestion, setQuestion] = useState<Data>();

  // get data on load
  useEffect(() => {
    const storedData = localStorage.getItem("pnm") || "[]";
    const data = JSON.parse(storedData)[id - 1];

    if (data) setData(data);
  }, [id]);

  if (!data) return null;

  // CATEGORY SELECT LAYOUT
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

  // GAME BOARD LAYOUT
  const GameLayout = () => {
    // defining current stage data
    const [stageData, setStageData] = useState({
      packagesLeft: 40,
      boxes: new Array(4).fill({ packages: 0 }),
    });

    // control timer
    const [counter, setCounter] = useState(0);

    useEffect(() => {
      const timerInterval = setInterval(() => {
        setCounter((prevTime) => {
          prevTime += 1;
          if (prevTime === 6) clearInterval(timerInterval);
          return prevTime;
        });
      }, 1_250);

      return () => clearInterval(timerInterval);
    }, []);

    // 60 seconds clock
    const [remainingTime, setRemainingTime] = useState(60_000);

    useEffect(() => {
      if (counter !== 6) return;

      const interval = setInterval(() => {
        setRemainingTime((prevTime) => {
          prevTime -= 100;
          if (prevTime === 0) clearInterval(interval);
          return prevTime;
        });
      }, 100);

      return () => clearInterval(interval);
    }, [counter]);

    // time counter display
    const Clock = () => {
      const minutes = Math.floor((remainingTime / (1000 * 60)) % 60);
      const seconds = Math.floor((remainingTime / 1000) % 60);
      const milliseconds = (remainingTime % 1000) / 100;

      const showMinutes = minutes.toString().padStart(2, "0");
      const showSeconds = seconds.toString().padStart(2, "0");
      const showMilliseconds = milliseconds.toString().padStart(1, "0");

      return (
        <div style={{ color: remainingTime <= 10_000 ? "red" : "" }}>
          <p>{`${showMinutes}:${showSeconds}.${showMilliseconds}`}</p>
        </div>
      );
    };

    // money packages interval on button hold
    const [intervalId, setIntervalId] = useState<NodeJS.Timeout>();

    return (
      <div>
        <div className={styles.boxes}>
          {selectedQuestion?.answers.map((answer, index) => (
            <div
              key={index}
              className={styles.box}
              style={{
                opacity: counter >= index + 1 ? 1 : 0,
                transition: "opacity 300ms ease-in-out",
              }}
            >
              <h2 className={styles.answer}>{answer.value}</h2>

              <p>{`[${stageData.boxes[index].packages}]`}</p>

              <div className={styles.buttons}>
                <button
                  onMouseDown={() => {
                    const removePackage = () => {
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
                    };

                    const id = setInterval(removePackage, 300);
                    removePackage(), setIntervalId(id);
                  }}
                  onMouseUp={() => clearInterval(intervalId)}
                >
                  <p>-</p>
                </button>

                <button
                  onMouseDown={() => {
                    const addPackage = () => {
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
                    };

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

        <p className={styles.packages}>{`[${stageData.packagesLeft}]`}</p>

        <div
          className={styles.info}
          style={{
            opacity: counter >= 5 ? 1 : 0,
            transition: "opacity 300ms ease-in-out",
          }}
        >
          <p>{selectedQuestion?.question}</p>

          <div>
            <button onClick={() => {}}>
              <p>+30s</p>
            </button>

            <button onClick={() => {}}>
              <p>stop</p>
            </button>

            <Clock />
          </div>
        </div>

        <audio src="/pnm/audio/question_timer.mp3" autoPlay />
      </div>
    );
  };

  // main return
  return (
    <div className={Myriad.className}>
      {!selectedQuestion && <CategoriesLayout />}
      {selectedQuestion && <GameLayout />}
    </div>
  );
}
