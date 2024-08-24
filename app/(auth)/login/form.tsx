"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import Callbacks from "../callbacks";
import PasswordInput from "../passwordInput";

import styles from "@/styles/auth.module.scss";

export default function LoginForm() {
  const router = useRouter();

  const { handleSubmit, register, reset } = useForm();
  const [submitting, setSubmitting] = useState(false);

  const formSubmit = async ({ email, password }: any) => {
    try {
      setSubmitting(true);

      const response = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (response?.error) {
        reset({ password: "" });
        console.error(response.error);
      } else {
        router.push("/profile");
        router.refresh();
      }
    } catch (error) {
      console.error("Wystąpił nieoczekiwany błąd, spróbuj ponownie", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit(formSubmit)}>
        <label>
          <p>E-mail</p>
          <input {...register("email")} maxLength={100} required />
        </label>

        <label>
          <p>Hasło</p>
          <PasswordInput function={register} name="password" />
        </label>

        {/* <div className={styles.forgotPassword}>
          <button onClick={() => {}} type="button">
            <p>Nie pamiętasz hasła?</p>
          </button>
        </div> */}

        <button
          className={styles.submitButton}
          type="submit"
          disabled={submitting}
        >
          <p>{submitting ? "Ładowanie..." : "Zaloguj się"}</p>
        </button>
      </form>

      <Callbacks />
    </div>
  );
}
