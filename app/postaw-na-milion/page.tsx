"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import styles from "./page.module.scss";
import Layout from "@/components/pageLayout";

// local object template
export interface Data {
  category: string;
  question: string;
  answers: Array<{ value: string; checked: boolean }>;
}

export default function PnmPage() {
  const router = useRouter();

  // empty data template
  const newStage: Data[] = new Array(2).fill({
    category: "",
    question: "",
    answers: new Array(4).fill({ value: "", checked: false }),
  });

  // data state
  const [data, setData] = useState([newStage]);
  const [loading, setLoading] = useState(true);

  // load data on start
  useEffect(() => {
    try {
      const storedData = localStorage.getItem("pnm");
      if (storedData) setData(JSON.parse(storedData));

      scrollTo({ top: 0 });
      setLoading(false);
    } catch (err) {
      localStorage.removeItem("pnm");
      router.refresh();
    }
  }, [router]);

  // save data on change
  useEffect(() => {
    if (!loading) localStorage.setItem("pnm", JSON.stringify(data));
  }, [loading, data]);

  // main page render
  return (
    <Layout>
      <div style={{ userSelect: "none" }}>
        <Image
          src="/pnm/images/logo.webp"
          alt="Postaw na milion"
          width={475}
          height={314}
          draggable={false}
          priority
        />
      </div>

      {loading ? (
        // loading indicator
        <div className="loading">
          <p>Trwa ładowanie...</p>
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            open(
              "/postaw-na-milion/board/0",
              "game_window",
              "width=960, height=540"
            );
          }}
        >
          {/* start game button */}
          <button type="submit">
            <p>{"▶️ Rozpocznij grę!"}</p>
          </button>

          <div className={styles.container}>
            {[...Array(data.length)].map((_, i) => (
              <div className={styles.board} key={i}>
                {/* board navbar */}
                <div className={styles.controls}>
                  <p>{`Etap ${i + 1}/${data.length}`}</p>

                  {/* quick settings */}
                  <div className={styles.buttons}>
                    <button
                      type="button"
                      title="Wyczyść/usuń pytanie"
                      onClick={() => {
                        if (
                          JSON.stringify(data[i]) !== JSON.stringify(newStage)
                        ) {
                          if (
                            !confirm("Czy na pewno chcesz wyczyścić planszę?")
                          ) {
                            return;
                          }

                          setData((prev) => {
                            const newData = [...prev];
                            newData[i] = newStage;
                            return newData;
                          });
                        } else {
                          setData((prev) => {
                            const newData = [...prev];
                            if (newData.length > 1) newData.splice(i, 1);
                            return newData;
                          });
                        }
                      }}
                    >
                      <Image
                        src="/icons/trashcan.svg"
                        alt="delete"
                        width={20}
                        height={20}
                        draggable={false}
                        className="icon"
                      />
                    </button>

                    <button
                      type="button"
                      title="Przenieś w dół"
                      className={i + 1 === data.length ? "disabled" : ""}
                      tabIndex={i + 1 === data.length ? -1 : 0}
                      onClick={() => {
                        setData((prev) => {
                          const newData = [...prev];
                          const temp = newData[i];
                          newData[i] = newData[i + 1];
                          newData[i + 1] = temp;
                          return newData;
                        });
                      }}
                    >
                      <Image
                        src="/icons/arrow.svg"
                        alt="arrow"
                        width={20}
                        height={20}
                        draggable={false}
                        className="icon"
                        style={{ rotate: "180deg" }}
                      />
                    </button>

                    <button
                      type="button"
                      title="Przenieś do góry"
                      className={i === 0 ? "disabled" : ""}
                      tabIndex={i === 0 ? -1 : 0}
                      onClick={() => {
                        setData((prev) => {
                          const newData = [...prev];
                          const temp = newData[i];
                          newData[i] = newData[i - 1];
                          newData[i - 1] = temp;
                          return newData;
                        });
                      }}
                    >
                      <Image
                        src="/icons/arrow.svg"
                        alt="arrow"
                        width={20}
                        height={20}
                        draggable={false}
                        className="icon"
                      />
                    </button>
                  </div>
                </div>

                <div className={styles.content}>
                  {data[i].map((stage, j) => (
                    <React.Fragment key={j}>
                      <div className={styles.inputs}>
                        <div>
                          <p>Kategoria:</p>

                          <input
                            name={`${i}-${j}-category`}
                            type="text"
                            autoComplete="off"
                            placeholder="Wpisz kategorię"
                            value={stage.category || ""}
                            maxLength={128}
                            onChange={(e) => {
                              setData((prev) => {
                                const newData = [...prev];
                                newData[i][j] = {
                                  ...newData[i][j],
                                  category: e.target.value,
                                };
                                return newData;
                              });
                            }}
                            required
                          />
                        </div>

                        <div>
                          <p>Pytanie:</p>

                          <input
                            name={`${i}-${j}-question`}
                            type="text"
                            autoComplete="off"
                            placeholder="Wpisz pytanie"
                            value={stage.question || ""}
                            maxLength={128}
                            onChange={(e) => {
                              setData((prev) => {
                                const newData = [...prev];
                                newData[i][j] = {
                                  ...newData[i][j],
                                  question: e.target.value,
                                };
                                return newData;
                              });
                            }}
                            required
                          />
                        </div>

                        <div>
                          <p>Odpowiedzi (jedna poprawna):</p>

                          {stage.answers.map((answer, k) => (
                            <div
                              key={k}
                              className={styles.answers}
                              style={{
                                // disable if prev or curr answer is empty
                                pointerEvents:
                                  k === 0 ||
                                  data[i][j].answers[k - 1].value ||
                                  data[i][j].answers[k].value
                                    ? "unset"
                                    : "none",
                              }}
                            >
                              <input
                                name={`${i}-${j}-${k}-answer`}
                                type="text"
                                autoComplete="off"
                                placeholder={`Odpowiedź ${k + 1}`}
                                value={answer.value || ""}
                                maxLength={64}
                                onChange={(e) => {
                                  setData((prev) => {
                                    const newData = [...prev];
                                    newData[i][j] = {
                                      ...newData[i][j],
                                      answers: newData[i][j].answers.map(
                                        (a, l) => {
                                          // find specific answer and add value
                                          return l === k
                                            ? { ...a, value: e.target.value }
                                            : a;
                                        }
                                      ),
                                    };
                                    return newData;
                                  });
                                }}
                                required={k < 2}
                              />

                              <input
                                name={`${i}-${j}-check`}
                                type="radio"
                                checked={answer.checked}
                                onChange={() => {
                                  setData((prev) => {
                                    const newData = [...prev];
                                    newData[i][j] = {
                                      ...newData[i][j],
                                      answers: newData[i][j].answers.map(
                                        (a, l) => {
                                          // find specific answer and check it
                                          return { ...a, checked: l === k };
                                        }
                                      ),
                                    };
                                    return newData;
                                  });
                                }}
                                required
                                style={{
                                  // disable if answer is empty
                                  pointerEvents: answer.value
                                    ? "unset"
                                    : "none",
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      {j == 0 && <hr />}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            ))}

            {/* add new board button */}
            <button
              type="button"
              className={styles.addButton}
              onClick={() => {
                if (
                  JSON.stringify(data[data.length - 1]) ===
                  JSON.stringify(newStage)
                ) {
                  return alert(
                    "Uzupełnij poprzednią planszę przed dodaniem nowej."
                  );
                }

                setData([...data, newStage]);

                setTimeout(() => {
                  scrollTo({
                    top: document.body.scrollHeight,
                    behavior: "smooth",
                  });
                }, 1);
              }}
            >
              <Image alt="+" src="/icons/plus.svg" width={18} height={18} />
              <p>Kolejny etap</p>
            </button>
          </div>
        </form>
      )}

      <p className={styles.credits}>
        Gra została stworzona na podstawie polskiego teleturnieju{" "}
        <Link
          href="https://pl.wikipedia.org/wiki/Postaw_na_milion"
          target="_blank"
        >{`"Postaw na milion"`}</Link>
        , emitowanego na antenach{" "}
        <Link
          href="https://pl.wikipedia.org/wiki/Telewizja_Polska"
          target="_blank"
        >
          Telewizji Polskiej
        </Link>
        . Wszystkie prawa do emisji oraz znaki towarowe należą do ich prawnych
        właścicieli.
      </p>
    </Layout>
  );
}
