import type { Metadata } from "next";
import { ReactNode } from "react";

// familiada metadata
export const metadata: Metadata = {
  title: `"Familiada" - Pokój gier / klalo.pl`,
  description: `"Familiada" to teleturniej, w którym dwie drużyny rywalizują między sobą, odgadując najpopularniejsze odpowiedzi na pytania z ankiet, aby zdobyć punkty.`,
  icons: {
    icon: "/favicons/money_bag.svg",
  },
};

export default function FamiliadaLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
