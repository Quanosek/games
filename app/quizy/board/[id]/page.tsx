"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import type { Question } from "@/app/quizy/page";
import styles from "./style.module.scss";

export default function BoardID({ params }: { params: { id: number } }) {
  const id = Number(params.id);
  const router = useRouter();

  const [data, setData] = useState<Question>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedData = localStorage.getItem("quizy");
    if (storedData) setData(JSON.parse(storedData)[id - 1]);
    setLoading(false);
  }, [id]);

  // keyboard interactions
  useEffect(() => {
    if (!data) return;

    const KeyupEvent = (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowLeft":
          router.push(`/quizy/board/${[id - 1]}`);
          break;
        case "ArrowRight":
          router.push(`/quizy/board/${[id + 1]}`);
          break;
      }
    };

    document.addEventListener("keyup", KeyupEvent);
    return () => document.removeEventListener("keyup", KeyupEvent);
  }, [data, router, id]);

  if (loading) return <h1>Trwa ładowanie...</h1>;

  if (id === 0) {
    return (
      <button onClick={() => router.push("/quizy/board/1")}>
        <p>Rozpocznij quiz!</p>
      </button>
    );
  }

  if (!data) return <h1>Gratulacje!</h1>;

  return (
    <>
      <h1 className={styles.question}>{`${id}. ${data.question}`}</h1>

      <div className={styles.answers}>
        {data.answers.map((el, i: number) => (
          <button
            key={i}
            onClick={(e) => {
              //
            }}
          >
            <p>{`${["A", "B", "C", "D"][i]}: ${el.value}`}</p>
          </button>
        ))}
      </div>

      <div className={styles.controls}>
        <button onClick={() => router.push(`/quizy/board/${[id - 1]}`)}>
          <Image
            src="/icons/arrow.svg"
            alt="arrow-left"
            width={50}
            height={50}
            draggable={false}
            style={{ rotate: "-90deg" }}
          />
        </button>

        <button onClick={() => router.push(`/quizy/board/${[id + 1]}`)}>
          <Image
            src="/icons/arrow.svg"
            alt="arrow-left"
            width={50}
            height={50}
            draggable={false}
            style={{ rotate: "90deg" }}
          />
        </button>
      </div>
    </>
  );
}
