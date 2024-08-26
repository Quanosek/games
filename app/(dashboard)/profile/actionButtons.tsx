"use client";

import { useState } from "react";
import { User } from "next-auth";
import { signOut } from "next-auth/react";
import axios from "axios";
import toast from "react-hot-toast";

import styles from "@/styles/dashboard.module.scss";

export default function ActionButtons({ user }: { user: User | undefined }) {
  const [submitting, setSubmitting] = useState(false);

  const deleteAccount = async () => {
    try {
      setSubmitting(true);

      if (!confirm("Czy na pewno chcesz usunąć konto?")) return;

      axios
        .delete("/api/user", { data: JSON.stringify({ id: user?.id }) })
        .then(async () => await signOut())
        .catch((error) => toast.error(error.response.data.message));
    } catch (error) {
      toast.error("Wystąpił nieoczekiwany błąd, spróbuj ponownie");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.actionButtons}>
      <button type="button" onClick={() => signOut()}>
        <p>Wyloguj się</p>
      </button>

      <button type="button" onClick={deleteAccount} disabled={submitting}>
        <p>{submitting ? "Ładowanie..." : "Usuń konto"}</p>
      </button>
    </div>
  );
}
