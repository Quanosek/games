import Link from "next/link";
import Image from "next/image";
import PageLayout from "@/components/wrappers/pageLayout";

import styles from "../styles.module.scss";
import { Nexa } from "@/lib/fonts";

import { Nunito_Sans } from "next/font/google";
const Nunito = Nunito_Sans({
  subsets: ["latin"],
  display: "swap",
});

export default function FamiliadaRulesPage() {
  return (
    <PageLayout>
      <div className={styles.rulesTitle}>
        <Link href="/familiada" className={styles.backButton}>
          <Image
            style={{ rotate: "-90deg" }}
            className="icon"
            src="/icons/arrow.svg"
            alt="w lewo"
            width={25}
            height={25}
          />
          <p>Powrót</p>
        </Link>

        <h1>Zasady gry</h1>
      </div>

      <div className={`${Nunito.className} ${styles.rulesContainer}`}>
        <p>
          W programie uczestniczą przedstawiciele dwóch drużyn, z których każda
          liczy 5 osób. Każda drużyna ma wyznaczonego kapitana – głowę drużyny.
          Gra polega na udzielaniu takich odpowiedzi, na które wskazało
          wcześniej najwięcej ankietowanych osób, z założenia 100. Teleturniej
          dzieli się na dwa etapy: pierwszy, który trwa tak długo, aż jedna z
          drużyn zdobędzie łącznie przynajmniej 300 punktów (składa się zatem z
          dowolnej liczby rund; w praktyce najczęściej pięciu, czasem czterech
          lub sześciu). Każda drużyna ma swój kolor – czerwony lub niebieski.
        </p>

        <section>
          <h2 className={Nexa.className}>Opis techniczny</h2>

          <div className={styles.description}>
            <p>
              Dodaj plansze, uzupełnij je pytaniami i punktami, następnie
              kliknij przycisk {`"Podgląd"`}, aby zobaczyć posortowaną planszę
              obok i zapisać ją na swoim urządzeniu. Aby wyświetlić tablicę
              wyników należy wybrać przycisk {`"Pokaż"`}, który otworzy ją w
              zewnętrznym oknie, które najlepiej jest ustawić w trybie
              pełnoekranowym na drugim ekranie poprzez użycie klawisza{" "}
              <span>[F11]</span>.
            </p>
          </div>
        </section>

        <section>
          <h2 className={Nexa.className}>Sterowanie</h2>

          <div className={styles.description}>
            <p>
              Klawisze numeryczne <span>[1-6]</span> odpowiadają za odkrywanie
              odpowiedzi. Wciśnięcie ich z użyciem klawisza <span>[Ctrl]</span>{" "}
              odkrywa odpowiedź bez przydzielania punktów. Klawisze{" "}
              <span>[Q, W, R, T]</span> odpowiadają za przydzielanie {`"X"`} za
              błędne odpowiedzi, gdzie <span>[Q]</span> i <span>[T]</span> to{" "}
              {`"duży X"`}, a <span>[W]</span> i <span>[R]</span> to{" "}
              {`"małe x"`}. Klawisz <span>[E]</span> usuwa wszystkie błędy
              widoczne na tablicy.
            </p>
          </div>
        </section>

        <section>
          <h2 className={Nexa.className}>Pierwszy etap</h2>

          <div className={styles.description}>
            <p>
              Zawodnicy – w pierwszej kolejce kapitanowie drużyn, potem kolejne
              osoby – podchodzą do pulpitu przy tablicy (tzw. beczki), po czym
              prowadzący czyta pytanie. Gracze zgłaszają się do odpowiedzi
              poprzez wciśnięcie przycisku. Jako pierwszy odpowiada gracz, który
              zgłosi się szybciej. Drużyna, której przedstawiciel poda wyżej
              punktowaną odpowiedź (czyli taką, która padała w ankietach
              częściej), decyduje, czy odpowiada na to pytanie dalej, czy
              przekazuje pytanie drużynie przeciwnej. Jeśli żaden z dwóch
              zawodników stojących przy „beczce” nie odpowie poprawnie na zadane
              pytanie (tj. nie udzieli odpowiedzi albo poda niewystępującą na
              tablicy), to prowadzący pyta kolejną osobę z każdego zespołu; jako
              pierwszą pyta drużynę, do której należy uczestnik, który zgłosił
              się pierwszy. W przypadku, gdy pierwsze cztery odpowiedzi okażą
              się niewłaściwe, następuje zmiana pytania. Do każdego pytania
              przypisanych jest od trzech do sześciu odpowiedzi.
            </p>

            <p>
              Za podanie poprawnej odpowiedzi – tj. takiej, która występuje na
              tablicy – do puli trafia przypisana jej liczba punktów, która
              ustalana jest na podstawie liczby osób ankietowanych, które
              odpowiedziały w ten sam sposób – w założeniu jeden punkt powinien
              odpowiadać jednej odpowiedzi od ankietowanych. Członkowie drużyny
              odpowiadają indywidualnie i nie mogą sobie nawzajem podpowiadać.
            </p>

            <ul>
              <li>
                Jeśli odpowiadająca drużyna wskaże wszystkie punktowane
                odpowiedzi, wygrywa daną rundę i otrzymuje wszystkie punkty z
                tablicy.
              </li>

              <li>
                Gdy odpowiadająca drużyna poda złą odpowiedź po raz drugi, jej
                przeciwnicy otrzymują prawo do narady.
              </li>

              <li>
                Gdy odpowiadająca drużyna poda złą odpowiedź po raz trzeci,
                prawo odpowiadania przejmują przeciwnicy. Jeśli udzielą
                właściwej odpowiedzi (przy czym podają tylko jedną, a ostateczna
                decyzja należy do kapitana drużyny), to oni wygrywają daną rundę
                i przejmują wszystkie włożone dotychczas punkty do puli danego
                pytania oraz dostają punkty za swoją odpowiedź; jeśli nie
                podadzą odpowiedzi, która występuje na tablicy (na dowolnej
                pozycji), to rundę wygrywa drugi zespół (i zdobywa uzbierane do
                puli punkty).
              </li>
            </ul>

            <p>
              Po zakończeniu jednej rundy rozpoczynana jest następna – do
              „beczki” podchodzą kolejni członkowie drużyn (do pytania drugiego
              osoby stojące na drugiej pozycji i tak dalej, do pytania szóstego
              ponownie kapitanowie drużyn, do ewentualnych kolejnych pytań –
              następne osoby w kolejce). Punktacja w pierwszych trzech rundach
              pozostaje standardowa, w czwartej rundzie liczbę punktów mnoży się
              przez 2, a od piątej mnoży się przez 3.
            </p>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
