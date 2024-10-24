"use client";

import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, Fragment } from "react";

import PageLayout from "@/components/wrappers/pageLayout";
import SavedGame from "@/components/savedGame";
import styles from "./styles.module.scss";

export interface Data {
  category: string;
  question: string;
  answers: Array<{ value: string; checked: boolean }>;
}

export default function PnmPage() {
  const router = useRouter();

  const newStage: Data[] = new Array(2).fill({
    category: "",
    question: "",
    answers: new Array(4).fill({ value: "", checked: false }),
  });

  const [data, setData] = useState([newStage]);
  const [loading, setLoading] = useState(true);

  // load game data
  useEffect(() => {
    try {
      const storedData = localStorage.getItem("pnm");
      if (storedData) setData(JSON.parse(storedData).data);
      setLoading(false);
    } catch (error) {
      localStorage.removeItem("pnm");
      router.refresh();
    }
  }, [router]);

  // save data on change
  useEffect(() => {
    if (loading) return;

    const localData = JSON.parse(localStorage.getItem("pnm") || "{}");
    const { data: _, ...params } = localData;

    localStorage.setItem("pnm", JSON.stringify({ data, ...params }));
  }, [loading, data]);

  // check if board is empty
  const emptyBoardCheck = (data: Data[]) => {
    return JSON.stringify(data) === JSON.stringify(newStage);
  };

  // MAIN COMPONENT
  const FormBoard = (i: number) => {
    return (
      <form
        key={i}
        id={i.toString()}
        className={styles.board}
        onSubmit={(e) => {
          e.preventDefault();
          open(`/pnm/board/${i + 1}`, "game_window", "width=960, height=540");
        }}
      >
        <div className={styles.controls}>
          <h2>{`Etap ${i + 1}/${data.length}`}</h2>

          <div className={styles.buttons}>
            {/* delete button */}
            <button
              type="button"
              disabled={data.length === 1 && emptyBoardCheck(data[i])}
              title={
                data.length === 1 && emptyBoardCheck(data[i])
                  ? "Nie można usunąć ostatniej planszy"
                  : "Wyczyść/usuń planszę"
              }
              onClick={() => {
                if (!emptyBoardCheck(data[i])) {
                  if (!confirm("Czy na pewno chcesz wyczyścić planszę?")) {
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

                    setTimeout(() => {
                      document.getElementById(i.toString())?.scrollIntoView({
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
                width={20}
                height={20}
                draggable={false}
              />
            </button>

            {/* move down button */}
            <button
              type="button"
              title="Przenieś w dół"
              disabled={i + 1 === data.length}
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
                style={{ rotate: "180deg" }}
                className="icon"
                alt="w dół"
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
              disabled={i === 0}
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
                className="icon"
                alt="w górę"
                src="/icons/arrow.svg"
                width={20}
                height={20}
                draggable={false}
              />
            </button>

            <p>{"•"}</p>

            <button type="submit">
              <p>Prezentuj</p>
            </button>
          </div>
        </div>

        <div className={styles.content}>
          {data[i].map((stage, j) => (
            <Fragment key={j}>
              <div className={styles.inputs}>
                <label>
                  <h3>Kategoria:</h3>

                  <input
                    name={`${i}-${j}-category`}
                    placeholder="Wpisz kategorię"
                    autoComplete="off"
                    maxLength={20} // board responsiveness limit
                    value={stage.category || ""}
                    required
                    onChange={(e) => {
                      // validate input
                      const category = e.target.value
                        .replace(/\s\s/g, " ") // double space
                        .replace(/^[\s]/, ""); // space as first character

                      // update data
                      setData((prev) => {
                        const newData = [...prev];
                        newData[i][j] = {
                          ...newData[i][j],
                          category,
                        };
                        return newData;
                      });
                    }}
                  />
                </label>

                <label>
                  <h3>Pytanie:</h3>

                  <input
                    name={`${i}-${j}-question`}
                    placeholder="Wpisz pytanie"
                    autoComplete="off"
                    maxLength={128}
                    value={stage.question || ""}
                    required
                    onChange={(e) => {
                      // validate input
                      const question = e.target.value
                        .replace(/\s\s/g, " ") // double space
                        .replace(/^[\s]/, ""); // space as first character

                      // update data
                      setData((prev) => {
                        const newData = [...prev];
                        newData[i][j] = {
                          ...newData[i][j],
                          question,
                        };
                        return newData;
                      });
                    }}
                  />
                </label>

                <div>
                  <h3>Odpowiedzi (jedna poprawna):</h3>

                  {stage.answers.map((answer, k) => (
                    <div
                      key={k}
                      className={styles.answer}
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
                        placeholder={`Odpowiedź ${k + 1}`}
                        autoComplete="off"
                        maxLength={64}
                        value={answer.value || ""}
                        required={k < 2}
                        onChange={(e) => {
                          // validate input
                          const value = e.target.value
                            .replace(/\s\s/g, " ") // double space
                            .replace(/^[\s]/, ""); // space as first character

                          // update data
                          setData((prev) => {
                            const newData = [...prev];
                            newData[i][j] = {
                              ...newData[i][j],
                              answers: newData[i][j].answers.map((a, l) => {
                                // find specific answer and add value
                                return l === k ? { ...a, value } : a;
                              }),
                            };
                            return newData;
                          });
                        }}
                      />

                      <input
                        style={{
                          // disable if answer is empty
                          pointerEvents: answer.value ? "unset" : "none",
                        }}
                        type="radio"
                        name={`${i}-${j}-check`}
                        checked={answer.checked}
                        required
                        onChange={() => {
                          setData((prev) => {
                            const newData = [...prev];
                            newData[i][j] = {
                              ...newData[i][j],
                              answers: newData[i][j].answers.map((a, l) => {
                                // find specific answer and check it
                                return { ...a, checked: l === k };
                              }),
                            };
                            return newData;
                          });
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {j === 0 && <hr />}
            </Fragment>
          ))}
        </div>
      </form>
    );
  };

  // MAIN RETURN
  return (
    <PageLayout>
      <SavedGame type={usePathname().slice(1)} data={JSON.stringify(data)} />

      <div className={styles.gameLogo}>
        <Image
          alt="Postaw na milion"
          src="/pnm/images/logo.webp"
          width={475}
          height={314}
          draggable={false}
          priority
        />
      </div>

      <div className={styles.actionButtons}>
        <Link href="/pnm/rules">
          <p>{"📖 Zasady gry"}</p>
        </Link>

        <button
          onClick={() => {
            return open(
              "/pnm/board/start",
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
          {[...Array(data.length)].map((_, index) => FormBoard(index))}

          <button
            className={styles.addButton}
            disabled={emptyBoardCheck(data[data.length - 1])}
            title={
              emptyBoardCheck(data[data.length - 1])
                ? "Uzupełnij poprzednią planszę przed dodaniem nowej"
                : ""
            }
            onClick={() => {
              setData([...data, newStage]);

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
            <p>Kolejny etap</p>
          </button>
        </div>
      )}

      <div className={styles.credits}>
        <p>
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
      </div>
    </PageLayout>
  );
}
