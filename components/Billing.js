import Loading from './Laoding';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { loadStripe } from '@stripe/stripe-js';
import { useApi } from '../context/api';

const asyncStripe = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);

const Billing = () => {
  const { contextApiData } = useApi();
  const router = useRouter();
  const [runEffect, setRunEffect] = useState(false);
  const [summary, setSummary] = useState({
    data: [],
    isCalling: false,
    isSaving: false,
    selectedProductId: null,
    currentPlan: null,
  });

  useEffect(() => {
    if (contextApiData.account.data !== null) {
      getStripePrices();
    }
  }, [contextApiData.account.data]);

  const defaultProductId = 'default';

  const getStripePrices = async () => {
    setSummary({
      ...summary,
      isCalling: true,
    });
    try {
      const response = await fetch(`/api/stripe/price`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        toast.error('Failed to get prices');
        throw new Error('Failed to get Stripe prices');
      }

      const data = await response.json();

      var myProduct = null;

      if (contextApiData.account.data?.is_subscribed) {
        myProduct = contextApiData.account.data?.stripe_product;
      }

      data.plans.unshift({
        active: true,
        description:
          'Ideal for young, financially responsible individuals seeking to commence comprehensive financial planning.',
        interval: 'lifetime',
        name: 'Free plan',
        price: 0,
        product_id: defaultProductId,
      });

      setSummary({
        ...summary,
        data: data.plans,
        isCalling: false,
        selectedProductId: myProduct ? myProduct : defaultProductId,
        currentPlan: myProduct ? myProduct : defaultProductId,
        isSubscribed: myProduct ? true : false,
      });
    } catch (error) {
      setSummary({
        ...summary,
        isCalling: false,
      });
      toast.error(error.message);
    }
  };

  const getStripeCustomer = async () => {
    try {
      const response = await fetch('/api/stripe/customer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: contextApiData.profile.data?.email,
          uuid: contextApiData.user.data?.id,
        }),
      });

      if (!response.ok) {
        toast.error('Failed to create customer ID');
        throw new Error('Failed to create Stripe customer ID');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      toast.error(error.message);
      return null;
    }
  };

  const getStripeSession = async () => {
    if (summary.data.length !== 0 && summary.selectedProductId) {
      const priceId = summary.data.find(
        (item) => item.product_id === summary.selectedProductId
      )?.price_id;

      if (priceId) {
        setSummary({
          ...summary,
          isSaving: true,
        });

        const data = await getStripeCustomer();
        if (data?.stripe_customer_id) {
          await createStripeSession({
            price_id: priceId,
            stripe_customer_id: data.stripe_customer_id,
          });
        }

        setSummary({
          ...summary,
          isSaving: false,
        });
      } else {
        toast.error('Something went wrong.');
      }
    } else {
      toast.error('Please select a plan below');
    }
  };

  const createStripeSession = async ({ price_id, stripe_customer_id }) => {
    try {
      const response = await fetch('/api/stripe/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          price_id: price_id,
          stripe_customer_id: stripe_customer_id,
        }),
      });

      if (!response.ok) {
        toast.error('Failed to create payment session');
        throw new Error('Failed to create Stripe session');
      }

      const data = await response.json();
      const { session_id, error } = data;

      if (error) {
        toast.error(error.message);
        throw new Error(error);
      }

      const stripe_async = await asyncStripe;
      await stripe_async.redirectToCheckout({ sessionId: session_id });

      return session_id;
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getStripePortal = async () => {
    setSummary({
      ...summary,
      isSaving: true,
    });
    try {
      const response = await fetch(`/api/stripe/portal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uuid: contextApiData.user.data?.id }),
      });

      if (!response.ok) {
        setSummary({
          ...summary,
          isSaving: false,
        });
        toast.error('Failed to get Stripe portal');
        throw new Error('Failed to get Stripe portal');
      }

      setSummary({
        ...summary,
        isSaving: false,
      });
      const data = await response.json();
      router.push(data?.url);
    } catch (error) {
      setSummary({
        ...summary,
        isSaving: false,
      });
      toast.error(error.message);
    }
  };

  return (
    <div class="mt-4">
      <div class="row mb-4">
        <div class="col-lg">
          <div class="smpl_text-sm-semibold">Subscription Plan</div>
          <div class="smpl_text-sm-regular">
            As you embark on your digital wasiat/will planning adventure, you
            have the flexibility to upgrade your plan at any time. Unlock
            premium reatures, sun as Frysical Asset, Appointment or Guardian,
            and Corporate Executor.
          </div>
        </div>
      </div>
      <div class="row mb-4">
        <div class="col-lg">
          <div class="smpl_text-sm-semibold">
            Billing
            <Loading loading={summary.isCalling} />
          </div>
          <div class="smpl_text-sm-regular">
            Manage your billing and payment details
          </div>
        </div>
        <div class="col text-end mt-md-0 mt-3">
          <button
            type="button"
            class="btn btn-primary btn-text"
            onClick={() => {
              if (summary.selectedProductId == defaultProductId) {
                toast.error(
                  'The free plan is automatically included upon registration'
                );
              } else {
                if (summary.isSubscribed) {
                  getStripePortal();
                } else {
                  getStripeSession();
                }
              }
            }}
          >
            <Loading
              title={summary.isSubscribed ? 'Manage subscription' : 'Subscribe'}
              loading={summary.isSaving}
            />
          </button>
        </div>
      </div>
      {summary.data?.map((item) => (
        <>
          {contextApiData.user.isLoading ? <Loading /> : <></>}
          {item.active ? (
            <div
              class="pointer-on-hover mb-3"
              key={item.price_id}
              onClick={() => {
                setSummary({
                  ...summary,
                  selectedProductId: item.product_id,
                });
              }}
            >
              <div
                class="form-block-9 w-form card-4"
                style={{
                  border:
                    summary.selectedProductId == item.product_id
                      ? '1px solid blue'
                      : '',
                }}
              >
                <div style={{ width: '100%' }}>
                  <div class="content-33">
                    <div class="smpl-icon-featured-outline-large">
                      <div class="icon-featured-medium w-embed">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M8 8H8.01M4.56274 2.93726L2.93726 4.56274C2.59136 4.90864 2.4184 5.0816 2.29472 5.28343C2.18506 5.46237 2.10425 5.65746 2.05526 5.86154C2 6.09171 2 6.3363 2 6.82548L2 9.67452C2 10.1637 2 10.4083 2.05526 10.6385C2.10425 10.8425 2.18506 11.0376 2.29472 11.2166C2.4184 11.4184 2.59135 11.5914 2.93726 11.9373L10.6059 19.6059C11.7939 20.7939 12.388 21.388 13.0729 21.6105C13.6755 21.8063 14.3245 21.8063 14.927 21.6105C15.612 21.388 16.2061 20.7939 17.3941 19.6059L19.6059 17.3941C20.7939 16.2061 21.388 15.612 21.6105 14.927C21.8063 14.3245 21.8063 13.6755 21.6105 13.0729C21.388 12.388 20.7939 11.7939 19.6059 10.6059L11.9373 2.93726C11.5914 2.59136 11.4184 2.4184 11.2166 2.29472C11.0376 2.18506 10.8425 2.10425 10.6385 2.05526C10.4083 2 10.1637 2 9.67452 2L6.82548 2C6.3363 2 6.09171 2 5.86154 2.05526C5.65746 2.10425 5.46237 2.18506 5.28343 2.29472C5.0816 2.4184 4.90865 2.59135 4.56274 2.93726ZM8.5 8C8.5 8.27614 8.27614 8.5 8 8.5C7.72386 8.5 7.5 8.27614 7.5 8C7.5 7.72386 7.72386 7.5 8 7.5C8.27614 7.5 8.5 7.72386 8.5 8Z"
                            stroke="#3118D3"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          ></path>
                        </svg>
                      </div>
                    </div>
                    <div class="text-and-supporting-text-19">
                      <div class="text-and-badge-copy">
                        <span class="smpl_text-lg-semibold">{item.name}</span>
                        {summary.currentPlan == item.product_id ? (
                          <span class="badge bg-danger text-white">
                            Current plan
                          </span>
                        ) : (
                          ''
                        )}
                      </div>
                    </div>
                  </div>
                  <img
                    src="images/Vectors-Wrapper_24.svg"
                    loading="lazy"
                    alt=""
                    class="vectors-wrapper-32"
                  />
                  <div class="p-4">
                    <div>
                      <span class="smpl_display-sm-semibold">
                        RM {item.price / 100}
                      </span>
                      <span class="smpl_text-md-regular">
                        {' '}
                        / {item.interval}
                      </span>
                    </div>
                    <span class="smpl_text-sm-regular">{item.description}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            ''
          )}
        </>
      ))}
    </div>
  );
};

export default Billing;
