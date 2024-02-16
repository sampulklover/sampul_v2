import { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../utils/supabase';
import { useRouter } from 'next/router';

const Context = createContext();

const Provider = ({ children }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState({
    uuid: null,
    profile: null,
  });

  useEffect(() => {
    const getUserProfile = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (data?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*,  accounts (*)')
          .eq('uuid', data.user.id)
          .single();

        setUser({
          uuid: data.user.id,
          profile: profile,
        });
      }
      setIsLoading(false);
    };

    getUserProfile();

    supabase.auth.onAuthStateChange(() => {
      getUserProfile();
    });
  }, []);

  const login = async () => {
    const email = 'clickerhizers@gmail.com';
    const password = '1qaz2wsx';

    supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    router.push('/');
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push('/');
  };

  const exposed = {
    user,
    isLoading,
    login,
    logout,
  };

  return <Context.Provider value={exposed}>{children}</Context.Provider>;
};

export const useUser = () => useContext(Context);

export default Provider;
