"use client";

import { useEffect } from "react";

import { Myriad } from "@/lib/fonts";
import styles from "./styles.module.scss";

export default function PnmBoardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const KeyupEvent = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.shiftKey || e.altKey || e.metaKey) return;
      if (e.key === "Escape") close();
    };

    document.addEventListener("keyup", KeyupEvent);
    return () => document.removeEventListener("keyup", KeyupEvent);
  }, []);

  return (
    <div className={styles.layout}>
      <div className={styles.container}>
        <>{children}</>

        <div className={styles.credits}>
          <p className={Myriad.className}>
            Stworzone na stronie games.klalo.pl
          </p>
        </div>
      </div>
    </div>
  );
}
