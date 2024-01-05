import { Roboto } from "next/font/google";
import type { Metadata } from "next";

const font = Roboto({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

// /familiada metadata
export const metadata: Metadata = {
  title: "Familiada - Pokój gier / klalo.pl",
  description: "Rodzinna gra telewizyjna - Familiada",
};

export default function FamiliadaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className={font.className}>{children}</div>;
}
