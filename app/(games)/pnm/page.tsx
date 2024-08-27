"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, Fragment } from "react";
import toast from "react-hot-toast";

import PageLayout from "@/components/wrappers/pageLayout";

import styles from "./page.module.scss";

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

  // load data on start
  useEffect(() => {
    try {
      const storedData = localStorage.getItem("pnm");
      if (storedData) setData(JSON.parse(storedData));

      scrollTo({ top: 0 });
      setLoading(false);
    } catch (error) {
      localStorage.removeItem("pnm");
      router.refresh();
    }
  }, [router]);

  // save data on change
  useEffect(() => {
    if (!loading) localStorage.setItem("pnm", JSON.stringify(data));
  }, [loading, data]);

  // main render
  return (
    <PageLayout>
      <div style={{ userSelect: "none" }}>
        <Image
          alt="Postaw na milion"
          src="/pnm/images/logo.webp"
          width={475}
          height={314}
          draggable={false}
          priority
        />
      </div>

      {loading ? (
        <div className="loading">
          <p>Trwa ładowanie...</p>
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            open("/pnm/board/0", "game_window", "width=960, height=540");
          }}
        >
          <button type="submit" className={styles.startButton}>
            <p>Uruchom grę</p>
          </button>

          <div className={styles.container}>
            {[...Array(data.length)].map((_, i) => (
              <div key={i} className={styles.board}>
                <div className={styles.controls}>
                  <p>{`Etap ${i + 1}/${data.length}`}</p>

                  <div className={styles.buttons}>
                    <button
                      type="button"
                      title="Wyczyść/usuń planszę"
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
                  {data[i].map((stage, j) => (
                    <Fragment key={j}>
                      <div className={styles.inputs}>
                        <div>
                          <h3>Kategoria:</h3>

                          <input
                            type="text"
                            name={`${i}-${j}-category`}
                            placeholder="Wpisz kategorię"
                            autoComplete="off"
                            maxLength={128}
                            value={stage.category || ""}
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
                          <h3>Pytanie:</h3>

                          <input
                            type="text"
                            name={`${i}-${j}-question`}
                            placeholder="Wpisz pytanie"
                            autoComplete="off"
                            maxLength={128}
                            value={stage.question || ""}
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
                                type="text"
                                name={`${i}-${j}-${k}-answer`}
                                placeholder={`Odpowiedź ${k + 1}`}
                                autoComplete="off"
                                maxLength={64}
                                value={answer.value || ""}
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
                                type="radio"
                                name={`${i}-${j}-check`}
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

                      {j === 0 && <hr />}
                    </Fragment>
                  ))}
                </div>
              </div>
            ))}

            <button
              type="button"
              className={styles.addButton}
              onClick={() => {
                if (
                  JSON.stringify(data[data.length - 1]) ===
                  JSON.stringify(newStage)
                ) {
                  return toast(
                    "Uzupełnij poprzednią planszę przed dodaniem nowej"
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
              <Image
                className="icon"
                alt="+"
                src="/icons/plus.svg"
                width={18}
                height={18}
                draggable={false}
              />
              <p>Dodaj etap</p>
            </button>
          </div>
        </form>
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
