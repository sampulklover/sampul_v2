import { supabase } from '../utils/supabase';
import { useUser } from '../context/user';
import Loading from '../components/Laoding';
import { useRouter } from 'next/router';
import initStripe from 'stripe';

const Dashboard = () => {
  const { user, isLoading } = useUser();
  const router = useRouter();

  const getStripePortal = async () => {
    try {
      const response = await fetch(`/api/stripe/portal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uuid: user.uuid }),
      });

      if (!response.ok) {
        throw new Error('Failed to get Stripe portal');
      }

      const data = await response.json();
      router.push(data?.url);
    } catch (error) {
      console.error('Error to get Stripe portal:', error);
      return null;
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
