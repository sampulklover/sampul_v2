import { loadStripe } from '@stripe/stripe-js';
import { useRouter } from 'next/router';
import { supabase } from '../utils/supabase';
import { useUser } from '../context/user';
import initStripe from 'stripe';

const asyncStripe = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);
const stripe = initStripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

const CheckoutButton = ({ price_id = '' }) => {
  const { user } = useUser();
  const router = useRouter();

  const createStripeCustomerId = async () => {
    try {
      const customer = await stripe.customers.create({
        email: user.profile.email,
      });

      const { data } = await supabase
        .from('accounts')
        .update({
          stripe_customer: customer.id,
        })
        .eq('uuid', user.uuid)
        .select()
        .single();

      return data?.stripe_customer;
    } catch (err) {
      console.log(err);
      //   router.push('/error');
    }
  };

  const getStripeCustomerId = async () => {
    try {
      const { data } = await supabase
        .from('accounts')
        .select('*')
        .eq('uuid', user.uuid)
        .single();

      if (data && data.stripe_customer) {
        return data.stripe_customer;
      } else {
        return await createStripeCustomerId();
      }
    } catch (err) {
      console.log(err);
      //   router.push('/error');
    }
  };

  const handler = async () => {
    try {
      const stripeCustomer = await getStripeCustomerId();

      if (stripeCustomer && price_id) {
        const stripe = await asyncStripe;

        const res = await fetch('/api/stripe/session', {
          method: 'POST',
          body: JSON.stringify({
            price_id: price_id,
            stripe_customer: stripeCustomer,
          }),
          headers: { 'Content-Type': 'application/json' },
        });

        const { sessionId } = await res.json();
        const { error } = await stripe.redirectToCheckout({ sessionId });

        if (error) {
          throw new Error(error.message);
        }
      }
    } catch (err) {
      console.error(err);
      //   router.push('/error');
    }
  };

  return (
    <button
      onClick={handler}
      className="bg-blue-700 hover:bg-blue-800 duration-200 px-8 py-4 text-white"
    >
      Checkout Now
    </button>
  );
};

export default CheckoutButton;
