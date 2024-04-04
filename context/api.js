import React, { createContext, useContext, useState } from 'react';
import { useEffect } from 'react';
import {
  getAccountApi,
  getBelovedApi,
  getBodiesApi,
  getDigitalAssetsApi,
  getExtraWishesApi,
  getInformDeathApi,
  getInvitesApi,
  getProfileApi,
  getRoleApi,
  getUserApi,
  getWillApi,
} from '../utils/api';
import { useRouter } from 'next/router';
import { supabase } from '../utils/supabase';
import toast from 'react-hot-toast';
import { pages } from '../constant/element';
import * as Sentry from '@sentry/nextjs';

const ApiContext = createContext();

export const useApi = () => useContext(ApiContext);

export const ApiProvider = ({ children }) => {
  const router = useRouter();
  const [contextApiData, setContextApiData] = useState({
    user: {
      data: null,
      isLoading: true,
    },
    profile: {
      data: null,
      isLoading: true,
    },
    account: {
      data: null,
      isLoading: true,
    },
    role: {
      data: null,
      isLoading: true,
    },
    bodies: {
      data: [],
      isLoading: true,
    },
    digitalAssets: {
      data: [],
      isLoading: true,
    },
    beloved: {
      data: [],
      isLoading: true,
    },
    invites: {
      data: [],
      isLoading: true,
    },
    extraWishes: {
      data: null,
      isLoading: true,
    },
    will: {
      data: null,
      isLoading: true,
    },
    informDeath: {
      data: null,
      isLoading: true,
    },
  });

  const getUser = async () => {
    setContextApiData((prevData) => ({
      ...prevData,
      informDeath: {
        data: null,
        isLoading: true,
      },
    }));

    try {
      const data = await getUserApi();

      if (data) {
        setContextApiData((prevData) => ({
          ...prevData,
          user: {
            data: data.user,
            isLoading: false,
          },
        }));
      }

      return data;
    } catch (error) {
      console.error(error);
      setContextApiData((prevData) => ({
        ...prevData,
        user: {
          data: null,
          isLoading: false,
        },
      }));
      Sentry.captureException(error);
      return null;
    }
  };

  const getProfile = async () => {
    setContextApiData((prevData) => ({
      ...prevData,
      profile: {
        data: null,
        isLoading: true,
      },
    }));
    try {
      const data = await getProfileApi({ uuid: contextApiData.user.data.id });
      setContextApiData((prevData) => ({
        ...prevData,
        profile: {
          data: data,
          isLoading: false,
        },
      }));
    } catch (error) {
      console.error(error);
      setContextApiData((prevData) => ({
        ...prevData,
        profile: {
          data: null,
          isLoading: false,
        },
      }));
      Sentry.captureException(error);
    }
  };

  const getAccount = async () => {
    setContextApiData((prevData) => ({
      ...prevData,
      account: {
        data: null,
        isLoading: true,
      },
    }));
    try {
      const data = await getAccountApi({ uuid: contextApiData.user.data.id });
      setContextApiData((prevData) => ({
        ...prevData,
        account: {
          data: data,
          isLoading: false,
        },
      }));
    } catch (error) {
      console.error(error);
      setContextApiData((prevData) => ({
        ...prevData,
        account: {
          data: null,
          isLoading: false,
        },
      }));
      Sentry.captureException(error);
    }
  };

  const getRole = async () => {
    setContextApiData((prevData) => ({
      ...prevData,
      role: {
        data: null,
        isLoading: true,
      },
    }));
    try {
      const data = await getRoleApi({ uuid: contextApiData.user.data.id });
      setContextApiData((prevData) => ({
        ...prevData,
        role: {
          data: data,
          isLoading: false,
        },
      }));
    } catch (error) {
      console.error(error);
      setContextApiData((prevData) => ({
        ...prevData,
        role: {
          data: null,
          isLoading: false,
        },
      }));
      Sentry.captureException(error);
    }
  };

  const getBodies = async () => {
    setContextApiData((prevData) => ({
      ...prevData,
      bodies: {
        data: [],
        isLoading: true,
      },
    }));
    try {
      const data = await getBodiesApi();
      setContextApiData((prevData) => ({
        ...prevData,
        bodies: {
          data: data,
          isLoading: false,
        },
      }));
    } catch (error) {
      console.error(error);
      setContextApiData((prevData) => ({
        ...prevData,
        bodies: {
          data: [],
          isLoading: false,
        },
      }));
      Sentry.captureException(error);
    }
  };

  const getDigitalAssets = async () => {
    setContextApiData((prevData) => ({
      ...prevData,
      digitalAssets: {
        data: [],
        isLoading: true,
      },
    }));
    try {
      const data = await getDigitalAssetsApi({
        uuid: contextApiData.user.data.id,
      });
      setContextApiData((prevData) => ({
        ...prevData,
        digitalAssets: {
          data: data,
          isLoading: false,
        },
      }));
    } catch (error) {
      console.error(error);
      setContextApiData((prevData) => ({
        ...prevData,
        digitalAssets: {
          data: [],
          isLoading: false,
        },
      }));
      Sentry.captureException(error);
    }
  };

  const getBeloved = async () => {
    setContextApiData((prevData) => ({
      ...prevData,
      beloved: {
        data: [],
        isLoading: true,
      },
    }));

    try {
      const data = await getBelovedApi({ uuid: contextApiData.user.data.id });

      setContextApiData((prevData) => ({
        ...prevData,
        beloved: {
          data: data,
          isLoading: false,
        },
      }));
    } catch (error) {
      console.error(error);
      setContextApiData((prevData) => ({
        ...prevData,
        beloved: {
          data: [],
          isLoading: false,
        },
      }));
      Sentry.captureException(error);
    }
  };

  const getInvites = async () => {
    setContextApiData((prevData) => ({
      ...prevData,
      invites: {
        data: [],
        isLoading: true,
      },
    }));

    try {
      const data = await getInvitesApi({
        email: contextApiData.user.data.email,
      });
      setContextApiData((prevData) => ({
        ...prevData,
        invites: {
          data: data,
          isLoading: false,
        },
      }));
    } catch (error) {
      console.error(error);
      setContextApiData((prevData) => ({
        ...prevData,
        invites: {
          data: [],
          isLoading: false,
        },
      }));
      Sentry.captureException(error);
    }
  };

  const getExtraWishes = async () => {
    setContextApiData((prevData) => ({
      ...prevData,
      extraWishes: {
        data: null,
        isLoading: true,
      },
    }));

    try {
      const data = await getExtraWishesApi({
        uuid: contextApiData.user.data.id,
      });
      setContextApiData((prevData) => ({
        ...prevData,
        extraWishes: {
          data: data,
          isLoading: false,
        },
      }));
    } catch (error) {
      console.error(error);
      setContextApiData((prevData) => ({
        ...prevData,
        extraWishes: {
          data: null,
          isLoading: false,
        },
      }));
      Sentry.captureException(error);
    }
  };

  const getWill = async () => {
    setContextApiData((prevData) => ({
      ...prevData,
      will: {
        data: null,
        isLoading: true,
      },
    }));

    try {
      const data = await getWillApi({ uuid: contextApiData.user.data.id });
      setContextApiData((prevData) => ({
        ...prevData,
        will: {
          data: data,
          isLoading: false,
        },
      }));
    } catch (error) {
      console.error(error);
      setContextApiData((prevData) => ({
        ...prevData,
        will: {
          data: null,
          isLoading: false,
        },
      }));
      Sentry.captureException(error);
    }
  };

  const getInformDeath = async () => {
    setContextApiData((prevData) => ({
      ...prevData,
      informDeath: {
        data: null,
        isLoading: true,
      },
    }));

    try {
      const data = await getInformDeathApi({
        uuid: contextApiData.user.data.id,
      });
      setContextApiData((prevData) => ({
        ...prevData,
        informDeath: {
          data: data,
          isLoading: false,
        },
      }));
    } catch (error) {
      console.error(error);
      setContextApiData((prevData) => ({
        ...prevData,
        informDeath: {
          data: null,
          isLoading: false,
        },
      }));
      Sentry.captureException(error);
    }
  };

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
    setContextApiData((prevData) => ({
      ...prevData,
      user: {
        data: null,
        isLoading: false,
      },
    }));

    router.push('/signin');
    toast.success('Sign out');
  };

  const getAllApi = async () => {
    await Promise.all([
      getProfile(),
      getAccount(),
      getRole(),
      getBodies(),
      getDigitalAssets(),
      getBeloved(),
      getInvites(),
      getExtraWishes(),
      getWill(),
      getInformDeath(),
    ]);
  };

  const isPageRequiredAuth = () => {
    const routerPath = router.pathname;
    const foundRoute = pages.some(
      (page) =>
        Object.values(page)[0].route === routerPath &&
        Object.values(page)[0].auth
    );

    return foundRoute;
  };

  useEffect(() => {
    const initialFetch = async () => {
      if (contextApiData.user.data == null) {
        const userData = await getUser();
        if (!userData) router.push('/signin');
      }
    };

    if (isPageRequiredAuth()) {
      initialFetch();
    }
  }, [router.pathname]);

  useEffect(() => {
    if (contextApiData.user.data !== null) {
      getAllApi();

      // supabase.auth.onAuthStateChange(() => {
      //   getAllApi();
      //  });
    }
  }, [contextApiData.user.data]);

  return (
    <ApiContext.Provider
      value={{
        contextApiData: contextApiData,
        setContextApiData,
        getProfile,
        getBodies,
        getDigitalAssets,
        getBeloved,
        getInvites,
        getExtraWishes,
        getWill,
        getInformDeath,
        normalLogin,
        googleLogin,
        normalSignup,
        logout,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};
