import Image from "next/image";
import { signIn } from "next-auth/react";

import styles from "@/styles/auth.module.scss";

export default function AuthCallbacks() {
  const authOptions = {
    callbackUrl: "/",
  };

  return (
    <div className={styles.callbacks}>
      <button title="Google" onClick={() => signIn("google", authOptions)}>
        <Image
          className="icon"
          alt="Google"
          src="/icons/google.svg"
          width={34}
          height={34}
        />
      </button>

      <button title="Facebook" onClick={() => signIn("facebook", authOptions)}>
        <Image
          className="icon"
          alt="Facebook"
          src="/icons/facebook.svg"
          width={34}
          height={34}
        />
      </button>

      <button title="Github" onClick={() => signIn("github", authOptions)}>
        <Image
          className="icon"
          alt="Github"
          src="/icons/github.svg"
          width={34}
          height={34}
        />
      </button>

      <button title="Discord" onClick={() => signIn("discord", authOptions)}>
        <Image
          className="icon"
          alt="Discord"
          src="/icons/discord.svg"
          width={34}
          height={34}
        />
      </button>
    </div>
  );
}
