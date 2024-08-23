import type { Metadata } from "next";

// wisielec metadata
export const metadata: Metadata = {
  title: "Wisielec - Pokój gier / klalo.pl",
  description:
    "Znana i lubiana gra w odgadywanie wyrazu po pojedynczych literach, gdy podana litera nie znajduje się w haśle wisielec jest coraz bliżej końca.",
  icons: {
    icon: "/favicons/knot.svg",
  },
};

export default function WisielecLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
