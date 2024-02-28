import Link from 'next/link';
import Image from 'next/image';
import { useUser } from '../context/user';

const NavBar = () => {
  const { user } = useUser();
  return (
    // <nav className="flex py-4 px-6 border-b border-gray-200">
    //   <Link href="/">Home</Link>
    //   <Link href="/pricing">Pricing</Link>
    //   <Link href={user ? '/logout' : '/login'}>
    //     {user ? 'Logout' : 'Login'}
    //   </Link>
    //   {!!user && <Link href="/dashboard">Dashboard</Link>}
    // </nav>
    <nav class="navbar sticky-top navbar-expand-sm border-bottom bg-white navbar-padding">
      <div class="container-fluid">
        <a class="navbar-brand" href="/">
          <Image
            src="/images/logo.svg"
            alt="image"
            width={0}
            height={0}
            sizes="100vw"
            style={{ width: 150, height: 'auto' }}
            class="d-inline-block align-text-top"
          />
        </a>
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
            {user?.uuid ? (
              <li class="nav-item">
                <Link href="dashboard">
                  <button class="btn btn-primary btn-lg btn-text" type="button">
                    Dashboard
                  </button>
                </Link>
              </li>
            ) : (
              <>
                <li class="nav-item pe-2">
                  <Link href="signin">
                    <button class="btn btn-light btn-text btn-lg" type="button">
                      Sign in
                    </button>
                  </Link>
                </li>
                <li class="nav-item">
                  <Link href="signup">
                    <button
                      class="btn btn-primary btn-lg btn-text"
                      type="button"
                    >
                      Sign up
                    </button>
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
