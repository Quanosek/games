"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import styles from "./page.module.scss";
import Layout from "@/components/pageLayout";
import FormatPoints from "@/functions/formatPoints";

import localFont from "next/font/local";
const dottedFont = localFont({
  src: "../../fonts/familiada_regular.woff2",
  display: "swap",
});

// local object template
interface Question {
  question: string;
  answers: Array<{ value: string; points: number }>;
}

export default function FamiliadaPage() {
  // question object template
  const emptyQuestion: Question = {
    question: "",
    answers: new Array(6).fill({ value: "", points: null }),
  };

  // data state
  const [data, setData] = useState([emptyQuestion]);
  const [loading, setLoading] = useState(true);

  // load data on start
  useEffect(() => {
    const storedData = localStorage.getItem("familiada");
    if (storedData) setData(JSON.parse(storedData));
    setLoading(false);
  }, []);

  // save data on change
  useEffect(() => {
    if (!loading) localStorage.setItem("familiada", JSON.stringify(data));
  }, [data, loading]);

  // check if question is empty
  const emptyQuestionCheck = (question: Question) => {
    return JSON.stringify(question) === JSON.stringify(emptyQuestion);
  };

  // sort answers by points amount
  const sortByPoints = (index: number) => {
    setData((prev) => {
      const newData = [...prev];
      newData[index].answers.sort((a, b) => b.points - a.points);
      return newData;
    });
  };

  return (
    <Layout>
      <div style={{ userSelect: "none" }}>
        <Image
          alt="FAMILIADA"
          src="/images/title.png"
          width={636}
          height={151}
          draggable={false}
          priority
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
          open(
            "/familiada/board/0",
            "familiada_window",
            "width=960, height=540"
          );
        }}
      >
        <p>✨ Pokaż tablicę tytułową</p>
      </button>

      {loading ? (
        <div className="loading">
          <p>Trwa ładowanie...</p>
        </div>
      ) : (
        <div className={styles.form}>
          {[...Array(data.length)].map((_, index) => (
            <div className={styles.container} key={index}>
              {/* question input */}
              <input
                type="text"
                autoComplete="off"
                placeholder={`Pytanie ${index + 1}`}
                value={data[index].question || ""}
                maxLength={128}
                className={styles.question}
                onChange={(e) => {
                  setData((prev) => {
                    const newData = [...prev];
                    newData[index].question = e.target.value;
                    return newData;
                  });
                }}
              />

              <div className={styles.content}>
                {/* input form */}
                <div className={styles.answers}>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div className={styles.list} key={i}>
                      {/* answer value input */}
                      <div className={styles.answer}>
                        <p>Odpowiedź {i + 1}:</p>

                        <input
                          type="text"
                          autoComplete="off"
                          maxLength={17} // 17 characters board limit
                          value={data[index].answers[i].value || ""}
                          onChange={(e) => {
                            setData((prev) => {
                              const newData = [...prev];
                              newData[index].answers[i] = {
                                ...newData[index].answers[i],
                                value: e.target.value,
                              };
                              return newData;
                            });
                          }}
                        />
                      </div>

                      <div className={styles.points}>
                        <p>Liczba punktów:</p>

                        <input
                          type="text"
                          autoComplete="off"
                          value={data[index].answers[i].points || ""}
                          maxLength={2} // 2 characters board limit
                          onChange={(e) => {
                            setData((prev) => {
                              const newData = [...prev];
                              newData[index].answers[i] = {
                                ...newData[index].answers[i],
                                points: Number(e.target.value),
                              };
                              return newData;
                            });
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* preview board of answers */}
                <div className={`${dottedFont.className} ${styles.preview}`}>
                  {data &&
                    data[index].answers.map((el, i: number) => {
                      const answer = el.value.split("");
                      const points = FormatPoints(el.points);

                      // board layout
                      return (
                        <div key={i}>
                          <p>{i + 1}</p>

                          <div className={styles.answer}>
                            {answer.map((value: string, i: number) => {
                              return <p key={i}>{value}</p>;
                            })}
                          </div>

                          <div className={styles.points}>
                            {points.map((value: string, i: number) => {
                              return <p key={i}>{value}</p>;
                            })}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* bottom buttons controls */}
              <div className={styles.buttons}>
                <div>
                  <button
                    className={index === 0 ? "disabled" : ""}
                    onClick={() => {
                      setData((prev) => {
                        const newData = [...prev];
                        const temp = newData[index];
                        newData[index] = newData[index - 1];
                        newData[index - 1] = temp;
                        return newData;
                      });
                    }}
                  >
                    <p>⬆️ W górę</p>
                  </button>

                  <button
                    className={index + 1 === data.length ? "disabled" : ""}
                    onClick={() => {
                      setData((prev) => {
                        const newData = [...prev];
                        const temp = newData[index];
                        newData[index] = newData[index + 1];
                        newData[index + 1] = temp;
                        return newData;
                      });
                    }}
                  >
                    <p>⬇️ W dół</p>
                  </button>

                  <button
                    onClick={() => {
                      if (!emptyQuestionCheck(data[index])) {
                        if (!confirm("Czy na pewno chcesz usunąć pytanie?"))
                          return;
                      }

                      setData((prev) => {
                        const newData = [...prev];
                        newData.splice(index, 1);
                        if (!newData.length) newData.push(emptyQuestion);
                        return newData;
                      });
                    }}
                  >
                    <p>🧹 Usuń</p>
                  </button>
                </div>

                <button
                  onClick={() => {
                    sortByPoints(index);

                    if (
                      data[index].answers.filter((el) => {
                        return el.value && el.points;
                      }).length < 3
                    ) {
                      return alert(
                        "Plansza musi mieć przynajmniej 3 wypełnione odpowiedzi z punktami!"
                      );
                    } else if (
                      data[index].answers.some((el) => {
                        return el.value && !el.points;
                      })
                    ) {
                      return alert(
                        "Niektóre odpowiedzi nie mają przydzielonych punktów!"
                      );
                    }

                    open(
                      `/familiada/board/${index + 1}`,
                      "familiada_window",
                      "width=960, height=540"
                    );
                  }}
                >
                  <p>🖥️ Pokaż</p>
                </button>
              </div>
            </div>
          ))}

          {/* add question button */}
          <button
            style={{ marginTop: "1rem" }}
            onClick={() => {
              if (emptyQuestionCheck(data[data.length - 1])) {
                return alert("Nie możesz dodać kolejnego pustego pytania!");
              }

              setData([...data, emptyQuestion]);

              setTimeout(() => {
                scrollTo({
                  top: document.body.scrollHeight,
                  behavior: "smooth",
                });
              }, 1);
            }}
          >
            <p>➕ Dodaj nową planszę</p>
          </button>
        </div>
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
