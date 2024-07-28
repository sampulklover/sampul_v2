import translations from '../constant/translations';
import { useApi } from '../context/api';
import { useLocale } from '../context/locale';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

const NavBar = () => {
  const { contextApiData } = useApi();
  const { locale } = useLocale();
  const router = useRouter();

  return (
    // <nav className="flex py-4 px-6 border-b border-gray-200">
    //   <Link href="/">Home</Link>
    //   <Link href="/pricing">Pricing</Link>
    //   <Link href={user ? '/logout' : '/login'}>
    //     {user ? 'Logout' : 'Login'}
    //   </Link>
    //   {!!user && <Link href="/dashboard">Dashboard</Link>}
    // </nav>
    <nav class="navbar sticky-top navbar-expand-sm border-bottom bg-white navbar-padding py-3">
      <div class="container-fluid">
        <a class="navbar-brand" href="/">
          <Image
            src="/images/Logo.svg"
            alt="image"
            width={0}
            height={0}
            sizes="100vw"
            style={{ width: 150, height: 'auto' }}
            class="d-inline-block align-text-top"
          />
        </a>
        {contextApiData.user.data?.id ? (
          <></>
        ) : (
          <>
            <button
              class="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#mynavbar"
            >
              <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="mynavbar">
              <ul class="navbar-nav ms-auto">
                {router?.route == '/signin' ? (
                  ''
                ) : (
                  <li class="nav-item pe-2">
                    <Link href="signin">
                      <button class="btn btn-light btn-text" type="button">
                        {translations[locale].component.nav_bar.sign_in}
                      </button>
                    </Link>
                  </li>
                )}
                {router?.route == '/signup' ? (
                  ''
                ) : (
                  <li class="nav-item">
                    <Link href="signup">
                      <button class="btn btn-primary btn-text" type="button">
                        {translations[locale].component.nav_bar.sign_up}
                      </button>
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;

// The summary of this page includes:
// This page describes a navigation bar component.
// It includes features such as a logo displayed at the top left corner, navigation links that adjust based on user authentication status,
// and responsive behavior for smaller screens.
// The bar allows users to navigate between different pages like Home, Pricing, Login, and Logout, with options for signing in or signing up if not authenticated.
// The component dynamically adjusts its content based on the user's login state and the current page being viewed.
