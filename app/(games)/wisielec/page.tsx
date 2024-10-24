"use client";

import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";

import PageLayout from "@/components/wrappers/pageLayout";
import SavedGame from "@/components/savedGame";
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
    time: "2m",
    category: "",
    phrase: "",
  };

  const [data, setData] = useState([emptyData]);
  const [loading, setLoading] = useState(true);

  // load game data
  useEffect(() => {
    try {
      const storedData = localStorage.getItem("wisielec");
      if (storedData) setData(JSON.parse(storedData).data);
      setLoading(false);
    } catch (error) {
      localStorage.removeItem("wisielec");
      window.location.reload();
    }
  }, [router]);

  // save data on change
  useEffect(() => {
    if (loading) return;

    const localData = JSON.parse(localStorage.getItem("wisielec") || "{}");
    const { data: _, ...params } = localData;

    localStorage.setItem("wisielec", JSON.stringify({ data, ...params }));
  }, [loading, data]);

  // check if board is empty
  const emptyBoardCheck = (data: Data) => {
    return JSON.stringify(data) === JSON.stringify(emptyData);
  };

  // MAIN COMPONENT
  const FormBoard = (index: number) => {
    const wordName = (string: string) => {
      const words = string.split(" ").filter((word) => word !== "");

      let wordName = "";
      const lastDigit = words.length % 10;

      if (words.length === 1) {
        wordName = "wyraz";
      } else if (words.length > 20 && lastDigit > 1 && lastDigit < 5) {
        wordName = "wyrazy";
      } else {
        wordName = "wyrazów";
      }

      return `${words.length} ${wordName}`;
    };

    const polishAlphabet = "aąbcćdeęfghijklłmnńoópqrsśtuvwxyzźż";
    const vowels = "aąeęioóuy";

    const phraseLetters = data[index].phrase.split("").filter((letter) => {
      return polishAlphabet.includes(letter.toLowerCase());
    });

    return (
      <form
        key={index}
        id={index.toString()}
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
          <h2>{`${index + 1}/${data.length}`}</h2>

          <div className={styles.buttons}>
            {/* delete button */}
            <button
              type="button"
              disabled={data.length === 1 && emptyBoardCheck(data[index])}
              title={
                data.length === 1 && emptyBoardCheck(data[index])
                  ? "Nie można usunąć ostatniej planszy"
                  : "Wyczyść/usuń planszę"
              }
              onClick={() => {
                if (!emptyBoardCheck(data[index])) {
                  if (!confirm("Czy na pewno chcesz wyczyścić planszę?")) {
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

            <p>{"•"}</p>

            <button type="submit">
              <p>Prezentuj</p>
            </button>
          </div>
        </div>

        <div className={styles.content}>
          <div className={styles.params}>
            <label>
              <p>Dozwolone błędy:</p>

              <select
                id={`${index}-attempts`}
                value={data[index].attempts}
                onChange={(e) => {
                  const value = parseInt(e.target.value);

                  // update data
                  setData((prev) => {
                    const newData = [...prev];
                    newData[index].attempts = value;
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
            </label>

            <label>
              <p>Czas:</p>

              <select
                id={`${index}-time`}
                value={data[index].time}
                onChange={(e) => {
                  const value = e.target.value;

                  // update data
                  setData((prev) => {
                    const newData = [...prev];
                    newData[index].time = value;
                    return newData;
                  });
                }}
              >
                <option value="-1">bez limitu</option>
                <option value="1m">1 min</option>
                <option value="2m">2 min</option>
                <option value="3m">3 min</option>
                <option value="4m">4 min</option>
                <option value="5m">5 min</option>
                <option value="10m">10 min</option>
              </select>
            </label>
          </div>

          <div className={styles.inputs}>
            <label>
              <h3>Kategoria:</h3>

              <input
                name={`${index}-category`}
                placeholder="Wpisz kategorię"
                autoComplete="off"
                maxLength={64}
                value={data[index].category || ""}
                required
                onChange={(e) => {
                  // validate input
                  const value = e.target.value
                    .toUpperCase() // capitalize
                    .replace(/\s\s/g, " ") // double space
                    .replace(/^[\s]/, ""); // space as first character

                  // update data
                  setData((prev) => {
                    const newData = [...prev];
                    newData[index].category = value;
                    return newData;
                  });
                }}
              />
            </label>

            <label>
              <h3>Hasło:</h3>

              <input
                name={`${index}-phrase`}
                placeholder="Wpisz hasło do odgadnięcia"
                autoComplete="off"
                maxLength={128}
                value={data[index].phrase || ""}
                required
                onChange={(e) => {
                  // validate input
                  const value = e.target.value
                    .toUpperCase() // capitalize
                    .replace(/\s\s/g, " ") // double space
                    .replace(/^[\s]/, ""); // space as first character

                  // update data
                  setData((prev) => {
                    const newData = [...prev];
                    newData[index].phrase = value;
                    return newData;
                  });
                }}
              />
            </label>
          </div>

          <hr style={{ marginTop: "0.25rem" }} />

          <div className={styles.phraseStats}>
            <p>{wordName(data[index].phrase)}</p>
            <p>{new Set(phraseLetters).size} różnych liter, w tym:</p>
            <p>
              {
                new Set(
                  phraseLetters.filter((letter) => {
                    return !vowels.split("").includes(letter);
                  })
                ).size
              }{" "}
              spółgłosek
            </p>
            <p>
              {
                new Set(
                  phraseLetters.filter((letter) => {
                    return vowels.split("").includes(letter);
                  })
                ).size
              }{" "}
              samogłosek
            </p>
          </div>
        </div>
      </form>
    );
  };

  // MAIN RETURN

  return (
    <PageLayout>
      <SavedGame type={usePathname().slice(1)} data={JSON.stringify(data)} />

      <h1 className={styles.gameTitle}>
        Gra w <span>wisielca</span>
      </h1>

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
            <p>Nowe hasło</p>
          </button>
        </div>
      )}
    </PageLayout>
  );
}
