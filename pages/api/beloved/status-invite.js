import { getServiceSupabase } from '../../../utils/supabase';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method Not Allowed',
      message: 'Only POST requests are allowed',
    });
  }

  try {
    const { invite_uuid, invite_status } = req.body;
    const supabase = getServiceSupabase();

    const { data, error } = await supabase
      .from('beloved_invites')
      .update({
        invite_status: invite_status,
      })
      .eq('invite_uuid', invite_uuid);

    if (error) {
      return res.status(400).json(error);
    }

    return res.status(200).json({ data: data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
