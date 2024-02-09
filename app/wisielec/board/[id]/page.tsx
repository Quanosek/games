"use client";

import { useCallback, useEffect, useState } from "react";

import ms from "ms";

import type { Data } from "@/app/wisielec/page";
import styles from "./styles.module.scss";

import { TConductorInstance } from "react-canvas-confetti/dist/types";
import Fireworks from "react-canvas-confetti/dist/presets/fireworks";

export default function WisielecBoardID({
  params,
}: {
  params: { id: number };
}) {
  const id = Number(params.id);

  const [data, setData] = useState<Data>();
  const [loading, setLoading] = useState(true);

  const [remainingTime, setRemainingTime] = useState<number>(0);
  const [letters, setLetters] = useState<string[]>([]);

  // get data on load
  useEffect(() => {
    const storedData = localStorage.getItem("wisielec") || "[]";
    const data = JSON.parse(storedData)[id - 1];

    if (data) {
      setData(data);
      setRemainingTime(Number(ms(data.time)));
    }

    setLoading(false);
  }, [id]);

  // end of the game handler
  const [endGame, setEndGame] = useState<"win" | "lose">();

  // set time counter
  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingTime((prevTime) => {
        if (!endGame) prevTime -= 1_000;

        if (prevTime === 0) {
          clearInterval(interval);
          setEndGame("lose");
        }

        return prevTime;
      });
    }, 1_000);

    return () => clearInterval(interval);
  }, [endGame]);

  // phrase completion
  const phraseCompletion = useCallback(
    (data: Data) => {
      return data.phrase
        .split(" ")
        .map((word) => {
          // add uppercase letters to array
          const allLetters = [
            ...letters,
            ...letters.map((l) => l.toUpperCase()),
          ];

          return word
            .split("")
            .map((letter) => {
              // if letter is not in polishAlphabet, return it
              if (!/[a-zA-ZąĄćĆęĘłŁńŃóÓśŚźŹżŻ]/.test(letter)) return letter;
              // hide letters
              return allLetters.includes(letter) || endGame ? letter : "_";
            })
            .join("");
        })
        .join(" ");
    },
    [letters, endGame]
  );

  // count mistakes
  const mistakesAmount = useCallback(
    (data: Data) => {
      return letters.filter((letter) => !data.phrase.includes(letter)).length;
    },
    [letters]
  );

  const [conductor, setConductor] = useState<TConductorInstance>();
  const onInit = ({ conductor }: { conductor: TConductorInstance }) => {
    setConductor(conductor);
  };

  useEffect(() => {
    if (!data || endGame) return;

    // all attempts used
    if (data && mistakesAmount(data) === data.attempts) {
      return setEndGame("lose");
    }

    // no more letters to guess
    if (!phraseCompletion(data).includes("_")) {
      conductor?.shoot();
      return setEndGame("win");
    }
  }, [data, endGame, mistakesAmount, conductor, phraseCompletion]);

  // letters of alphabet
  const polishAlphabet = "aąbcćdeęfghijklłmnńoópqrsśtuvwxyzźż";
  const vowels = "aąeęioóuy";

  // loading data handler
  if (loading) {
    return <h1 className="loading">Trwa ładowanie...</h1>;
  } else if (!data) return;

  // page main render
  return (
    <>
      {/* hidden input for keyboard interactions */}
      <input
        type="text"
        className={styles.globalKeyboard}
        ref={(input) => input && input.focus()}
        onBlur={(e) => e.target.focus()}
        onChange={(e) => {
          if (endGame) return;

          const key = e.target.value.toLowerCase();
          // if key is not a letter, return it
          if (key.length !== 1 || !/[a-ząćęłńóśźż]/.test(key)) return;
          // add letter to letters array
          if (!letters.includes(key)) setLetters([...letters, key]);

          e.target.value = "";
        }}
      />

      {/* complete confetti */}
      <Fireworks onInit={onInit} />

      {/* board content  */}
      <div className={styles.content}>
        <div className={styles.topDiv}>
          <p>
            Kategoria: <span>{data.category}</span>
          </p>

          {remainingTime >= 0 && (
            <>
              <p className={styles.separator}>{"•"}</p>
              <p>
                Pozostały czas:{" "}
                <span
                  style={{
                    color: remainingTime === 0 ? "red" : "",
                  }}
                >{`${Math.floor(remainingTime / 60000)
                  .toString()
                  .padStart(2, "0")}:${Math.floor(
                  (remainingTime % 60000) / 1000
                )
                  .toString()
                  .padStart(2, "0")}`}</span>
              </p>
            </>
          )}
        </div>

        <div className={styles.phrase}>
          <h1>{phraseCompletion(data)}</h1>
        </div>

        <div className={styles.bottomDiv}>
          <p className={styles.mistakes}>
            Błędy:{" "}
            <span
              style={{
                color: mistakesAmount(data) === data.attempts ? "red" : "",
              }}
            >
              {mistakesAmount(data)}/{data.attempts}
            </span>
          </p>

          <div className={styles.letters}>
            {polishAlphabet.split("").map((letter) => (
              <button
                key={letter}
                className={`${styles.letter} ${
                  vowels.includes(letter) && styles.vowel
                } ${(letters.includes(letter) || endGame) && "disabled"}`}
                onClick={() => setLetters([...letters, letter])}
              >
                <p>{letter.toUpperCase()}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
