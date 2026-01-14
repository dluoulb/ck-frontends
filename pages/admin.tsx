import Head from 'next/head';

import favicon from '../public/favicon.ico';

export default function Admin() {
  return (
    <div>
      <Head>
        <title>Admin Page</title>
        <link rel="icon" href={favicon.src} />
      </Head>

      <main>
        <h1>Admin Testing</h1>
      </main>
    </div>
  );
}
