import type { Metadata } from "next";

// milionerzy metadata
export const metadata: Metadata = {
  title: "Quizy - Pokój gier / klalo.pl",
  description:
    "Quizy to forma konkursu, w którym uczestnicy odpowiadają na pytania z różnych dziedzin w celu zdobycia punktów, przy użyciu zazwyczaj krótkich odpowiedzi lub wyboru spośród kilku opcji.",
  icons: {
    icon: "/favicon/white_question_mark.svg",
  },
};

export default function QuizyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
