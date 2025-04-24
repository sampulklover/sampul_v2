import { getServiceSupabase } from '../../../utils/supabase';
import { buffer } from 'micro';

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const rawBody = await buffer(req);

    // Add debug logging for local testing
    if (process.env.NODE_ENV === 'development') {
      console.log('Received webhook:', {
        body: JSON.parse(rawBody),
        headers: req.headers,
      });
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
