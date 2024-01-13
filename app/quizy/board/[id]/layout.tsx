"use client";

import { useEffect } from "react";

import styles from "./style.module.scss";

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

  return <div className={styles.container}>{children}</div>;
}
