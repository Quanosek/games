"use client";

import localFont from "next/font/local";
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

  const pointsAmount = useRef(0);

  // set answers
  useEffect(() => {
    const answers = localStorage.getItem("answers");
    if (answers) setAnswers(JSON.parse(answers)[id]);
  }, [id]);

  // keyboard navigation
  useEffect(() => {
    const KeyupEvent = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.shiftKey || event.altKey || event.metaKey) {
        return;
      }

      if ([1, 2, 3, 4, 5, 6].includes(+event.key)) {
        const number = Number(event.key);

        if (!show.includes(number)) {
          pointsAmount.current += answers[number - 1].points;
          setShow([...show, number]);
        }
      }

      if (event.key === "Escape") window.close();
    };

    document.addEventListener("keyup", KeyupEvent);
    return () => document.removeEventListener("keyup", KeyupEvent);
  }, [answers, show]);

  const numberFormatter = (number: number) => {
    const size = number.toString().length;

    // reserve 3 cells for points
    return size <= 2
      ? ["", ...(size === 1 ? [""] : []), ...number.toString().split("")]
      : number.toString().split("");
  };

  if (!answers) return null;

  return (
    <div className={`${dottedFont.className} ${styles.container}`}>
      <div className={styles.data}>
        {answers.map((el: any, i: number) => {
          const answer = el.answer.split("");
          const points = numberFormatter(el.points);

          return (
            <div className={styles.item} key={i}>
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
                  {Array(17)
                    .fill("...")
                    .map((cell: string, i: number) => {
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
    </div>
  );
}
