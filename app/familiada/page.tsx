"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import styles from "./page.module.scss";

import Question from "@/components/question";
import Layout from "@/components/pageLayout";

export default function FamiliadaPage() {
  const [loading, setLoading] = useState(true);
  const [counter, setCounter] = useState(1);

  useEffect(() => {
    const local = localStorage.getItem("questions") || "{}";
    const questions = JSON.parse(local);

    // rewrite keys to be in order
    const newOrder = {} as any;
    Object.keys(questions).forEach((key, i) => (newOrder[i] = questions[key]));
    localStorage.setItem("questions", JSON.stringify(newOrder));

    setCounter(Object.keys(newOrder).length || 1);
    setLoading(false);
  }, []);

  return (
    <Layout>
      <div style={{ userSelect: "none" }}>
        <Image
          alt="FAMILIADA"
          src="/images/title.png"
          width={595}
          height={170}
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
          które najlepiej jest ustawić w trybie pełnoekranowym na drugim ekranie
          poprzez użycie klawisza <span>[f11]</span>.
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
            "/familiada/board/title",
            "familiada_tablica",
            "width=960, height=540"
          );
        }}
      >
        <p>✨ Pokaż tablicę tytułową</p>
      </button>

      {(loading && <p>Ładowanie...</p>) || (
        <>
          {[...Array(counter)].map((_, i) => (
            <div className={styles.question} key={i}>
              <Question id={i} />
            </div>
          ))}

          <button onClick={() => setCounter(counter + 1)}>
            <p>➕ Dodaj nową planszę</p>
          </button>
        </>
      )}

      <div className={styles.credits}>
        <p>
          Na podstawie i z wykorzystaniem zasad programu telewizyjnego{" "}
          <Link href="https://pl.wikipedia.org/wiki/Familiada" target="_blank">
            {`"Familiada"`}
          </Link>{" "}
          emitowana na kanale{" "}
          <Link href="https://pl.wikipedia.org/wiki/TVP2" target="_blank">
            TVP2
          </Link>
          . Wszystkie grafiki i znaki towarowe należą do ich prawnych
          właścicieli.
        </p>
      </div>
    </Layout>
  );
}
