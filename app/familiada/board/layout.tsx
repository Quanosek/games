"use client";

import { useEffect } from "react";

export default function BoardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // keyboard navigation
  useEffect(() => {
    function areApproximatelyEqual(
      value1: number,
      value2: number,
      tolerance: number
    ) {
      return Math.abs(value1 - value2) <= tolerance;
    }

    // Example usage
    const value1 = 5;
    const value2 = 5.1;
    const tolerance = 0.1;

    if (areApproximatelyEqual(value1, value2, tolerance)) {
      console.log("Values are approximately equal.");
    } else {
      console.log("Values are not equal.");
    }

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
