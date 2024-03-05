import { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../utils/supabase';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { pages } from '../constant/element';

const Context = createContext();

const Provider = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState({
    uuid: null,
    profile: null,
    account: null,
    access_control: null,
    role: null,
    isLoading: true,
  });

  useEffect(() => {
    const getUserProfile = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        setUser({
          ...user,
          isLoading: false,
        });
      }

      if (data?.user) {
        const { data: profile, error: errorProfile } = await supabase
          .from('profiles')
          .select('*, roles (*)')
          .eq('uuid', data.user.id)
          .single();

        const { data: account, error: errorAccount } = await supabase
          .from('accounts')
          .select('*, products (*)')
          .eq('uuid', data.user.id)
          .single();

        // if (errorProfile && errorAccount) {
        //   setUser({
        //     ...user,
        //     isLoading: false,
        //   });

        //   return;
        // }

        setUser({
          uuid: data.user.id,
          profile: profile,
          account: account,
          access_control: account?.products?.access_control,
          role: profile?.roles,
          isLoading: false,
        });
      }
    };

    getUserProfile();

    supabase.auth.onAuthStateChange(() => {
      getUserProfile();
    });
  }, []);

  useEffect(() => {
    if (user.isLoading == false && user.uuid == null) {
      const routerPath = router.pathname;
      const foundRoute = pages.some(
        (page) =>
          Object.values(page)[0].route === routerPath &&
          Object.values(page)[0].auth
      );
      if (foundRoute) {
        router.push('/signin');
      }
    }
  }, [router.pathname, user.uuid, user.isLoading]);

  const normalLogin = async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      if (error.message === 'Email not confirmed') {
        let errorMessage = `Email not yet confirmed. Check your inbox for the confirmation link`;
        toast.error(errorMessage);
      } else {
        toast.error(error.message);
      }
      return;
    }

    if (data?.user) {
      setTimeout(() => {
        router.push('/dashboard');
      }, 500);
    }
  };

  const normalSignup = async ({ name, email, password }) => {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        emailRedirectTo: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URL,
        data: {
          name: name,
        },
      },
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    if (
      data.user &&
      data.user.identities &&
      data.user.identities.length === 0
    ) {
      const authError = {
        name: 'AuthApiError',
        message: 'User already exists',
      };
      toast.error(authError.message);
      return;
    }

    toast.success(
      'Registration successful, please check your email and confirm your email address to complete the registration process',
      {
        duration: 6000,
      }
    );
  };

  const googleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        queryParams: {
          // access_type: 'offline',
          prompt: 'consent',
        },
        redirectTo: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URL,
      },
    });

    if (error) {
      toast.error(error.message);
      return;
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser({
      ...user,
      uuid: null,
      profile: null,
      account: null,
      access_control: null,
      role: null,
      isLoading: false,
    });

    toast.success('Sign out');
  };

  const exposed = {
    user,
    normalLogin,
    googleLogin,
    normalSignup,
    logout,
  };

  return <Context.Provider value={exposed}>{children}</Context.Provider>;
};

export const useUser = () => useContext(Context);

export default Provider;
