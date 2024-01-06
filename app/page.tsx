import Link from "next/link";

import styles from "./page.module.scss";
import Layout from "@/components/pageLayout";

export default function HomePage() {
  return (
    <Layout>
      <h1 className={styles.title}>Wybierz grę:</h1>

      <div className={styles.buttons}>
        <Link className="button disabled" href="/quizy">
          <p>❔ Quizy</p>
        </Link>

        <Link className="button" href="/familiada">
          <p>{`💰 "Familiada"`}</p>
        </Link>

        <Link className="button disabled" href="/milionerzy">
          <p>{`💸 "Milionerzy"`}</p>
        </Link>
      </div>
    </Layout>
  );
}
