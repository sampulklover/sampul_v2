import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  const { method } = req;
  if (method === 'GET') {
    try {
      const { data: prices } = await stripe.prices.list();
      const plans = await Promise.all(
        prices.map(async (price) => {
          const product = await stripe.products.retrieve(price.product);
          return {
            price_id: price.id,
            name: product.name,
            price: price.unit_amount,
            interval: price.recurring.interval,
            currency: price.currency,
            product_id: product.id,
            description: product.description,
            active: product.active,
          };
        })
      );

      const sortedPlans = plans.sort((a, b) => a.price - b.price);
      res.status(200).json({ plans: sortedPlans });
    } catch (err) {
      res.status(500).json({ error: 'Error', err });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
