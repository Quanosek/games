"use client";

import Image from "next/image";
// import { useState } from "react";
import { signIn } from "next-auth/react";
import styles from "./styles.module.scss";

export default function LoginForm() {
  // const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <div className={styles.formContainer}>
      {/* <form>
        <label>
          <p>E-mail</p>

          <input type="email" name="email" required />
        </label>

        <label>
          <p>Hasło</p>

          <div className={styles.passwordInput}>
            <input type={passwordVisible ? "text" : "password"} required />
            <button
              tabIndex={-1}
              type="button"
              name="toggle"
              className={styles.eyeIcon}
              onClick={() => setPasswordVisible(!passwordVisible)}
            >
              <Image
                className="icon"
                src={`/icons/${passwordVisible ? "eye" : "eye_slash"}.svg`}
                alt=""
                height={24}
                width={24}
                draggable={false}
                priority
              />
            </button>
          </div>
        </label>

        <div className={styles.forgotPassword}>
          <button onClick={() => {}} type="button" className="disabled">
            <p>Zapomniałeś hasło?</p>
          </button>
        </div>

        <button className={styles.submitButton} type="submit">
          <p>Zaloguj się</p>
        </button>
      </form> */}

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
