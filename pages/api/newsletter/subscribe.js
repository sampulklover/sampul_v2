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

    if (!to_email) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Email address is required',
      });
    }

    const { data: existingEmail, error: existingEmailError } = await supabase
      .from('newsletter')
      .select('email')
      .eq('email', email)
      .single();

    if (existingEmailError) {
      return res.status(400).json(existingEmailError);
    }

    if (existingEmail) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Email already subscribed!',
      });
    }

    const { data, error } = await supabase.from('newsletter').insert({
      email: email,
    });

    if (error) {
      return res.status(400).json(existingEmailError);
    }

    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
