"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import styles from "./style.module.scss";

export default function BoardID({ params }: { params: { id: number } }) {
  const { id } = params;
  const router = useRouter();

  const [data, setData] = useState<any>();

  useEffect(() => {
    const storedData = localStorage.getItem("quizy");
    if (storedData) setData(JSON.parse(storedData)[id - 1]);
  }, [id]);

  if (!data) {
    return (
      <button onClick={() => router.push("/quizy/board/1")}>
        <p>Rozpocznij quiz!</p>
      </button>
    );
  }

  return (
    <>
      <h1 className={styles.question}>{`${id}. ${data.question}`}</h1>

      <div className={styles.answers}>
        {data.answers.map((el: any, i: number) => (
          <button key={i}>
            <p>{`${["A", "B", "C", "D"][i]}: ${el.value}`}</p>
          </button>
        ))}
      </div>

      <div className={styles.controls}>
        <button onClick={() => router.push(`/quizy/board/${[Number(id) - 1]}`)}>
          <Image
            src="/icons/arrow.svg"
            alt="arrow-left"
            width={50}
            height={50}
            draggable={false}
            style={{ rotate: "-90deg" }}
          />
        </button>

        <button onClick={() => router.push(`/quizy/board/${[Number(id) + 1]}`)}>
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
