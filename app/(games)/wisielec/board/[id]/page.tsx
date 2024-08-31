"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { TConductorInstance } from "react-canvas-confetti/dist/types";
import Fireworks from "react-canvas-confetti/dist/presets/fireworks";
import ms from "ms";

import type { Data } from "../../page";
import styles from "./board.module.scss";

export default function WisielecIdBoard({
  params,
}: {
  params: { id: number };
}) {
  const id = Number(params.id);

  const [data, setData] = useState<Data>();
  const [loading, setLoading] = useState(true);

  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);
  const [endGame, setEndGame] = useState<"win" | "lose">();

  // load board data
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

  // init confetti animation
  const [conductor, setConductor] = useState<TConductorInstance>();
  const onInit = ({ conductor }: { conductor: TConductorInstance }) => {
    return setConductor(conductor);
  };

  // end of game detection
  useEffect(() => {
    if (!data) return;

    // all attempts used
    if (mistakes === data.attempts) {
      return setEndGame("lose");
    }

    // no more letters to guess
    const lettersToGuess = data.phrase.split("").filter((value: string) => {
      return value.match(/[A-ZĄĆĘŁŃÓŚŹŻ]/) && !guessedLetters.includes(value);
    });

    if (!lettersToGuess.length) {
      for (let i = 0; i < 2; i++) {
        setTimeout(() => {
          if (conductor) conductor?.shoot();
        }, i * 600);
      }

      return setEndGame("win");
    }
  }, [data, mistakes, guessedLetters, conductor]);

  // on letter click handler
  const checkLetter = (letter: string) => {
    if (guessedLetters.includes(letter)) return;

    setGuessedLetters([...guessedLetters, letter]);

    if (!data?.phrase.includes(letter)) setMistakes(mistakes + 1);
  };

  // allowed letters
  const polishAlphabet = "AĄBCĆDEĘFGHIJKLŁMNŃOÓPQRSŚTUVWXYZŹŻ";
  const vowels = "AĄEĘIOÓUY";

  // loading screen
  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
      </div>
    );
  }

  // no data found
  if (!data) return null;

  // main return
  return (
    <div className={styles.board}>
      {/* hidden input for keyboard interactions */}
      <input
        className={styles.globalKeyboard}
        ref={(input) => input?.focus()}
        onBlur={(e) => e.target.focus()}
        onInput={(e) => {
          if (endGame) return;

          const input = e.target as HTMLInputElement;
          const value = input.value.toUpperCase();

          if (polishAlphabet.includes(value)) checkLetter(value);

          input.value = "";
        }}
      />

      <Fireworks onInit={onInit} />

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

      <div className={styles.phraseContainer}>
        <div className={styles.phrase}>
          {data.phrase.split(" ").map((word, i) => (
            <div key={i}>
              {word.split("").map((sign, j) => {
                const isLetter = sign.match(/[A-ZĄĆĘŁŃÓŚŹŻ]/);

                if (isLetter) {
                  return (
                    <p
                      key={j}
                      style={{ color: endGame === "win" ? "green" : "" }}
                      className={styles.letter}
                    >
                      {guessedLetters.includes(sign) || endGame ? sign : ""}
                    </p>
                  );
                } else {
                  return (
                    <p key={j} className={styles.sign}>
                      {sign}
                    </p>
                  );
                }
              })}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.bottomDiv}>
        <p className={styles.mistakes}>
          Błędy:{" "}
          <span style={{ color: mistakes === data.attempts ? "red" : "" }}>
            {mistakes}/{data.attempts}
          </span>
        </p>

        <div className={styles.letters}>
          {polishAlphabet.split("").map((letter, index) => (
            <button
              key={index}
              className={`${vowels.includes(letter) && styles.vowel} ${
                (guessedLetters.includes(letter) || endGame) && "disabled"
              }`}
              onClick={() => checkLetter(letter)}
            >
              <p>{letter}</p>
            </button>
          ))}
        </div>
      </div>

      {mistakes > 0 && (
        // dynamic background image
        <div className={styles.backgroundImage}>
          <Image
            alt="wisielec"
            src={`/wisielec/${Math.ceil((15 / data.attempts) * mistakes)}.svg`}
            width={800}
            height={750}
            draggable={false}
          />
        </div>
      )}
    </div>
  );
}
