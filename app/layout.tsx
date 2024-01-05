import localFont from "next/font/local";
import type { Metadata, Viewport } from "next";

import "the-new-css-reset/css/reset.css";
import "./globals.scss";

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
    icon: "/favicon.ico",
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
      <body>{children}</body>
    </html>
  );
}
