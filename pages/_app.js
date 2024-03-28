'use client';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import '../styles/global.css';
import { useEffect } from 'react';
import Head from 'next/head';
import NavBar from '../components/NavBar';
import dynamic from 'next/dynamic';
import { ApiProvider } from '../context/api';
// import Footer from '../components/Footer';

const DynamicToaster = dynamic(
  () => import('react-hot-toast').then((module) => module.Toaster),
  {
    ssr: false,
  }
);

export default function MyApp({ Component, pageProps }) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('bootstrap/dist/js/bootstrap.min.js');
      import('../script/webflow.js');
    }
  }, []);

  return (
    <>
      <Head>
        <title>Sampul</title>
        <meta property="og:title" content="Sampul" />
        <meta
          property="og:description"
          content="Safekeep Digital Asset - Simple and Hassle-Free Way to pass on your digital asset to your loved ones  — entirely online."
        />
        <meta property="og:image" content="https://sampul.co/images/Logo.svg" />
        <meta property="og:url" content="https://sampul.co" />
        <meta property="og:type" content="website" />
        <script
          src="https://d3e54v103j8qbb.cloudfront.net/js/jquery-3.5.1.min.dc5e7f18c8.js?site=651503a226dcd604df8a350d"
          type="text/javascript"
          integrity="sha256-9/aliU8dGd2tb6OSsuzixeV4y/faTqgFtohetphbbj0="
          crossOrigin="anonymous"
        ></script>
      </Head>
      <ApiProvider>
        <DynamicToaster position="top-right" />
        <NavBar />
        <main className="main">
          <Component {...pageProps} />
        </main>
      </ApiProvider>
    </>
  );
}
