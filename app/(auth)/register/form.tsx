"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterUserInput, registerUserSchema } from "@/lib/zod";
import axios from "axios";
import toast from "react-hot-toast";
import Callbacks from "../callbacks";
import PasswordInput from "../passwordInput";

import styles from "@/styles/auth.module.scss";

export default function RegisterForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<RegisterUserInput>({
    resolver: zodResolver(registerUserSchema),
  });

  const formSubmit = (values: RegisterUserInput) => {
    try {
      setSubmitting(true);

      axios
        .post("/api/users", values)
        .then(() => {
          toast.success("Konto zostało utworzone, zaloguj się");
          router.push("/login");
        })
        .catch((err) => {
          reset({ passwordConfirm: "" });
          toast.error(err.response.data.message);
        });
    } catch (error) {
      toast.error("Wystąpił nieoczekiwany błąd, spróbuj ponownie");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit(formSubmit)}>
        <label>
          <p>E-mail</p>
          <input {...register("email")} autoComplete="email" maxLength={100} />
          {errors.email && <span>{errors.email.message}</span>}
        </label>

        <label>
          <p>Hasło</p>
          <PasswordInput
            function={register}
            name="password"
            autocomplete="current-password"
          />
          {errors.password && <span>{errors.password.message}</span>}
        </label>

        <label>
          <p>Potwierdź hasło</p>
          <PasswordInput
            function={register}
            name="passwordConfirm"
            autocomplete="off"
          />
          {errors.passwordConfirm && (
            <span>{errors.passwordConfirm.message}</span>
          )}
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
