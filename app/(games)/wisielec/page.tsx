"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import PageLayout from "@/components/wrappers/pageLayout";

import styles from "./page.module.scss";

export interface Data {
  attempts: number;
  time: string;
  category: string;
  phrase: string;
}

export default function WisielecPage() {
  const router = useRouter();

  const emptyData: Data = {
    attempts: 10,
    time: "1m",
    category: "",
    phrase: "",
  };

  const [data, setData] = useState([emptyData]);
  const [loading, setLoading] = useState(true);

  // load data on start
  useEffect(() => {
    try {
      const storedData = localStorage.getItem("wisielec");
      if (storedData) setData(JSON.parse(storedData));

      scrollTo({ top: 0 });
      setLoading(false);
    } catch (error) {
      localStorage.removeItem("wisielec");
      router.refresh();
    }
  }, [router]);

  // save data on change
  useEffect(() => {
    if (!loading) localStorage.setItem("wisielec", JSON.stringify(data));
  }, [loading, data]);

  // input phrase counter
  const phraseStats = (string: string) => {
    const words = string.split(" ").filter((word) => word !== "");
    let result = "";

    if (words.length === 1) result = "1 wyraz";
    else if (words.length > 1 && words.length < 5) {
      result = `${words.length} wyrazy`;
    } else result = `${words.length} wyrazów`;

    return result;
  };

  const vowels = "aąeęioóuy";

  // main render
  return (
    <PageLayout>
      <h1 className={styles.gameTitle}>
        Gra w <span>wisielca</span>
      </h1>

      {loading ? (
        <div className="loading">
          <p>Trwa ładowanie...</p>
        </div>
      ) : (
        <div className={styles.container}>
          {/* board handle */}
          {[...Array(data.length)].map((_, index) => (
            <form
              key={index}
              className={styles.board}
              onSubmit={(e) => {
                e.preventDefault();
                open(
                  `/wisielec/board/${index + 1}`,
                  "game_window",
                  "width=960, height=540"
                );
              }}
            >
              <div className={styles.controls}>
                <p>{`${index + 1}/${data.length}`}</p>

                <div className={styles.buttons}>
                  <button
                    type="button"
                    title="Wyczyść/usuń planszę"
                    onClick={() => {
                      if (data[index].category || data[index].phrase) {
                        if (
                          !confirm("Czy na pewno chcesz wyczyścić planszę?")
                        ) {
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
                          if (newData.length > 1) newData.splice(index, 1);
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

                  <p>{"•"}</p>

                  <button type="submit">
                    <p>Zagraj</p>
                  </button>
                </div>
              </div>

              <div className={styles.content}>
                <div className={styles.params}>
                  <div>
                    <label htmlFor={`${index}-attempts`}>
                      <p>Dozwolone błędy:</p>
                    </label>

                    <select
                      id={`${index}-attempts`}
                      value={data[index].attempts}
                      onChange={(e) => {
                        setData((prev) => {
                          const newData = [...prev];
                          newData[index].attempts = parseInt(e.target.value);
                          return newData;
                        });
                      }}
                    >
                      <option value="1">1</option>
                      <option value="3">3</option>
                      <option value="5">5</option>
                      <option value="10">10</option>
                      <option value="15">15</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor={`${index}-time`}>
                      <p>Limit czasu:</p>
                    </label>

                    <select
                      id={`${index}-time`}
                      value={data[index].time}
                      onChange={(e) => {
                        setData((prev) => {
                          const newData = [...prev];
                          newData[index].time = e.target.value;
                          return newData;
                        });
                      }}
                    >
                      <option value="-1">bez limitu</option>
                      <option value="30s">30s</option>
                      <option value="45s">45s</option>
                      <option value="1m">1m</option>
                      <option value="2m">2m</option>
                      <option value="5m">5m</option>
                    </select>
                  </div>
                </div>

                <div className={styles.inputs}>
                  <div>
                    <h3>Kategoria:</h3>

                    <input
                      type="text"
                      name={`${index}-category`}
                      placeholder="Wpisz kategorię"
                      autoComplete="off"
                      maxLength={64}
                      value={data[index].category || ""}
                      onChange={(e) => {
                        setData((prev) => {
                          const newData = [...prev];
                          newData[index].category = e.target.value;
                          return newData;
                        });
                      }}
                      required
                    />
                  </div>

                  <div>
                    <h3>Hasło:</h3>

                    <input
                      type="text"
                      name={`${index}-phrase`}
                      placeholder="Wpisz hasło do odgadnięcia"
                      autoComplete="off"
                      maxLength={128}
                      value={data[index].phrase || ""}
                      onChange={(e) => {
                        // prevent double space
                        if (e.target.value.includes("  ")) {
                          return e.target.value.replace("  ", " ");
                        }

                        setData((prev) => {
                          const newData = [...prev];
                          newData[index].phrase = e.target.value;
                          return newData;
                        });
                      }}
                      required
                    />
                  </div>
                </div>

                <hr style={{ marginTop: "0.25rem" }} />

                <div className={styles.phraseStats}>
                  <p>{phraseStats(data[index].phrase)}</p>

                  <p>
                    {
                      new Set(
                        data[index].phrase.split("").filter((letter) => {
                          return letter !== " ";
                        })
                      ).size
                    }{" "}
                    różnych liter, w tym:
                  </p>

                  <p>
                    {
                      new Set(
                        data[index].phrase.split("").filter((letter) => {
                          if (letter !== " ") {
                            return !vowels.split("").includes(letter);
                          }
                        })
                      ).size
                    }{" "}
                    spółgłosek
                  </p>

                  <p>
                    {
                      new Set(
                        data[index].phrase.split("").filter((letter) => {
                          return vowels.split("").includes(letter);
                        })
                      ).size
                    }{" "}
                    samogłosek
                  </p>
                </div>
              </div>
            </form>
          ))}

          <button
            type="button"
            className={styles.addButton}
            onClick={() => {
              if (
                JSON.stringify(data[data.length - 1]) ===
                JSON.stringify(emptyData)
              ) {
                return toast(
                  "Uzupełnij poprzednią planszę przed dodaniem nowej"
                );
              }

              setData([...data, emptyData]);

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
            <p>Dodaj hasło</p>
          </button>
        </div>
      )}
    </PageLayout>
  );
}
