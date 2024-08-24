import { auth } from "@/lib/auth";

// import styles from "@/styles/dashboard.module.scss";

export default async function ProfilePage() {
  const session = await auth();
  const user = session?.user;

  return (
    <>
      <h1>Twój profil</h1>

      {user?.role === "admin" && <p>Jesteś administratorem {";D"}</p>}

      {/* <pre>
        <code>{JSON.stringify(user, null, "  ")}</code>
      </pre> */}

      {!user?.name && <p>Dodaj nazwę profilu</p>}
      {!user?.username && <p>Dodaj wyświetlaną nazwę (pseudonim)</p>}
      {!user?.password && <p>Utwórz hasło</p>}
      {!user?.image && <p>Dodaj zdjęcie profilowe</p>}
    </>
  );
}
