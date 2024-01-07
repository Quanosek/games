"use client";

import { useState } from "react";

import styles from "./page.module.scss";
import Layout from "@/components/pageLayout";

export default function QuizyPage() {
  const [counter, setCounter] = useState(1);

  return (
    <Layout>
      <h1 className={styles.title}>
        Zagraj w <span>Quizy</span>
      </h1>

      <button
        onClick={() => {
          //
        }}
      >
        <p>✨ Pokaż ekran startowy</p>
      </button>

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
  const handleFormSubmit = () => {
    //
  };

  const handleClearBoard = () => {
    //
  };

  const handleShowBoard = () => {
    //
  };

  return (
    <form className={styles.question} onSubmit={handleFormSubmit}>
      <input
        id={`${id}-title`}
        type="text"
        placeholder="Pytanie"
        maxLength={128}
      />

      <div className={styles.answers}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div className={styles.answer} key={i}>
            <input
              id={`${id}-${i}-answer`}
              type="text"
              placeholder="Odpowiedź"
              maxLength={64}
            />

            <div className={styles.container}>
              <div className={styles.correct}>
                <input id={`${id}-${i}-correct`} type="checkbox" />

                <label
                  htmlFor={`${id}-${i}-correct`}
                  className={styles.checkbox}
                >
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
