"use client";

import Image from "next/image";
import { signIn } from "next-auth/react";
import PasswordInput from "@/components/passwordInput";

import styles from "./styles.module.scss";

export default function LoginForm() {
  return (
    <div className={styles.formContainer}>
      <form onSubmit={() => {}}>
        <label>
          <p>E-mail</p>
          <input name="email" type="email" />
        </label>

        <label>
          <p>Hasło</p>

          <div className={styles.passwordInput}>
            <PasswordInput />
          </div>
        </label>

        <label>
          <p>Powtórz hasło</p>

          <div className={styles.passwordInput}>
            <PasswordInput />
          </div>
        </label>

        <button className={styles.submitButton} type="submit">
          <p>Stwórz konto</p>
        </button>
      </form>

      <div className={styles.callbacks}>
        <button onClick={() => signIn("google")} title="Google">
          <Image
            className="icon"
            src="/icons/google.svg"
            alt="Google"
            width={34}
            height={34}
          />
        </button>

        <button onClick={() => signIn("facebook")} title="Facebook">
          <Image
            className="icon"
            src="/icons/facebook.svg"
            alt="Facebook"
            width={34}
            height={34}
          />
        </button>

        <button onClick={() => signIn("github")} title="Github">
          <Image
            className="icon"
            src="/icons/github.svg"
            alt="Github"
            width={34}
            height={34}
          />
        </button>

        <button onClick={() => signIn("discord")} title="Discord">
          <Image
            className="icon"
            src="/icons/discord.svg"
            alt="Discord"
            width={34}
            height={34}
          />
        </button>
      </div>
    </div>
  );
}
