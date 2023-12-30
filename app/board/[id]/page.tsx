"use client";

import localFont from "next/font/local";
import { useEffect, useState } from "react";

import styles from "./page.module.scss";

const dottedFont = localFont({
  src: "../../../fonts/familiada.woff2",
  display: "swap",
});

export default function Board({ params }: { params: { id: number } }) {
  const [answers, setAnswers] = useState<any>();
  const { id } = params;

  useEffect(() => {
    const answers = localStorage.getItem("answers");
    if (answers) setAnswers(JSON.parse(answers)[id]);
  }, [id]);

  console.log(answers);

  return (
    <div className={`${dottedFont.className} ${styles.preview}`}>
      {answers &&
        answers.map((el: any, i: number) => {
          const formattedAnswer = el.answer
            .split(" ")
            .filter((el: string) => el);
          return (
            <div key={i}>
              <p>{i + 1}</p>
              <div className={styles.answer}>
                {formattedAnswer.map((word: string, i: number) => (
                  <div key={i}>{word}</div>
                ))}
              </div>
              <p className={styles.points}>{el.points}</p>
            </div>
          );
        })}
    </div>
  );
}
