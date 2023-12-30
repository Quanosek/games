"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import styles from "./page.module.scss";

import Question from "@/components/question";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const local = localStorage.getItem("answers");
    if (local) {
      const parsed = JSON.parse(local);
      setCounter(Object.keys(parsed).length);
    }

    setLoading(false);
  }, []);

  if (loading) return null;

  return (
    <main>
      <div className={styles.header}>
        <Image
          alt="FAMILIADA"
          src="/images/title.png"
          width={893}
          height={255}
          draggable={false}
          priority={true}
        />
      </div>

      <p className={styles.description}>
        Dodaj planszę, uzupełnij pytaniami i punktami. Następnie kliknij{" "}
        {`"Podgląd"`}, aby zobaczyć posortowaną planszę i zapisać ją lokalnie na
        urządzeniu.
        <br />
        Wybierając opcję {`"Pokaż"`} wyświetlisz planszę na zewnętrznym oknie,
        które można ustawić na pełen ekran np. na rzutniku dla wszystkich.
      </p>

      {[...Array(counter)].map((_, i) => (
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
