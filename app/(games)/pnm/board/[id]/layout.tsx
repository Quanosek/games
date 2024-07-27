"use client";

import { ReactNode, useEffect } from "react";

import styles from "./styles.module.scss";

import localFont from "next/font/local";
const Myriad = localFont({
  src: [
    {
      path: "../../../../fonts/myriad_pro_semibold.woff2",
      weight: "normal",
    },
    {
      path: "../../../../fonts/myriad_pro_bold_cond.woff2",
      weight: "bold",
    },
  ],

  style: "normal",
  display: "swap",
});

export default function BoardLayout({ children }: { children: ReactNode }) {
  useEffect(() => {
    // keyboard interactions
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
    <div className={Myriad.className}>
      <div className={styles.container}>
        <div className={styles.board}>{children}</div>

        <p className={styles.credits}>Stworzone na stronie games.klalo.pl</p>
      </div>
    </div>
  );
}
