import initStripe from 'stripe';
import { buffer } from 'micro';
import { getServiceSupabase } from '../../../utils/supabase';

export const config = { api: { bodyParser: false } };

const handler = async (req, res) => {
  const stripe = initStripe(process.env.STRIPE_SECRET_KEY);
  const signature = req.headers['stripe-signature'];
  const signingSecret = process.env.STRIPE_SIGNING_SECRET;
  const reqBuffer = await buffer(req);

  let event;

  try {
    event = stripe.webhooks.constructEvent(reqBuffer, signature, signingSecret);
  } catch (error) {
    console.log(error);
    return res.status(400).send(`Webhook error: ${error.message}`);
  }

  const supabase = getServiceSupabase();

  switch (event.type) {
    case 'customer.subscription.updated':
      await supabase
        .from('accounts')
        .update({
          is_subscribed: true,
          stripe_interval: event.data.object.items.data[0].plan.interval,
          stripe_product: event.data.object.items.data[0].plan.product,
          stripe_price_id: event.data.object.items.data[0].price.id,
          ref_product_key:
            event.data.object.items.data[0].plan.metadata.ref_key,
        })
        .eq('stripe_customer', event.data.object.customer);
      break;
    case 'customer.subscription.deleted':
      await supabase
        .from('accounts')
        .update({
          is_subscribed: false,
          stripe_interval: null,
          stripe_product: null,
          stripe_price_id: null,
          ref_product_key: process.env.BASIC_PRODUCT_KEY,
        })
        .eq('stripe_customer', event.data.object.customer);
      break;
  }

  res.send({ received: true });
};

export default handler;
