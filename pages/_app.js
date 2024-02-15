'use client';
import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap-icons/font/bootstrap-icons.css';

import '../styles/global.css';
import { useEffect } from 'react';
import UserProvider from '../context/user';
// import { Toaster } from 'react-hot-toast';
import NavBar from '../components/NavBar';
// import Footer from '../components/Footer';

export default function MyApp({ Component, pageProps }) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('bootstrap/dist/js/bootstrap.min.js');
    }
  }, []);

  return (
    <>
      <UserProvider>
        <NavBar />

        {/* <Toaster /> */}
        <main className="main">
          <Component {...pageProps} />
        </main>
        {/* <Footer /> */}
      </UserProvider>
    </>
  );
}
