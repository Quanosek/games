import Link from "next/link";

export function Header() {
  return (
    <header>
      <div>
        <Link className="headerTitle" href="/">
          <p>🎲 Pokój gier</p>
        </Link>
      </div>

      <Link href="https://www.klalo.pl/">www.klalo.pl</Link>
    </header>
  );
}

export function Footer() {
  return (
    <footer>
      <p>
        Stworzone z <span>💙</span> przez{" "}
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
    </footer>
  );
}
