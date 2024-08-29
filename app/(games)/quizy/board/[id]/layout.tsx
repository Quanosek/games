"use client";

import { useEffect } from "react";

import styles from "./board.module.scss";

export default function QuizyBoardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // keyboard interactions
  useEffect(() => {
    const KeyupEvent = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.shiftKey || event.altKey || event.metaKey) {
        return;
      }

      if (event.key === "Escape") close();
    };

    document.addEventListener("keyup", KeyupEvent);
    return () => document.removeEventListener("keyup", KeyupEvent);
  }, []);

  // main return
  return (
    <div className={styles.layout}>
      <>{children}</>

      <div className={styles.credits}>
        <p>Stworzone na stronie games.klalo.pl</p>
      </div>
    </div>
  );
}
