import { getServiceSupabase } from '../../../utils/supabase';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method Not Allowed',
      message: 'Only POST requests are allowed',
    });
  }

  try {
    const { uuid } = req.body;
    const supabase = getServiceSupabase();

    const { data, error } = await supabase
      .from('beloved')
      .select(
        '*, beloved_invites (*, invited_profile:profiles!public_beloved_invites_invited_uuid_fkey(*))'
      )
      .eq('uuid', uuid);

    if (error) {
      return res.status(400).json(error);
    }

    res.status(200).json({ data: data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
