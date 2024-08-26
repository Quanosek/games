import Image from "next/image";
import { auth } from "@/lib/auth";
import UserData from "./userData";
import ActionButtons from "./actionButtons";

import styles from "@/styles/dashboard.module.scss";

export default async function ProfilePage() {
  const session = await auth();
  const user = session?.user;

  return (
    <div className={styles.profileContainer}>
      <h1>Twój profil</h1>

      <div className={styles.profileLayout}>
        <div className={styles.flex}>
          <Image
            alt=""
            src={user?.image ?? ""}
            width={140}
            height={140}
            draggable={false}
          />

          <div className={styles.info}>
            <p>ID: {user?.id}</p>
            {user?.role === "admin" && <span>Administrator</span>}
          </div>
        </div>

        <hr />

        <div>
          <h2>Uzupełnij swoje dane:</h2>
          <UserData user={user} />
        </div>

        <hr />

        <div>
          <h2>Operacje na koncie:</h2>
          <ActionButtons user={user} />
        </div>
      </div>
    </div>
  );
}
