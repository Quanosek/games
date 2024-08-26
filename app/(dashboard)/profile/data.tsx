"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { User } from "next-auth";
import { signOut } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userDataInput, userDataSchema } from "@/lib/zod";
import axios from "axios";
import toast from "react-hot-toast";
import PasswordInput from "@/components/passwordInput";

import styles from "@/styles/dashboard.module.scss";

export default function Data({ user }: { user: User | undefined }) {
  const router = useRouter();

  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<userDataInput>({
    resolver: zodResolver(userDataSchema),
  });

  const [submitting, setSubmitting] = useState(false);

  const formSubmit = (values: userDataInput) => {
    try {
      setSubmitting(true);

      const {
        passwordConfirm,
        ...params
      }: { [key: string]: string | undefined } = values;

      if (!params.password) delete params.password;
      const data = { id: user?.id, ...params };

      axios
        .post("/api/user/data", data)
        .then(async () => {
          await signOut({ redirect: false });
          toast.success("Dane zostały zaktualizowane, zaloguj się ponownie");
          router.push("/login");
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

  if (!user) return null;

  return (
    <form className={styles.dataForm} onSubmit={handleSubmit(formSubmit)}>
      <div>
        <label>
          <p>Nazwa konta</p>
          <input
            {...register("name")}
            autoComplete="name"
            maxLength={101}
            defaultValue={user.name ?? ""}
          />
          {errors.name && <span>{errors.name.message}</span>}
        </label>

        <label>
          <p>Wyświetlana nazwa</p>
          <input
            {...register("username")}
            autoComplete="username"
            maxLength={33}
            defaultValue={user.username ?? ""}
          />
          {errors.username && <span>{errors.username.message}</span>}
        </label>
      </div>

      <label className={styles.locked}>
        <p>E-mail</p>
        <input
          name="email"
          autoComplete="email"
          maxLength={100}
          defaultValue={user.email ?? ""}
          disabled
        />
      </label>

      <label>
        <p>{user.password ? "Nowe hasło" : "Hasło"}</p>
        <PasswordInput
          function={register}
          name="password"
          autocomplete="new-password"
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
        {submitting ? "Ładowanie..." : "Zapisz dane"}
      </button>
    </form>
  );
}
