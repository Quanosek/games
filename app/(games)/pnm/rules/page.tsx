import Link from "next/link";
import Image from "next/image";
import PageLayout from "@/components/wrappers/pageLayout";

import styles from "../styles.module.scss";

import { Nunito_Sans } from "next/font/google";
const Nunito = Nunito_Sans({
  subsets: ["latin"],
  display: "swap",
});

export default function PnmRulesPage() {
  return (
    <PageLayout>
      <div className={styles.rulesTitle}>
        <Link href="/pnm" className={styles.backButton}>
          <Image
            style={{ rotate: "-90deg" }}
            className="icon"
            src="/icons/arrow.svg"
            alt="w lewo"
            width={25}
            height={25}
          />
          <p>Powrót</p>
        </Link>

        <h1>Zasady gry</h1>
      </div>

      <div className={`${Nunito.className} ${styles.rulesContainer}`}>
        <p>
          Po uruchomieniu planszy etapu wybór kategorii możliwy jest przez
          kliknięcie w odpowiednią nazwę lub wciśnięcie odpowiednio klawiszy{" "}
          <span>[1]</span> lub <span>[2]</span>. Następnie po pojawieniu się
          wszystkich możliwych odpowiedzi należy włączyć odliczanie czasu przez
          wciśnięcie klawisza <span>[Spacji]</span>. Pieniądze przydziela się do
          odpowiedzi przez wciskanie lub wciśnięcie i przytrzymanie przycisków -
          i + na ekranie. Po zakończeniu odliczania czasu, aby wyświetlić
          poprawną odpowiedź (uruchomić zapadnie) należy ponownie wcisnąć
          klawisz <span>[Spacji]</span> i poczekać na animację.
        </p>

        <p style={{ opacity: "90%" }}>Więcej zasad już wkrótce...</p>
      </div>
    </PageLayout>
  );
}
