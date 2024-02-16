import { loadStripe } from '@stripe/stripe-js';
import { useUser } from '../context/user';

const asyncStripe = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);

const CheckoutButton = ({ price_id = '' }) => {
  const { user } = useUser();

  const getStripeCustomer = async () => {
    try {
      const response = await fetch('/api/stripe/customer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: user.profile.email, uuid: user.uuid }),
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
      Checkout Now
    </button>
  );
};

export default CheckoutButton;
