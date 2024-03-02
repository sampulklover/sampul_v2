import { getServiceSupabase } from '../../../utils/supabase';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method Not Allowed',
      message: 'Only POST requests are allowed',
    });
  }

  try {
    const { name, email, message } = req.body;
    const supabase = getServiceSupabase();

    if (!to_email) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Email address is required',
      });
    }

    const { data, error } = await supabase.from('contact_us').insert({
      name: name,
      email: email,
      message: message,
    });

    if (error) {
      return res.status(400).json(error);
    }

    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
