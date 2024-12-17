import { getServiceSupabase } from '../../../utils/supabase';
import { createHmac } from 'crypto';
import { buffer } from 'micro';

export const config = { api: { bodyParser: false } };

const verifySignature = (encodedData, receivedSignature, secret) => {
  const computedSignature = createHmac('sha256', secret)
    .update(encodedData)
    .digest('hex');

  return computedSignature === receivedSignature;
};

const verifyTimestamp = (timestamp) => {
  const now = Math.round(Date.now() / 1000);
  const fiveMinutes = 5 * 60;

  return now - timestamp <= fiveMinutes;
};

const handler = async (req, res) => {
  const secret = process.env.DIDIT_WEBHOOK_SECRET_KEY;
  const signature = req.headers['x-signature'];

  if (!signature || !secret) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const reqBuffer = await buffer(req);

  if (!verifySignature(reqBuffer, signature, secret)) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const body = JSON.parse(reqBuffer.toString());

  console.log('Webhook body:', body);

  const timestamp = body.created_at;

  if (!verifyTimestamp(timestamp)) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { session_id, status, vendor_data } = body;

  const supabase = getServiceSupabase();

  const { error } = await supabase.from('verification').upsert(
    {
      service_name: 'didit',
      session_id,
      uuid: vendor_data,
      status,
    },
    { onConflict: 'session_id' }
  );

  if (error) {
    console.error('Database upsert error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }

  if (status === 'Approved') {
    const { error } = await supabase
      .from('profiles')
      .update({
        kyc_status: 'approved',
      })
      .eq('uuid', vendor_data);

    if (error) {
      console.error('Database update error:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  return res.json({ message: 'Webhook event processed' });
};

export default handler;
