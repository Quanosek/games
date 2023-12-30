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
    };

    document.addEventListener("keyup", KeyupEvent);
    return () => document.removeEventListener("keyup", KeyupEvent);
  }, [show]);

  useEffect(() => {
    const answers = localStorage.getItem("answers");
    if (answers) setAnswers(JSON.parse(answers)[id]);
  }, [id]);

  return (
    <div className={`${dottedFont.className} ${styles.data}`}>
      {answers &&
        answers.map((el: any, i: number) => {
          let answer = el.answer.split(" ").filter((el: string) => el);
          let points = el.points;

          return (
            <div key={i}>
              <p>{i + 1}</p>

              {show.includes(i + 1) && (
                <>
                  <div className={styles.answer}>
                    {answer.map((word: string, i: number) => (
                      <p key={i}>{word}</p>
                    ))}
                  </div>

                  <p className={styles.points}>{points}</p>
                </>
              )}

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
  );
}
