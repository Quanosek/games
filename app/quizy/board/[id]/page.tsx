"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import type { Question } from "@/app/quizy/page";
import styles from "./page.module.scss";
import { Credits, BoardLayout } from "@/components/boardLayout";

import { TConductorInstance } from "react-canvas-confetti/dist/types";
import Fireworks from "react-canvas-confetti/dist/presets/fireworks";

export default function QuizyBoardID({ params }: { params: { id: number } }) {
  const id = Number(params.id);
  const router = useRouter();

  const [data, setData] = useState<Question>();
  const [loading, setLoading] = useState(true);

  // get data on load
  useEffect(() => {
    const storedData = localStorage.getItem("quizy") || "[]";
    const data = JSON.parse(storedData)[id - 1];

    if (data) {
      // filter empty answers
      const answers = data.answers.filter(
        (el: { value: string }) => el.value !== ""
      );

      setData({ ...data, answers });
    }

    setLoading(false);
  }, [id]);

  // keyboard interactions
  useEffect(() => {
    const KeyupEvent = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.shiftKey || event.altKey || event.metaKey) {
        return;
      }

      switch (event.key) {
        case "ArrowLeft":
          (id !== 0 || data) && router.push(`/quizy/board/${[id - 1]}`);
          break;
        case " ": // Space
        case "ArrowRight":
          (id === 0 || data) && router.push(`/quizy/board/${[id + 1]}`);
          break;
      }
    };

    document.addEventListener("keyup", KeyupEvent);
    return () => document.removeEventListener("keyup", KeyupEvent);
  }, [data, router, id]);

  // type: "closed"
  function ClosedBoard(params: { data: Question }) {
    const data = params.data;

    const [selected, setSelected] = useState(0); // id + 1

    const [conductor, setConductor] = useState<TConductorInstance>();
    const onInit = ({ conductor }: { conductor: TConductorInstance }) => {
      setConductor(conductor);
    };

    return (
      <>
        <Fireworks onInit={onInit} />

        <h1>{`${data.question}`}</h1>

        <div
          className={styles.closedAnswers}
          style={{
            // disable after choosing answer
            pointerEvents: selected ? "none" : "unset",
          }}
        >
          {data.answers.map((el, i: number) => (
            <button
              key={i}
              onClick={() => {
                if (data.answers[i].checked) conductor?.shoot();
                setSelected(i + 1);
              }}
              className={
                // show selected and correct answers
                selected && data.answers[i].checked
                  ? styles.correct
                  : (selected === i + 1 && styles.selected) || ""
              }
            >
              <p>{`${["A", "B", "C", "D"][i]}: ${el.value}`}</p>
            </button>
          ))}
        </div>
      </>
    );
  }

  // type: "gap"
  function GapBoard(params: { data: Question }) {
    const data = params.data;

    const [showHint, setShowHint] = useState(false);
    const [reveal, setReveal] = useState(false);

    const parseText = (text: string) => {
      const regex = /\[([^\]]*)\]/g;
      const parts = text.split(regex);
      return parts;
    };

    return (
      <>
        <h1>
          {parseText(data.question).map((part, index) => {
            if (index % 2 === 0) return part;
            else {
              if (!reveal) {
                if (!showHint) {
                  // empty underlined space
                  return (
                    <span key={index}>
                      {new String("_").repeat(part.length)}
                    </span>
                  );
                } else {
                  // show hint
                  return (
                    <span key={index} className={styles.gapHints}>
                      {part.replace(/[^\s]/g, "_")}
                      <p className={styles.hint}>{part[0]}</p>
                    </span>
                  );
                }
              } else {
                // show answer
                return (
                  <span
                    key={index}
                    style={{
                      fontWeight: "normal",
                      textDecoration: "underline",
                    }}
                  >
                    {part}
                  </span>
                );
              }
            }
          })}
        </h1>

        <div className={styles.bottomButtons}>
          <button
            className={showHint ? "disabled" : reveal ? "disabled" : ""}
            onClick={() => setShowHint(true)}
          >
            <p>❔ Podpowiedź</p>
          </button>

          <button
            className={reveal ? "disabled" : ""}
            onClick={() => setReveal(true)}
          >
            <p>🔍 Odkryj</p>
          </button>
        </div>
      </>
    );
  }

  // type: "open"
  function OpenBoard(params: { data: Question }) {
    const data = params.data;

    const [showAnswer, setShowAnswer] = useState(false);

    return (
      <>
        <h1>{data.question}</h1>
        {showAnswer && (
          <h2 className={styles.openAnswer}>{data.answers[0].value}</h2>
        )}

        <div className={styles.bottomButtons}>
          <button
            className={showAnswer ? "disabled" : ""}
            onClick={() => {
              setShowAnswer(true);
            }}
          >
            <p>💬 Pokaż odpowiedź</p>
          </button>
        </div>
      </>
    );
  }

  // page main render
  return (
    <BoardLayout>
      <div className={styles.board}>
        {(loading && <h1 className="loading">Trwa ładowanie...</h1>) ||
          (id === 0 && (
            <div className={styles.center}>
              <button onClick={() => router.push("/quizy/board/1")}>
                <p>Rozpocznij quiz!</p>
              </button>
            </div>
          )) ||
          (!data && <h1>To już wszystko!</h1>) ||
          (data && (
            <>
              <div className={styles.content}>
                {data.type === "closed" && <ClosedBoard data={data} />}
                {data.type === "gap" && <GapBoard data={data} />}
                {data.type === "open" && <OpenBoard data={data} />}
              </div>

              <div className={styles.controls}>
                <button
                  title="Poprzednie pytanie [🡨]"
                  onClick={() => router.push(`/quizy/board/${[id - 1]}`)}
                >
                  <Image
                    src="/icons/arrow.svg"
                    alt="arrow-left"
                    width={50}
                    height={50}
                    draggable={false}
                    className="icon"
                    style={{ rotate: "-90deg" }}
                  />
                </button>

                <button
                  title="Nastepne pytanie [🡪]"
                  onClick={() => router.push(`/quizy/board/${[id + 1]}`)}
                >
                  <Image
                    src="/icons/arrow.svg"
                    alt="arrow-left"
                    width={50}
                    height={50}
                    draggable={false}
                    className="icon"
                    style={{ rotate: "90deg" }}
                  />
                </button>
              </div>
            </>
          ))}

        <Credits />
      </div>
    </BoardLayout>
  );
}
