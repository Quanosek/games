"use client";

import { ChangeEvent, useEffect, useState } from "react";

import styles from "./question.module.scss";

import numberFormatter from "@/functions/numberFormatter";

import localFont from "next/font/local";
const dottedFont = localFont({
  src: "../fonts/familiada_regular.woff2",
  display: "swap",
});

export default function QuestionComponent({ id }: { id: number }) {
  const [data, setData] = useState<any>();

  const defaultTitle = `Plansza ${id + 1}`;
  const [title, setTitle] = useState(defaultTitle);

  const [answers, setAnswers] = useState<string[]>([]);
  const [points, setPoints] = useState<string[]>([]);

  // setting up default values on load
  useEffect(() => {
    const local = localStorage.getItem("questions") || "{}";
    const question = JSON.parse(local)[id];

    if (question) {
      const { elements, title } = question;

      setData(elements);
      setTitle(title || defaultTitle);

      setAnswers(elements.map((el: { answer: string }) => el.answer));
      setPoints(elements.map((el: { points: number }) => el.points));
    }
  }, [id, defaultTitle]);

  const handleClearBoard = () => {
    if (!window.confirm("Czy na pewno chcesz wyczyścić całą planszę?")) return;

    const local = localStorage.getItem("questions");

    if (local) {
      const parsed = JSON.parse(local);

      if (parsed[id]) {
        delete parsed[id];

        // modify id of other boards
        Object.keys(parsed).forEach((key) => {
          if (Number(key) > id) {
            parsed[Number(key) - 1] = parsed[key];
            delete parsed[key];
          }
        });

        localStorage.setItem("questions", JSON.stringify(parsed));
      }
    }

    // restore to default values
    setData(undefined);
    setTitle(defaultTitle);
    setAnswers([]);
    setPoints([]);
  };

  const handleFormSubmit = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    // parse form data
    const Collection = new Map();

    Array.from(e.target.elements).forEach((el: any) => {
      if (el.type !== "text") return;

      const [index, type] = el.id.split("-");
      if (index === "title") return setTitle(el.value || defaultTitle);

      if (!Collection.has(index)) Collection.set(index, []);

      const parsedValue = type === "points" ? Number(el.value) : el.value;
      Collection.get(index)[type] = parsedValue;
    });

    const elements = Array.from(Collection.values())
      .filter((el) => el.answer && el.points)
      .sort((a, b) => b.points - a.points)
      .map(({ answer, points }) => ({ answer, points }));

    // game rules error handling
    if (!elements.length) {
      return window.alert(
        "Przed zapisaniem, uzupełnij plansze o wymagane dane."
      );
    } else if (!(elements.length > 2)) {
      return window.alert(
        "Plansza musi zawierać co najmniej 3 odpowiedzi z podanymi wartościami punktowymi."
      );
    }

    // manage local storage data
    const local = localStorage.getItem("questions");
    let result = {};

    if (local) {
      const parsed = JSON.parse(local);

      if (parsed[id]) {
        parsed[id] = { title, elements };
        result = parsed;
      } else {
        result = {
          ...parsed,
          [id]: { title, elements },
        };
      }
    } else {
      result = {
        [id]: { title, elements },
      };
    }

    // save data
    setData(elements);
    localStorage.setItem("questions", JSON.stringify(result));

    window.alert(
      "Plansza została zapisana, możesz teraz ją wyświetlić w osobnym oknie."
    );
  };

  const handleShowBoard = () => {
    if (!data) {
      return window.alert("Przed wyświetleniem musisz zapisać planszę!");
    }

    // open new window with board
    window.open(
      `/familiada/board/${id + 1}`,
      "familiada_tablica",
      "width=960, height=540"
    );
  };

  return (
    <form className={styles.container} onSubmit={handleFormSubmit}>
      {/* custom question title */}
      <div className={styles.question}>
        <input
          id="title"
          type="text"
          value={title}
          placeholder={defaultTitle}
          onChange={(e) => setTitle(e.target.value)}
        />
        <hr />
      </div>

      <div className={styles.content}>
        {/* input form */}
        <div className={styles.answers}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div className={styles.list} key={i}>
              <div className={styles.answer}>
                <p>Odpowiedź {i + 1}:</p>

                <input
                  id={`${i}-answer`}
                  type="text"
                  autoComplete="off"
                  maxLength={17} // 17 characters board limit
                  value={answers[i] || ""}
                  onChange={(e) => {
                    // answer input
                    setAnswers((prev) => {
                      const copy = [...prev];
                      copy[i] = e.target.value.replace(/[^a-zA-Z\s.]/g, "");
                      return copy;
                    });
                  }}
                />
              </div>

              <div className={styles.points}>
                <p>Liczba punktów:</p>

                <input
                  id={`${i}-points`}
                  type="text"
                  autoComplete="off"
                  maxLength={2} // 2 characters board limit
                  value={points[i] || ""}
                  onChange={(e) => {
                    // points input
                    setPoints((prev) => {
                      const copy = [...prev];
                      copy[i] = e.target.value.replace(/[^0-9]/g, "");
                      return copy;
                    });
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* preview board of answers */}
        <div className={`${dottedFont.className} ${styles.preview}`}>
          {data &&
            data.map((el: { answer: string; points: number }, i: number) => {
              const answer = el.answer.split("");
              const points = numberFormatter(Number(el.points));

              // board layout
              return (
                <div key={i}>
                  <p>{i + 1}</p>

                  <div className={styles.answer}>
                    {answer.map((value: string, i: number) => {
                      return <p key={i}>{value}</p>;
                    })}
                  </div>

                  <div className={styles.points}>
                    {points.map((value: string, i: number) => {
                      return <p key={i}>{value}</p>;
                    })}
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* bottom buttons controls */}
      <div className={styles.buttons}>
        <button type="button" onClick={handleClearBoard}>
          <p>🧹 Wyczyść</p>
        </button>

        <button type="submit">
          <p>💾 Zapisz</p>
        </button>

        <button type="button" onClick={handleShowBoard}>
          <p>🖥️ Pokaż</p>
        </button>
      </div>
    </form>
  );
}
