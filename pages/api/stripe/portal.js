import { getServiceSupabase } from '../../../utils/supabase';
import initStripe from 'stripe';

const stripe = initStripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method Not Allowed',
      message: 'Only POST requests are allowed',
    });
  }

  try {
    const { uuid } = req.body;
    const supabase = getServiceSupabase();

    const { data } = await supabase
      .from('accounts')
      .select('*')
      .eq('uuid', uuid)
      .single();

    if (data && data.stripe_customer) {
      const session = await stripe.billingPortal.sessions.create({
        customer: data.stripe_customer,
        return_url: `${process.env.NEXT_PUBLIC_HOST}/success`,
      });

      res.status(200).json({ url: session.url });
    } else {
      res.status(404).json({ error: `Stripe customer not found ${uuid}` });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
