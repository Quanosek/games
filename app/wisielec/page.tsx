"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import styles from "./page.module.scss";
import Layout from "@/components/pageLayout";

// local object template
export interface Word {
  word: string;
  attempts: number;
}

export default function QuizyPage() {
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
    if (!data) setData([{ word: "", attempts: 10 }]);
    if (!loading) localStorage.setItem("wisielec", JSON.stringify(data));
  }, [data, loading]);

  const vowels = ["a", "e", "i", "o", "u", "y"];

  const wordNaming = (string: string) => {
    const words = string.split(" ").filter((word) => word !== "");
    let result = "";

    if (words.length === 1) result = "1 wyraz";
    else if (wordNaming.length > 1 && words.length < 5) {
      result = `${words.length} wyrazy`;
    } else result = `${words.length} wyrazów`;

    return <p>{result}</p>;
  };

  // main page render
  return (
    <Layout>
      {/* large title */}
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
            <div key={index} className={styles.board}>
              {/* choosing */}
              <div className={styles.inputs}>
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
                <div>
                  <label htmlFor="attempts">Dozwolone błędy:</label>
                  <select id="attempts" defaultValue={data[index].attempts}>
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="15">15</option>
                    <option value="20">20</option>
                  </select>
                </div>
              </div>

              <hr />

              {/* useful information */}
              <div className={styles.wordInfo}>
                <p>{wordNaming(data[index].word)}</p>

                <p>
                  {
                    new Set(
                      data
                        .map((word) => word.word)
                        .join("")
                        .split("")
                        .filter((letter) => letter !== " ")
                    ).size
                  }{" "}
                  różnych liter
                </p>

                <p>
                  {
                    new Set(
                      data
                        .map((word) => word.word)
                        .join("")
                        .split("")
                        .filter(
                          (letter) => letter !== " " && !vowels.includes(letter)
                        )
                    ).size
                  }{" "}
                  spółgłosek
                </p>

                <p>
                  {
                    new Set(
                      data
                        .map((word) => word.word)
                        .join("")
                        .split("")
                        .filter((letter) => vowels.includes(letter))
                    ).size
                  }{" "}
                  samogłosek
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}
