import Link from "next/link";

import Analytics from "@/components/analytics";

import { Roboto } from "next/font/google";
const font = Roboto({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {process.env.NODE_ENV !== "development" && <Analytics />}

      <header>
        <section>
          <div>
            <Link className="headerTitle" href="/">
              <p>🎲 Pokój gier</p>
            </Link>
          </div>

          <div>
            <Link href="https://buycoffee.to/kubaklalo/" target="_blank">
              Wesprzyj
            </Link>

            <Link href="https://www.klalo.pl/" target="_blank">
              www.klalo.pl
            </Link>
          </div>
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

        <main className={font.className}>{children}</main>
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
    </>
  );
}
