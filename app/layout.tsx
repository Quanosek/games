import localFont from "next/font/local";
import type { Metadata, Viewport } from "next";

import "the-new-css-reset/css/reset.css";
import "./globals.scss";

import Analytics from "@/components/analytics";

// global font-face
const Nexa = localFont({
  src: [
    {
      path: "../fonts/nexa_light.woff2",
      weight: "200",
    },
    {
      path: "../fonts/nexa_regular.woff2",
      weight: "400",
    },
    {
      path: "../fonts/nexa_bold.woff2",
      weight: "800",
    },
  ],

  style: "normal",
  display: "swap",
});

// global metadata (default values)
export const metadata: Metadata = {
  title: "Pokój gier / klalo.pl",
  description:
    "Przeglądarkowe wersje znanych gier towarzyskich i rodzinnych gier telewizyjnych przeznaczone do gry w większym gronie osób.",
  icons: {
    icon: "/favicons/game_die.svg",
  },
};

// global viewport
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "black",
};

// app project layout
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl" className={Nexa.className}>
      {process.env.NODE_ENV !== "development" && <Analytics />}
      <body>{children}</body>
    </html>
  );
}
