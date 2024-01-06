import { Roboto } from "next/font/google";
import Link from "next/link";

const font = Roboto({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header>
        <section>
          <div>
            <Link className="headerTitle" href="/">
              <p>🎲 Pokój gier</p>
            </Link>
          </div>

          <Link href="https://www.klalo.pl/">www.klalo.pl</Link>
        </section>
      </header>

      <section>
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
            Wszelkie prawa zastrzeżone &#169; 2023 | domena{" "}
            <Link href="https://www.klalo.pl/" target="_blank">
              klalo.pl
            </Link>
          </p>
        </section>
      </footer>
    </>
  );
}
