"use client";

import Image from "next/image";
import { useState } from "react";

import styles from "./page.module.scss";

import Question from "@/components/question";

export default function Home() {
  const [counter, setCounter] = useState(0);

  return (
    <main>
      <div className={styles.header}>
        <Image
          alt="FAMILIADA"
          src="/title.png"
          width={893}
          height={255}
          draggable={false}
        />
      </div>

      {[...Array(counter + 1)].map((_, i) => (
        <div className={styles.board} key={i}>
          <input
            className={styles.title}
            type="text"
            defaultValue={`Plansza ${i + 1}`}
          />
          <hr />
          <Question id={i} />
        </div>
      ))}

      <button
        className={styles.addButton}
        onClick={() => setCounter(counter + 1)}
      >
        <p>➕ Dodaj planszę</p>
      </button>
    </main>
  );
}
