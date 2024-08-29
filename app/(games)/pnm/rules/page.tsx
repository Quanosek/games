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
        <p style={{ opacity: "90%" }}>Już wkrótce</p>
      </div>
    </PageLayout>
  );
}
