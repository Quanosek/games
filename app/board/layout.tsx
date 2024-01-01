"use client";

import { useEffect } from "react";

export default function BoardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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

  return <>{children}</>;
}
