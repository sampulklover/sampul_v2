import { supabase } from '../../../utils/supabase';
import cookie from 'cookie';

const handler = async (req, res) => {
  //   const { user } = await supabase.auth.api.getUserByCookie(req);
  //   console.log('supabase.auth.api', supabase.auth.api);

  //   if (!user) {
  //     return res.status(401).send('Unauthorized');
  //   }

  //   const token = cookie.parse(req.headers.cookie)['sb:token'];

  //   supabase.auth.session = () => ({
  //     access_token: token,
  //   });

  const { data } = await supabase
    .from('accounts')
    .select('*')
    .eq('uuid', user.uuid)
    .single();

  res.send({
    data,
  });
};

export default handler;
