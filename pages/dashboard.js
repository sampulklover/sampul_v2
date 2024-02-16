import { supabase } from '../utils/supabase';
import { useUser } from '../context/user';
import Loading from '../components/Laoding';
import { useRouter } from 'next/router';
import initStripe from 'stripe';

const stripe = initStripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);
const host = process.env.NEXT_PUBLIC_HOST;

const Dashboard = () => {
  const { user, isLoading } = useUser();
  const router = useRouter();

  const getStripePortal = async () => {
    try {
      const { data } = await supabase
        .from('accounts')
        .select('*')
        .eq('uuid', user.uuid)
        .single();

      if (data && data.stripe_customer) {
        const session = await stripe.billingPortal.sessions.create({
          customer: data.stripe_customer,
          return_url: `${host}/success`,
        });

        router.push(session.url);
      } else {
        return null;
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-16 px-8">
      <h1 className="text-3xl mb-6">Dashboard</h1>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <p className="mb-6">
            {user?.profile?.accounts.is_subscribed
              ? `Subscribed: ${user.profile.accounts.stripe_interval}, Product: ${user.profile.accounts.stripe_product}`
              : 'Not subscribed'}
          </p>
          <button onClick={getStripePortal}>Manage subscription</button>
        </>
      )}
    </div>
  );
};

export default Dashboard;
