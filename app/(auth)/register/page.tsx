import Link from "next/link";
import RegisterForm from "./form";

import styles from "./styles.module.scss";

export default function LoginPage() {
  return (
    <>
      <div className={styles.title}>
        <h1>Zarejestruj się</h1>
        <p>Stwórz konto, aby korzystać z możliwości zapisu gier</p>
      </div>

      <RegisterForm />

      <div className={styles.prompt}>
        <p>Posiadasz już konto?</p>
        <Link href="/login">Zaloguj się!</Link>
      </div>
    </>
  );
}
