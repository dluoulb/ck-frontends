import React from 'react';
import Head from 'next/head';
import favicon from '../../public/favicon.ico';

const Title = ({ pathname }) => {
  const titles = [
    { path: '/reports', title: 'Credit Key Reporting' },
    { path: '/borrower', title: 'Credit Key Borrower Portal' },
    { path: '/admin', title: 'Credit Key Admin Portal' },
  ];

  const getTitle = () => {
    const match = titles.find((t) => pathname?.startsWith(t.path));
    return match ? match.title : 'Credit Key';
  };

  return (
    <Head>
      <title>{getTitle()}</title>
      <link rel="icon" href={favicon.src} sizes="any" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>
  );
};

export default Title;
