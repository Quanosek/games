import Link from "next/link";
import LoginForm from "./form";

import styles from "./styles.module.scss";

export default function LoginPage() {
  return (
    <>
      <div className={styles.title}>
        <h1>Zaloguj się</h1>
        <p>Wpisz swoje dane, aby kontynuować</p>
      </div>

      <LoginForm />

      <div className={styles.signUp}>
        <p>Nie posiadasz konta?</p>
        <Link href="/register" className="disabled">
          Zarejestruj się!
        </Link>
      </div>
    </>
  );
}
