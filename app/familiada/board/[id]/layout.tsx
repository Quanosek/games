"use client";

import { useEffect } from "react";

import styles from "./styles.module.scss";

import localFont from "next/font/local";
const dottedFont = localFont({
  src: "../../../../fonts/familiada_regular.woff2",
  display: "swap",
});

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
    <div className={dottedFont.className}>
      <p className={styles.credits}>Stworzone na stronie games.klalo.pl</p>
      <div className={styles.container}>{children}</div>
    </div>
  );
}
