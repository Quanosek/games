"use client";

import { useEffect, useState } from "react";

import type { Word } from "@/app/wisielec/page";
import { vowels } from "@/app/wisielec/page";

import styles from "./page.module.scss";
import { Credits, BoardLayout } from "@/components/boardLayout";

export default function BoardID({ params }: { params: { id: number } }) {
  const id = Number(params.id);

  const [data, setData] = useState<Word>();
  const [loading, setLoading] = useState(true);

  const [letters, setLetters] = useState<string[]>([]);

  // get data on load
  useEffect(() => {
    const storedData = localStorage.getItem("wisielec") || "[]";
    const data = JSON.parse(storedData)[id];

    if (data) setData(data);
    setLoading(false);
  }, [id]);

  const polishAlphabet = "aąbcćdeęfghijklłmnńoópqrsśtuvwxyzźż";

  const showPhrase = (phrase: string) => {
    const words = phrase.split(" ");

    const letters = words.map((word) => {
      return word.split("").map((letter) => ({ letter, guessed: false }));
    });

    const result = letters.map((word) => {
      return word.map((letter) => letter.letter).join(" ");
    });

    return result;
  };

  return (
    <BoardLayout>
      <input
        type="text"
        className={styles.globalKeyboard}
        ref={(input) => input && input.focus()}
        onBlur={(e) => e.target.focus()}
        onChange={(e) => {
          const key = e.target.value;
          if (!letters.includes(key)) setLetters([...letters, key]);
          e.target.value = "";
        }}
      />

      <div className={styles.board}>
        {(loading && <h1 className="loading">Trwa ładowanie...</h1>) ||
          (data && (
            // board content
            <div className={styles.content}>
              <div className={styles.phrase}>
                <h1>{showPhrase(data.word)}</h1>
              </div>

              <div className={styles.letters}>
                {polishAlphabet.split("").map((letter) => (
                  <button
                    key={letter}
                    className={`${styles.letter} ${
                      vowels.includes(letter) && styles.vowel
                    } ${letters.includes(letter) && "disabled"}`}
                    onClick={() => setLetters([...letters, letter])}
                  >
                    <p>{letter.toUpperCase()}</p>
                  </button>
                ))}
              </div>
            </div>
          ))}

        <Credits />
      </div>
    </BoardLayout>
  );
}
