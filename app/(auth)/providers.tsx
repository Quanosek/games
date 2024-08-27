import Image from "next/image";
import { signIn } from "next-auth/react";

import styles from "@/styles/auth.module.scss";

export default function AuthProviders({
  callbackUrl,
}: {
  callbackUrl: string;
}) {
  const authOptions = {
    callbackUrl,
  };

  return (
    <div className={styles.providers}>
      <button
        title="Google"
        onClick={async () => await signIn("google", authOptions)}
      >
        <Image
          className="icon"
          alt="Google"
          src="/icons/google.svg"
          width={34}
          height={34}
        />
      </button>

      <button
        title="Facebook"
        onClick={async () => await signIn("facebook", authOptions)}
      >
        <Image
          className="icon"
          alt="Facebook"
          src="/icons/facebook.svg"
          width={34}
          height={34}
        />
      </button>

      <button
        title="Github"
        onClick={async () => await signIn("github", authOptions)}
      >
        <Image
          className="icon"
          alt="Github"
          src="/icons/github.svg"
          width={34}
          height={34}
        />
      </button>

      <button
        title="Discord"
        onClick={async () => await signIn("discord", authOptions)}
      >
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
