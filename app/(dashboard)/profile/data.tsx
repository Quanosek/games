"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import PasswordInput from "@/components/passwordInput";

import styles from "@/styles/dashboard.module.scss";

export default function Data({ user }: any) {
  const [submitting, setSubmitting] = useState(false);
  const { handleSubmit, register } = useForm();

  const formSubmit = (values: any) => {
    try {
      setSubmitting(true);
      console.log(values);
    } catch (error) {
      toast.error("Wystąpił nieoczekiwany błąd, spróbuj ponownie");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className={styles.dataForm} onSubmit={handleSubmit(formSubmit)}>
      <div>
        <label>
          <p>Nazwa konta</p>
          <input
            {...register("name")}
            autoComplete="name"
            maxLength={250}
            defaultValue={user.name}
          />
        </label>

        <label>
          <p>Wyświetlana nazwa</p>
          <input
            {...register("username")}
            autoComplete="username"
            maxLength={200}
            defaultValue={user.username}
          />
        </label>
      </div>

      <label className={styles.locked}>
        <p>E-mail</p>
        <input
          {...register("email")}
          autoComplete="email"
          maxLength={150}
          defaultValue={user.email}
        />
      </label>

      <label>
        <p>{user.password ? "Nowe hasło" : "Hasło"}</p>
        <PasswordInput
          function={register}
          name="passwordNew"
          autocomplete="new-password"
        />
      </label>

      <label>
        <p>Potwierdź hasło</p>
        <PasswordInput
          function={register}
          name="passwordConfirm"
          autocomplete="off"
        />
      </label>

      {user.password && (
        <label>
          <p>Obecnie używane hasło</p>
          <PasswordInput
            function={register}
            name="password"
            autocomplete="current-password"
          />
        </label>
      )}

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
