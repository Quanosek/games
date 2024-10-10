"use client";

import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

export interface Params {
  userId: string | undefined;
  type: string;
  data: string;
}

export default function saveFormComponent({ userId, type, data }: Params) {
  const router = useRouter();

  if (!userId) return null;

  const loadDb = async () => {
    await axios
      .get(`/api/game`, { params: { userId, type } })
      .then((response) => {
        toast.success("Pomyślnie wczytano grę z twojego konta");
        localStorage.setItem(type, response.data.result.data);
        router.push(`/${type}`);
        router.refresh();
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  const uploadDb = async () => {
    await axios
      .post("/api/game", { userId, type, data })
      .then(() => {
        toast.success("Pomyślnie zapisano grę na twoim koncie");
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  return (
    <div style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}>
      <button onClick={loadDb}>
        <p>Wczytaj grę</p>
      </button>

      <button onClick={uploadDb}>
        <p>Zapisz w profilu</p>
      </button>
    </div>
  );
}
