import type { Metadata, Viewport } from "next";
import Image from "next/image";
import Link from "next/link";
import { Toaster } from "react-hot-toast";
import { auth } from "@/lib/auth";
import Analytics from "@/components/analytics";
import LoginButton from "@/components/loginButton";
import Wrapper from "@/components/wrapper";

import "the-new-css-reset/css/reset.css";
import "@/styles/globals.scss";
import { Nexa } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "Pokój gier / klalo.pl",
  description:
    "Przeglądarkowe wersje popularnych gier towarzyskich i telewizyjnych teleturniejów",

  icons: {
    icon: ["/favicons/game_die.ico", "/favicons/game_die.svg"],
    apple: "/favicons/game_die.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html lang="pl" className={Nexa.className}>
      <body>
        {process.env.NODE_ENV !== "development" && <Analytics />}

        <Wrapper>
          <header>
            <section>
              <div className="navigation">
                <Link href="/">
                  <Image
                    alt="🎲"
                    src="/favicons/game_die.svg"
                    width={28}
                    height={28}
                    draggable={false}
                    priority
                  />
                  <h1>Pokój gier</h1>
                </Link>

                <Link href="/info">
                  <p>Informacje</p>
                </Link>

                <Link
                  href="https://buycoffee.to/kubaklalo/"
                  target="_blank"
                  className="supportButton"
                >
                  <p>Wesprzyj</p>
                </Link>
              </div>

              <LoginButton user={session?.user} />
            </section>
          </header>

          <section>
            <div className="mobileView">
              <p>
                Wybrana strona nie jest dostępna
                <br />
                dla urządzeń mobilnych.
              </p>
            </div>

            {children}
          </section>

          <footer>
            <section>
              <p>
                Stworzone z 💙 przez{" "}
                <Link href="https://github.com/quanosek" target="_blank">
                  Jakuba Kłało
                </Link>
              </p>

              <p>
                Wszelkie prawa zastrzeżone &#169; 2024 | domena{" "}
                <Link href="https://www.klalo.pl/" target="_blank">
                  klalo.pl
                </Link>
              </p>
            </section>
          </footer>
        </Wrapper>

        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "#2a2a2a",
              color: "#f2f2f2",
            },
          }}
        />
      </body>
    </html>
  );
}
