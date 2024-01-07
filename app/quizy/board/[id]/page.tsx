"use client";

import { useEffect, useState } from "react";

export default function BoardID({ params }: { params: { id: number } }) {
  const { id } = params;

  const [data, setData] = useState<any>();

  useEffect(() => {
    const local = localStorage.getItem("quizy") || "{}";
    if (local) setData(JSON.parse(local)[id - 1]);
  }, [id]);

  if (!data) return null;

  return (
    <>
      <h1>{data.question}</h1>
      {data.answers.map((el: any, index: number) => (
        <div style={{ display: "flex", gap: "1rem" }} key={index}>
          <p>{el.answer}</p>
          <p>{el.correct.toString()}</p>
        </div>
      ))}
    </>
  );
}
