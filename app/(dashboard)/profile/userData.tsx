"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import toast from "react-hot-toast";

import { userDataInput, userDataSchema } from "@/lib/zod";
import PasswordInput from "@/components/passwordInput";

import styles from "@/styles/dashboard.module.scss";

export default function UserData({ user }: { user: User | undefined }) {
  const { update } = useSession();
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

      const { passwordConfirm: _, ...params } = values;
      if (!params.password) delete params.password;

      axios
        .put("/api/user", { id: user?.id, ...params })
        .then(async () => {
          toast.success("Dane konta zostały zaktualizowane");

          await update(params).then(() => {
            reset({ password: "", passwordConfirm: "" });
            router.push("/profile");
            router.refresh();
          });
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
    <form className={styles.userData} onSubmit={handleSubmit(formSubmit)}>
      <div>
        <label>
          <p>Imię i nazwisko</p>
          <input
            {...register("name")}
            autoComplete="name"
            maxLength={101}
            defaultValue={user.name ?? ""}
          />
          {errors.name && <span>{errors.name.message}</span>}
        </label>

        <label>
          <p>Nazwa użytkownika</p>
          <input
            {...register("username")}
            autoComplete="username"
            maxLength={33}
            defaultValue={user.username ?? ""}
          />
          {errors.username && <span>{errors.username.message}</span>}
        </label>
      </div>

      <label>
        <p>E-mail</p>
        <input
          className={styles.locked}
          name="email"
          autoComplete="email"
          maxLength={100}
          defaultValue={user.email ?? ""}
          disabled
        />
      </label>

      <label>
        <p>{user.password ? "Nowe hasło" : "Utwórz hasło"}</p>
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
        <p>{submitting ? "Ładowanie..." : "Zapisz dane"}</p>
      </button>
    </form>
  );
}
