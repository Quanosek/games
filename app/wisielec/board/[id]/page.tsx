"use client";

import { useEffect, useState } from "react";

import type { Word } from "@/app/wisielec/page";
import styles from "./styles.module.scss";

export default function BoardID({ params }: { params: { id: number } }) {
  const id = Number(params.id);

  const [data, setData] = useState<Word>();
  const [loading, setLoading] = useState(true);

  // get data on load
  useEffect(() => {
    const storedData = localStorage.getItem("wisielec") || "[]";
    const data = JSON.parse(storedData)[id - 1];

    if (data) setData({ ...data, word: data.word.toLowerCase() });
    setLoading(false);
  }, [id]);

  return (
    <>
      {/* 
      
      */}
    </>
  );
}
