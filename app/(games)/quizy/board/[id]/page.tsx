"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import type { Data } from "@/app/(games)/quizy/page";
import styles from "./styles.module.scss";

import { TConductorInstance } from "react-canvas-confetti/dist/types";
import Fireworks from "react-canvas-confetti/dist/presets/fireworks";

export default function QuizyBoardID({ params }: { params: { id: number } }) {
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
  function ClosedBoard(params: { data: Data }) {
    const data = params.data;

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
  function GapBoard(params: { data: Data }) {
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
        <div className={styles.centerDiv}>
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
        </div>

        <div className={styles.controls}>
          <button
            className={showHint ? "disabled" : reveal ? "disabled" : ""}
            onClick={() => setShowHint(true)}
          >
            <Image
              className="icon"
              alt="icon"
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
              alt="icon"
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
  function OpenBoard(params: { data: Data }) {
    const data = params.data;

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
              alt="icon"
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
    } else if (id === 0) {
      // start screen
      return (
        <div className={styles.simpleLayout}>
          <h1>Rozpocznij quiz</h1>

          <button onClick={() => router.push("/quizy/board/1")}>
            <p>Zagraj</p>
          </button>
        </div>
      );
    } else if (!data) {
      // end screen
      return (
        <div className={styles.simpleLayout}>
          <h1>Koniec quizu</h1>

          <button onClick={() => window.close()}>
            <p>Wyjdź</p>
          </button>
        </div>
      );
    } else {
      return (
        <div className={styles.content}>
          {data.type === "closed" && <ClosedBoard data={data} />}
          {data.type === "gap" && <GapBoard data={data} />}
          {data.type === "open" && <OpenBoard data={data} />}
        </div>
      );
    }
  }

  return (
    <>
      {/* Page content */}
      <DynamicRender />

      {/* Default navigation buttons */}
      <div className={styles.navigation}>
        <button
          title="Poprzednia plansza [🡨]"
          className={loading || id === 0 ? "disabled" : ""}
          onClick={() => router.push(`/quizy/board/${[id - 1]}`)}
        >
          <Image
            style={{ rotate: "-90deg" }}
            className="icon"
            alt="arrow-left"
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
            alt="arrow-left"
            src="/icons/arrow.svg"
            width={50}
            height={50}
            draggable={false}
          />
        </button>
      </div>
    </>
  );
}
