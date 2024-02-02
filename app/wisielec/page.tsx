"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import styles from "./page.module.scss";
import Layout from "@/components/pageLayout";

// local object template
export interface Word {
  word: string;
  attempts: number;
  time: string;
}

export default function WisielecPage() {
  const router = useRouter();

  // data state
  const [data, setData] = useState<Word[]>([]);
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
    if (!loading) {
      if (!data.length) setData([{ word: "", attempts: 10, time: "1m" }]);
      localStorage.setItem("wisielec", JSON.stringify(data));
    }
  }, [data, loading]);

  const vowels = "aąeęioóuy";

  // word information functions
  const wordsName = (string: string) => {
    const words = string.split(" ").filter((word) => word !== "");
    let result = "";

    if (words.length === 1) result = "1 wyraz";
    else if (words.length > 1 && words.length < 5) {
      result = `${words.length} wyrazy`;
    } else result = `${words.length} wyrazów`;

    return result;
  };

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
        <form
          onSubmit={(e) => {
            e.preventDefault();
            open("/wisielec/board/0", "game_window", "width=960, height=540");
          }}
        >
          {[...Array(data.length)].map((_, index) => (
            <div key={index} className={styles.container}>
              <div className={styles.content}>
                <div className={styles.params}>
                  <div>
                    <label htmlFor={`${index}-attempts`}>
                      <p>Dozwolone błędy:</p>
                    </label>

                    <select
                      id={`${index}-attempts`}
                      defaultValue={data[index].attempts}
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
                      defaultValue={data[index].time}
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

                <input
                  type="text"
                  autoComplete="off"
                  placeholder="Podaj hasło"
                  value={data[index].word || ""}
                  maxLength={128}
                  onChange={(e) => {
                    // prevent double space
                    if (e.target.value.includes("  ")) {
                      return e.target.value.replace("  ", " ");
                    }

                    setData((prev) => {
                      const newData = [...prev];
                      newData[index].word = e.target.value;
                      return newData;
                    });
                  }}
                  required
                />
              </div>

              <hr />

              <div className={styles.wordInfo}>
                <p>{wordsName(data[index].word)}</p>

                <p>
                  {
                    new Set(
                      data
                        .map((phrase) => phrase.word)
                        .join("")
                        .split("")
                        .filter((letter) => letter !== " ")
                    ).size
                  }{" "}
                  różnych liter, w tym:
                </p>

                <p>
                  {
                    new Set(
                      data
                        .map((phrase) => phrase.word)
                        .join("")
                        .split("")
                        .filter((letter) => {
                          return (
                            letter !== " " && !vowels.split("").includes(letter)
                          );
                        })
                    ).size
                  }{" "}
                  spółgłosek
                </p>

                <p>
                  {
                    new Set(
                      data
                        .map((phrase) => phrase.word)
                        .join("")
                        .split("")
                        .filter((letter) => vowels.split("").includes(letter))
                    ).size
                  }{" "}
                  samogłosek
                </p>
              </div>
            </div>
          ))}

          <button type="submit">
            <p>▶️ Rozpocznij grę!</p>
          </button>
        </form>
      )}
    </Layout>
  );
}
