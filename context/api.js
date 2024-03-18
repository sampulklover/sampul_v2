import React, { createContext, useContext, useState } from 'react';
import { useEffect } from 'react';
import { useUser } from './user';
import {
  getBelovedApi,
  getBodiesApi,
  getDigitalAssetsApi,
  getExtraWishesApi,
  getInformDeathApi,
  getInvitesApi,
  getProfileApi,
  getWillApi,
} from '../utils/api';

const ApiContext = createContext();

export const useApi = () => useContext(ApiContext);

export const ApiProvider = ({ children }) => {
  const { user } = useUser();
  const [contextApiData, setContextApiData] = useState({
    profile: {
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

  const getProfile = async () => {
    setContextApiData((prevData) => ({
      ...prevData,
      profile: {
        data: null,
        isLoading: true,
      },
    }));
    try {
      const data = await getProfileApi({ uuid: user.uuid });
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
      const data = await getDigitalAssetsApi({ uuid: user.uuid });
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
      const data = await getBelovedApi({ uuid: user.uuid });

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
      const data = await getInvitesApi({ email: user.profile.email });
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
      const data = await getExtraWishesApi({ uuid: user.uuid });
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
      const data = await getWillApi({ uuid: user.uuid });
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
      const data = await getInformDeathApi({ uuid: user.uuid });
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
    }
  };

  const initialFunction = async () => {
    await Promise.all([
      getProfile(),
      getBodies(),
      getDigitalAssets(),
      getBeloved(),
      getInvites(),
      getExtraWishes(),
      getWill(),
      getInformDeath(),
    ]);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (user?.uuid !== null) {
        await initialFunction();
      }
    };

    fetchData();
  }, [user]);

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
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};
