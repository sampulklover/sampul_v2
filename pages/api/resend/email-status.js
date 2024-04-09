import { getServiceSupabase } from '../../../utils/supabase';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method Not Allowed',
      message: 'Only POST requests are allowed',
    });
  }

  try {
    const payload = req.body;

    const supabase = getServiceSupabase();

    const { data, error } = await supabase
      .from('beloved_invites')
      .update({
        email_status: payload.type,
      })
      .eq('email_resend_id', '46d54d9b-a4db-4df2-b2db-a801dd0196dc');

    if (error) {
      return res.status(400).json(error);
    }

    res.status(200).json({ data: data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
