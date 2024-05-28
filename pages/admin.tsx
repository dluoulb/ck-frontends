import Head from "next/head";
import styles from "../styles/Home.module.css";

export default function Admin() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Admin Page</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className={styles.title}>Admin Testing</h1>
      </main>
    </div>
  );
}
