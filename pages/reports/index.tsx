import Head from 'next/head';
import styles from '../../styles/Home.module.css';

// This is a functional component in TypeScript with no props.
const Reports: React.FC = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Reports Page</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className={styles.title}>Reports Testing</h1>
      </main>
    </div>
  );
}

export default Reports;
