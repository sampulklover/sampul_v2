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

  // useEffect(() => {
  //   const getUserProfile = async () => {
  //     const { data, error } = await supabase.auth.getUser();

  //     if (error) {
  //       setUser({
  //         ...user,
  //         isLoading: false,
  //       });
  //     }

  //     if (data?.user) {
  //       const { data: profile, error: errorProfile } = await supabase
  //         .from('profiles')
  //         .select('*, roles (*)')
  //         .eq('uuid', data.user.id)
  //         .single();

  //       const { data: account, error: errorAccount } = await supabase
  //         .from('accounts')
  //         .select('*, products (*)')
  //         .eq('uuid', data.user.id)
  //         .single();

  //       // if (errorProfile && errorAccount) {
  //       //   setUser({
  //       //     ...user,
  //       //     isLoading: false,
  //       //   });

  //       //   return;
  //       // }

  //       setUser({
  //         uuid: data.user.id,
  //         profile: profile,
  //         account: account,
  //         access_control: account?.products?.access_control,
  //         role: profile?.roles,
  //         isLoading: false,
  //       });
  //     }
  //   };

  //   getUserProfile();

  //   // supabase.auth.onAuthStateChange(() => {
  //   //   getUserProfile();
  //   // });
  // }, []);

  const navigateUseToSignin = () => {
    const routerPath = router.pathname;
    const foundRoute = pages.some(
      (page) =>
        Object.values(page)[0].route === routerPath &&
        Object.values(page)[0].auth
    );
    if (foundRoute) {
      router.push('/signin');
    }
  };

  const getActiveUser = async () => {
    const { data, error } = await supabase.auth.getUser();

    if (data.user == null) {
      navigateUseToSignin();
    }
  };

  // useEffect(() => {
  //   navigateUseToSignin();
  // }, [router.pathname]);

  useEffect(() => {
    const getActiveUser = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (data.user) {
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
  }, [router.pathname]);

  // useEffect(() => {
  //   if (user.isLoading == false && user?.uuid == null) {
  //     console.log('asd', user.isLoading, user);
  //     const routerPath = router.pathname;
  //     const foundRoute = pages.some(
  //       (page) =>
  //         Object.values(page)[0].route === routerPath &&
  //         Object.values(page)[0].auth
  //     );
  //     if (foundRoute) {
  //       router.push('/signin');
  //     }
  //   }
  // }, [router.pathname, user.uuid, user.isLoading]);

  const exposed = {
    user,
  };

  return <Context.Provider value={exposed}>{children}</Context.Provider>;
};

export const useUser = () => useContext(Context);

export default Provider;
