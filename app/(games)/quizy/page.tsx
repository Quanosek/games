"use client";

import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";

import PageLayout from "@/components/wrappers/pageLayout";
import SavedGame from "@/components/savedGame";
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

  // load game data
  useEffect(() => {
    try {
      const storedData = localStorage.getItem("quizy");
      if (storedData) setData(JSON.parse(storedData).data);
      setLoading(false);
    } catch (error) {
      localStorage.removeItem("quizy");
      window.location.reload();
    }
  }, [router]);

  // save data on change
  useEffect(() => {
    if (loading) return;

    const localData = JSON.parse(localStorage.getItem("quizy") || "{}");
    const { data: _, ...params } = localData;

    localStorage.setItem("quizy", JSON.stringify({ data, ...params }));
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

    switch (type) {
      case "closed":
        data = { src: "a_button", name: "Pytanie zamknięte" };
        break;
      case "gap":
        data = { src: "magnifying_glass", name: "Uzupełnij lukę" };
        break;
      case "open":
        data = { src: "thought_balloon", name: "Pytanie otwarte" };
        break;
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
      <label>
        <h3>Pytanie:</h3>

        <input
          name={`${i}-question`}
          placeholder="Wpisz treść pytania"
          autoComplete="off"
          maxLength={128}
          value={data[i].question || ""}
          required
          onChange={(e) => {
            // validate input
            const value = e.target.value
              .replace(/\s\s/g, " ") // double space
              .replace(/^[\s]/, ""); // space as first character

            // update data
            setData((prev) => {
              const newData = [...prev];
              newData[i].question = value;
              return newData;
            });
          }}
        />
      </label>

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
                  placeholder="Wpisz odpowiedź"
                  autoComplete="off"
                  maxLength={64}
                  value={answer.value || ""}
                  required={j < 2}
                  onChange={(e) => {
                    // validate input
                    const value = e.target.value
                      .replace(/\s\s/g, " ") // double space
                      .replace(/^[\s]/, ""); // space as first character

                    // update data
                    setData((prev) => {
                      const newData = [...prev];
                      newData[i].answers[j] = {
                        ...newData[i].answers[j],
                        value,
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
                    type="checkbox"
                    id={`${i}-${j}-checkbox`}
                    checked={answer.checked || false}
                    onChange={(e) => {
                      const checked = e.target.checked;

                      setData((prev) => {
                        const newData = [...prev];
                        newData[i].answers[j] = {
                          ...newData[i].answers[j],
                          checked,
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
        style={{ marginBottom: "0.5rem" }}
        name={`${i}-question`}
        placeholder="Wpisz zdanie z luką"
        autoComplete="off"
        maxLength={128}
        value={data[i].question || ""}
        required
        onChange={(e) => {
          // validate input
          const value = e.target.value
            .replace(/\s\s/g, " ") // double space
            .replace(/^[\s]/, ""); // space as first character

          // update data
          setData((prev) => {
            const newData = [...prev];
            newData[i].question = value;
            return newData;
          });
        }}
      />

      <p className={styles.instruction}>
        Umieść ukryte fragmenty w kwadratowych nawiasach. Na przykład:{" "}
        {`"Ala ma [kota] i psa"`}.
      </p>
    </>
  );

  const OpenBoard = (i: number) => (
    <div className={styles.inputs}>
      <label>
        <h3>Pytanie:</h3>

        <input
          name={`${i}-question`}
          placeholder="Wpisz treść pytania"
          autoComplete="off"
          maxLength={128}
          className={styles.question}
          value={data[i].question || ""}
          required
          onChange={(e) => {
            // validate input
            const value = e.target.value
              .replace(/\s\s/g, " ") // double space
              .replace(/^[\s]/, ""); // space as first character

            // update data
            setData((prev) => {
              const newData = [...prev];
              newData[i].question = value;
              return newData;
            });
          }}
        />
      </label>

      <label>
        <h3>Odpowiedź:</h3>

        <input
          name={`${i}-answer`}
          placeholder="Wpisz poprawną odpowiedź"
          autoComplete="off"
          maxLength={128}
          className={styles.answer}
          value={data[i].answers[0].value || ""}
          required
          onChange={(e) => {
            // validate input
            const value = e.target.value
              .replace(/\s\s/g, " ") // double space
              .replace(/^[\s]/, ""); // space as first character

            // update data
            setData((prev) => {
              const newData = [...prev];
              data[i].answers[0].value = value;
              return newData;
            });
          }}
        />
      </label>
    </div>
  );

  // MAIN RETURN

  return (
    <PageLayout>
      <SavedGame type={usePathname().slice(1)} data={JSON.stringify(data)} />

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
                <div key={index} id={index.toString()} className={styles.board}>
                  <div className={styles.controls}>
                    <div className={styles.description}>
                      <p>{`${index + 1}/${data.length} •`}</p>
                      <BoardType type={type} />
                    </div>

                    <div className={styles.buttons}>
                      {/* delete button */}
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

                              setTimeout(() => {
                                document
                                  .getElementById(index.toString())
                                  ?.scrollIntoView({
                                    behavior: "smooth",
                                    block: "start",
                                  });
                              }, 1);

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

                      {/* move down button */}
                      <button
                        type="button"
                        title="Przenieś w dół"
                        disabled={index + 1 === data.length}
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

                      {/* move up button */}
                      <button
                        type="button"
                        title="Przenieś do góry"
                        disabled={index === 0}
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

                  setTimeout(() => {
                    document
                      .getElementById(data.length.toString())
                      ?.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                      });
                  }, 1);
                }}
              >
                <p>pytanie zamknięte</p>
              </button>

              <button
                type="button"
                onClick={() => {
                  setData([
                    ...data,
                    { type: "gap", question: "", answers: [] },
                  ]);

                  setTimeout(() => {
                    document
                      .getElementById(data.length.toString())
                      ?.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                      });
                  }, 1);
                }}
              >
                <p>uzupełnij lukę</p>
              </button>

              <button
                type="button"
                onClick={() => {
                  setData([
                    ...data,
                    {
                      type: "open",
                      question: "",
                      answers: [{ value: "", checked: false }],
                    },
                  ]);

                  setTimeout(() => {
                    document
                      .getElementById(data.length.toString())
                      ?.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                      });
                  }, 1);
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
