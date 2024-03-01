import { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../utils/supabase';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';

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
          .select('*, roles (*)')
          .eq('uuid', data.user.id)
          .single();

        const { data: account } = await supabase
          .from('accounts')
          .select('*, products (*)')
          .eq('uuid', data.user.id)
          .single();

        setUser({
          uuid: data.user.id,
          profile: profile,
          account: account,
          access_control: account?.products?.access_control,
          role: profile?.roles,
        });
      }
      setIsLoading(false);
    };

    getUserProfile();

    supabase.auth.onAuthStateChange(() => {
      getUserProfile();
    });
  }, []);

  const normalLogin = async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      if (error.message === 'Email not confirmed') {
        let errorMessage = `Email not yet confirmed. Check your inbox for the confirmation link or <b onClick="openResendVerificationModal()" style=" text-decoration: underline; cursor: pointer;">click here to resend verification</b>.`;
        toast.error(errorMessage);
      } else {
        toast.error(error.message);
      }
      return;
    }

    if (data?.user) {
      router.push('/dashboard');
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
    setUser(null);
    toast.success('Sign out');
    router.push('signin');
  };

  const exposed = {
    user,
    isLoading,
    normalLogin,
    googleLogin,
    normalSignup,
    logout,
  };

  return <Context.Provider value={exposed}>{children}</Context.Provider>;
};

export const useUser = () => useContext(Context);

export default Provider;
