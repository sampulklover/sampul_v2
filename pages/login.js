import { useEffect } from 'react';
import { useUser } from '../context/user';

const Login = () => {
  const { login } = useUser();

  useEffect(() => {
    async function fetchData() {
      const response = await login();
    }
    fetchData();
  }, []);

  return <p>Logging in</p>;
};

export default Login;
