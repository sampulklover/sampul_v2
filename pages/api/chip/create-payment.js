import { getServiceSupabase } from '../../../utils/supabase';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const supabase = getServiceSupabase();

  const { trustId, trustCode, userId, clientId, amount, description } =
    req.body;

  try {
    // Create payment session in Supabase first
    const { data: sessionData, error: sessionError } = await supabase
      .from('trust_payments')
      .insert({
        trust_id: trustId,
        uuid: userId,
        amount: amount,
        status: 'initiated',
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (sessionError) throw sessionError;

    // Initialize CHIP API with your secret key
    const CHIP_SECRET_KEY = process.env.CHIP_SECRET_KEY;
    const CHIP_BRAND_ID = process.env.CHIP_BRAND_ID;

    // Use absolute URL for trust page redirect
    const baseUrl = process.env.NEXT_PUBLIC_HOST;
    const successCallback = `${baseUrl}/api/chip/success-callback`;
    const successUrl = `${baseUrl}/trust?payment=success`;
    const failureUrl = `${baseUrl}/trust?payment=failed`;

    const response = await fetch(
      'https://gate.chip-in.asia/api/v1/purchases/',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${CHIP_SECRET_KEY}`,
        },
        body: JSON.stringify({
          brand_id: CHIP_BRAND_ID,
          client_id: clientId,
          success_callback: successCallback,
          success_redirect: successUrl,
          failure_redirect: failureUrl,
          send_receipt: true,
          purchase: {
            amount: amount,
            products: [
              {
                name: description || 'Trust Payment',
                price: amount,
              },
            ],
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to create CHIP payment');
    }

    const data = await response.json();

    // Update payment session with CHIP payment ID
    const { error: updateError } = await supabase
      .from('trust_payments')
      .update({
        chip_payment_id: data.id,
        status: data.status,
        chip_client_id: data.client_id,
      })
      .eq('id', sessionData.id);

    if (updateError) throw updateError;

    return res.status(200).json({ data });
  } catch (error) {
    console.error('Payment error:', error);
    return res.status(500).json({ message: error.message });
  }
}
