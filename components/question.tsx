"use client";

import localFont from "next/font/local";
import { ChangeEvent, useState } from "react";

import styles from "./question.module.scss";

const dottedFont = localFont({
  src: "../fonts/familiada.woff2",
  display: "swap",
});

export default function Question({ id }: { id: number }) {
  // valid inputs
  const answerFormat = (e: ChangeEvent<HTMLInputElement>) => {
    const filtered = e.target.value.replace(/[^a-zA-Z\s.]/g, "");
    e.target.value = filtered;
  };

  const pointsFormat = (e: ChangeEvent<HTMLInputElement>) => {
    const filtered = e.target.value.replace(/[^0-9]/g, "");
    e.target.value = filtered;
  };

  // define answers state
  const [answers, setAnswers] = useState<any>();

  // handle form submit button
  const handleSubmit = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    // console.log(`plansza ${id + 1}`);

    const elements = Array.from(e.target.elements)
      .map((el: any) => {
        if (el.type === "text") return [el.id, el.value];
      })
      .filter((el: any) => el);

    const collection = new Map();

    elements.forEach(([id, value]: any) => {
      const [index, type] = id.split("-");
      const parsedValue = type === "points" ? Number(value) : value;

      if (!collection.has(index)) collection.set(index, []);
      collection.get(index)[type] = parsedValue;
    });

    const sortedAnswers = Array.from(collection.values())
      .filter((el) => el.answer && el.points)
      .sort((a, b) => b.points - a.points)
      .map(({ answer, points }) => ({ answer, points }));

    if (!(sortedAnswers.length > 1)) {
      return window.alert("Brak informacji do wyświetlenia planszy!");
    }

    setAnswers(sortedAnswers);
  };

  return (
    <div className={styles.board}>
      <form onSubmit={handleSubmit}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div className={styles.list} key={i}>
            <div className={styles.answer}>
              <p>Odpowiedź {i + 1}:</p>

              <input
                id={`${i}-answer`}
                type="text"
                autoComplete="off"
                maxLength={17}
                onChange={answerFormat}
              />
            </div>

            <div className={styles.points}>
              <p>Liczba punktów:</p>

              <input
                id={`${i}-points`}
                type="text"
                autoComplete="off"
                maxLength={2}
                onChange={pointsFormat}
              />
            </div>
          </div>
        ))}

        <div className={styles.buttons}>
          <button type="submit">Podgląd</button>
        </div>
      </form>

      <div className={`${dottedFont.className} ${styles.preview}`}>
        {answers &&
          answers.map((el: any, i: number) => {
            return (
              <div key={i}>
                <h2>{i + 1}</h2>
                <p className={styles.answer}>{el.answer}</p>
                <p className={styles.points}>{el.points}</p>
              </div>
            );
          })}
      </div>
    </div>
  );
}
