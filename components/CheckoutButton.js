import translations from '../constant/translations';
import { useApi } from '../context/api';
import { useLocale } from '../context/locale';
import { loadStripe } from '@stripe/stripe-js';

const asyncStripe = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);

const CheckoutButton = ({ price_id = '' }) => {
  const { contextApiData } = useApi();
  const { locale } = useLocale();

  const getStripeCustomer = async () => {
    try {
      const response = await fetch('/api/stripe/customer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.profile.email,
          uuid: contextApiData.user.data?.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create Stripe customer ID');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating Stripe customer ID:', error);
      return null;
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
        throw new Error('Failed to create Stripe session');
      }

      const data = await response.json();
      const { session_id, error } = data;

      if (error) {
        throw new Error(error);
      }

      const stripe_async = await asyncStripe;
      await stripe_async.redirectToCheckout({ sessionId: session_id });

      return session_id;
    } catch (error) {
      console.error('Error creating Stripe session:', error);
      return null;
    }
  };

  const getStripeSession = async () => {
    const data = await getStripeCustomer();
    if (data?.stripe_customer_id) {
      await createStripeSession({
        price_id: price_id,
        stripe_customer_id: data.stripe_customer_id,
      });
    }
  };

  return (
    <button
      onClick={getStripeSession}
      className="bg-blue-700 hover:bg-blue-800 duration-200 px-8 py-4 text-white"
    >
      {translations[locale].component.checkout_button.checkout_now}
    </button>
  );
};

export default CheckoutButton;

// The summary of this page includes:
// The button triggers a checkout process when clicked.
// Upon clicking "Checkout Now," the component fetches user information and creates a Stripe customer ID by sending a request to /api/stripe/customer.
// This ID is essential for securely managing customer data and transactions through Stripe.
// If successful, it proceeds to create a Stripe session via /api/stripe/session,
// specifying the price ID and the previously generated Stripe customer ID.
// If both operations (customer creation and session creation) are successful,
// the component uses Stripe's functionality to redirect the user to the Stripe Checkout page
// with the generated session ID. This allows users to complete their purchases securely.
// Error handling is implemented throughout to log and manage any issues that may occur.
