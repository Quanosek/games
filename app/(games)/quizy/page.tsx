"use client";

import { useState, useEffect, Fragment } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import TextareaAutosize from "react-textarea-autosize";

import { GameType } from "@/lib/enums";
import PageLayout from "@/components/wrappers/pageLayout";
import SavedGame from "@/components/savedGame";
import styles from "./page.module.scss";

export interface DataTypes {
  type: "closed" | "gap" | "open";
  question: string;
  answers: Array<{ value: string; checked: boolean }>;
}

// allow presentation only on valid form values
export function emptyForm(params: DataTypes) {
  if (params.type === "closed") {
    return (
      params.question &&
      params.answers.some((answer) => answer.checked) &&
      params.answers.every((answer, index) => {
        if (index === 0) return true;
        return answer.value ? params.answers[index - 1].value : true;
      })
    );
  } else if (params.type === "gap") {
    return /\[.*?\]/.test(params.question); // square brackets check
  } else if (params.type === "open") {
    return params.question && params.answers[0].value;
  }
}

export default function QuizyPage() {
  const type = GameType.QUIZY;

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [data, setData] = useState<DataTypes[]>([]);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  // load game data
  useEffect(() => {
    const localData = localStorage.getItem(type);

    if (localData) {
      try {
        const parsed = JSON.parse(localData);
        setData(parsed.data);
      } catch {
        localStorage.removeItem(type);
        window.location.reload();
      }
    }

    setIsLoading(false);
  }, [type]);

  // save data on change
  useEffect(() => {
    if (isLoading) return;

    const localData = JSON.parse(localStorage.getItem(type)!);
    localStorage.setItem(type, JSON.stringify({ ...localData, data }));
  }, [isLoading, data, type]);

  // handle add buttons list show
  useEffect(() => {
    const hideButtonsList = () => setShowDropdown(false);

    if (showDropdown) document.addEventListener("click", hideButtonsList);
    return () => document.removeEventListener("click", hideButtonsList);
  }, [showDropdown]);

  // inside form components
  const ClosedBoard = (i: number) => (
    <div className={styles.inputs}>
      <label>
        <h3>Pytanie:</h3>

        <TextareaAutosize
          name={`${i}-question`}
          value={data[i].question}
          placeholder="Wpisz treść pytania"
          autoComplete="off"
          maxLength={128}
          onChange={(e) => {
            const value = e.target.value
              .replace(/\s\s/g, " ") // double space
              .replace(/^[\s]/, "") // space as first character
              .replace(/\n/g, ""); // enters

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
                  value={answer.value}
                  placeholder="Wpisz odpowiedź"
                  autoComplete="off"
                  maxLength={64}
                  onChange={(e) => {
                    const value = e.target.value
                      .replace(/\s\s/g, " ") // double space
                      .replace(/^[\s]/, ""); // space as first character

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
                  style={{ pointerEvents: answer.value ? "unset" : "none" }}
                >
                  <input
                    type="checkbox"
                    id={`${i}-${j}-checkbox`}
                    checked={answer.checked}
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

                    <svg width="15px" height="15px" viewBox="0 0 18 18">
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
      <TextareaAutosize
        value={data[i].question}
        name={`${i}-question`}
        placeholder="Wpisz zdanie z luką"
        autoComplete="off"
        maxLength={256}
        onChange={(e) => {
          const value = e.target.value
            .replace(/\s\s/g, " ") // double space
            .replace(/^[\s]/, "") // space as first character
            .replace(/\n/g, ""); // enters

          setData((prev) => {
            const newData = [...prev];
            newData[i].question = value;
            return newData;
          });
        }}
      />

      <p className={styles.instruction}>
        {`Umieść ukryte fragmenty w kwadratowych nawiasach, na przykład: "Ala ma [kota] i psa".`}
      </p>
    </>
  );

  const OpenBoard = (i: number) => (
    <div className={styles.inputs}>
      <label>
        <h3>Pytanie:</h3>

        <TextareaAutosize
          name={`${i}-question`}
          value={data[i].question}
          placeholder="Wpisz treść pytania"
          autoComplete="off"
          maxLength={256}
          className={styles.question}
          onChange={(e) => {
            const value = e.target.value
              .replace(/\s\s/g, " ") // double space
              .replace(/^[\s]/, "") // space as first character
              .replace(/\n/g, ""); // enters

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

        <TextareaAutosize
          name={`${i}-answer`}
          value={data[i].answers[0].value}
          placeholder="Wpisz poprawną odpowiedź"
          autoComplete="off"
          maxLength={256}
          className={styles.answer}
          onChange={(e) => {
            const value = e.target.value
              .replace(/\s\s/g, " ") // double space
              .replace(/^[\s]/, "") // space as first character
              .replace(/\n/g, ""); // enters

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

  // game form component
  const MainComponent = (index: number) => {
    const params = data[index];
    if (!params) return null;

    let typeInfo: { src: string; name: string };

    switch (params.type) {
      case "closed":
        typeInfo = { src: "a_button", name: "Pytanie zamknięte" };
        break;
      case "gap":
        typeInfo = { src: "magnifying_glass", name: "Uzupełnij lukę" };
        break;
      case "open":
        typeInfo = { src: "thought_balloon", name: "Pytanie otwarte" };
        break;
    }

    return (
      <div id={`${index}`} className={styles.form}>
        <div className={styles.controls}>
          <div className={styles.description}>
            <p>{`Plansza ${index + 1}/${data.length}`}</p>

            <p>{"•"}</p>

            <Image
              className="icon"
              alt=""
              src={`/icons/${typeInfo.src}.svg`}
              width={18}
              height={18}
              draggable={false}
            />

            <h2>{typeInfo.name}</h2>
          </div>

          <div className={styles.buttons}>
            <button
              onClick={() => {
                if (data[index].question || data[index].answers[0]?.value) {
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
                          block: "center",
                        });
                    }, 1);

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
              disabled={index + 1 === data.length}
              onClick={() => {
                setData((prev) => {
                  const newData = [...prev];

                  [newData[index], newData[index + 1]] = [
                    newData[index + 1],
                    newData[index],
                  ];

                  return newData;
                });
              }}
            >
              <Image
                style={{ rotate: "180deg" }}
                className="icon"
                alt="w dół"
                src="/icons/arrow.svg"
                width={20}
                height={20}
                draggable={false}
              />
            </button>

            <button
              disabled={index === 0}
              onClick={() => {
                setData((prev) => {
                  const newData = [...prev];

                  [newData[index], newData[index - 1]] = [
                    newData[index - 1],
                    newData[index],
                  ];

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

            <p>{"•"}</p>

            <button
              className={styles.presentationButton}
              disabled={!emptyForm(params)}
              onClick={() => {
                return open(
                  `/quizy/board/${index + 1}`,
                  "game_window",
                  "width=960, height=540"
                );
              }}
            >
              <p>Prezentuj</p>
            </button>
          </div>
        </div>

        <div className={styles.content}>
          {params.type === "closed" && ClosedBoard(index)}
          {params.type === "gap" && GapBoard(index)}
          {params.type === "open" && OpenBoard(index)}
        </div>
      </div>
    );
  };

  // main component render
  return (
    <PageLayout>
      <SavedGame type={GameType.QUIZY} data={JSON.stringify(data)} />

      <h1 className={styles.title}>
        Gra w <span>Quizy</span>
      </h1>

      {isLoading && (
        <div className="loading">
          <p>Trwa ładowanie...</p>
        </div>
      )}

      <div
        className={styles.container}
        style={{
          visibility: isLoading ? "hidden" : "visible",
          position: "relative",
          top: isLoading ? 10 : 0,
          opacity: isLoading ? 0 : 1,
          transition: "top 150ms ease-out, opacity 200ms ease-out",
        }}
      >
        {data.length > 0 && (
          <>
            <button
              className={styles.formButton}
              onClick={() => {
                if (!data.some(emptyForm)) {
                  return toast.error("Uzupełnij co najmniej jedną planszę");
                }

                return open(
                  "/quizy/board/0",
                  "game_window",
                  "width=960, height=540"
                );
              }}
            >
              <p>Rozpocznij grę</p>
            </button>

            <div className={styles.formsContainer}>
              {Array.from({ length: data.length }).map((_, index) => (
                <Fragment key={index}>{MainComponent(index)}</Fragment>
              ))}
            </div>
          </>
        )}

        <div className={styles.dropdownHandler}>
          <button
            className={styles.formButton}
            onClick={() => setShowDropdown(true)}
          >
            {data.length > 0 ? (
              <>
                <Image
                  className="icon"
                  alt="+"
                  src="/icons/plus.svg"
                  width={16}
                  height={16}
                  draggable={false}
                />
                <p>Dodaj...</p>
              </>
            ) : (
              <p>Rozpocznij</p>
            )}
          </button>

          <div
            style={{ display: showDropdown ? "" : "none" }}
            className={styles.dropdown}
          >
            <hr />

            <button
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
              onClick={() => {
                setData([
                  ...data,
                  {
                    type: "gap",
                    question: "",
                    answers: [],
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
              <p>uzupełnij lukę</p>
            </button>

            <button
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
      </div>
    </PageLayout>
  );
}
