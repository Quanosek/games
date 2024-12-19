"use client";

import Image from "next/image";
import { useEffect, useState, useRef } from "react";

import type { Data } from "../../page";
import styles from "../styles.module.scss";
import { Dotted } from "@/lib/fonts";

export default function FamiliadaIdBoard({
  params,
}: {
  params: { id: number };
}) {
  const id = Number(params.id);

  const [data, setData] = useState<Data>();
  const [visible, setVisible] = useState<Array<number>>([]);

  const pointsAmount = useRef(0);
  const mainScore = useRef(0);

  // team mistakes
  const [redMistakes, setRedMistakes] = useState(0);
  const [blueMistakes, setBlueMistakes] = useState(0);

  // audio files support
  const audioCorrect = useRef<HTMLAudioElement>(null);
  const audioWrong = useRef<HTMLAudioElement>(null);

  // load board data
  useEffect(() => {
    const storedData = localStorage.getItem("familiada") || "[]";
    let data = JSON.parse(storedData).data[id - 1] as Data;

    if (data) {
      // filter empty answers
      const answers = data.answers.filter((el) => el.value !== "");

      data = { ...data, answers };
      setData(data);
    }
  }, [id]);

  // keyboard interactions
  useEffect(() => {
    if (!data) return;

    const KeyupEvent = (event: KeyboardEvent) => {
      if (event.shiftKey || event.altKey || event.metaKey) {
        return;
      }

      // show answer
      if ([1, 2, 3, 4, 5, 6].includes(Number(event.key))) {
        const number = Number(event.key);
        if (!data.answers[number - 1]) return;

        if (!visible.includes(number)) {
          if (audioCorrect.current) {
            audioCorrect.current.play();
          }

          setVisible([...visible, number]);

          if (!event.ctrlKey) {
            const points = data.answers[number - 1].points;
            const multiply = data.multiply || 1;

            pointsAmount.current += points;
            mainScore.current += points * multiply;
          }
        }
      }

      if (!audioWrong.current) return;

      // manage teams mistakes
      switch (event.key.toUpperCase()) {
        case "Q":
          if (redMistakes > 3) return;
          setRedMistakes(-1);
          audioWrong.current.play();
          break;
        case "W":
          if (redMistakes >= 3) return;
          setRedMistakes(redMistakes + 1);
          audioWrong.current.play();
          break;
        case "E":
          setRedMistakes(0);
          setBlueMistakes(0);
          break;
        case "R":
          if (blueMistakes >= 3) return;
          setBlueMistakes(blueMistakes + 1);
          audioWrong.current.play();
          break;
        case "T":
          if (blueMistakes > 3) return;
          setBlueMistakes(-1);
          audioWrong.current.play();
          break;
      }
    };

    document.addEventListener("keyup", KeyupEvent);
    return () => document.removeEventListener("keyup", KeyupEvent);
  }, [data, visible, blueMistakes, redMistakes]);

  const FormatPoints = (value: number) => {
    const size = value.toString().length;
    const newValue = value.toString().split("");

    if (size <= 2) return ["", ...(size === 1 ? [""] : []), ...newValue];
    else return newValue;
  };

  // handle mistakes display
  const handleMistakes = (counter: number) => {
    return (
      <div className={styles.mistakes}>
        {(counter < 0 && (
          <Image
            className={styles.big}
            alt="X"
            src="/familiada/images/x_big.webp"
            width={111}
            height={283}
            draggable={false}
          />
        )) ||
          [...Array(counter)].map((_, i) => (
            <Image
              key={i}
              alt="x"
              src="/familiada/images/x_small.webp"
              width={111}
              height={163}
              draggable={false}
            />
          ))}
      </div>
    );
  };

  // main return
  const backgroundImage = `url("/familiada/images/background_empty.webp")`;

  return (
    <div
      className={`${Dotted.className} ${styles.board}`}
      style={{ backgroundImage }}
    >
      <div className={styles.totalPoints}>
        <div>
          {FormatPoints(mainScore.current).map((el, i) => (
            <p key={i}>{el}</p>
          ))}
        </div>
      </div>

      {data && (
        <div className={styles.data}>
          <div className={styles.mistakes}>{handleMistakes(redMistakes)}</div>

          <div
            className={`${styles.main} ${
              data.answers.length < 5 && styles.doublePadding
            }`}
          >
            {data.answers.map((el, i) => {
              const answer = el.value.split("");
              const points = FormatPoints(el.points);
              const dots = Array(17).fill("...");

              return (
                <div key={i}>
                  <p>{i + 1}</p>

                  {(visible.includes(i + 1) && (
                    // show answer
                    <>
                      <div className={styles.answer}>
                        {answer.map((word, i) => (
                          <p key={i}>{word}</p>
                        ))}
                      </div>

                      <div className={styles.points}>
                        {points.map((word, i) => (
                          <p key={i}>{word}</p>
                        ))}
                      </div>
                    </>
                  )) || (
                    // show dots
                    <div className={styles.dots}>
                      {dots.map((cell, i) => (
                        <p key={i}>{cell}</p>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            <div className={styles.pointsAmount}>
              <div>
                {"SUMA".split("").map((el, i) => (
                  <p key={i}>{el}</p>
                ))}
              </div>

              <div>
                {FormatPoints(pointsAmount.current).map((el, i) => (
                  <p key={i}>{el}</p>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.mistakes}>{handleMistakes(blueMistakes)}</div>
        </div>
      )}

      {/* audio effects */}
      <audio src="/familiada/audio/new_round.mp3" autoPlay />
      <audio ref={audioCorrect} src="/familiada/audio/correct.mp3" />
      <audio ref={audioWrong} src="/familiada/audio/wrong.mp3" />
    </div>
  );
}
