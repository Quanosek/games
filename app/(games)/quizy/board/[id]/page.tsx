"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { TConductorInstance } from "react-canvas-confetti/dist/types";
import Fireworks from "react-canvas-confetti/dist/presets/fireworks";

import type { Data } from "../../page";
import styles from "./board.module.scss";

export default function QuizyIdBoard({ params }: { params: { id: number } }) {
  const id = Number(params.id);
  const router = useRouter();

  const [data, setData] = useState<Data>();
  const [loading, setLoading] = useState(true);

  // get data on load
  useEffect(() => {
    const storedData = localStorage.getItem("quizy") || "[]";
    const data = JSON.parse(storedData)[id - 1];

    if (data) {
      // filter empty answers
      const answers = data.answers.filter((el: { value: string }) => {
        return el.value !== "";
      });

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

      if (event.key === "ArrowLeft" && id !== 0) {
        router.push(`/quizy/board/${[id - 1]}`);
      }
      if (event.key === "ArrowRight" && (id === 0 || data)) {
        router.push(`/quizy/board/${[id + 1]}`);
      }
    };

    document.addEventListener("keyup", KeyupEvent);
    return () => document.removeEventListener("keyup", KeyupEvent);
  }, [data, router, id]);

  // type: "closed"
  function ClosedBoard({ data }: { data: Data }) {
    const [selected, setSelected] = useState(0); // id + 1

    // init confetti animation
    const [conductor, setConductor] = useState<TConductorInstance>();
    const onInit = ({ conductor }: { conductor: TConductorInstance }) => {
      return setConductor(conductor);
    };

    return (
      <>
        <Fireworks onInit={onInit} />

        <h1 className={styles.centerDiv}>{data.question}</h1>

        <div
          style={{ pointerEvents: selected ? "none" : "unset" }}
          className={styles.answersGrid}
        >
          {data.answers.map((el, i) => (
            <button
              key={i}
              className={
                // show selected and correct answers
                selected && data.answers[i].checked
                  ? styles.correct
                  : (selected === i + 1 && styles.selected) || ""
              }
              onClick={() => {
                if (data.answers[i].checked) conductor?.shoot();
                setSelected(i + 1);
              }}
            >
              <p>{`${["A", "B", "C", "D"][i]}: ${el.value}`}</p>
            </button>
          ))}
        </div>
      </>
    );
  }

  // type: "gap"
  function GapBoard({ data }: { data: Data }) {
    const [showHint, setShowHint] = useState(false);
    const [reveal, setReveal] = useState(false);

    const parseText = (text: string) => {
      const regex = /\[([^\]]*)\]/g;
      const parts = text.split(regex);
      return parts;
    };

    return (
      <>
        <div className={styles.centerDiv}>
          <h1>
            {parseText(data.question).map((part, i) => {
              if (i % 2 === 0) return part;

              if (!reveal) {
                if (!showHint) {
                  // empty underlined space
                  return (
                    <span key={i}>{new String("_").repeat(part.length)}</span>
                  );
                } else {
                  // show hint
                  return (
                    <span key={i} className={styles.gapHints}>
                      {part.replace(/[^\s]/g, "_")}
                      <p className={styles.hint}>{part[0]}</p>
                    </span>
                  );
                }
              } else {
                // show answer
                return (
                  <span
                    key={i}
                    style={{
                      fontWeight: "normal",
                      textDecoration: "underline",
                    }}
                  >
                    {part}
                  </span>
                );
              }
            })}
          </h1>
        </div>

        <div className={styles.controls}>
          <button
            className={showHint ? "disabled" : reveal ? "disabled" : ""}
            onClick={() => setShowHint(true)}
          >
            <Image
              className="icon"
              alt=""
              src="/icons/question_mark.svg"
              width={20}
              height={20}
              draggable={false}
            />
            <p>Podpowiedź</p>
          </button>

          <button
            className={reveal ? "disabled" : ""}
            onClick={() => setReveal(true)}
          >
            <Image
              className="icon"
              alt=""
              src="/icons/magnifying_glass.svg"
              width={20}
              height={20}
              draggable={false}
            />
            <p>Odkryj</p>
          </button>
        </div>
      </>
    );
  }

  // type: "open"
  function OpenBoard({ data }: { data: Data }) {
    const [showAnswer, setShowAnswer] = useState(false);

    return (
      <>
        <h1 className={styles.centerDiv}>{data.question}</h1>

        {showAnswer && (
          <h2 className={styles.openAnswer}>{data.answers[0].value}</h2>
        )}

        <div className={styles.controls}>
          <button
            className={showAnswer ? "disabled" : ""}
            onClick={() => setShowAnswer(true)}
          >
            <Image
              className="icon"
              alt=""
              src="/icons/magnifying_glass.svg"
              width={20}
              height={20}
              draggable={false}
            />
            <p>Pokaż odpowiedź</p>
          </button>
        </div>
      </>
    );
  }

  function DynamicRender() {
    if (loading) {
      // loading screen
      return (
        <div className={styles.loading}>
          <div className={styles.spinner} />
        </div>
      );
    }

    if (id === 0) {
      // start screen
      return (
        <div className={styles.simpleLayout}>
          <h1>Rozpocznij Quiz</h1>

          <button onClick={() => router.push("/quizy/board/1")}>
            <p>Graj</p>
          </button>
        </div>
      );
    }

    if (!data) {
      // end screen
      return (
        <div className={styles.simpleLayout}>
          <h1>Koniec</h1>

          <button onClick={() => window.close()}>
            <p>Zakończ</p>
          </button>
        </div>
      );
    }

    return (
      // default dynamic content
      <div className={styles.content}>
        {data.type === "closed" && <ClosedBoard data={data} />}
        {data.type === "gap" && <GapBoard data={data} />}
        {data.type === "open" && <OpenBoard data={data} />}
      </div>
    );
  }

  // main return
  return (
    <div className={styles.container}>
      <DynamicRender />

      <div className={styles.navigation}>
        <button
          title="Poprzednia plansza [🡨]"
          className={loading || id === 0 ? "disabled" : ""}
          onClick={() => router.push(`/quizy/board/${[id - 1]}`)}
        >
          <Image
            style={{ rotate: "-90deg" }}
            className="icon"
            alt="w lewo"
            src="/icons/arrow.svg"
            width={50}
            height={50}
            draggable={false}
          />
        </button>

        <button
          title="Następna plansza [🡪]"
          className={loading || (id && !data) ? "disabled" : ""}
          onClick={() => router.push(`/quizy/board/${[id + 1]}`)}
        >
          <Image
            style={{ rotate: "90deg" }}
            className="icon"
            alt="w prawo"
            src="/icons/arrow.svg"
            width={50}
            height={50}
            draggable={false}
          />
        </button>
      </div>
    </div>
  );
}
