import { getServiceSupabase } from '../../../utils/supabase';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method Not Allowed',
      message: 'Only POST requests are allowed',
    });
  }

  try {
    const { beloved_id } = req.body;
    const supabase = getServiceSupabase();

    const { data, error } = await supabase
      .from('beloved')
      .select('*, profiles ( nric_name, username)')
      .eq('id', beloved_id);

    if (error) {
      return res.status(400).json(error);
    }

    if (data.length > 0) {
      res.status(200).json({ data: data[0] });
    } else {
      res.status(400).json({ error: 'Data not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
