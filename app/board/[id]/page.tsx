"use client";

import localFont from "next/font/local";
import { useEffect, useState } from "react";

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

  // keyboard navigation
  useEffect(() => {
    const KeyupEvent = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.shiftKey || event.altKey || event.metaKey) {
        return;
      }

      if ([1, 2, 3, 4, 5, 6].includes(+event.key)) {
        const number = Number(event.key);
        if (!show.includes(number)) setShow([...show, number]);
      }

      if (event.key.toUpperCase() === "ESCAPE") window.close();
    };

    document.addEventListener("keyup", KeyupEvent);
    return () => document.removeEventListener("keyup", KeyupEvent);
  }, [show]);

  return (
    <div className={`${dottedFont.className} ${styles.container}`}>
      <div className={styles.data}>
        {answers &&
          answers.map((el: any, i: number) => {
            const answer = el.answer.split("");
            const points =
              el.points.toString().length === 1
                ? ["", ...el.points.toString()]
                : el.points.toString().split("");

            return (
              <div className={styles.item} key={i}>
                <p>{i + 1}</p>

                {/* answer revealed */}
                {show.includes(i + 1) && (
                  <>
                    <div className={styles.answer}>
                      {answer.map((word: string, i: number) => (
                        <p key={i}>{word}</p>
                      ))}
                    </div>

                    <div className={styles.points}>
                      {points.map((word: string, i: number) => (
                        <p key={i}>{word}</p>
                      ))}
                    </div>
                  </>
                )}

                {/* answer hidden */}
                {!show.includes(i + 1) && (
                  <div className={styles.dots}>
                    {Array(17)
                      .fill("...")
                      .map((cell: string, i: number) => (
                        <p key={i}>{cell}</p>
                      ))}
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}
