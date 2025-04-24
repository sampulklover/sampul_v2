import { pages } from '../constant/element';
import { systemLanguages } from '../constant/enum';
import {
  addBulkAftercareApi,
  addExecutorApi,
  addExecutorDeceasedApi,
  addExecutorDeceasedAssetsApi,
  addExecutorGuardianApi,
  addTrustApi,
  addTrustBeneficiaryApi,
  addTrustCharityApi,
  addTrustPaymentApi,
  addChipPaymentApi,
  deleteExecutorApi,
  deleteTrustApi,
  deleteTrustCharityApi,
  getAccountApi,
  getAftercareApi,
  getAllExecutorApi,
  getAllTrustApi,
  getBelovedApi,
  getBodiesApi,
  getBucketExecutorApi,
  getDiditAuthApi,
  getDiditSessionApi,
  getDigitalAssetsApi,
  getExecutorApi,
  getExtraWishesApi,
  getInformDeathApi,
  getInvitesApi,
  getProfileApi,
  getRoleApi,
  getTrustApi,
  getUserApi,
  getWillApi,
  getChipClientApi,
} from '../utils/api';
import { supabase } from '../utils/supabase';
import * as Sentry from '@sentry/nextjs';
import { useRouter } from 'next/router';
import React, { createContext, useContext, useState } from 'react';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

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
    aftercare: {
      data: null,
      isLoading: true,
    },
    trust: {
      data: [],
      isLoading: true,
    },
    executor: {
      data: [],
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

  const getProfile = async (refresh = false) => {
    if (!refresh && contextApiData.profile.data) {
      console.log('Using cached profile data.');
      return;
    }

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

      const routerPath = router?.pathname;
      if (!data.isOnboard && routerPath !== '/onboard') {
        router.push('onboard');
      }
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
      const { data: data, error: error } = await supabase
        .from('digital_assets')
        .select('*')
        .eq('uuid', contextApiData.user.data.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setContextApiData((prevData) => ({
        ...prevData,
        digitalAssets: {
          data: data,
          isLoading: false,
        },
      }));
    } catch (error) {
      toast.error(error.message);
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

  const addDigitalAssetsApi = async (addData) => {
    try {
      const { data, error } = await supabase
        .from('digital_assets')
        .insert(addData)
        .select();

      if (error) {
        throw error;
      }

      const { data: data1, error: error1 } = await supabase
        .from('digital_assets')
        .select('*')
        .eq('uuid', contextApiData.user.data.id)
        .order('created_at', { ascending: false });

      if (error1) {
        throw error1;
      }

      setContextApiData((prevData) => ({
        ...prevData,
        digitalAssets: {
          data: data1,
          isLoading: false,
        },
      }));
      return true;
    } catch (error) {
      toast.error(error.message);
      Sentry.captureException(error);
      return false;
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
      const data = await getBelovedApi({
        uuid: contextApiData.user.data.id,
      });

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

  const getAftercare = async () => {
    setContextApiData((prevData) => ({
      ...prevData,
      aftercare: {
        data: prevData.aftercare.data,
        isLoading: true,
      },
    }));

    try {
      const data = await getAftercareApi({
        uuid: contextApiData.user.data.id,
      });

      setContextApiData((prevData) => ({
        ...prevData,
        aftercare: {
          data: data,
          isLoading: false,
        },
      }));
    } catch (error) {
      console.error(error);
      setContextApiData((prevData) => ({
        ...prevData,
        aftercare: {
          data: [],
          isLoading: false,
        },
      }));
      Sentry.captureException(error);
    }
  };

  const addBulkAftercare = async () => {
    const data = await getProfileApi({
      uuid: contextApiData.user.data.id,
    });

    if (data.is_aftercare_onboard == false) {
      const { data: returnData, error } = await supabase
        .from('profiles')
        .update({
          is_aftercare_onboard: true,
        })
        .eq('uuid', contextApiData.user.data?.id)
        .select()
        .single();

      if (returnData) {
        const defaultAfterCare = [
          { task: '1. Manage the Burial', uuid: contextApiData.user.data.id },
          {
            task: '2. Claim Khairat/Mutual Benevolent',
            uuid: contextApiData.user.data.id,
          },
          {
            task: '3. Apply for Death Certificate with National Registration Department (Jabatan Pendaftaran Negara)',
            uuid: contextApiData.user.data.id,
          },
          {
            task: '4. Apply for List of Asset, Debt, Wishes and Wasiat via Sampul.co',
            uuid: contextApiData.user.data.id,
          },
          {
            task: '5. Claim Takaful/Insurance',
            uuid: contextApiData.user.data.id,
          },
          {
            task: '6. Terminate Digital Accounts and Subscription',
            uuid: contextApiData.user.data.id,
          },
          {
            task: '7. Identify other Asset',
            uuid: contextApiData.user.data.id,
          },
          {
            task: '8. Identify other Debts to be Settled',
            uuid: contextApiData.user.data.id,
          },
          { task: '9. Legal consultation', uuid: contextApiData.user.data.id },
          { task: '10. Get authority', uuid: contextApiData.user.data.id },
          { task: '11. Manage assets', uuid: contextApiData.user.data.id },
          {
            task: '12. Distribute to heirs',
            uuid: contextApiData.user.data.id,
          },
          {
            task: '13. Channel Charity and Waqf',
            uuid: contextApiData.user.data.id,
          },
          { task: '14. Continuous Prayers', uuid: contextApiData.user.data.id },
          { task: '15. Process grief', uuid: contextApiData.user.data.id },
        ];

        const rearrangedAfterCare = defaultAfterCare.reverse();

        console.log('Default task aftercare added!');

        try {
          const data = await addBulkAftercareApi({
            bulkData: rearrangedAfterCare,
            uuid: contextApiData.user.data.id,
          });

          if (data) {
            await getAftercare();
          }
        } catch (error) {
          console.error(error);
          Sentry.captureException(error);
        }
      }
    }
  };

  const getDiditAuth = async () => {
    try {
      const data = await getDiditAuthApi();
      return data;
    } catch (error) {
      console.error(error);
      Sentry.captureException(error);
      return null;
    }
  };

  const getDiditSession = async (postData) => {
    try {
      const data = await getDiditSessionApi({
        ...postData,
        uuid: contextApiData.user.data.id,
      });
      return data;
    } catch (error) {
      console.error(error);
      Sentry.captureException(error);
      return null;
    }
  };

  const getAllTrust = async () => {
    setContextApiData((prevData) => ({
      ...prevData,
      trust: {
        data: [],
        isLoading: true,
      },
    }));

    try {
      const data = await getAllTrustApi({
        uuid: contextApiData.user.data.id,
      });

      setContextApiData((prevData) => ({
        ...prevData,
        trust: {
          data: data,
          isLoading: false,
        },
      }));
    } catch (error) {
      console.error(error);
      setContextApiData((prevData) => ({
        ...prevData,
        trust: {
          data: [],
          isLoading: false,
        },
      }));
      Sentry.captureException(error);
    }
  };

  const addTrust = async (postData) => {
    try {
      const data = await addTrustApi({
        ...postData.trustData,
        uuid: postData.trustData.uuid
          ? postData.trustData.uuid
          : contextApiData.user.data.id,
      });

      const existingTrustIndex = contextApiData.trust.data.findIndex(
        (trust) => trust.id === data.id
      );

      let newTrustData;

      if (existingTrustIndex > -1) {
        newTrustData = contextApiData.trust.data.map((trust, index) =>
          index === existingTrustIndex ? data : trust
        );
      } else {
        newTrustData = [data, ...contextApiData.trust.data];
      }

      setContextApiData((prevData) => ({
        ...prevData,
        trust: {
          data: newTrustData,
          isLoading: false,
        },
      }));

      if (data) {
        return data;
      }
    } catch (error) {
      console.error(error);
      Sentry.captureException(error);
    }
  };

  const getTrust = async (postData) => {
    try {
      const data = await getTrustApi({
        trustId: postData.trustId,
      });

      if (data) {
        return data;
      }
    } catch (error) {
      console.error(error);
      Sentry.captureException(error);
    }
  };

  const deleteTrust = async (postData) => {
    try {
      const data = await deleteTrustApi({
        id: postData.id,
      });

      const newTrustData = contextApiData.trust.data.filter(
        (trust) => trust.id !== data.id
      );

      setContextApiData((prevData) => ({
        ...prevData,
        trust: {
          data: newTrustData,
          isLoading: false,
        },
      }));

      if (data) {
        return data;
      }
    } catch (error) {
      console.error(error);
      Sentry.captureException(error);
    }
  };

  const getChipClient = async (postData) => {
    try {
      const data = await getChipClientApi({
        userId: contextApiData.user.data.id,
        email: contextApiData.user.data.user_metadata.email,
      });

      if (data) {
        return data;
      }
    } catch (error) {
      console.error(error);
      Sentry.captureException(error);
    }
  };

  const addChipPayment = async (postData) => {
    const result = await getChipClient();
    if (result?.chip_customer_id) {
      try {
        const data = await addChipPaymentApi({
          trustId: postData.trustId,
          trustCode: postData.trustCode,
          userId: contextApiData.user.data.id,
          clientId: result?.chip_customer_id,
          amount: parseFloat(postData.amount),
          description: `Payment for Trust ${postData.trustCode}`,
        });

        if (data) {
          return data;
        }
      } catch (error) {
        console.error(error);
        Sentry.captureException(error);
      }
    } else {
      console.log('Client Id not found');
    }
  };

  const addTrustBeneficiary = async (postData, trustId = null) => {
    try {
      const updatedPostData = postData.trustData.map((item) => ({
        ...item,
        uuid: item.uuid ? item.uuid : contextApiData.user.data.id,
        trust_id: item.trust_id ? item.trust_id : trustId,
      }));

      const data = await addTrustBeneficiaryApi({
        trustData: updatedPostData,
      });

      const newTrustData = contextApiData.trust.data.map((trust) => {
        const matchingData = data.find((item) => item.trust_id === trust.id);

        if (matchingData) {
          return {
            ...trust,
            trust_beneficiary: data,
          };
        }
        return trust;
      });

      setContextApiData((prevData) => ({
        ...prevData,
        trust: {
          data: newTrustData,
          isLoading: false,
        },
      }));

      if (data) {
        return data;
      }
    } catch (error) {
      console.error(error);
      Sentry.captureException(error);
    }
  };

  const addTrustCharity = async (postData) => {
    try {
      const updatedPostData = {
        ...postData,
        uuid: postData.uuid ? postData.uuid : contextApiData.user.data.id,
      };

      const data = await addTrustCharityApi({
        trustCharityData: updatedPostData,
      });

      const newTrustData = contextApiData.trust.data.map((trust) => {
        if (data.trust_id === trust.id) {
          const existingIndex = trust.trust_charity.findIndex(
            (charity) => charity.id === data.id
          );

          let updatedTrustCharity;

          if (existingIndex > -1) {
            updatedTrustCharity = trust.trust_charity.map((charity, index) =>
              index === existingIndex ? data : charity
            );
          } else {
            updatedTrustCharity = [...trust.trust_charity, data];
          }

          const updatedTrust = {
            ...trust,
            trust_charity: updatedTrustCharity,
          };
          return updatedTrust;
        }
        return trust;
      });

      setContextApiData((prevData) => ({
        ...prevData,
        trust: {
          data: newTrustData,
          isLoading: false,
        },
      }));

      if (data) {
        return data;
      }
    } catch (error) {
      console.error(error);
      Sentry.captureException(error);
    }
  };

  const deleteTrustCharity = async (postData) => {
    try {
      const data = await deleteTrustCharityApi({
        id: postData.id,
      });

      const newTrustData = contextApiData.trust.data.map((trust) => {
        if (data.trust_id === trust.id) {
          const updatedTrustCharity = trust.trust_charity.filter(
            (charity) => charity.id !== data.id
          );

          const updatedTrust = {
            ...trust,
            trust_charity: updatedTrustCharity,
          };
          return updatedTrust;
        }
        return trust;
      });

      setContextApiData((prevData) => ({
        ...prevData,
        trust: {
          data: newTrustData,
          isLoading: false,
        },
      }));

      if (data) {
        return data;
      }
    } catch (error) {
      console.error(error);
      Sentry.captureException(error);
    }
  };

  const addTrustPayment = async (postData) => {
    try {
      const updatedPostData = {
        ...postData.data,
        uuid: postData.data.uuid
          ? postData.data.uuid
          : contextApiData.user.data.id,
      };

      const data = await addTrustPaymentApi({
        trustPaymentData: updatedPostData,
        trustPaymentId: postData.otherData.trust_payment_id,
      });

      const newTrustData = contextApiData.trust.data.map((trust) => {
        if (data.trust_id === trust.id) {
          return {
            ...trust,
            trust_payment: data,
          };
        }
        return trust;
      });

      setContextApiData((prevData) => ({
        ...prevData,
        trust: {
          data: newTrustData,
          isLoading: false,
        },
      }));

      if (data) {
        return data;
      }
    } catch (error) {
      console.error(error);
      Sentry.captureException(error);
    }
  };

  const getAllExecutor = async () => {
    setContextApiData((prevData) => ({
      ...prevData,
      executor: {
        data: [],
        isLoading: true,
      },
    }));

    try {
      const data = await getAllExecutorApi({
        uuid: contextApiData.user.data.id,
      });

      setContextApiData((prevData) => ({
        ...prevData,
        executor: {
          data: data,
          isLoading: false,
        },
      }));
    } catch (error) {
      console.error(error);
      setContextApiData((prevData) => ({
        ...prevData,
        executor: {
          data: [],
          isLoading: false,
        },
      }));
      Sentry.captureException(error);
    }
  };

  const addExecutor = async (postData) => {
    try {
      const data = await addExecutorApi({
        ...postData.executorData,
        uuid: postData.executorData.uuid
          ? postData.executorData.uuid
          : contextApiData.user.data.id,
      });

      const existingExecutorIndex = contextApiData.executor.data.findIndex(
        (executor) => executor.id === data.id
      );

      let newExecutorData;

      if (existingExecutorIndex > -1) {
        newExecutorData = contextApiData.executor.data.map((executor, index) =>
          index === existingExecutorIndex ? data : executor
        );
      } else {
        newExecutorData = [data, ...contextApiData.executor.data];
      }

      setContextApiData((prevData) => ({
        ...prevData,
        executor: {
          data: newExecutorData,
          isLoading: false,
        },
      }));

      if (data) {
        return data;
      }
    } catch (error) {
      console.error(error);
      Sentry.captureException(error);
    }
  };

  const getExecutor = async (postData) => {
    try {
      const data = await getExecutorApi({
        executorId: postData.executorId,
      });

      if (data) {
        return data;
      }
    } catch (error) {
      console.error(error);
      Sentry.captureException(error);
    }
  };

  const deleteExecutor = async (postData) => {
    try {
      const data = await deleteExecutorApi({
        id: postData.id,
        uuid: contextApiData.user.data.id,
      });

      const newExecutorData = contextApiData.executor.data.filter(
        (trust) => trust.id !== data.id
      );

      setContextApiData((prevData) => ({
        ...prevData,
        executor: {
          data: newExecutorData,
          isLoading: false,
        },
      }));

      if (data) {
        return data;
      }
    } catch (error) {
      console.error(error);
      Sentry.captureException(error);
    }
  };

  const addExecutorDeceased = async (postData) => {
    try {
      const updatedPostData = {
        ...postData.data,
        uuid: postData.data.uuid
          ? postData.data.uuid
          : contextApiData.user.data.id,
      };

      const data = await addExecutorDeceasedApi({
        ...updatedPostData,
      });

      let updatedExecutor = null;

      const newExecutorData = contextApiData.executor.data.map((executor) => {
        if (data.executor_id === executor.id) {
          updatedExecutor = {
            ...executor,
            executor_deceased: data,
          };
          return updatedExecutor;
        }
        return executor;
      });

      setContextApiData((prevData) => ({
        ...prevData,
        executor: {
          data: newExecutorData,
          isLoading: false,
        },
      }));

      if (updatedExecutor) {
        return updatedExecutor;
      }
    } catch (error) {
      console.error(error);
      Sentry.captureException(error);
    }
  };

  const addExecutorDeceasedAssets = async (postData) => {
    try {
      const updatedPostData = {
        ...postData.data,
        uuid: postData.data.uuid
          ? postData.data.uuid
          : contextApiData.user.data.id,
      };

      const data = await addExecutorDeceasedAssetsApi({
        ...updatedPostData,
      });

      let updatedExecutor = null;

      const newExecutorData = contextApiData.executor.data.map((executor) => {
        if (data.executor_id === executor.id) {
          updatedExecutor = {
            ...executor,
            executor_deceased_assets: data,
          };
          return updatedExecutor;
        }
        return executor;
      });

      setContextApiData((prevData) => ({
        ...prevData,
        executor: {
          data: newExecutorData,
          isLoading: false,
        },
      }));

      if (updatedExecutor) {
        return updatedExecutor;
      }
    } catch (error) {
      console.error(error);
      Sentry.captureException(error);
    }
  };

  const addExecutorGuardian = async (postData) => {
    try {
      const updatedPostData = {
        ...postData.data,
        uuid: postData.data.uuid
          ? postData.data.uuid
          : contextApiData.user.data.id,
      };

      const data = await addExecutorGuardianApi({
        ...updatedPostData,
      });

      let updatedExecutor = null;

      const newExecutorData = contextApiData.executor.data.map((executor) => {
        if (data.executor_id === executor.id) {
          updatedExecutor = {
            ...executor,
            executor_guardian: data,
          };
          return updatedExecutor;
        }
        return executor;
      });

      setContextApiData((prevData) => ({
        ...prevData,
        executor: {
          data: newExecutorData,
          isLoading: false,
        },
      }));

      if (updatedExecutor) {
        return updatedExecutor;
      }
    } catch (error) {
      console.error(error);
      Sentry.captureException(error);
    }
  };

  const getBucketExecutor = async (postData) => {
    try {
      const data = await getBucketExecutorApi({
        executorId: postData.executorId,
        uuid: contextApiData.user.data.id,
      });

      if (data) {
        return data;
      }
    } catch (error) {
      console.error(error);
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
      getAftercare(),
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
        addDigitalAssetsApi,
        getBeloved,
        getInvites,
        getExtraWishes,
        getWill,
        getInformDeath,
        getAftercare,
        addBulkAftercare,
        getDiditAuth,
        getDiditSession,
        getAllTrust,
        addTrust,
        getTrust,
        deleteTrust,
        getChipClient,
        addChipPayment,
        addTrustBeneficiary,
        addTrustCharity,
        deleteTrustCharity,
        addTrustPayment,
        getAllExecutor,
        addExecutor,
        getExecutor,
        deleteExecutor,
        addExecutorDeceased,
        addExecutorDeceasedAssets,
        addExecutorGuardian,
        getBucketExecutor,
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
