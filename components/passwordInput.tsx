import Image from "next/image";
import { useState } from "react";

export default function PasswordInputComponent() {
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <>
      <input name="password" type={passwordVisible ? "text" : "password"} />
      <button
        tabIndex={-1}
        type="button"
        name="toggle"
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
    </>
  );
}
