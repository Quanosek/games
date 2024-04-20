import Image from "next/image";
import Link from "next/link";

import styles from "./page.module.scss";
import Layout from "@/components/pageLayout";

export default function HomePage() {
  return (
    <Layout>
      <h1>Wybierz grę:</h1>

      <div className={styles.buttons}>
        <Link className="button" href="/quizy">
          <Image
            alt="icon"
            src="/favicons/white_question_mark.svg"
            width={22}
            height={22}
            draggable={false}
          />
          <p>Quizy</p>
        </Link>

        <Link className="button" href="/wisielec">
          <Image
            alt="icon"
            src="/favicons/knot.svg"
            width={22}
            height={22}
            draggable={false}
          />
          <p>Wisielec</p>
        </Link>

        <Link className="button" href="/familiada">
          <Image
            alt="icon"
            src="/favicons/money_bag.svg"
            width={22}
            height={22}
            draggable={false}
          />
          <p>{`"Familiada"`}</p>
        </Link>

        <Link className="button disabled" href="/postaw-na-milion">
          <Image
            alt="icon"
            src="/favicons/dollar_banknote.svg"
            width={22}
            height={22}
            draggable={false}
          />
          <p>{`"Postaw na milion"`}</p>
        </Link>
      </div>
    </Layout>
  );
}
