"use client";

import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import FormatPoints from "@/lib/formatPoints";

import styles from "./styles.module.scss";

export default function FamiliadaBoardID({
  params,
}: {
  params: { id: number };
}) {
  const id = Number(params.id);

  const [data, setData] = useState<any>();
  const [show, setShow] = useState<Array<number>>([]);

  const pointsAmount = useRef(0);
  const mainScore = useRef(0);

  // team mistakes
  const [redMistakes, setRedMistakes] = useState(0);
  const [blueMistakes, setBlueMistakes] = useState(0);

  // audio files support
  const audioGood = useRef<HTMLAudioElement>(null);
  const audioWrong = useRef<HTMLAudioElement>(null);

  // get data on load
  useEffect(() => {
    const storedData = localStorage.getItem("familiada") || "[]";
    const data = JSON.parse(storedData)[id - 1];

    if (data) {
      // filter empty answers
      const answers = data.answers.filter(
        (el: { value: string }) => el.value !== ""
      );

      setData(answers);
    }
  }, [id]);

  // keyboard navigation
  useEffect(() => {
    const KeyupEvent = (event: KeyboardEvent) => {
      if (event.shiftKey || event.altKey || event.metaKey) {
        return;
      }

      // show answer
      if ([1, 2, 3, 4, 5, 6].includes(+event.key)) {
        event.preventDefault();

        const number = Number(event.key);
        if (!data[number - 1]) return;

        if (!show.includes(number)) {
          audioGood.current && audioGood.current.play();
          setShow([...show, number]);

          if (!event.ctrlKey) {
            const points = data[number - 1].points;
            pointsAmount.current += points;

            let score = points;
            if (data.length === 5) score = points * 2;
            if (data.length < 5) score = points * 3;
            mainScore.current += score;
          }
        }
      }

      if (!audioWrong.current) return;

      // manage teams mistakes
      switch (event.key.toUpperCase()) {
        case "Q":
          if (redMistakes > 3) return;
          setRedMistakes(4);
          audioWrong.current.play();
          break;
        case "W":
          if (redMistakes >= 3) return;
          setRedMistakes(redMistakes + 1);
          audioWrong.current.play();
          break;
        case "E":
          setRedMistakes(0);
          setBlueMistakes(0);
          break;
        case "R":
          if (blueMistakes >= 3) return;
          setBlueMistakes(blueMistakes + 1);
          audioWrong.current.play();
          break;
        case "T":
          if (blueMistakes > 3) return;
          setBlueMistakes(4);
          audioWrong.current.play();
          break;
      }
    };

    document.addEventListener("keyup", KeyupEvent);
    return () => document.removeEventListener("keyup", KeyupEvent);
  }, [data, show, blueMistakes, redMistakes]);

  const handleMistakes = (teamCounter: number) => {
    return (
      <div className={styles.mistakes}>
        {(teamCounter > 3 && (
          <Image
            className={styles.big}
            alt="X"
            src="/familiada/images/x_big.webp"
            width={111}
            height={283}
            draggable={false}
          />
        )) ||
          [...Array(teamCounter)].map((_, i) => {
            return (
              <Image
                key={i}
                alt="x"
                src="/familiada/images/x_small.webp"
                width={111}
                height={163}
                draggable={false}
              />
            );
          })}
      </div>
    );
  };

  // start board view
  if (id === 0) {
    return (
      <>
        <Image
          className={styles.titleBoard}
          alt="FAMILIADA"
          src="/familiada/images/background_title.webp"
          width={1920}
          height={1080}
          draggable={false}
        />

        <audio src="/familiada/audio/intro.mp3" autoPlay />
      </>
    );
  }

  return (
    <>
      <div className={styles.totalPoints}>
        <div>
          {FormatPoints(mainScore.current).map((el: string, i: number) => {
            return <p key={i}>{el}</p>;
          })}
        </div>
      </div>

      {data && (
        <div className={styles.data}>
          <div className={styles.mistakes}>{handleMistakes(redMistakes)}</div>

          <div className={styles.main}>
            {data.map((el: { value: string; points: number }, i: number) => {
              const answer = el.value.split("");
              const points = FormatPoints(el.points);
              const dots = Array(17).fill("...");

              return (
                <div key={i}>
                  <p>{i + 1}</p>

                  {(show.includes(i + 1) && (
                    // show answer
                    <>
                      <div className={styles.answer}>
                        {answer.map((word: string, i: number) => {
                          return <p key={i}>{word}</p>;
                        })}
                      </div>

                      <div className={styles.points}>
                        {points.map((word: string, i: number) => {
                          return <p key={i}>{word}</p>;
                        })}
                      </div>
                    </>
                  )) || (
                    // show dots
                    <div className={styles.dots}>
                      {dots.map((cell: string, i: number) => {
                        return <p key={i}>{cell}</p>;
                      })}
                    </div>
                  )}
                </div>
              );
            })}

            <div className={styles.pointsAmount}>
              <div>
                {"SUMA".split("").map((el: string, i: number) => {
                  return <p key={i}>{el}</p>;
                })}
              </div>

              <div>
                {FormatPoints(pointsAmount.current).map(
                  (el: string, i: number) => {
                    return <p key={i}>{el}</p>;
                  }
                )}
              </div>
            </div>
          </div>

          <div className={styles.mistakes}>{handleMistakes(blueMistakes)}</div>
        </div>
      )}

      {/* audio effects */}
      <audio src="/familiada/audio/round.mp3" autoPlay />
      <audio ref={audioGood} src="/familiada/audio/answer.mp3" />
      <audio ref={audioWrong} src="/familiada/audio/wrong.mp3" />
    </>
  );
}
