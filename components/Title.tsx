import React from "react";
import Head from "next/head";
import getConfig from "next/config";

const Title = ({ pathname }) => {
  const { publicRuntimeConfig } = getConfig();
  const baseURL = publicRuntimeConfig.baseURL;

  const titles = [
    {
      path: "/reports",
      title: "Credit Key Reporting",
    },
    { path: "/borrower", title: "Credit Key Borrower Portal" },
    { path: "/admin", title: "Credit Key Admin Portal" },
  ];

  const getTitle = () => {
    const match = titles.find((t) => pathname?.startsWith(t.path));
    return match ? match.title : "Credit Key";
  };

  return (
    <Head>
      <title>{getTitle()}</title>
      <link rel="icon" href={`${baseURL}/ck-mark.png`} />
    </Head>
  );
};

export default Title;
