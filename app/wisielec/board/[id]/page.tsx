"use client";

import { useEffect, useState } from "react";

import ms from "ms";

import type { Word } from "@/app/wisielec/page";

import styles from "./page.module.scss";
import { Credits, BoardLayout } from "@/components/boardLayout";

export default function WisielecBoardID({
  params,
}: {
  params: { id: number };
}) {
  const id = Number(params.id);

  const [data, setData] = useState<Word>();
  const [loading, setLoading] = useState(true);

  const [remainingTime, setRemainingTime] = useState<number>(0);
  const [letters, setLetters] = useState<string[]>([]);

  // get data on load
  useEffect(() => {
    const storedData = localStorage.getItem("wisielec") || "[]";
    const data = JSON.parse(storedData)[id];

    if (data) {
      setData(data);
      setRemainingTime(Number(ms(data.time)));
    }

    setLoading(false);
  }, [id]);

  // set time counter
  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingTime((prevTime) => {
        prevTime -= 1_000;
        if (prevTime <= 0) clearInterval(interval);
        return prevTime;
      });
    }, 1_000);

    return () => clearInterval(interval);
  }, []);

  // display time in format mm:ss
  const timeFormat = (time: number) => {
    const minutes = Math.floor(time / 60000)
      .toString()
      .padStart(2, "0");

    const seconds = Math.floor((time % 60000) / 1000)
      .toString()
      .padStart(2, "0");

    return `${minutes}:${seconds}`;
  };

  // display phrase
  const phraseFormat = (phrase: string) => {
    const words = phrase.split(" ");

    return words
      .map((word) => {
        return word
          .split("")
          .map((letter) => (letters.includes(letter) ? letter : "_"))
          .join("");
      })
      .join(" ");
  };

  // letters of alphabet
  const polishAlphabet = "aąbcćdeęfghijklłmnńoópqrsśtuvwxyzźż";
  const vowels = "aąeęioóuy";

  return (
    <BoardLayout>
      {/* hidden input for keyboard interactions */}
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
              {remainingTime >= 0 && (
                <p>Pozostały czas: {timeFormat(remainingTime)}</p>
              )}

              <div className={styles.phrase}>
                <h1>{phraseFormat(data.word)}</h1>
              </div>

              <div className={styles.bottom}>
                <p className={styles.mistakes}>
                  Błędy:{" "}
                  {
                    letters.filter((letter) => !data.word.includes(letter))
                      .length
                  }
                  /{data.attempts}
                </p>

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
            </div>
          ))}

        <Credits />
      </div>
    </BoardLayout>
  );
}
