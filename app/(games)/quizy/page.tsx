"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";

import PageLayout from "@/components/wrappers/pageLayout";

import styles from "./page.module.scss";

export interface Data {
  type: "closed" | "gap" | "open";
  question: string;
  answers: Array<{ value: string; checked: boolean }>;
}

export default function QuizyPage() {
  const router = useRouter();

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

  // handle add buttons list show
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const hideButtonsList = () => setShowDropdown(false);

    if (showDropdown) document.addEventListener("click", hideButtonsList);
    return () => document.removeEventListener("click", hideButtonsList);
  }, [showDropdown]);

  // PAGE COMPONENTS

  const BoardType = ({ type }: { type: Data["type"] }) => {
    let data = { src: "", name: "" };

    if (type === "closed") {
      data = { src: "a_button", name: "Pytanie zamknięte" };
    }
    if (type === "gap") {
      data = { src: "magnifying_glass", name: "Uzupełnij lukę" };
    }
    if (type === "open") {
      data = { src: "thought_balloon", name: "Pytanie otwarte" };
    }

    return (
      <div>
        <Image
          className="icon"
          alt=""
          src={`/icons/${data.src}.svg`}
          width={20}
          height={20}
          draggable={false}
        />
        <h2>{data.name}</h2>
      </div>
    );
  };

  const ClosedBoard = (i: number) => (
    <div className={styles.inputs}>
      <div>
        <h3>Pytanie:</h3>

        <input
          type="text"
          name={`${i}-question`}
          placeholder="Wpisz treść pytania"
          autoComplete="off"
          maxLength={128}
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
        <h3>Odpowiedzi (co najmniej jedna poprawna):</h3>

        <div className={styles.answersGrid}>
          {data[i].answers.map((answer, j) => (
            <div key={j} className={styles.answerBox}>
              <div
                className={styles.formValue}
                style={{
                  // disable if prev or current answer is empty
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

  const GapBoard = (i: number) => (
    <>
      <input
        type="text"
        name={`${i}-question`}
        placeholder="Wpisz zdanie z luką"
        autoComplete="off"
        maxLength={128}
        style={{ marginBottom: "0.5rem" }}
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

      <p className={styles.instructions}>
        Umieść ukryte fragmenty w kwadratowych nawiasach. Na przykład:{" "}
        {`"Ala ma [kota] i psa"`}.
      </p>
    </>
  );

  const OpenBoard = (i: number) => (
    <div className={styles.inputs}>
      <div>
        <h3>Pytanie:</h3>

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
        <h3>Odpowiedź:</h3>

        <input
          type="text"
          name={`${i}-answer`}
          placeholder="Wpisz poprawną odpowiedź"
          autoComplete="off"
          maxLength={128}
          className={styles.answer}
          value={data[i].answers[0].value || ""}
          onChange={(e) => {
            setData((prev) => {
              const newData = [...prev];
              data[i].answers[0].value = e.target.value;
              return newData;
            });
          }}
          required
        />
      </div>
    </div>
  );

  // MAIN RETURN

  return (
    <PageLayout>
      <h1 className={styles.gameTitle}>
        Stwórz własny <span>Quiz</span>
      </h1>

      {loading ? (
        <div className="loading">
          <p>Trwa ładowanie...</p>
        </div>
      ) : (
        <form
          style={{ gap: data.length ? "" : "0" }}
          onSubmit={(e) => {
            e.preventDefault();
            open("/quizy/board/0", "game_window", "width=960, height=540");
          }}
        >
          {data.length > 0 && (
            <button type="submit" className={styles.startButton}>
              <p>Uruchom grę</p>
            </button>
          )}

          <div className={styles.container}>
            {[...Array(data.length)].map((_, index) => {
              const { type } = data[index];

              return (
                <div key={index} className={styles.board}>
                  <div className={styles.controls}>
                    <div className={styles.description}>
                      <p>{`${index + 1}/${data.length} •`}</p>
                      <BoardType type={type} />
                    </div>

                    <div className={styles.buttons}>
                      <button
                        type="button"
                        title="Wyczyść/usuń planszę"
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
                                answers: data[index].answers.map(() => ({
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
                          alt="kosz"
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
          </div>

          <div className={styles.addButton}>
            {data.length ? (
              <button type="button" onClick={() => setShowDropdown(true)}>
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
                className={styles.startButton}
                onClick={() => setShowDropdown(true)}
              >
                <p>Rozpocznij</p>
              </button>
            )}

            <div
              style={{ display: showDropdown ? "" : "none" }}
              className={styles.dropdown}
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
        </form>
      )}
    </PageLayout>
  );
}
