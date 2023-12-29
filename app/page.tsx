"use client";

import localFont from "next/font/local";
import { useState } from "react";

import styles from "./page.module.scss";

const dottedFont = localFont({
  src: "../fonts/familiada.woff2",
  weight: "normal",
  style: "normal",
  display: "swap",
});

export default function Home() {
  // valid inputs
  const answerFormat = (e: any) => {
    const filtered = e.target.value.replace(/[^a-zA-Z\s.]/g, "");
    e.target.value = filtered;
  };

  const pointsFormat = (e: any) => {
    const filtered = e.target.value.replace(/[^0-9]/g, "");
    e.target.value = filtered;
  };

  // define answers state
  const [answers, setAnswers] = useState<any>();

  // handle form submit button
  const handleSubmit = (e: any) => {
    e.preventDefault();

    const elements = Array.from(e.target.elements)
      .map((el: any) => {
        // filter out non-input elements
        if (el.type === "text") return [el.id, el.value];
      })
      // filter out empty elements
      .filter((el: any) => el);

    const collection = new Map();

    elements.forEach(([id, value]: any) => {
      const [index, type] = id.split("-");
      const parsedValue = type === "points" ? Number(value) : value;

      if (!collection.has(index)) collection.set(index, []);
      collection.get(index)[type] = parsedValue;
    });

    const sortedAnswers = Array.from(collection.values())
      .sort((a, b) => b.points - a.points)
      .map(({ answer, points }) => ({ answer, points }));

    setAnswers(sortedAnswers);
    localStorage.setItem("answers", JSON.stringify(sortedAnswers));
  };

  return (
    <main>
      <h1>Familiada</h1>

      <div className={styles.preview}>
        <form className={styles.list} onSubmit={handleSubmit}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div className={styles.answers} key={i}>
              <div className={styles.text}>
                <p>Odpowiedź {i + 1}:</p>
                <input
                  id={`${i}-answer`}
                  type="text"
                  autoComplete="off"
                  maxLength={24}
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
            <button type="submit">Zapisz</button>
          </div>
        </form>

        <section className={`${dottedFont.className} ${styles.board}`}>
          {answers &&
            answers.map((el: any, i: number) => {
              return (
                <div key={i}>
                  <h2>{i + 1}</h2>
                  <p
                    className={styles.answer}
                    style={{
                      borderBottom: el.answer ? "" : "3px dotted #d9c465",
                    }}
                  >
                    {el.answer}
                  </p>
                  <p className={styles.points}>{el.points}</p>
                </div>
              );
            })}
        </section>
      </div>
    </main>
  );
}
