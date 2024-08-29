"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";

import styles from "../styles.module.scss";

export default function PnmStartBoard() {
  const [showIntro, setShowIntro] = useState(true);

  const IntroComponent = () => {
    // video params
    const videoRef = useRef<HTMLVideoElement>(null);
    const [videoPlaying, setVideoPlaying] = useState(false);

    // update video playing state
    useEffect(() => {
      if (videoPlaying) videoRef.current?.play();
      else videoRef.current?.pause();
    }, [videoPlaying]);

    // mouse behavior
    const [showCursor, setShowCursor] = useState(false);
    const cursorHideTimeout = useRef<NodeJS.Timeout | undefined>(undefined);

    useEffect(() => {
      const mouseMoveEvent = (e: MouseEvent) => {
        if ((e.movementX && e.movementY) === 0) return;

        setShowCursor(true);

        clearTimeout(cursorHideTimeout.current);
        cursorHideTimeout.current = setTimeout(() => {
          return setShowCursor(false);
        }, 1_500);
      };

      document.addEventListener("mousemove", mouseMoveEvent);
      return () => document.removeEventListener("mousemove", mouseMoveEvent);
    }, []);

    // keyboard interactions
    useEffect(() => {
      const KeyupEvent = (event: KeyboardEvent) => {
        if (event.ctrlKey || event.shiftKey || event.altKey || event.metaKey) {
          return;
        }

        // Spacebar to play/pause video
        if (event.key === " ") setVideoPlaying((prev) => !prev);
      };

      document.addEventListener("keyup", KeyupEvent);
      return () => document.removeEventListener("keyup", KeyupEvent);
    }, []);

    // component return
    return (
      <div
        style={{ cursor: showCursor ? "" : "none" }}
        className={styles.introComponent}
      >
        {!videoPlaying && (
          <div
            className={styles.videoOverlay}
            onClick={() => {
              videoRef.current?.play();
              setShowCursor(false);
            }}
          >
            <button
              title="Odtwórz czołówkę teleturnieju"
              className={styles.playButton}
            >
              <Image
                className="icon"
                alt=""
                src="/icons/play.svg"
                width={100}
                height={100}
              />
            </button>

            <div className={styles.skipButton}>
              <button onClick={() => setShowIntro(false)}>
                <p>Pomiń czołówkę</p>
              </button>
            </div>
          </div>
        )}

        <video
          ref={videoRef}
          onPlaying={() => setVideoPlaying(true)}
          onEnded={() => setShowIntro(false)}
          onClick={() => {
            setVideoPlaying(false);
            setShowCursor(true);
          }}
        >
          <source src="/pnm/video/intro.mp4" type="video/mp4" />
          <p>Twoja przeglądarka nie obsługuje odtwarzania plików wideo</p>
        </video>
      </div>
    );
  };

  // show intro component
  if (showIntro) return <IntroComponent />;

  // show start board
  return <div className={styles.startLayout} />;
}
