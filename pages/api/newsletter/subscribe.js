import { getServiceSupabase } from '../../../utils/supabase';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method Not Allowed',
      message: 'Only POST requests are allowed',
    });
  }

  try {
    const { email } = req.body;
    const supabase = getServiceSupabase();

    if (!email) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Please complete all required fields',
      });
    }

    const { data, error } = await supabase
      .from('newsletter')
      .select('*')
      .eq('email', email);

    if (data.length > 0) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Email already subscribed!',
      });
    }

    const { data: dataInsert, error: errorInsert } = await supabase
      .from('newsletter')
      .insert({
        email: email,
      });

    if (errorInsert) {
      return res.status(400).json(errorInsert);
    }

    res.status(200).json(dataInsert);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
