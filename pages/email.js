import Head from 'next/head';
import { inviteBelove } from '../components/EmailTemplate';

const error = () => {
  const to_email = 'test@example.com';
  const to_nric_name = 'John Doe';
  const to_type = 'user';
  const to_level = 1;
  const from_name = 'Sampul Team';
  const invite_uuid = 'abc123';

  return (
    <div>
      {inviteBelove({
        to_email,
        to_nric_name,
        to_type,
        to_level,
        from_name,
        invite_uuid,
      })}
    </div>
  );
};

export default error;
