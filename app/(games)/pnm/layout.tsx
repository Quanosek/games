import type { Metadata } from "next";
import { ReactNode } from "react";

// pnm metadata
export const metadata: Metadata = {
  title: `"Postaw na milion" - Pokój gier / klalo.pl`,
  description: `Teleturniej "Postaw na milion" polega na odpowiadaniu przez zawodnika na pytania z różnych dziedzin. W każdej rundzie uczestnik wybiera kategorię i przydziela pulę pieniędzy do wybranych odpowiedzi. Celem gry jest utrzymanie jak największej kwoty, zaczynając od miliona, aż do końca gry.`,
  icons: {
    icon: "/favicons/dollar_banknote.svg",
  },
};

export default function PnmLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
