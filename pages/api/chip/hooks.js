import { getServiceSupabase } from '../../../utils/supabase';
import { createHmac } from 'crypto';
import { buffer } from 'micro';

export const config = { api: { bodyParser: false } };

const verifySignature = (encodedData, receivedSignature, secret) => {
  const hmac = createHmac('sha256', secret);
  hmac.update(encodedData);
  const computedSignature = hmac.digest('hex');
  return computedSignature === receivedSignature;
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const rawBody = await buffer(req);
    const signature = req.headers['x-signature'];

    if (!verifySignature(rawBody, signature, process.env.CHIP_SECRET_KEY)) {
      return res.status(401).json({ message: 'Invalid signature' });
    }

    const event = JSON.parse(rawBody);
    const supabase = getServiceSupabase();

    // Update payment status in database
    const { error } = await supabase
      .from('trust_payments')
      .update({
        status: event.status,
        updated_at: new Date().toISOString(),
      })
      .eq('chip_payment_id', event.id);

    if (error) throw error;

    return res.status(200).json({ message: 'Webhook processed successfully' });
  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(500).json({ message: error.message });
  }
}
