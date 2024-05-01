import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  const { method } = req;
  if (method === 'GET') {
    try {
      const { data: prices } = await stripe.prices.list({
        expand: ['data.product'],
      });

      const priceList = [];
      prices.map((price) => {
        if (price.active && price.product.active) {
          priceList.push({
            price_id: price.id,
            name: price.product.name,
            price: price.unit_amount,
            interval: price.recurring?.interval || 'One-time',
            currency: price.currency,
            product_id: price.product.id,
            description: price.product.description,
            active: price.product.active,
          });
        }
      });

      const sortedPlans = priceList.sort((a, b) => a.price - b.price);
      res.status(200).json({ plans: sortedPlans });
    } catch (err) {
      res.status(500).json({ error: 'Error', err });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
