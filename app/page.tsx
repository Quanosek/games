"use client";

import styles from "./page.module.scss";

export default function Home() {
  const handleSubmit = (e: any) => {
    e.preventDefault();

    //
  };

  return (
    <main>
      <h1>Familiada</h1>

      <form className={styles.list} onSubmit={handleSubmit}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div className={styles.answers} key={i}>
            <div className={styles.text}>
              <p>Odpowiedź {i + 1}:</p>
              <input
                id={`answer-${i}`}
                type="text"
                autoComplete="off"
                maxLength={32}
                onChange={(e) => {
                  // allow only letters, spaces and dots
                  const filtered = e.target.value.replace(/[^a-zA-Z\s.]/g, "");
                  e.target.value = filtered;
                }}
              />
            </div>

            <div className={styles.points}>
              <p>Liczba punktów:</p>
              <input
                id={`points-${i}`}
                type="text"
                autoComplete="off"
                maxLength={2}
                onChange={(e) => {
                  // allow only numbers
                  const filtered = e.target.value.replace(/[^0-9]/g, "");
                  e.target.value = filtered;
                }}
              />
            </div>
          </div>
        ))}

        <div className={styles.buttons}>
          <button>Sortuj</button>
          <button type="submit">Zapisz</button>
          <button>Eksportuj</button>
        </div>
      </form>
    </main>
  );
}
