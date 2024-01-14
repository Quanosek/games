import type { Metadata } from "next";

// milionerzy metadata
export const metadata: Metadata = {
  title: `"Milionerzy" - Pokój gier / klalo.pl`,
  description: `"Milionerzy" to teleturniej, w którym uczestnicy odpowiadają na pytania różnych poziomów trudności, aby zdobyć jak najwięcej pieniędzy, przy wykorzystaniu systemu pytań z czterema możliwymi odpowiedziami i rosnących kwot nagród.`,
  icons: {
    icon: "/favicons/money_with_wings.svg",
  },
};

export default function MilionerzyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
