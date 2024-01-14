"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import type { Question } from "@/app/quizy/page";
import styles from "./styles.module.scss";

import { TConductorInstance } from "react-canvas-confetti/dist/types";
import Fireworks from "react-canvas-confetti/dist/presets/fireworks";

export default function BoardID({ params }: { params: { id: number } }) {
  const id = Number(params.id);
  const router = useRouter();

  const [data, setData] = useState<Question>();
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(0); // id + 1

  const [conductor, setConductor] = useState<TConductorInstance>();
  const onInit = ({ conductor }: { conductor: TConductorInstance }) => {
    setConductor(conductor);
  };

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

  const CenterDiv = ({ children }: { children: React.ReactNode }) => (
    <div className={styles.centerDiv}>
      <div>{children}</div>
    </div>
  );

  if (loading) {
    return (
      <CenterDiv>
        <h1 className="loading">Trwa ładowanie...</h1>
      </CenterDiv>
    );
  }

  if (id === 0) {
    return (
      <CenterDiv>
        <button onClick={() => router.push("/quizy/board/1")}>
          <p>Rozpocznij quiz!</p>
        </button>
      </CenterDiv>
    );
  }

  if (!data) {
    return (
      <CenterDiv>
        <h1>Koniec.</h1>
      </CenterDiv>
    );
  }

  const ClosedBoard = () => (
    <>
      <h1 className={styles.question}>{`${id}. ${data.question}`}</h1>

      <div
        className={styles.answers}
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

  const GapBoard = () => (
    <>
      <h1>{data.question}</h1>
      <button>Odkryj odpowiedź</button>
    </>
  );

  const OpenBoard = () => (
    <>
      <h1>{data.question}</h1>
      <button>Pokaż odpowiedzi</button>
    </>
  );

  return (
    <>
      <Fireworks onInit={onInit} />

      {data.type === "closed" && ClosedBoard()}
      {data.type === "gap" && GapBoard()}
      {data.type === "open" && OpenBoard()}

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
  );
}
