// import Link from "next/link";
import LoginForm from "./form";

import styles from "./styles.module.scss";

export default function LoginPage() {
  return (
    <>
      <div className={styles.title}>
        <h1>Witamy ponownie</h1>
        {/* <p>Wpisz swoje dane, aby kontynuować</p> */}
      </div>

      <LoginForm />

      {/* <div className={styles.prompt}>
        <p>Nie posiadasz konta?</p>
        <Link href="/register">Zarejestruj się!</Link>
      </div> */}
    </>
  );
}
