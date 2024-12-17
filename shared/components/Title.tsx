import React from 'react';
import getConfig from 'next/config';
import Head from 'next/head';
import favicon from '../../public/favicon.ico';
import { platform } from '@lib/constants/SiteVariables';

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
  window.zESettings = {
    webWidget: {
      chat: {
        notifications: {
          mobile: {
            disable: true
          }
        }
      }
    }
  };

  return (
    <Head>
      <title>{getTitle()}</title>
      <link rel="icon" href={favicon.src} sizes="any" />
      {platform() !== 'development' && 
        <script type="text/javascript" id="ze-snippet" src="https://static.zdassets.com/ekr/snippet.js?key=b115523b-cee9-4d74-a8c4-e27327166184" />
      }
    </Head>
  );
};

export default Title;
