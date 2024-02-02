"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import styles from "./page.module.scss";
import Layout from "@/components/pageLayout";

// local object template
export interface Data {
  attempts: number;
  time: string;
  category: string;
  phrase: string;
}

export default function WisielecPage() {
  const router = useRouter();

  // empty data template
  const emptyData: Data = {
    attempts: 10,
    time: "1m",
    category: "",
    phrase: "",
  };

  // data state
  const [data, setData] = useState([emptyData]);
  const [loading, setLoading] = useState(true);

  // load data on start
  useEffect(() => {
    try {
      const storedData = localStorage.getItem("wisielec");
      if (storedData) setData(JSON.parse(storedData));

      scrollTo({ top: 0 });
      setLoading(false);
    } catch (err) {
      localStorage.removeItem("wisielec");
      router.refresh();
    }
  }, [router]);

  // save data on change
  useEffect(() => {
    if (!loading) localStorage.setItem("wisielec", JSON.stringify(data));
  }, [loading, data]);

  // words counter formatter
  const wordsName = (string: string) => {
    const words = string.split(" ").filter((word) => word !== "");
    let result = "";

    if (words.length === 1) result = "1 wyraz";
    else if (words.length > 1 && words.length < 5) {
      result = `${words.length} wyrazy`;
    } else result = `${words.length} wyrazów`;

    return result;
  };

  const vowels = "aąeęioóuy";

  // main page render
  return (
    <Layout>
      <h1 className={styles.title}>
        Gra w <span>wisielca</span>
      </h1>

      {loading ? (
        <div className="loading">
          <p>Trwa ładowanie...</p>
        </div>
      ) : (
        <div className={styles.container}>
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
              {/* board navbar */}
              <div className={styles.controls}>
                <p>{`Plansza: ${index + 1}/${data.length}`}</p>

                {/* quick settings */}
                <div className={styles.buttons}>
                  <button
                    type="button"
                    title="Wyczyść/usuń pytanie"
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
                          newData.splice(index, 1);
                          if (!newData.length) newData.push(emptyData);
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

                  <p>{"•"}</p>

                  <button type="submit">
                    <p>Zagraj!</p>
                  </button>
                </div>
              </div>

              <div className={styles.content}>
                {/* game params */}
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
                      <option value="3">3</option>
                      <option value="5">5</option>
                      <option value="10">10</option>
                      <option value="15">15</option>
                      <option value="20">20</option>
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

                {/* input values */}
                <div className={styles.inputs}>
                  <div>
                    <p>Kategoria:</p>

                    <input
                      id={`${index}-category`}
                      type="text"
                      autoComplete="off"
                      placeholder="Wpisz kategorię"
                      value={data[index].category || ""}
                      maxLength={128}
                      onChange={(e) => {
                        // prevent double space
                        if (e.target.value.includes("  ")) {
                          return e.target.value.replace("  ", " ");
                        }

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
                    <p>Hasło:</p>

                    <input
                      id={`${index}-phrase`}
                      type="text"
                      autoComplete="off"
                      placeholder="Wpisz hasło do odgadnięcia"
                      value={data[index].phrase || ""}
                      maxLength={128}
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

                <hr />

                {/* phrase statistics */}
                <div className={styles.phraseStats}>
                  <p>{wordsName(data[index].phrase)}</p>

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

          {/* add new board button */}
          <button
            type="button"
            onClick={() => {
              if (
                JSON.stringify(data[data.length - 1]) ===
                JSON.stringify(emptyData)
              ) {
                return alert("Nie możesz dodać kolejnego pustego pytania!");
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
            <p>{"➕ Dodaj planszę"}</p>
          </button>
        </div>
      )}
    </Layout>
  );
}
