import { supabase } from '../../../utils/supabase';
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
    const { uuid, email } = req.body;

    const { data: existingAccount } = await supabase
      .from('accounts')
      .select('stripe_customer')
      .eq('uuid', uuid)
      .single();

    if (existingAccount && existingAccount.stripe_customer) {
      return res
        .status(200)
        .json({ stripe_customer_id: existingAccount.stripe_customer });
    }

    const customer = await stripe.customers.create({
      email: email,
    });

    const { data } = await supabase
      .from('accounts')
      .update({
        stripe_customer: customer.id,
      })
      .eq('uuid', uuid)
      .select()
      .single();

    res.status(200).json({ stripe_customer_id: data?.stripe_customer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
