"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import styles from "./page.module.scss";

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
    } catch (error) {
      localStorage.removeItem("quizy");
      router.refresh();
    }
  }, [router]);

  // save data on change
  useEffect(() => {
    if (!loading) localStorage.setItem("quizy", JSON.stringify(data));
  }, [loading, data]);

  // board type description
  const boardType = (type: Data["type"]) => {
    if (type === "closed") {
      return (
        <>
          <Image
            className="icon"
            alt=""
            src="/icons/a_button.svg"
            width={20}
            height={20}
            draggable={false}
          />
          <p>Pytanie zamknięte</p>
        </>
      );
    } else if (type === "gap") {
      return (
        <>
          <Image
            className="icon"
            alt=""
            src="/icons/magnifying_glass.svg"
            width={20}
            height={20}
            draggable={false}
          />
          <p>Uzupełnij lukę</p>
        </>
      );
    } else if (type === "open") {
      return (
        <>
          <Image
            className="icon"
            alt=""
            src="/icons/thought_balloon.svg"
            width={20}
            height={20}
            draggable={false}
          />
          <p>Pytanie otwarte</p>
        </>
      );
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
  const ClosedBoard = (i: number) => (
    <div className={styles.inputs}>
      <div>
        <p className={styles.name}>Pytanie:</p>

        <input
          type="text"
          name={`${i}-question`}
          placeholder="Wpisz treść pytania"
          autoComplete="off"
          maxLength={128}
          className={styles.question}
          value={data[i].question || ""}
          onChange={(e) => {
            setData((prev) => {
              const newData = [...prev];
              newData[i].question = e.target.value;
              return newData;
            });
          }}
          required
        />
      </div>

      <div>
        <p className={styles.name}>Odpowiedzi (co najmniej jedna poprawna):</p>

        <div className={styles.grid}>
          {data[i].answers.map((answer, j) => (
            <div key={j} className={styles.answers}>
              {/* answer value input */}
              <div
                className={styles.value}
                style={{
                  // disable if prev or curr answer is empty
                  pointerEvents:
                    j === 0 ||
                    data[i].answers[j - 1].value ||
                    data[i].answers[j].value
                      ? "unset"
                      : "none",
                }}
              >
                <p>{`${["A", "B", "C", "D"][j]}:`}</p>

                <input
                  name={`${i}-${j}-answer`}
                  type="text"
                  autoComplete="off"
                  placeholder="Wpisz odpowiedź"
                  value={answer.value || ""}
                  maxLength={64}
                  onChange={(e) => {
                    setData((prev) => {
                      const newData = [...prev];
                      newData[i].answers[j] = {
                        ...newData[i].answers[j],
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
                        newData[i].answers[j] = {
                          ...newData[i].answers[j],
                          checked: false,
                        };
                        return newData;
                      });
                    }
                  }}
                  required={j < 2}
                />
              </div>

              {/* correct answer checkbox */}
              <div className={styles.checkboxHandler}>
                <div
                  className={styles.checkbox}
                  style={{
                    // disable if answer is empty
                    pointerEvents: answer.value ? "unset" : "none",
                  }}
                >
                  <input
                    id={`${i}-${j}-checkbox`}
                    type="checkbox"
                    checked={answer.checked || false}
                    onChange={(e) => {
                      setData((prev) => {
                        const newData = [...prev];
                        newData[i].answers[j] = {
                          ...newData[i].answers[j],
                          checked: e.target.checked,
                        };
                        return newData;
                      });
                    }}
                  />

                  <label
                    htmlFor={`${i}-${j}-checkbox`}
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
      </div>
    </div>
  );

  // "Uzupełnij lukę" board
  const GapBoard = (index: number) => (
    <>
      <input
        type="text"
        name={`${index}-question`}
        placeholder="Dodaj zdanie do uzupełnienia"
        autoComplete="off"
        maxLength={128}
        style={{ marginBottom: "0.5rem" }}
        value={data[index].question || ""}
        onChange={(e) => {
          setData((prev) => {
            const newData = [...prev];
            newData[index].question = e.target.value;
            return newData;
          });
        }}
        required
      />

      <p className={styles.instruction}>
        Umieść ukryte fragmenty w kwadratowych nawiasach. Na przykład:{" "}
        {`"Ala ma [kota] i psa"`}.
      </p>
    </>
  );

  // "Pytanie otwarte" board
  const OpenBoard = (index: number) => (
    <div className={styles.inputs}>
      <div>
        <p className={styles.name}>Pytanie:</p>

        <input
          type="text"
          name={`${index}-question`}
          placeholder="Wpisz treść pytania"
          autoComplete="off"
          maxLength={128}
          className={styles.question}
          value={data[index].question || ""}
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
          name={`${index}-answer`}
          placeholder="Wpisz poprawną odpowiedź"
          autoComplete="off"
          maxLength={128}
          className={styles.answer}
          value={data[index].answers[0].value || ""}
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
    <main>
      <h1 className={styles.pageTitle}>
        Stwórz własny <span>Quiz</span>
      </h1>

      {loading ? (
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
            <button type="submit" className={styles.defaultButton}>
              <p>Uruchom grę</p>
            </button>
          )}

          <div className={styles.container}>
            {/* board handle */}
            {[...Array(data.length)].map((_, index) => {
              const type = data[index].type;

              return (
                <div key={index} className={styles.board}>
                  <div className={styles.controls}>
                    <div className={styles.description}>
                      <p>{`${index + 1}/${data.length} •`}</p>
                      <div>{boardType(type)}</div>
                    </div>

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
                          className="icon"
                          alt="usuń"
                          src="/icons/trashcan.svg"
                          width={20}
                          height={20}
                          draggable={false}
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
                          style={{ rotate: "180deg" }}
                          className="icon"
                          alt="w lewo"
                          src="/icons/arrow.svg"
                          width={20}
                          height={20}
                          draggable={false}
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
                          className="icon"
                          alt="w górę"
                          src="/icons/arrow.svg"
                          width={20}
                          height={20}
                          draggable={false}
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
            <div className={styles.addButton}>
              {data.length ? (
                <button type="button" onClick={() => setShowButtonsList(true)}>
                  <Image
                    className="icon"
                    alt="+"
                    src="/icons/plus.svg"
                    width={18}
                    height={18}
                    draggable={false}
                  />
                  <p>Dodaj...</p>
                </button>
              ) : (
                <button
                  type="button"
                  className={styles.defaultButton}
                  onClick={() => setShowButtonsList(true)}
                >
                  <p>Rozpocznij</p>
                </button>
              )}

              <div
                className={styles.list}
                style={{ display: showButtonsList ? "block" : "none" }}
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
                  <p>pytanie otwarte</p>
                </button>
              </div>
            </div>
          </div>
        </form>
      )}
    </main>
  );
}
