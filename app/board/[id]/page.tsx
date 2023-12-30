"use client";

import localFont from "next/font/local";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";

import styles from "./page.module.scss";

const dottedFont = localFont({
  src: "../../../fonts/familiada.woff2",
  display: "swap",
});

export default function Board({ params }: { params: { id: number } }) {
  const { id } = params;

  const [answers, setAnswers] = useState<any>();
  const [show, setShow] = useState<Array<number>>([]);

  // set answers
  useEffect(() => {
    const answers = localStorage.getItem("answers");
    if (answers) setAnswers(JSON.parse(answers)[id]);
  }, [id]);

  const numberFormatter = (number: number) => {
    const size = number.toString().length;

    // reserve 3 cells for points
    return size <= 2
      ? ["", ...(size === 1 ? [""] : []), ...number.toString().split("")]
      : number.toString().split("");
  };

  const pointsAmount = useRef(0);

  // team mistakes
  const [redMistakes, setRedMistakes] = useState(0);
  const [blueMistakes, setBlueMistakes] = useState(0);

  // keyboard navigation
  useEffect(() => {
    const KeyupEvent = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.shiftKey || event.altKey || event.metaKey) {
        return;
      }

      // show answer
      if ([1, 2, 3, 4, 5, 6].includes(+event.key)) {
        const number = Number(event.key);
        if (!answers[number - 1]) return;

        if (!show.includes(number)) {
          pointsAmount.current += answers[number - 1].points;
          setShow([...show, number]);
        }
      }

      // close board
      if (event.key === "Escape") window.close();

      // manage teams mistakes
      switch (event.key.toUpperCase()) {
        case "Q":
          setRedMistakes(4);
          break;
        case "W":
          if (redMistakes >= 3) return;
          setRedMistakes(redMistakes + 1);
          break;
        case "E":
          setRedMistakes(0);
          setBlueMistakes(0);
          break;
        case "R":
          if (blueMistakes >= 3) return;
          setBlueMistakes(blueMistakes + 1);
          break;
        case "T":
          setBlueMistakes(4);
          break;
      }
    };

    document.addEventListener("keyup", KeyupEvent);
    return () => document.removeEventListener("keyup", KeyupEvent);
  }, [answers, show, blueMistakes, redMistakes]);

  const handleMistakes = (teamCounter: number) => {
    return (
      <div className={styles.mistakes}>
        {(teamCounter > 3 && (
          <Image
            className={styles.big}
            src="/images/x_big.webp"
            alt="X"
            width={111}
            height={283}
            draggable={false}
          />
        )) ||
          [...Array(teamCounter)].map((_, i) => {
            return (
              <Image
                key={i}
                src="/images/x_small.webp"
                alt="x"
                width={111}
                height={163}
                draggable={false}
              />
            );
          })}
      </div>
    );
  };

  // render content only with answers loaded
  if (!answers) return null;

  return (
    <div className={`${dottedFont.className} ${styles.container}`}>
      <div className={styles.data}>
        <div className={styles.mistakes}>{handleMistakes(redMistakes)}</div>

        <div className={styles.main}>
          {answers.map((el: any, i: number) => {
            const answer = el.answer.split("");
            const points = numberFormatter(el.points);
            const dots = Array(17).fill("...");

            return (
              <div key={i}>
                <p>{i + 1}</p>

                {(show.includes(i + 1) && (
                  // show answer
                  <>
                    <div className={styles.answer}>
                      {answer.map((word: string, i: number) => {
                        return <p key={i}>{word}</p>;
                      })}
                    </div>

                    <div className={styles.points}>
                      {points.map((word: string, i: number) => {
                        return <p key={i}>{word}</p>;
                      })}
                    </div>
                  </>
                )) || (
                  // show dots
                  <div className={styles.dots}>
                    {dots.map((cell: string, i: number) => {
                      return <p key={i}>{cell}</p>;
                    })}
                  </div>
                )}
              </div>
            );
          })}

          <div className={styles.pointsAmount}>
            <div>
              {"SUMA".split("").map((el: string, i: number) => {
                return <p key={i}>{el}</p>;
              })}
            </div>

            <div>
              {numberFormatter(pointsAmount.current).map(
                (el: string, i: number) => {
                  return <p key={i}>{el}</p>;
                }
              )}
            </div>
          </div>
        </div>

        <div className={styles.mistakes}>{handleMistakes(blueMistakes)}</div>
      </div>
    </div>
  );
}
