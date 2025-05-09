'use client';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../styles/global.css';
import AftercareModal from '../components/AftercareModal';
import BelovedModal from '../components/BelovedModal';
import CharityModal from '../components/CharityModal';
import DigitalAssetsModal from '../components/DigitalAssetsModal';
import ExecutorModal from '../components/ExecutorModal';
import IntroModal from '../components/IntroModal';
import InviteModal from '../components/InviteModal';
import KycModal from '../components/KycModal';
import LogoutModal from '../components/LogoutModal';
import NavBar from '../components/NavBar';
import TrustModal from '../components/TrustModal';
import { ApiProvider } from '../context/api';
import { LocaleProvider } from '../context/locale';
import { ModalProvider } from '../context/modal';
import { TempDataProvider } from '../context/tempData';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useEffect } from 'react';

const DynamicToaster = dynamic(
  () => import('react-hot-toast').then((module) => module.Toaster),
  {
    ssr: false,
  }
);

const MyApp = ({ Component, pageProps }) => {
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
        <meta
          content="Simple and Hassle-Free Way to pass on your digital asset to your loved ones  — entirely online."
          name="description"
        />
        <meta content="Sampul | Safekeep digital asset" property="og:title" />
        <meta
          content="Simple and Hassle-Free Way to pass on your digital asset to your loved ones  — entirely online."
          property="og:description"
        />
        <meta
          content="Sampul | Safekeep digital asset"
          property="twitter:title"
        />
        <meta
          content="Simple and Hassle-Free Way to pass on your digital asset to your loved ones  — entirely online."
          property="twitter:description"
        />
        <meta
          property="og:image"
          content="https://sampul.co/images/og_facebook_post_1200_x_630_p.png"
        />
        <meta property="og:url" content="https://sampul.co" />
        <meta property="og:type" content="website" />
        <meta content="summary_large_image" name="twitter:card" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <script
          src="https://d3e54v103j8qbb.cloudfront.net/js/jquery-3.5.1.min.dc5e7f18c8.js?site=651503a226dcd604df8a350d"
          type="text/javascript"
          integrity="sha256-9/aliU8dGd2tb6OSsuzixeV4y/faTqgFtohetphbbj0="
          crossOrigin="anonymous"
        ></script>
      </Head>
      <LocaleProvider>
        <TempDataProvider>
          <ApiProvider>
            <ModalProvider>
              <LogoutModal />
              <IntroModal />
              <InviteModal />
              <BelovedModal />
              <AftercareModal />
              <CharityModal />
              <TrustModal />
              <ExecutorModal />
              <KycModal />
              <DigitalAssetsModal />
              <DynamicToaster position="top-right" />
              <NavBar />
              <main className="main">
                <Component {...pageProps} />
              </main>
            </ModalProvider>
          </ApiProvider>
        </TempDataProvider>
      </LocaleProvider>
    </>
  );
};

export default MyApp;

// Summary for this page includes:
// This page serves as the main entry point to this website.
// It imports styling and components like a navigation bar and toast notifications.
// The page includes metadata and loads necessary scripts only when needed.
// The main content of the page is wrapped in an 'ApiProvider' context provider,
// ensuring that components can access necessary API functionalities.
