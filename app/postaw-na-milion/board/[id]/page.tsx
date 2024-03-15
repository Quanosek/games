"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";

import type { Data } from "@/app/postaw-na-milion/page";
import styles from "./styles.module.scss";

export default function PnmBoardID({ params }: { params: { id: number } }) {
  const id = Number(params.id);
  const router = useRouter();

  const [data, setData] = useState<Data[]>();

  // get data on load
  useEffect(() => {
    const storedData = localStorage.getItem("pnm") || "[]";
    const data = JSON.parse(storedData)[id - 1];

    if (data) setData(data);
  }, [id]);

  // mouse behavior
  const [alwaysShowCursor, setAlwaysShowCursor] = useState(false);
  const [showCursor, setShowCursor] = useState(false);

  const cursorHideTimeout = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    const mouseMoveEvent = (e: MouseEvent) => {
      if ((e.movementX && e.movementY) == 0) return;

      setShowCursor(true);
      clearTimeout(cursorHideTimeout.current);

      if (!alwaysShowCursor) {
        cursorHideTimeout.current = setTimeout(
          () => setShowCursor(false),
          1500
        );
      }
    };

    document.addEventListener("mousemove", mouseMoveEvent);
    return () => document.removeEventListener("mousemove", mouseMoveEvent);
  }, [alwaysShowCursor]);

  // video behavior
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hiddenIntro, setHiddenIntro] = useState(false);

  const hideVideo = () => {
    setHiddenIntro(true);

    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.style.display = "none";
    }
  };

  // selected category content
  const [selectedQuestion, setQuestion] = useState<Data>();

  // game-start screen
  if (id === 0) {
    return (
      <>
        <div
          className={styles.startIntro}
          style={{
            display: hiddenIntro ? "none" : "block",
            cursor: showCursor ? "default" : "none",
          }}
        >
          <div
            className={styles.skipButton}
            style={{ display: showCursor ? "block" : "none" }}
            onMouseEnter={() => setAlwaysShowCursor(true)}
            onMouseLeave={() => setAlwaysShowCursor(false)}
          >
            <button onClick={hideVideo}>
              <p>Pomiń czołówkę</p>
            </button>
          </div>

          <video
            ref={videoRef}
            src="/pnm/intro.mp4"
            autoPlay
            onEnded={hideVideo}
          >
            <source src="/pnm/intro.mp4" type="video/mp4" />
            Twoja przeglądarka nie obsługuje odtwarzacza wideo.
          </video>
        </div>

        <div
          className={styles.startLayout}
          style={{
            display: hiddenIntro ? "flex" : "none",
          }}
        >
          <button onClick={() => router.push("/postaw-na-milion/board/1")}>
            <p>Start</p>
          </button>

          <Image
            className={styles.background}
            src="/pnm/background.webp"
            alt="Postaw na milion"
            width={1920}
            height={1080}
            draggable={false}
          />
        </div>
      </>
    );
  }

  if (data && !selectedQuestion) {
    return data.map((question, index) => (
      <button key={index} onClick={() => setQuestion(question)}>
        <p>{question.category}</p>
      </button>
    ));
  }

  if (selectedQuestion) {
    return (
      <div>
        <p>{selectedQuestion.question}</p>

        <div>
          {selectedQuestion.answers.map((answer, index) => (
            <p key={index}>{answer.value}</p>
          ))}
        </div>
      </div>
    );
  }
}
