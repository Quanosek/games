"use client";

import { useEffect } from "react";

import styles from "./page.module.scss";

export default function BoardTitle() {
  // keyboard navigation
  useEffect(() => {
    const KeyupEvent = (event: KeyboardEvent) => {
      if (event.key === "Escape") window.close();
    };

    document.addEventListener("keyup", KeyupEvent);
    return () => {
      document.removeEventListener("keyup", KeyupEvent);
    };
  }, []);

  return (
    <>
      <div className={styles.container} />
      <audio src="/audio/soundtrack.mp3" autoPlay loop />
    </>
  );
}
