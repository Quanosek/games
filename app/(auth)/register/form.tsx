"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import Callbacks from "../callbacks";
import PasswordInput from "../passwordInput";

import styles from "@/styles/auth.module.scss";

export default function LoginForm() {
  const router = useRouter();

  const { handleSubmit, register, reset } = useForm();
  const [submitting, setSubmitting] = useState(false);

  const formSubmit = async (values: any) => {
    try {
      setSubmitting(true);

      axios
        .post("/api/users", values)
        .then(() => {
          router.push("/login");
        })
        .catch((err) => {
          reset({ passwordConfirm: "" });
          alert(err.response.data.message);
        });
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

        <label>
          <p>Powtórz hasło</p>
          <PasswordInput function={register} name="passwordConfirm" />
        </label>

        <button
          className={styles.submitButton}
          type="submit"
          disabled={submitting}
        >
          <p>{submitting ? "Ładowanie..." : "Stwórz konto"}</p>
        </button>
      </form>

      <Callbacks />
    </div>
  );
}
