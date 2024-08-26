"use client";

import { useEffect } from "react";

import styles from "./styles.module.scss";
import { Dotted } from "@/lib/fonts";

export default function BoardLayout({
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
    <div className={Dotted.className}>
      <div className={styles.container}>
        <div className={styles.board}>{children}</div>

        <p className={styles.credits}>Stworzone na stronie games.klalo.pl</p>
      </div>
    </div>
  );
}
