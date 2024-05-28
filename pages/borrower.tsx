import Head from "next/head";
import styles from "../styles/Home.module.css";

export default function Borrower() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Borrower Page</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className={styles.title}>Borrower Testing</h1>
      </main>
    </div>
  );
}
