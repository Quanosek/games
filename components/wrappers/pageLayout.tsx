import Link from "next/link";

import Analytics from "@/components/analytics";

export default function PageLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {process.env.NODE_ENV !== "development" && <Analytics />}

      <section>
        <div className="mobileView">
          <p>
            Wybrana strona nie jest dostępna
            <br />
            dla urządzeń mobilnych.
          </p>
        </div>

        <main>{children}</main>
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
