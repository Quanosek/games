"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import styles from "./page.module.scss";

import Footer from "@/components/footer";
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
    <>
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

        <div className={styles.description}>
          <p>
            Dodaj plansze, uzupełnij je pytaniami i punktami, następnie kliknij
            przycisk {`"Podgląd"`}, aby zobaczyć posortowaną planszę obok i
            zapisać ją na swoim urządzeniu.
            <br />
            Aby wyświetlić tablicę wyników należy wybrać przycisk {`"Pokaż"`},
            który otworzy ją w zewnętrznym oknie,
            <br />
            które najlepiej jest ustawić w trybie pełnoekranowym na drugim
            ekranie poprzez użycie klawisza <span>[f11]</span>.
          </p>

          <p>
            Klawisze numeryczne <span>[1-6]</span> odpowiadają za odkrywanie
            odpowiedzi. Wciśnięcie ich z użyciem klawisza <span>[Shift]</span>{" "}
            odkrywa odpowiedź bez przydzielania punktów.
            <br />
            Klawisze <span>[Q, W, R, T]</span> odpowiadają za przydzielanie{" "}
            {`"X"`} za błędne odpowiedzi, gdzie <span>[Q]</span> i{" "}
            <span>[T]</span> to {`"duży X"`}, a <span>[W]</span> i{" "}
            <span>[R]</span> to {`"małe x"`}.
            <br />
            Klawisz <span>[E]</span> usuwa wszystkie błędy widoczne na tablicy.
          </p>
        </div>

        <button
          onClick={() => {
            window.open(
              "/board/title",
              "familiada_tablica",
              "width=960, height=540"
            );
          }}
        >
          ✨ Pokaż tablicę tytułową
        </button>

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
          <p>➕ Dodaj nową planszę</p>
        </button>
      </main>

      <Footer />
    </>
  );
}
