"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  const router = useRouter();

  // question object template
  const emptyQuestion: Question = {
    question: "",
    answers: new Array(6).fill({ value: "", points: null }),
  };

  // data state
  const [preview, setPreview] = useState<Question[]>([]);
  const [data, setData] = useState([emptyQuestion]);
  const [loading, setLoading] = useState(true);

  // load data on start
  useEffect(() => {
    try {
      const storedData = localStorage.getItem("familiada");
      if (storedData) {
        const parsed = JSON.parse(storedData);
        if (!parsed.length) throw new Error("No data");

        setPreview(Array.from({ length: parsed.length }));
        setData(parsed);
      }

      scrollTo({ top: 0 });
      setLoading(false);
    } catch (err) {
      localStorage.removeItem("familiada");
      router.refresh();
    }
  }, [router]);

  // save data on change
  useEffect(() => {
    if (!loading) localStorage.setItem("familiada", JSON.stringify(data));
  }, [data, loading]);

  // check if question is empty
  const emptyQuestionCheck = (question: Question) => {
    return JSON.stringify(question) === JSON.stringify(emptyQuestion);
  };

  // clear preview
  const clearPreview = (index: number) => {
    setPreview((prev) => {
      const newData = [...prev];
      newData[index] = undefined as any;
      return newData;
    });
  };

  return (
    <Layout>
      <div style={{ userSelect: "none" }}>
        <Image
          alt="FAMILIADA"
          src="/familiada/images/title.png"
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
          open("/familiada/board/0", "game_window", "width=960, height=540");
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
                            const value = e.target.value.replace(
                              /[^a-zA-Z\s.]/g,
                              ""
                            );

                            clearPreview(index);
                            setData((prev) => {
                              const newData = [...prev];
                              newData[index].answers[i] = {
                                ...newData[index].answers[i],
                                value,
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
                            const points = Number(
                              e.target.value.replace(/[^0-9]/g, "")
                            );

                            clearPreview(index);
                            setData((prev) => {
                              const newData = [...prev];
                              newData[index].answers[i] = {
                                ...newData[index].answers[i],
                                points,
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
                  {preview[index]?.answers
                    .filter((el) => el.value && el.points)
                    .map((el, i: number) => {
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
                      clearPreview(index - 1);
                      clearPreview(index);

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
                      clearPreview(index);
                      clearPreview(index + 1);

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

                      clearPreview(index);
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

                <div>
                  <button
                    onClick={() => {
                      const answers = data[index].answers;

                      if (
                        answers.filter((el) => el.value && el.points).length < 3
                      ) {
                        return alert(
                          "Plansza musi mieć przynajmniej 3 wypełnione odpowiedzi z punktami!"
                        );
                      } else if (answers.some((el) => el.value && !el.points)) {
                        return alert(
                          "Niektóre odpowiedzi nie mają przydzielonych punktów!"
                        );
                      } else if (answers.some((el) => !el.value && el.points)) {
                        return alert(
                          "Niektóre odpowiedzi nie mają wypełnionych odpowiedzi!"
                        );
                      }

                      // sort answers by points
                      const sorted = answers.sort((a, b) => {
                        return b.points - a.points;
                      });

                      setPreview((prev) => {
                        const newData = [...prev];
                        newData[index] = data[index];
                        newData[index].answers = sorted;
                        return newData;
                      });

                      setData((prev) => {
                        const newData = [...prev];
                        newData[index] = data[index];
                        newData[index].answers = sorted;
                        return newData;
                      });
                    }}
                  >
                    <p>🔎 Sprawdź</p>
                  </button>

                  <button
                    onClick={() => {
                      if (!preview[index]) {
                        return alert(
                          "Nie sprawdzono danych dla wybranej planszy!"
                        );
                      }

                      open(
                        `/familiada/board/${index + 1}`,
                        "game_window",
                        "width=960, height=540"
                      );
                    }}
                  >
                    <p>🖥️ Prezentuj</p>
                  </button>
                </div>
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
