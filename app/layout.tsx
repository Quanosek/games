import { Roboto } from "next/font/google";
import type { Metadata, Viewport } from "next";

import "the-new-css-reset/css/reset.css";
import "./globals.scss";

const font = Roboto({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Familiada / klalo.pl",
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "black",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl" className={font.className}>
      <body>{children}</body>
    </html>
  );
}
