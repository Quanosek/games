"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import styles from "./page.module.scss";
import Layout from "@/components/pageLayout";

export default function QuizyPage() {
  const emptyQuestion = {
    question: "",
    answers: new Array(4).fill({ value: "", checked: false }),
  };

  const [data, setData] = useState([emptyQuestion]);

  // load data from localStorage
  useEffect(() => {
    const storedData = localStorage.getItem("quizy");
    if (storedData) setData(JSON.parse(storedData));
  }, []);

  return (
    <Layout>
      <h1 className={styles.title}>
        Zagraj w <span>Quizy</span>
      </h1>

      <form
        className={styles.form}
        onSubmit={(e) => {
          e.preventDefault();
          localStorage.setItem("quizy", JSON.stringify(data));
        }}
      >
        {[...Array(data.length)].map((_, index) => (
          <div className={styles.container} key={index}>
            <div className={styles.params}>
              <p>
                {index + 1}/{data.length}
              </p>

              {/* quick settings */}
              <div className={styles.controls}>
                <button
                  type="button"
                  title="Przenieś do góry"
                  className={index === 0 ? "disabled" : ""}
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
                  />
                </button>

                <button
                  type="button"
                  title="Przenieś w dół"
                  className={index + 1 === data.length ? "disabled" : ""}
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
                    style={{ transform: "rotate(180deg)" }}
                  />
                </button>

                <button
                  type="button"
                  title="Usuń pytanie"
                  onClick={() => {
                    if (!confirm("Czy na pewno chcesz usunąć pytanie?")) return;

                    setData((prev) => {
                      const newData = [...prev];
                      newData.splice(index, 1);
                      if (!newData.length) newData.push(emptyQuestion);
                      return newData;
                    });
                  }}
                >
                  <Image
                    src="/icons/trashcan.svg"
                    alt="delete"
                    width={20}
                    height={20}
                    draggable={false}
                  />
                </button>
              </div>
            </div>

            {/* question input */}
            <input
              type="text"
              autoComplete="off"
              placeholder="Pytanie"
              maxLength={128}
              style={{ marginBottom: "1rem" }}
              value={data[index].question || ""}
              onChange={(e) => {
                setData((prev) => {
                  const newData = [...prev];
                  newData[index].question = e.target.value;
                  return newData;
                });
              }}
            />

            {/* answers grid */}
            <div className={styles.answers}>
              {Array.from({ length: 4 }).map((_, i) => (
                <div className={styles.value} key={i}>
                  {/* answer value input */}
                  <div className={styles.answer}>
                    <p>{["A", "B", "C", "D"][i]}</p>
                    <input
                      type="text"
                      autoComplete="off"
                      placeholder="Odpowiedź"
                      maxLength={64}
                      value={data[index].answers[i].value || ""}
                      onChange={(e) => {
                        setData((prev) => {
                          const newData = [...prev];
                          newData[index].answers[i] = {
                            ...newData[index].answers[i],
                            value: e.target.value,
                          };
                          return newData;
                        });
                      }}
                    />
                  </div>

                  {/* correct answer checkbox */}
                  <div className={styles.checkboxHandler}>
                    <div className={styles.checkbox}>
                      <input
                        id={`${index}-${i}-checkbox`}
                        type="checkbox"
                        checked={data[index].answers[i].checked || ""}
                        onChange={(e) => {
                          setData((prev) => {
                            const newData = [...prev];
                            newData[index].answers[i] = {
                              ...newData[index].answers[i],
                              checked: e.target.checked,
                            };
                            return newData;
                          });
                        }}
                      />

                      <label
                        htmlFor={`${index}-${i}-checkbox`}
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
        ))}

        {/* add question button */}
        <button
          type="button"
          style={{ marginTop: "1rem" }}
          onClick={() => {
            setData([...data, emptyQuestion]);

            setTimeout(() => {
              scrollTo({
                top: document.body.scrollHeight,
                behavior: "smooth",
              });
            }, 1);
          }}
        >
          <p>➕ Dodaj pytanie</p>
        </button>

        {/* floating play button */}
        <div className={styles.playButton}>
          <button type="submit" title="Rozpocznij grę">
            <Image
              src="/icons/play.svg"
              alt="play"
              width={32}
              height={32}
              draggable={false}
            />
          </button>
        </div>
      </form>
    </Layout>
  );
}
