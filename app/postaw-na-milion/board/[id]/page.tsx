"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import type { Data } from "@/app/postaw-na-milion/page";
import styles from "./styles.module.scss";

export default function FamiliadaBoardID({
  params,
}: {
  params: { id: number };
}) {
  const id = Number(params.id);

  const [data, setData] = useState<Data>();
  const [videoPlaying, setVideoPlaying] = useState(true);

  // get data on load
  useEffect(() => {
    const storedData = localStorage.getItem("pnm") || "[]";
    const data = JSON.parse(storedData)[id - 1];

    if (data) setData(data);
  }, [id]);

  // keyboard navigation
  useEffect(() => {
    const KeyupEvent = (event: KeyboardEvent) => {
      if (event.shiftKey || event.altKey || event.metaKey) {
        return;
      }

      //
    };

    document.addEventListener("keyup", KeyupEvent);
    return () => document.removeEventListener("keyup", KeyupEvent);
  }, []);

  // game-start screen
  if (id === 0) {
    return (
      <>
        <Image
          className={styles.startBackground}
          src="/pnm/background.webp"
          alt="Postaw na milion"
          width={1920}
          height={1080}
          draggable={false}
        />

        <video
          className={styles.startIntro}
          src="/pnm/intro.mp4"
          autoPlay
          onEnded={() => setVideoPlaying(false)}
          style={{ display: videoPlaying ? "block" : "none" }}
        />
      </>
    );
  }

  return (
    <>
      {data && (
        <>
          <h1>Hello world</h1>
        </>
      )}
    </>
  );
}
