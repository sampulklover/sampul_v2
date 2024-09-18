import translations from '../constant/translations';
import { useApi } from '../context/api';
import { useLocale } from '../context/locale';
import Loading from './Laoding';
import { loadStripe } from '@stripe/stripe-js';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const asyncStripe = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);

const Billing = ({ onSuccess = () => {} }) => {
  const { contextApiData } = useApi();
  const router = useRouter();
  const { locale } = useLocale();
  const [summary, setSummary] = useState({
    data: [],
    isCalling: false,
    isSaving: false,
    selectedPriceId: null,
    currentPriceId: null,
  });
  const [currentURL, setCurrentURL] = useState('');

  useEffect(() => {
    if (contextApiData.account.data !== null) {
      getStripePrices();
    }
  }, [contextApiData.account.data]);

  useEffect(() => {
    const tempUrl = `${window?.location?.origin}${router.asPath}`;
    setCurrentURL(tempUrl);
  }, [router]);

  const defaultProductId = 'default';

  const [isLoading, setIsLoading] = useState({
    planButton: {
      plan1: false,
      plan2: false,
      plan3: false,
    },
    manageButton: false,
  });

  const PRICE_1_ID = 'default';
  const PRICE_2_MONTHLY_ID = 'price_1PBeaCESARlUW001NjHTj3mZ';
  const PRICE_3_MONTHLY_ID = 'price_1Pp7LMESARlUW0013DRHQ7Yh';
  const PRICE_2_YEARLY_ID = 'price_1PBeagESARlUW001esoY6BB3';
  const PRICE_3_YEARLY_ID = 'price_1Pp7LMESARlUW00174bvJcnV';

  const [showMore, setShowMore] = useState({});
  const [isYearly, setIsYearly] = useState(false);

  const priceDisplay = (priceInCents) => {
    // Convert cents to ringgit
    const priceInRinggit = priceInCents / 100;

    const formattedPrice = new Intl.NumberFormat('ms-MY', {
      style: 'currency',
      currency: 'MYR',
    }).format(priceInRinggit);

    return formattedPrice;
  };

  const features = {
    assets: {
      title: 'Overview',
      body: {
        // beneficiaries: 'Beneficiaries for each asset',
        assets: 'Assets',
        amendments: 'Amendments',
        generation_of_will: 'Generation of Digital Wasiat/Will',
        nazar: 'Nazar/Fidyah Clause',
        waris: '1/3 to non-waris',
        charity: 'Charity/Sadaqah/Waqf Clause',
        organ: 'Organ Donation Clause',
        guidance: '30 minutes post-loss guidance (Limited Offer)',
        therapy: '30 minutes post-loss therapy session (Limited Offer)',
        guardian: 'Appointment of Guardian',
      },
    },
    overview: {
      title: 'Others',
      body: {
        appoint_co_sampul: 'Appointment of Co-Sampul',
        digital_cert: 'Digital Wasiat/Will Certificate',
        witness_timestamp: 'Digital Wasiat/Will with witnesses & timestamp',
        will_generator: 'Digital Wasiat/Will Generator',
        full_day_access: '24 hours access',
        simple_dashboard: 'Simplified Dashboard',
        support: 'Support',
      },
    },
  };

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
        toast.error(translations[locale].component.billing.failed_to_get_);
        throw new Error('Failed to get Stripe prices');
      }

      const data = await response.json();

      var myStripePriceId = null;

      if (contextApiData.account.data?.is_subscribed) {
        myStripePriceId = contextApiData.account.data?.stripe_price_id;
      }

      data.plans.unshift({
        active: true,
        description:
          'Ideal for young, financially responsible individuals seeking to commence comprehensive financial planning.',
        interval: 'lifetime',
        name: 'Free plan',
        price: 0,
        product_id: defaultProductId,
        price_id: defaultProductId,
      });

      setSummary({
        ...summary,
        data: data.plans,
        isCalling: false,
        selectedPriceId: myStripePriceId ? myStripePriceId : defaultProductId,
        currentPriceId: myStripePriceId ? myStripePriceId : defaultProductId,
        isSubscribed: myStripePriceId ? true : false,
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
        toast.error(translations[locale].component.billing.failed_to_create_);
        throw new Error('Failed to create Stripe customer ID');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      toast.error(error.message);
      return null;
    }
  };

  const getStripeSession = async (priceId) => {
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
      toast.error(translations[locale].global.something_went_wrong_);
    }
  };

  const createStripeSession = async ({ price_id, stripe_customer_id }) => {
    try {
      // const fallBackURL = `${process.env.NEXT_PUBLIC_HOST}/settings?tab=nav-billing-tab&session_id={CHECKOUT_SESSION_ID}`;

      const response = await fetch('/api/stripe/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          price_id: price_id,
          stripe_customer_id: stripe_customer_id,
          callbackURL: currentURL,
        }),
      });

      if (!response.ok) {
        toast.error(translations[locale].component.billing.failed_to_create_);
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
    if (!isLoading.manageButton) {
      setIsLoading((prevState) => ({
        ...prevState,
        manageButton: true,
      }));
      try {
        const response = await fetch(`/api/stripe/portal`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            uuid: contextApiData.user.data?.id,
            callbackURL: currentURL,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to get Stripe portal');
        }

        const data = await response.json();
        router.push(data?.url);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setTimeout(() => {
          setIsLoading((prevState) => ({
            ...prevState,
            manageButton: false,
          }));
        }, 2000);
      }
    }
  };

  const createFeatureList = (featureBody, inclusions) => {
    return Object.keys(featureBody).map((key, index) => ({
      title: featureBody[key],
      included: inclusions[index],
    }));
  };

  const checkPricePackage = (priceId) => {
    const matchingItem = summary.data.find((item) => item.price_id === priceId);
    return matchingItem ? matchingItem : 'Not Found';
  };

  const createPlanConfig = (
    planType,
    priceId,
    overviewInclusions,
    assetInclusions,
    extraWishesInclusions
  ) => ({
    onSubscribe: async () => {
      if (isLoading.planButton[planType] == false) {
        setIsLoading((prevState) => ({
          ...prevState,
          planButton: {
            ...prevState.planButton,
            [planType]: true,
          },
        }));

        try {
          if (checkPricePackage(priceId).price === 0) {
            await new Promise((resolve) => setTimeout(resolve, 1000)); // 1 second delay
            if (onSuccess) {
              onSuccess();
            }
          } else {
            if (summary.isSubscribed) {
              await getStripePortal();
            } else {
              await getStripeSession(priceId);
            }
          }
        } catch (error) {
          console.error('Subscription error:', error);
        } finally {
          setTimeout(() => {
            setIsLoading((prevState) => ({
              ...prevState,
              planButton: {
                ...prevState.planButton,
                [planType]: false,
              },
            }));
          }, 2000);
        }
      }
    },
    isBtnLoading: isLoading.planButton[planType],
    title: checkPricePackage(priceId)?.name,
    description: checkPricePackage(priceId)?.description,
    price: checkPricePackage(priceId)?.price,
    interval: checkPricePackage(priceId)?.interval,
    isMyPlan:
      summary.currentPriceId == checkPricePackage(priceId)?.price_id
        ? true
        : false,
    features: {
      title: features.assets.title,
      list: createFeatureList(features.assets.body, assetInclusions),
    },
    features3: {
      title: features.overview.title,
      list: createFeatureList(features.overview.body, overviewInclusions),
    },
  });

  const toggleShowMore = (planKey) => {
    setShowMore((prevState) => ({
      ...prevState,
      [planKey]: !prevState[planKey],
    }));
  };

  const handleToggle = () => {
    setIsYearly(!isYearly);
  };

  const planConfig = {
    plan1: createPlanConfig(
      'plan1',
      PRICE_1_ID,
      ['2', true, true, true, true, true, true],
      ['Up to 5', 'Unlimited', 'Unlimited']
    ),
    // plan2: createPlanConfig(
    //   'plan2',
    //   isYearly ? PRICE_2_YEARLY_ID : PRICE_2_MONTHLY_ID,
    //   ['2', true, true, true, true, true, true],
    //   [true, 'Up to 10', 'Unlimited', 'Unlimited'],
    //   [true, true, true, true, true, true, true, false, false]
    // ),
    plan3: createPlanConfig(
      'plan3',
      isYearly ? PRICE_3_YEARLY_ID : PRICE_3_MONTHLY_ID,
      ['2', true, true, true, true, true, true],
      [
        'Unlimited',
        'Unlimited',
        'Unlimited',
        true,
        true,
        true,
        true,
        true,
        true,
        true,
      ]
    ),
  };

  return (
    <>
      <div className="d-flex justify-content-center mb-3">
        <div>
          <div className="d-flex align-items-center mb-2">
            <span style={{ fontWeight: isYearly ? 'normal' : 'bold' }}>
              Billed monthly
            </span>
            <div className="form-check form-switch form-switch-lg mx-3">
              <input
                className="form-check-input"
                type="checkbox"
                role="switch"
                checked={isYearly}
                onChange={handleToggle}
              />
            </div>
            <span style={{ fontWeight: isYearly ? 'bold' : 'normal' }}>
              Billed yearly
            </span>
          </div>
          <div className="d-flex justify-content-center align-items-center">
            <small className="text-muted">
              (Save up to 20% with yearly billing)
            </small>
          </div>
        </div>
      </div>
      <div className="card-group">
        {Object.keys(planConfig).map((planKey) => {
          const plan = planConfig[planKey];

          return (
            <div
              className={`${
                plan.isMyPlan && !summary.isCalling
                  ? 'card border-2 border-primary'
                  : 'card'
              }`}
              key={planKey}
            >
              <div className="card-body">
                <div class="d-flex">
                  {plan.isMyPlan && !summary.isCalling ? (
                    <span
                      class="badge bg-primary text-white position-absolute translate-middle top-0 start-10"
                      style={{
                        paddingLeft: '15px',
                        paddingRight: '15px',
                        paddingTop: '10px',
                        paddingBottom: '10px',
                      }}
                    >
                      {translations[locale].component.billing.current_plan}
                    </span>
                  ) : (
                    ''
                  )}
                </div>
                {plan.title ? (
                  <>
                    <h5 className="card-title h4">{plan.title}</h5>
                    <p className="card-text px-0 mb-0">
                      <span class="fs-2 ">{priceDisplay(plan.price)}</span>
                      <small>/ {plan.interval}</small>
                    </p>
                    <p className="card-text text-muted plan-description small">
                      {plan.description}
                    </p>
                  </>
                ) : (
                  <Loading loading={true} />
                )}
                <div class="d-grid mb-3">
                  <button
                    type="button"
                    disabled={plan.isMyPlan}
                    class={`btn btn-primary btn-text`}
                    onClick={plan.onSubscribe}
                  >
                    <Loading
                      title={
                        plan.isMyPlan ? (
                          <>
                            <span class="text-primary">Subscribed</span>
                            <i class="bi bi-check2 text-success ms-1 h5"></i>
                          </>
                        ) : (
                          'Subscribe'
                        )
                      }
                      loading={plan.isBtnLoading}
                    />
                  </button>
                </div>
                <table className="table">
                  {/* <thead>
                  <tr>
                    <th scope="col">Feature</th>
                    <th scope="col">Included</th>
                  </tr>
                </thead> */}
                  <tbody>
                    <tr>
                      <th colSpan="2" class="text-primary">
                        {plan.features.title}
                      </th>
                    </tr>
                    {plan.features.list.map((feature, index) => (
                      <tr key={index}>
                        <td class="text-muted">{feature.title}</td>
                        <td class="text-center">
                          {feature.included ? (
                            <>
                              {feature.included == true ? (
                                <i class="bi bi-check-circle text-success h5"></i>
                              ) : (
                                <small class="text-muted">
                                  {feature.included}
                                </small>
                              )}
                            </>
                          ) : (
                            <i class="bi bi-dash-lg"></i>
                          )}
                        </td>
                      </tr>
                    ))}
                    {showMore[planKey] && (
                      <>
                        <tr>
                          <th colSpan="2" class="text-primary">
                            {plan.features3.title}
                          </th>
                        </tr>
                        {plan.features3.list.map((feature, index) => (
                          <tr key={`additional-${index}`}>
                            <td class="text-muted">{feature.title}</td>
                            <td class="text-center">
                              {feature.included ? (
                                <>
                                  {feature.included == true ? (
                                    <i class="bi bi-check-circle text-success h5"></i>
                                  ) : (
                                    <small class="text-muted">
                                      {feature.included}
                                    </small>
                                  )}
                                </>
                              ) : (
                                <i class="bi bi-dash-lg"></i>
                              )}
                            </td>
                          </tr>
                        ))}
                      </>
                    )}
                  </tbody>
                </table>
                <button
                  className="btn btn-link text-primary"
                  onClick={() => toggleShowMore(planKey)}
                  style={{ textDecoration: 'none' }}
                >
                  {showMore[planKey] ? (
                    <>
                      See Less <i class="bi bi-chevron-up"></i>
                    </>
                  ) : (
                    <>
                      See More <i class="bi bi-chevron-down"></i>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <div
        class="text-primary mt-3 text-center text-muted pointer-on-hover"
        onClick={() => getStripePortal()}
      >
        Manage my subscription <Loading loading={isLoading.manageButton} />
      </div>
    </>
  );

  return (
    <div class="mt-4">
      <div class="row mb-4">
        <div class="col-lg">
          <div class="smpl_text-sm-semibold">
            {translations[locale].component.billing.subscription_plan}
          </div>
          <div class="smpl_text-sm-regular">
            {translations[locale].component.billing.as_you_embark_}
          </div>
        </div>
      </div>
      <div class="row mb-4">
        <div class="col-lg">
          <div class="smpl_text-sm-semibold">
            {translations[locale].component.billing.Billing}
            <Loading loading={summary.isCalling} />
          </div>
          <div class="smpl_text-sm-regular">
            {translations[locale].component.billing.manage_your_billing_}
          </div>
        </div>
        <div class="col text-end mt-md-0 mt-3">
          <button
            type="button"
            class="btn btn-primary btn-text"
            onClick={() => {
              if (summary.selectedPriceId == defaultProductId) {
                toast.error(
                  translations[locale].component.billing.the_free_plan_
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
              title={
                summary.isSubscribed
                  ? translations[locale].component.billing.manage_subscription
                  : translations[locale].component.billing.subscribe
              }
              loading={summary.isSaving}
            />
          </button>
        </div>
      </div>
      {summary.data?.map((item, index) => (
        <div key={index}>
          {contextApiData.user.isLoading ? <Loading /> : <></>}
          {item.active ? (
            <div
              class="pointer-on-hover mb-3"
              key={item.price_id}
              onClick={() => {
                setSummary({
                  ...summary,
                  selectedPriceId: item.price_id,
                });
              }}
            >
              <div
                class="form-block-9 w-form card-4"
                style={{
                  border:
                    summary.selectedPriceId == item.price_id
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
                        {summary.currentPriceId == item.product_id ? (
                          <span class="badge bg-danger text-white">
                            {
                              translations[locale].component.billing
                                .current_plan
                            }
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
        </div>
      ))}
    </div>
  );
};

export default Billing;

// The summary of this page includes:
// This page represents a billing interface for managing subscription plans and payments.
// It integrates with Stripe for handling pricing details and session management.
// The component initializes with a loading indicator and retrieves pricing information from an API, adjusting plans based on user subscription status.
// Users can select different subscription tiers, with the option to upgrade via a Stripe checkout session.
// It also includes functionality for managing billing details and accessing a Stripe portal for subscribed users.
