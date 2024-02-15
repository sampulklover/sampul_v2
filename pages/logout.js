import { useEffect } from 'react';
import { useUser } from '../context/user';

const Logout = () => {
  const { logout } = useUser();

  useEffect(() => {
    async function fetchData() {
      const response = await logout();
    }
    fetchData();
  }, []);

  return <p>Logging out</p>;
};

export default Logout;
