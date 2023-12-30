"use client";

import localFont from "next/font/local";
import { ChangeEvent, useEffect, useState } from "react";

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
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const answers = localStorage.getItem("answers");
    if (answers) setAnswers(JSON.parse(answers)[id]);
  }, [id]);

  // handle form submit button
  const handleSubmit = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

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

    // manage local storage data
    const local = localStorage.getItem("answers");

    if (!local) {
      // create new data with board
      localStorage.setItem(
        "answers",
        JSON.stringify({
          [id]: sortedAnswers,
        })
      );
    } else {
      const parsed = JSON.parse(local);

      if (parsed[id]) {
        // update existing board
        parsed[id] = sortedAnswers;
        localStorage.setItem("answers", JSON.stringify(parsed));
      } else {
        // create new board
        localStorage.setItem(
          "answers",
          JSON.stringify({
            ...parsed,
            [id]: sortedAnswers,
          })
        );
      }
    }

    setAnswers(sortedAnswers);
    setIsSaved(true);
    window.alert("Zapisano planszę do pamięci lokalnej.");
  };

  const handleClearBoard = () => {
    if (!window.confirm("Czy na pewno chcesz wyczyścić planszę?")) return;

    // manage local storage data
    const local = localStorage.getItem("answers");

    if (local) {
      const parsed = JSON.parse(local);

      if (parsed[id]) {
        // remove existing board
        delete parsed[id];

        // modify id of other boards
        Object.keys(parsed).forEach((key) => {
          if (Number(key) > id) {
            parsed[Number(key) - 1] = parsed[key];
            delete parsed[key];
          }
        });

        localStorage.setItem("answers", JSON.stringify(parsed));
      }
    }

    setAnswers(undefined);
  };

  const handleShowBoard = () => {
    const answers = localStorage.getItem("answers");
    const local = answers && JSON.parse(answers)[id];

    if (!(isSaved || local)) {
      return window.alert("Najpierw musisz zapisać planszę!");
    }

    const board = window.open(
      `/board/${id}`,
      "Familiada - Tablica wyników",
      "width=960, height=540"
    );

    // const controls = window.open(
    //   "/controls",
    //   "Familiada - Panel sterowania",
    //   "width=960, height=540"
    // );
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
          <button type="submit">
            <p>💾 Zapisz</p>
          </button>

          <button type="button" onClick={handleClearBoard}>
            <p>🧹 Wyczyść</p>
          </button>

          <button type="button" onClick={handleShowBoard}>
            <p>🖥️ Pokaż</p>
          </button>
        </div>
      </form>

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
                    <p key={i}>{word}</p>
                  ))}
                </div>

                <p className={styles.points}>{el.points}</p>
              </div>
            );
          })}
      </div>
    </div>
  );
}
