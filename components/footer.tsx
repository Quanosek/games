import Link from "next/link";

export default function Footer() {
  return (
    <footer>
      <p>
        Stworzone z <span>💛</span> przez{" "}
        <Link href="https://github.com/quanosek" target="_blank">
          Jakuba Kłało
        </Link>{" "}
        &#169; 2023 | domena{" "}
        <Link href="https://www.klalo.pl/" target="_blank">
          klalo.pl
        </Link>
      </p>

      <p>
        Na podstawie i z wykorzystaniem zasad programu telewizyjnego{" "}
        <Link href="https://pl.wikipedia.org/wiki/Familiada" target="_blank">
          {`"Familiada"`}
        </Link>{" "}
        emitowana na kanale{" "}
        <Link href="https://pl.wikipedia.org/wiki/TVP2" target="_blank">
          TVP2
        </Link>
        . Wszystkie grafiki i znaki towarowe należą do ich prawnych właścicieli.
      </p>
    </footer>
  );
}
