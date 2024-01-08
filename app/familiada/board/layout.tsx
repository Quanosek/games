"use client";

import { useEffect } from "react";

import styles from "./layout.module.scss";

export default function BoardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // keyboard navigation
  useEffect(() => {
    const KeyupEvent = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };

    document.addEventListener("keyup", KeyupEvent);
    return () => {
      document.removeEventListener("keyup", KeyupEvent);
    };
  }, []);

  return <div className={styles.container}>{children}</div>;
}
