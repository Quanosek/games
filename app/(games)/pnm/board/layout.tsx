"use client";

import { useEffect } from "react";

import styles from "./styles.module.scss";
import { Myriad } from "@/lib/fonts";

export default function PnmBoardLayout({
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

  return (
    <div className={styles.layout}>
      <div className={styles.container}>{children}</div>

      <div className={styles.credits}>
        <p className={Myriad.className}>Stworzone na stronie games.klalo.pl</p>
      </div>
    </div>
  );
}
