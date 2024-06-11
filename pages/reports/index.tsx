import Head from "next/head";
import { useEffect } from "react";
import { DateTime } from 'luxon';
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
function Reports() {
  // useEffect(() => {
  //   signOut({ callbackUrl: "/login" });
  // }, []);
  const { data: session } = useSession();
  
  return (
    <div>
      <Head>
        <title>Reports Page</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Reports Testing</h1>
      </main>
    </div>
  );
}

Reports.requireAuth = true;

export default Reports;
