import Image from "next/image";
import Link from "next/link";

import { auth } from "@/lib/auth";
import { Role } from "@/lib/enums";
import AccountProviders from "./accountProviders";
import ActionButtons from "./actionButtons";
import SavedButton from "./savedButton";
import UserData from "./userData";

import styles from "@/styles/dashboard.module.scss";

export default async function ProfilePage() {
  const session = await auth();
  const user = session?.user;
  const admin = user?.role === Role.ADMIN;

  return (
    <div className={styles.profileContainer}>
      <h1>Twój profil</h1>

      <div className={styles.profileLayout}>
        <div className={styles.accountInfo}>
          <Image
            style={{
              borderColor: admin ? "var(--gold)" : "var(--white)",
            }}
            alt="profile_picture"
            src={user?.image ?? "/icons/profile.svg"}
            width={150}
            height={150}
            draggable={false}
          />

          <div className={styles.params}>
            <div>
              {admin && (
                <Link className={styles.roleBadge} href={"/admin"}>
                  <p>Administrator</p>
                </Link>
              )}
            </div>

            <SavedButton user={user} />
          </div>
        </div>

        <hr />

        <div>
          <h2>Uzupełnij swoje dane</h2>
          <UserData user={user} />
        </div>

        <hr />

        <div>
          <h2>Połączone konta</h2>
          <AccountProviders user={user} />
        </div>

        <hr />

        <div>
          <h2>Operacje na koncie</h2>
          <ActionButtons user={user} />
        </div>
      </div>
    </div>
  );
}
