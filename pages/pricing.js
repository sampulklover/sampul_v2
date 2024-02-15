import initStripe from 'stripe';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement } from '@stripe/react-stripe-js';
import { useUser } from '../context/user';
import Loading from '../components/Laoding';
import axios from 'axios';
import { supabase } from '../utils/supabase';
import CheckoutButton from '../components/CheckoutButton';

const Pricing = ({ plans }) => {
  const { user, login, isLoading } = useUser();

  const callApi = async () => {
    const { API_ROUTE_SECRET } = process.env;
    const data = {
      record: {
        email: 'hfzTest@gmail.com',
        uuid: '19947ad2-a782-4c94-857e-fdb40e9061bb',
      },
    };

    try {
      const response = await axios.post(
        'http://localhost:3000/api/create-stripe-customer',
        data,
        {
          headers: {
            API_ROUTE_SECRET: API_ROUTE_SECRET,
          },
        }
      );

      console.log(response.data);
    } catch (error) {
      console.error('Error calling the API:', error);
    }
  };

  const createStripeCustomer = async () => {
    const stripe = initStripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

    if (user.uuid && user.profile.email) {
      const customer = await stripe.customers.create({
        email: user.profile.email,
      });

      const { data, error } = await supabase
        .from('accounts')
        .update({
          stripe_customer: customer.id,
        })
        .eq('uuid', user.uuid)
        .select()
        .single();

      return data;
    }
  };

  const processSubscription = (planId) => async () => {
    const stripe = initStripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

    try {
      const userAccount = await supabase
        .from('accounts')
        .select('*')
        .eq('uuid', user.uuid)
        .single();

      if (!userAccount.data) {
        const createCustomerResult = await createStripeCustomer();
        userAccount.data = {
          stripe_customer: createCustomerResult.stripe_customer,
        };
      }

      const lineItems = [
        {
          price: planId,
          quantity: 1,
        },
      ];

      const session = await stripe.checkout.sessions.create({
        customer: userAccount.data.stripe_customer,
        mode: 'subscription',
        payment_method_types: ['card'],
        line_items: lineItems,
        success_url: 'http://localhost:3000/payment/success',
        cancel_url: 'http://localhost:3000/payment/cancelled',
      });

      await loadStripe(session.id);
      await stripe.redirectToCheckout({ sessionId: session.id });
    } catch (error) {
      console.error('Error creating Stripe Checkout session:', error);
    }
  };

  const showSubscribeButton = !!user && !user?.profile?.accounts?.is_subscribed;
  const showCreateAccountButton = !user;
  const showManageSubscriptionButton =
    !!user && user?.profile?.accounts?.is_subscribed;

  return (
    <div className="w-full max-w-3xl mx-auto py-16 flex justify-around">
      {plans.map((plan) => (
        <div key={plan.id} className="w-80 h-40 rounded shadow px-6 py-4">
          <h2 className="text-xl">{plan.name}</h2>
          <p className="text-gray-500">
            ${plan.price / 100} / {plan.interval}
          </p>
          {isLoading ? (
            <Loading />
          ) : (
            <div>
              {showSubscribeButton && (
                // <button onClick={processSubscription(plan.id)}>
                //   Subscribe
                // </button>
                <CheckoutButton price_id={plan.id} />
              )}
              {showCreateAccountButton && (
                <button onClick={login}>Create Account</button>
              )}
              {showManageSubscriptionButton && (
                <button>Manage Subscription</button>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export const getStaticProps = async () => {
  const stripe = initStripe(process.env.STRIPE_SECRET_KEY);

  const { data: prices } = await stripe.prices.list();

  const plans = await Promise.all(
    prices.map(async (price) => {
      const product = await stripe.products.retrieve(price.product);
      return {
        id: price.id,
        name: product.name,
        price: price.unit_amount,
        interval: price.recurring.interval,
        currency: price.currency,
      };
    })
  );

  const sortedPlans = plans.sort((a, b) => a.price - b.price);

  return {
    props: {
      plans: sortedPlans,
    },
  };
};

export default Pricing;
