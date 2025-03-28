import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  const { method, body } = req;
  if (method === 'POST') {
    try {
      const lineItems = [
        {
          price: body?.price_id,
          quantity: 1,
        },
      ];

      const session = await stripe.checkout.sessions.create({
        customer: body.stripe_customer_id,
        mode: 'subscription',
        allow_promotion_codes: true,
        line_items: lineItems,
        // {CHECKOUT_SESSION_ID} is a string literal; do not change it!
        // the actual Session ID is returned in the query parameter when your customer
        // is redirected to the success page.
        success_url: body.callbackURL,
        cancel_url: body.callbackURL,
      });

      res.status(200).json({ session_id: session.id });
    } catch (err) {
      res.status(500).json({ error: 'Error checkout session', err });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
