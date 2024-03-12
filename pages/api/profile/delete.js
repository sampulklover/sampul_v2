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
      .from('accounts')
      .select('*')
      .eq('uuid', uuid);

    if (error) {
      return res.status(400).json(error);
    }

    if (data.length > 0) {
      if (data[0].is_subscribed == true) {
        return res.status(400).json({
          error: {
            message:
              'If you want to delete your profile, you need to first cancel your active subscription.',
          },
        });
      } else {
        const { data: dataDelete, error: errorDelete } =
          await supabase.auth.admin.deleteUser(uuid);
        if (errorDelete) {
          return res.status(400).json(errorDelete);
        }

        return res.status(200).json({ data: dataDelete });
      }
    } else {
      return res.status(400).json({
        error: {
          message: `Account doesn't exist.`,
        },
      });
    }
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
