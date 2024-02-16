import Link from 'next/link';
import { useUser } from '../context/user';

const NavBar = () => {
  const { user } = useUser();
  return (
    <nav className="flex py-4 px-6 border-b border-gray-200">
      <Link href="/">Home</Link>
      <Link href="/pricing">Pricing</Link>
      <Link href={user ? '/logout' : '/login'}>
        {user ? 'Logout' : 'Login'}
      </Link>
      {!!user && <Link href="/dashboard">Dashboard</Link>}
    </nav>
  );
};

export default NavBar;
