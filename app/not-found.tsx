"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

import PageLayout from "@/components/wrappers/pageLayout";

export default function NotFoundPage() {
  const router = useRouter();
  const [seconds, setSeconds] = useState(10); // 10 seconds

  useEffect(() => {
    const counter = setInterval(() => {
      setSeconds((prevSeconds: number) => prevSeconds - 1);
      if (seconds === 1) router.push("/");
    }, 1000);

    return () => clearInterval(counter);
  }, [router, seconds]);

  return (
    <PageLayout>
      <h1>Nie znaleziono strony!</h1>

      <Link className="button" href="/">
        🏠 Powrót na stronę główną <span>[{seconds}]</span>
      </Link>
    </PageLayout>
  );
}
