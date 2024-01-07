"use client";

import { ChangeEvent, useState } from "react";

import styles from "./page.module.scss";
import Layout from "@/components/pageLayout";

export default function QuizyPage() {
  const [counter, setCounter] = useState(1);

  return (
    <Layout>
      <h1 className={styles.title}>
        Zagraj w <span>Quizy</span>
      </h1>

      {/* 
      <button onClick={() => {}}>
        <p>✨ Pokaż ekran startowy</p>
      </button>
      */}

      {[...Array(counter)].map((_, i) => (
        <div key={i}>
          <Question id={i} />
        </div>
      ))}

      <button onClick={() => setCounter(counter + 1)}>
        <p>➕ Dodaj nowe pytanie</p>
      </button>
    </Layout>
  );
}

function Question({ id }: { id: number }) {
  const handleClearBoard = () => {
    const collections = JSON.parse(localStorage.getItem("quizy") || "{}");
    delete collections[id];
    localStorage.setItem("quizy", JSON.stringify(collections));
  };

  const handleFormSubmit = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    type Answer = {
      answer: string;
      correct?: boolean;
    };

    const Collection = {
      question: "",
      answers: [] as Answer[],
    };

    Array.from((e.target as HTMLFormElement).elements).forEach((el: any) => {
      const [index, type] = el.name.split("-");

      if (el.type === "text") {
        if (index === "title" && !type) Collection.question = el.value;
        else Collection.answers.push({ answer: el.value });
      }
      if (el.type === "checkbox") {
        Collection.answers[index].correct = el.checked;
      }
    });

    const collections = JSON.parse(localStorage.getItem("quizy") || "{}");
    collections[id] = Collection;
    localStorage.setItem("quizy", JSON.stringify(collections));
  };

  const handleShowBoard = () => {
    window.open(
      `/quizy/board/${id + 1}`,
      "quizy_tablica",
      "width=960, height=540"
    );
  };

  return (
    <form className={styles.question} onSubmit={handleFormSubmit}>
      <input
        name="title"
        type="text"
        maxLength={128}
        placeholder="Pytanie"
        autoComplete="off"
      />

      <div className={styles.answers}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div className={styles.answer} key={i}>
            <input
              name={`${i}-answer`}
              type="text"
              maxLength={64}
              placeholder="Odpowiedź"
              autoComplete="off"
            />

            <div className={styles.container}>
              <div className={styles.correct}>
                <input
                  id={`${id}-${i}`}
                  name={`${i}-correct`}
                  type="checkbox"
                />

                <label htmlFor={`${id}-${i}`} className={styles.checkbox}>
                  <p className={styles.text}>poprawna odpowiedź</p>

                  <svg width="18px" height="18px" viewBox="0 0 18 18">
                    <path d="M1,9 L1,3.5 C1,2 2,1 3.5,1 L14.5,1 C16,1 17,2 17,3.5 L17,14.5 C17,16 16,17 14.5,17 L3.5,17 C2,17 1,16 1,14.5 L1,9 Z"></path>
                    <polyline points="1 9 7 14 15 4"></polyline>
                  </svg>
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* bottom buttons controls */}
      <div className={styles.buttons}>
        <button type="button" onClick={handleClearBoard}>
          <p>🧹 Wyczyść</p>
        </button>

        <button type="submit">
          <p>💾 Zapisz</p>
        </button>

        <button type="button" onClick={handleShowBoard}>
          <p>🖥️ Pokaż</p>
        </button>
      </div>
    </form>
  );
}
