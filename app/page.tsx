"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import styles from "./page.module.scss";

import Footer from "@/components/footer";
import Question from "@/components/question";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [counter, setCounter] = useState(1);

  useEffect(() => {
    let answers = localStorage.getItem("answers");
    if (!answers) answers = "{}";

    const parsed = JSON.parse(answers);
    setCounter(Object.keys(parsed).length || 1);

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
            odpowiedzi. Wciśnięcie ich z użyciem klawisza <span>[Ctrl]</span>{" "}
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
          <p>✨ Pokaż tablicę tytułową</p>
        </button>

        {[...Array(counter)].map((_, i) => (
          <div className={styles.question} key={i}>
            <Question id={i} />
          </div>
        ))}

        <button onClick={() => setCounter(counter + 1)}>
          <p>➕ Dodaj nową planszę</p>
        </button>
      </main>

      <Footer />
    </>
  );
}
