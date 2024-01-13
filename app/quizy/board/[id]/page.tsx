"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import type { Question } from "@/app/quizy/page";
import styles from "./style.module.scss";

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

  useEffect(() => {
    const storedData = localStorage.getItem("quizy");
    if (storedData) setData(JSON.parse(storedData)[id - 1]);
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

  if (loading) return <h1 className="loading">Trwa ładowanie...</h1>;

  if (id === 0) {
    return (
      <div className={styles.centerDiv}>
        <div>
          <button onClick={() => router.push("/quizy/board/1")}>
            <p>Rozpocznij quiz!</p>
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className={styles.centerDiv}>
        <div>
          <h1>Koniec.</h1>
        </div>
      </div>
    );
  }

  return (
    <>
      <Fireworks onInit={onInit} />

      <h1 className={styles.question}>{`${id}. ${data.question}`}</h1>

      <div className={styles.bottomHandler}>
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
      </div>
    </>
  );
}
