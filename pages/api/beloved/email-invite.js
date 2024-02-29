import { inviteBelove } from '../../../components/EmailTemplate';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method Not Allowed',
      message: 'Only POST requests are allowed',
    });
  }

  try {
    const {
      to_email,
      to_nric_name,
      to_type,
      to_level,
      from_name,
      invite_uuid,
    } = req.body;

    if (!to_email) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Email address is required',
      });
    }

    const { data, error } = await resend.emails.send({
      from: process.env.FROM_EMAIL,
      to: [to_email],
      subject: 'Co-Sampul Request',
      react: inviteBelove({
        to_email,
        to_nric_name,
        to_type,
        to_level,
        from_name,
        invite_uuid,
      }),
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
