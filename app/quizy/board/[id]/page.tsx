"use client";

import { useEffect, useState } from "react";

import styles from "./page.module.scss";

export default function BoardID({ params }: { params: { id: number } }) {
  const { id } = params;

  const [data, setData] = useState<any>();

  useEffect(() => {
    const storedData = localStorage.getItem("quizy");
    if (storedData) setData(JSON.parse(storedData)[id - 1]);
  }, [id]);

  if (!data) return null;

  return (
    <>
      <h1>{data.question}</h1>

      <div className={styles.answers}>
        {data.answers.map((el: any, i: number) => (
          <div key={i}>
            <button>
              <p>{`${["A", "B", "C", "D"][i]}: ${el.value}`}</p>
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
