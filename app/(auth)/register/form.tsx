"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import toast from "react-hot-toast";

import { RegisterUserInput, registerUserSchema } from "@/lib/zod";
import PasswordInput from "@/components/passwordInput";
import Providers from "../providers";

import styles from "@/styles/auth.module.scss";

export default function RegisterForm() {
  const router = useRouter();

  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<RegisterUserInput>({
    resolver: zodResolver(registerUserSchema),
  });

  const [submitting, setSubmitting] = useState(false);

  const formSubmit = async (values: RegisterUserInput) => {
    try {
      setSubmitting(true);

      const { passwordConfirm, ...params } = values;
      await axios
        .post("/api/user", params)
        .then(async () => {
          toast.success("Pomyślnie utworzono nowe konto");
          await signIn("credentials", { ...params, redirect: false });
          router.push("/profile");
          router.refresh();
        })
        .catch((error) => {
          reset({ passwordConfirm: "" });
          toast.error(error.response.data.message);
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

      <Providers callbackUrl="/profile" />
    </div>
  );
}
