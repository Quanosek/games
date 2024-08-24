import Image from "next/image";
import { useState } from "react";

import styles from "@/styles/auth.module.scss";

export default function AuthPasswordInput({
  function: register,
  name,
}: {
  function: Function;
  name: string;
}) {
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <div className={styles.passwordInput}>
      <input
        {...register(name)}
        type={passwordVisible ? "text" : "password"}
        maxLength={64}
        required
      />

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
        />
      </button>
    </div>
  );
}
