import styles from "./style.module.scss";

export default function BoardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className={styles.container}>{children}</div>;
}
