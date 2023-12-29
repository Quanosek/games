import type { Metadata, Viewport } from "next";

// import "the-new-css-reset/css/reset.css";
import "./globals.scss";

export const metadata: Metadata = {
  title: "Familiada",
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
    <html lang="pl">
      <body>{children}</body>
    </html>
  );
}
