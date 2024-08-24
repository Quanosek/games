import Image from "next/image";
import { signIn } from "next-auth/react";

import styles from "@/styles/auth.module.scss";

export default function Callbacks() {
  const authOptions = {
    callbackUrl: "/profile",
  };

  return (
    <div className={styles.callbacks}>
      <button title="Google" onClick={() => signIn("google", authOptions)}>
        <Image
          className="icon"
          src="/icons/google.svg"
          alt="Google"
          width={34}
          height={34}
        />
      </button>

      <button title="Facebook" onClick={() => signIn("facebook", authOptions)}>
        <Image
          className="icon"
          src="/icons/facebook.svg"
          alt="Facebook"
          width={34}
          height={34}
        />
      </button>

      <button title="Github" onClick={() => signIn("github", authOptions)}>
        <Image
          className="icon"
          src="/icons/github.svg"
          alt="Github"
          width={34}
          height={34}
        />
      </button>

      <button title="Discord" onClick={() => signIn("discord", authOptions)}>
        <Image
          className="icon"
          src="/icons/discord.svg"
          alt="Discord"
          width={34}
          height={34}
        />
      </button>
    </div>
  );
}
