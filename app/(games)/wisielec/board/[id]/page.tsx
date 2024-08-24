"use client";

import Image from "next/image";
import { useEffect, useState, useCallback } from "react";
import { TConductorInstance } from "react-canvas-confetti/dist/types";
import Fireworks from "react-canvas-confetti/dist/presets/fireworks";
import ms from "ms";

import type { Data } from "../../page";
import styles from "./styles.module.scss";

export default function WisielecBoardID({
  params,
}: {
  params: { id: number };
}) {
  const id = Number(params.id);

  const [data, setData] = useState<Data>();
  const [loading, setLoading] = useState(true);

  const [remainingTime, setRemainingTime] = useState(0);
  const [letters, setLetters] = useState<string[]>([]);
  const [endGame, setEndGame] = useState<"win" | "lose">();

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

  // timer counting down
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
  const Phrase = useCallback(
    (data: Data) => {
      return data.phrase
        .split(" ")
        .map((word) => {
          // add uppercase letters to array
          const array = [...letters, ...letters.map((l) => l.toUpperCase())];

          return word
            .split("")
            .map((letter) => {
              // if letter is not in polish alphabet, return it
              if (!/[a-zA-ZąĄćĆęĘłŁńŃóÓśŚźŹżŻ]/.test(letter)) return letter;
              // hide letters
              return array.includes(letter) || endGame ? letter : "_";
            })
            .join("");
        })
        .join(" ");
    },
    [letters, endGame]
  );

  // mistakes counter
  const Mistakes = useCallback(
    (data: Data) => {
      return letters.filter((letter) => {
        return !data.phrase.includes(letter);
      }).length;
    },
    [letters]
  );

  // init confetti animation
  const [conductor, setConductor] = useState<TConductorInstance>();
  const onInit = ({ conductor }: { conductor: TConductorInstance }) => {
    return setConductor(conductor);
  };

  // end of game detection
  useEffect(() => {
    if (!data || endGame) return;

    // all attempts used
    if (data && Mistakes(data) === data.attempts) {
      return setEndGame("lose");
    }

    // no more letters to guess
    if (!Phrase(data).includes("_")) {
      conductor?.shoot();
      return setEndGame("win");
    }
  }, [data, endGame, Mistakes, Phrase, conductor]);

  // letters of alphabet
  const polishAlphabet = "aąbcćdeęfghijklłmnńoópqrsśtuvwxyzźż";
  const vowels = "aąeęioóuy";

  if (loading) {
    // loading screen
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
      </div>
    );
  } else if (!data) {
    // no data screen
    return null;
  }

  // page content
  return (
    <>
      {/* hidden input for keyboard interactions */}
      <input
        className={styles.globalKeyboard}
        ref={(input) => input?.focus()}
        onChange={(e) => {
          if (endGame) return;

          const value = e.target.value.toLowerCase();

          // add to letters array
          if (polishAlphabet.includes(value) && !letters.includes(value)) {
            setLetters([...letters, value]);
          }

          // clear input
          e.target.value = "";
        }}
        onBlur={(e) => e.target.focus()}
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
              <p>{"•"}</p>

              <p>
                Pozostały czas:{" "}
                <span style={{ color: remainingTime === 0 ? "red" : "" }}>
                  {`${Math.floor(remainingTime / 60_000)
                    .toString()
                    .padStart(2, "0")}:${Math.floor(
                    (remainingTime % 60_000) / 1_000
                  )
                    .toString()
                    .padStart(2, "0")}`}
                </span>
              </p>
            </>
          )}
        </div>

        <div className={styles.phrase}>
          <h1>{Phrase(data)}</h1>
        </div>

        <div className={styles.bottomDiv}>
          <p className={styles.mistakes}>
            Błędy:{" "}
            <span
              style={{
                color: Mistakes(data) === data.attempts ? "red" : "",
              }}
            >
              {Mistakes(data)}/{data.attempts}
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

        {/* dynamic image in background */}
        {Mistakes(data) > 0 && (
          <div className={styles.bgImage}>
            <Image
              alt="wisielec"
              src={`/wisielec/${Math.ceil(
                (15 / data.attempts) * Mistakes(data)
              )}.svg`}
              width={800}
              height={750}
              draggable={false}
            />
          </div>
        )}
      </div>
    </>
  );
}
