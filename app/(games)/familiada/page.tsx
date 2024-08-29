"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import PageLayout from "@/components/wrappers/pageLayout";

import styles from "./styles.module.scss";

export interface Data {
  checked: boolean;
  question: string;
  answers: Array<{ value: string; points: number }>;
  multiply: number | undefined;
}

export default function FamiliadaPage() {
  const router = useRouter();

  const emptyData: Data = {
    checked: false,
    question: "",
    answers: new Array(6).fill({ value: "", points: 0 }),
    multiply: undefined,
  };

  const [data, setData] = useState<Data[]>([emptyData]);
  const [loading, setLoading] = useState(true);

  // load game data
  useEffect(() => {
    try {
      const storedData = localStorage.getItem("familiada");
      if (storedData) setData(JSON.parse(storedData));
      setLoading(false);
    } catch (error) {
      localStorage.removeItem("familiada");
      router.refresh();
    }
  }, [router]);

  // save data on change
  useEffect(() => {
    if (loading) return;
    localStorage.setItem("familiada", JSON.stringify(data));
  }, [loading, data]);

  // check if board is empty
  const emptyBoardCheck = (data: Data) => {
    const { multiply, ...rest } = data;
    return JSON.stringify(rest) === JSON.stringify(emptyData);
  };

  // ROUND COMPONENT

  const RoundBoard = (index: number) => (
    <form
      id={index.toString()}
      key={index}
      className={styles.board}
      onSubmit={(e) => {
        e.preventDefault();

        const answers = data[index].answers;

        // form validation
        if (answers.filter((el) => el.value && el.points).length < 3) {
          return toast.error(
            "Plansza musi zawierać co najmniej 3 uzupełnione odpowiedzi z punktami"
          );
        } else if (answers.some((el) => el.value && !el.points)) {
          return toast.error(
            "Niektóre odpowiedzi nie mają przydzielonych punktów"
          );
        } else if (answers.some((el) => !el.value && el.points)) {
          return toast.error(
            "Niektóre odpowiedzi nie mają wypełnionych odpowiedzi"
          );
        } else {
          toast.success("Plansza jest gotowa do prezentacji");
        }

        // sort answers by points
        const sorted = answers.sort((a, b) => {
          return b.points - a.points;
        });

        // count filled answers
        const filled = answers.filter((el) => {
          return el.value && el.points;
        }).length;

        // update saved data
        setData((prev) => {
          const newData = [...prev];
          newData[index] = data[index];
          newData[index].checked = true;
          newData[index].answers = sorted;

          if (filled === 6) {
            newData[index].multiply = 1;
          } else if (filled > 3) {
            newData[index].multiply = 2;
          } else {
            newData[index].multiply = 3;
          }

          return newData;
        });
      }}
    >
      <div className={styles.content}>
        <label className={styles.question}>
          <p>{index + 1}.</p>

          <input
            name={`${index}-question`}
            placeholder={`Pytanie ${index + 1}`}
            autoComplete="off"
            maxLength={100}
            value={data[index].question || ""}
            onChange={(e) => {
              setData((prev) => {
                const newData = [...prev];
                newData[index].question = e.target.value;
                return newData;
              });
            }}
          />
        </label>

        <div className={styles.answersList}>
          {data[index].answers.map((answer, i) => (
            <div key={i} className={styles.answer}>
              <label className={styles.value}>
                <p>Odpowiedź {i + 1}:</p>

                <input
                  name={`${index}-${i}-answer`}
                  autoComplete="off"
                  maxLength={17} // board limit
                  value={answer.value || ""}
                  onChange={(e) => {
                    // validate input
                    const value = e.target.value
                      .toUpperCase()
                      .replace(/[^A-ZĄĆĘŁŃÓŚŹŻ\s.-]/g, "");

                    // update data
                    setData((prev) => {
                      const newData = [...prev];
                      newData[index].checked = false;
                      newData[index].answers[i] = {
                        ...newData[index].answers[i],
                        value,
                      };
                      return newData;
                    });
                  }}
                />
              </label>

              <label className={styles.points}>
                <p>punkty:</p>
                <input
                  name={`${index}-${i}-points`}
                  autoComplete="off"
                  maxLength={2} // board limit
                  value={answer.points || ""}
                  onChange={(e) => {
                    // validate input
                    const points = Number(
                      e.target.value.replace(/[^0-9]/g, "")
                    );

                    // update data
                    setData((prev) => {
                      const newData = [...prev];
                      newData[index].checked = false;
                      newData[index].answers[i] = {
                        ...newData[index].answers[i],
                        points,
                      };
                      return newData;
                    });
                  }}
                />
              </label>
            </div>
          ))}

          <div className={styles.pointsAmount}>
            <p>
              Suma:{" "}
              {data[index].answers.reduce((acc, curr) => {
                return acc + (curr.points || 0);
              }, 0)}
              /100
            </p>

            <select
              style={{ display: data[index].checked ? "" : "none" }}
              className={styles.multiply}
              name={`${index}-multiply`}
              title="Mnożnik punktów (zależny od ilości odpowiedzi)"
              value={data[index].multiply}
              onChange={(e) => {
                setData((prev) => {
                  const newData = [...prev];
                  newData[index].multiply = parseInt(e.target.value);
                  return newData;
                });
              }}
            >
              <option value={1}>× 1</option>
              <option value={2}>× 2</option>
              <option value={3}>× 3</option>
              <option value={4}>× 4</option>
            </select>
          </div>
        </div>

        <div className={styles.bottomButtons}>
          <div className={styles.controls}>
            {/* delete button */}
            <button
              type="button"
              disabled={data.length === 1 && emptyBoardCheck(data[index])}
              title={
                data.length === 1 && emptyBoardCheck(data[index])
                  ? "Nie można usunąć ostatniej planszy"
                  : ""
              }
              onClick={() => {
                if (!emptyBoardCheck(data[index])) {
                  if (!confirm("Czy na pewno chcesz wyczyścić pytanie?")) {
                    return;
                  }

                  setData((prev) => {
                    const newData = [...prev];
                    newData[index] = emptyData;

                    return newData;
                  });
                } else {
                  setData((prev) => {
                    const newData = [...prev];
                    newData[index].checked = false;
                    if (newData.length > 1) newData.splice(index, 1);

                    setTimeout(() => {
                      document
                        .getElementById((data.length - 2).toString())
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
                alt="kosz"
                src="/icons/trashcan.svg"
                width={22}
                height={22}
                draggable={false}
              />
            </button>

            {/* move down button */}
            <button
              type="button"
              disabled={index + 1 === data.length}
              onClick={() => {
                data[index].multiply === undefined;
                data[index + 1].multiply === undefined;

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
                alt="w dół"
                src="/icons/arrow.svg"
                width={22}
                height={22}
                draggable={false}
              />
            </button>

            {/* move up button */}
            <button
              type="button"
              disabled={index === 0}
              onClick={() => {
                data[index - 1].multiply === undefined;
                data[index].multiply === undefined;

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
                width={22}
                height={22}
                draggable={false}
              />
            </button>
          </div>

          <div>
            <button type="submit">
              <p>{"🔎 Sprawdź"}</p>
            </button>

            <button
              type="button"
              disabled={!data[index].checked}
              title={
                !data[index].checked ? "Plansza nie została sprawdzona" : ""
              }
              onClick={() => {
                open(
                  `/familiada/board/${index + 1}`,
                  "game_window",
                  "width=960, height=540"
                );
              }}
            >
              <p>{"🖥️ Prezentuj"}</p>
            </button>
          </div>
        </div>
      </div>
    </form>
  );

  // MAIN RETURN

  return (
    <PageLayout>
      <div className={styles.gameLogo}>
        <Image
          alt="Familiada"
          src="/familiada/images/logo.svg"
          width={800}
          height={130}
          draggable={false}
          priority
        />
      </div>

      <div className={styles.actionButtons}>
        <Link href="/familiada/rules">
          <p>{"📖 Zasady gry"}</p>
        </Link>

        <button
          onClick={() => {
            return open(
              "/familiada/board/start",
              "game_window",
              "width=960, height=540"
            );
          }}
        >
          <p>{"✨ Tablica tytułowa"}</p>
        </button>
      </div>

      {loading ? (
        <div className="loading">
          <p>Trwa ładowanie...</p>
        </div>
      ) : (
        <div className={styles.container}>
          {[...Array(data.length)].map((_, index) => RoundBoard(index))}

          <button
            className={styles.addButton}
            disabled={emptyBoardCheck(data[data.length - 1])}
            title={
              emptyBoardCheck(data[data.length - 1])
                ? "Uzupełnij poprzednią planszę przed dodaniem nowej"
                : ""
            }
            onClick={() => {
              setData([...data, emptyData]);

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
            <Image
              className="icon"
              alt="+"
              src="/icons/plus.svg"
              width={18}
              height={18}
              draggable={false}
            />
            <p>Nowe pytanie</p>
          </button>
        </div>
      )}

      <div className={styles.credits}>
        <p>
          Gra została stworzona na podstawie polskiego teleturnieju{" "}
          <Link
            href="https://pl.wikipedia.org/wiki/Familiada"
            target="_blank"
          >{`"Familiada"`}</Link>
          , emitowanego na antenie{" "}
          <Link href="https://pl.wikipedia.org/wiki/TVP2" target="_blank">
            TVP2
          </Link>
          . Wszystkie prawa do emisji oraz znaki towarowe należą do ich prawnych
          właścicieli.
        </p>
      </div>
    </PageLayout>
  );
}
