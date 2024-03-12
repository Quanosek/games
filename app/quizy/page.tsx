"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import styles from "./page.module.scss";
import Layout from "@/components/pageLayout";

// local object template
export interface Data {
  type: "closed" | "gap" | "open";
  question: string;
  answers: Array<{ value: string; checked: boolean }>;
}

export default function QuizyPage() {
  const router = useRouter();

  // data state
  const [data, setData] = useState<Data[]>([]);
  const [loading, setLoading] = useState(true);

  // load data on start
  useEffect(() => {
    try {
      const storedData = localStorage.getItem("quizy");
      if (storedData) setData(JSON.parse(storedData));

      scrollTo({ top: 0 });
      setLoading(false);
    } catch (err) {
      localStorage.removeItem("quizy");
      router.refresh();
    }
  }, [router]);

  // save data on change
  useEffect(() => {
    if (!loading) localStorage.setItem("quizy", JSON.stringify(data));
  }, [loading, data]);

  // board type to user-friendly string
  const boardType = (type: Data["type"]) => {
    switch (type) {
      case "closed":
        return "🅰️ Pytanie zamknięte";
      case "gap":
        return "🔍 Uzupełnij lukę";
      case "open":
        return "💬 Pytanie otwarte";
    }
  };

  // handle add buttons list show
  const [showButtonsList, setShowButtonsList] = useState(false);

  useEffect(() => {
    const hideButtonsList = () => setShowButtonsList(false);

    if (showButtonsList) document.addEventListener("click", hideButtonsList);
    return () => document.removeEventListener("click", hideButtonsList);
  }, [showButtonsList]);

  // "Pytanie zamknięte" board
  const ClosedBoard = (index: number) => (
    <>
      {/* question input */}
      <div className={styles.value}>
        <p>Pyt:</p>

        <input
          type="text"
          autoComplete="off"
          placeholder="Treść pytania"
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
          required
        />
      </div>

      {/* answers grid */}
      <div className={styles.grid}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div className={styles.answers} key={i}>
            {/* answer value input */}
            <div
              className={styles.value}
              style={{
                // disable if prev or curr answer is empty
                pointerEvents:
                  i === 0 ||
                  data[index].answers[i - 1].value ||
                  data[index].answers[i].value
                    ? "unset"
                    : "none",
              }}
            >
              <p>{`${["A", "B", "C", "D"][i]}:`}</p>
              <input
                type="text"
                autoComplete="off"
                placeholder="Odpowiedź"
                value={data[index].answers[i].value || ""}
                maxLength={64}
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
                onBlur={(e) => {
                  // unchecked if answer is empty
                  if (!e.target.value) {
                    setData((prev) => {
                      const newData = [...prev];
                      newData[index].answers[i] = {
                        ...newData[index].answers[i],
                        checked: false,
                      };
                      return newData;
                    });
                  }
                }}
                required={i < 2}
              />
            </div>

            {/* correct answer checkbox */}
            <div className={styles.checkboxHandler}>
              <div
                className={styles.checkbox}
                style={{
                  // disable if answer is empty
                  pointerEvents: data[index].answers[i].value
                    ? "unset"
                    : "none",
                }}
              >
                <input
                  id={`${index}-${i}-checkbox`}
                  type="checkbox"
                  checked={data[index].answers[i].checked || false}
                  onChange={(e) => {
                    setData((prev) => {
                      const newData = [...prev];
                      newData[index].answers[i] = {
                        ...newData[index].answers[i],
                        checked: e.target.checked,
                      };
                      return newData;
                    });
                  }}
                />

                <label
                  htmlFor={`${index}-${i}-checkbox`}
                  className={styles.check}
                >
                  <p>poprawna odpowiedź</p>
                  <svg width="18px" height="18px" viewBox="0 0 18 18">
                    <path d="M1,9 L1,3.5 C1,2 2,1 3.5,1 L14.5,1 C16,1 17,2 17,3.5 L17,14.5 C17,16 16,17 14.5,17 L3.5,17 C2,17 1,16 1,14.5 L1,9 Z"></path>
                    <polyline points="1 9 7 14 15 4"></polyline>
                  </svg>
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  // "Uzupełnij lukę" board
  const GapBoard = (index: number) => (
    <>
      <input
        type="text"
        autoComplete="off"
        placeholder="Zdanie do uzupełnienia"
        style={{ marginBottom: "0.5rem" }}
        value={data[index].question || ""}
        maxLength={128}
        onChange={(e) => {
          setData((prev) => {
            const newData = [...prev];
            newData[index].question = e.target.value;
            return newData;
          });
        }}
        required
      />

      <p className={styles.howTo}>
        Umieść ukryte fragmenty w kwadratowych nawiasach. Na przykład:{" "}
        {`"Ala ma [kota]"`}.
      </p>
    </>
  );

  // "Pytanie otwarte" board
  const OpenBoard = (index: number) => (
    <div className={styles.inputs}>
      <div>
        <p>Pytanie:</p>

        <input
          type="text"
          autoComplete="off"
          placeholder="Wpisz treść pytania"
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
          required
        />
      </div>

      <div>
        <p>Odpowiedź:</p>

        <input
          type="text"
          autoComplete="off"
          placeholder="Wpisz poprawną odpowiedź"
          value={data[index].answers[0].value || ""}
          maxLength={128}
          className={styles.answer}
          onChange={(e) => {
            setData((prev) => {
              const newData = [...prev];
              data[index].answers[0].value = e.target.value;
              return newData;
            });
          }}
          required
        />
      </div>
    </div>
  );

  // main page render
  return (
    <Layout>
      <h1 className={styles.title}>
        Stwórz własny <span>Quiz</span>
      </h1>

      {loading ? (
        // loading indicator
        <div className="loading">
          <p>Trwa ładowanie...</p>
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            open("/quizy/board/0", "game_window", "width=960, height=540");
          }}
        >
          {/* start game button */}
          {data.length > 0 && (
            <button type="submit">
              <p>{"▶️ Rozpocznij grę!"}</p>
            </button>
          )}

          <div className={styles.container}>
            {/* board handle */}
            {[...Array(data.length)].map((_, index) => {
              const type = data[index].type;

              return (
                <div className={styles.board} key={index}>
                  <div className={styles.controls}>
                    <p>{`${index + 1}/${data.length} • ${boardType(type)}`}</p>

                    <div className={styles.buttons}>
                      <button
                        type="button"
                        title="Wyczyść/usuń pytanie"
                        onClick={() => {
                          if (
                            data[index].question ||
                            data[index].answers[0]?.value
                          ) {
                            if (
                              !confirm("Czy na pewno chcesz wyczyścić planszę?")
                            ) {
                              return;
                            }

                            setData((prev) => {
                              const newData = [...prev];
                              newData[index] = {
                                type: data[index].type,
                                question: "",
                                answers: data[index].answers.map((_) => ({
                                  value: "",
                                  checked: false,
                                })),
                              };
                              return newData;
                            });
                          } else {
                            setData((prev) => {
                              const newData = [...prev];
                              newData.splice(index, 1);
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
                        className={index + 1 === data.length ? "disabled" : ""}
                        tabIndex={index + 1 === data.length ? -1 : 0}
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
                        className={index === 0 ? "disabled" : ""}
                        tabIndex={index === 0 ? -1 : 0}
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
                    {type === "closed" && ClosedBoard(index)}
                    {type === "gap" && GapBoard(index)}
                    {type === "open" && OpenBoard(index)}
                  </div>
                </div>
              );
            })}

            {/* add new board button */}
            <div className={styles.addQuestionButton}>
              <button
                type="button"
                className={styles.default}
                onClick={() => setShowButtonsList(true)}
              >
                <p>{data.length ? "➕ Dodaj..." : "✨ Rozpocznij!"}</p>
              </button>

              <div
                style={{ display: showButtonsList ? "block" : "none" }}
                className={styles.list}
              >
                <button
                  type="button"
                  onClick={() => {
                    setTimeout(() => {
                      scrollTo({
                        top: document.body.scrollHeight,
                        behavior: "smooth",
                      });
                    }, 1);

                    setData([
                      ...data,
                      {
                        type: "closed",
                        question: "",
                        answers: new Array(4).fill({
                          value: "",
                          checked: false,
                        }),
                      },
                    ]);
                  }}
                >
                  <p>pytanie zamknięte</p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setTimeout(() => {
                      scrollTo({
                        top: document.body.scrollHeight,
                        behavior: "smooth",
                      });
                    }, 1);

                    setData([
                      ...data,
                      { type: "gap", question: "", answers: [] },
                    ]);
                  }}
                >
                  <p>uzupełnij lukę</p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setTimeout(() => {
                      scrollTo({
                        top: document.body.scrollHeight,
                        behavior: "smooth",
                      });
                    }, 1);

                    setData([
                      ...data,
                      {
                        type: "open",
                        question: "",
                        answers: [{ value: "", checked: false }],
                      },
                    ]);
                  }}
                >
                  <p> pytanie otwarte</p>
                </button>
              </div>
            </div>
          </div>
        </form>
      )}
    </Layout>
  );
}
