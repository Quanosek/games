import Link from "next/link";

import styles from "./page.module.scss";
import Layout from "@/components/pageLayout";

export default function HomePage() {
  return (
    <Layout>
      <h1>Wybierz grę:</h1>

      <div className={styles.buttons}>
        <Link className="button" href="/quizy">
          <p>{`❔ Quizy`}</p>
        </Link>

        <Link className="button" href="/wisielec">
          <p>{`🪢 Wisielec`}</p>
        </Link>

        <Link className="button" href="/familiada">
          <p>{`💰 "Familiada"`}</p>
        </Link>

        <Link className="button disabled" href="/postaw-na-milion">
          <p>{`💵 "Postaw na milion"`}</p>
        </Link>
      </div>
    </Layout>
  );
}
