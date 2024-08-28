import Image from "next/image";
import Link from "next/link";

import PageLayout from "@/components/wrappers/pageLayout";

import styles from "@/styles/home.module.scss";

export default function HomePage() {
  return (
    <PageLayout>
      <h1>Wybierz grę</h1>

      <div className={styles.buttons}>
        <Link href="/quizy">
          <Image
            alt="❔"
            src="/favicons/white_question_mark.svg"
            width={22}
            height={22}
            draggable={false}
          />
          <p>Quizy</p>
        </Link>

        <Link href="/wisielec">
          <Image
            alt="🪢"
            src="/favicons/knot.svg"
            width={22}
            height={22}
            draggable={false}
          />
          <p>Wisielec</p>
        </Link>

        <Link href="/familiada">
          <Image
            alt="💰"
            src="/favicons/money_bag.svg"
            width={22}
            height={22}
            draggable={false}
          />
          <p>{`"Familiada"`}</p>
        </Link>

        <Link tabIndex={-1} className="disabled" href="/pnm">
          <Image
            alt="💸"
            src="/favicons/dollar_banknote.svg"
            width={22}
            height={22}
            draggable={false}
          />
          <p>{`"Postaw na milion"`}</p>
        </Link>
      </div>
    </PageLayout>
  );
}
