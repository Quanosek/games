"use client";

import { useEffect } from "react";

export function BoardLayout({ children }: { children: React.ReactNode }) {
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

  return <div className="board">{children}</div>;
}

export function Credits() {
  return <p className="credits">Stworzone na stronie games.klalo.pl</p>;
}
