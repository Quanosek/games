import Image from "next/image";
import Link from "next/link";

import { auth } from "@/lib/auth";
import ActionButtons from "./actionButtons";
import UserData from "./userData";

import styles from "@/styles/dashboard.module.scss";

export default async function ProfilePage() {
  const session = await auth();
  const user = session?.user;

  return (
    <div className={styles.profileContainer}>
      <h1>Twój profil</h1>

      <div className={styles.profileLayout}>
        <div className={styles.userInfo}>
          <Image
            alt=""
            src={user?.image ?? "/icons/profile.svg"}
            width={150}
            height={150}
            draggable={false}
          />

          <div className={styles.params}>
            <div>
              <p className={styles.id}>ID: {user?.id}</p>

              {user?.role === "admin" && (
                <Link className={styles.badge} href={"/admin"}>
                  <p>Administrator</p>
                </Link>
              )}
            </div>

            <Link className={styles.savedButton} href={"/saved"}>
              <p>Zapisane gry [0]</p>
            </Link>
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
