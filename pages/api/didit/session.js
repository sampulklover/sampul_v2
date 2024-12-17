export default async function createSession(req, res) {
  const { method, body } = req;

  if (method === 'POST') {
    const url = `${process.env.NEXT_PUBLIC_DIDIT_VERIFICATION_URL}/v1/session/`;

    const { access_token, vendor_data } = body;

    if (!access_token) {
      return res.status(400).json({ error: 'Access token is required' });
    }

    const sessionBody = {
      vendor_data: vendor_data,
      callback: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URL,
      features: 'OCR + NFC + FACE',
    };

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access_token}`, // Use the provided access token
      },
      body: JSON.stringify(sessionBody),
    };

    try {
      const sessionResponse = await fetch(url, requestOptions);
      const sessionData = await sessionResponse.json();

      if (sessionResponse.status === 201 && sessionData) {
        return res.status(201).json({ data: sessionData });
      } else {
        console.error('Error creating session:', sessionData.message);
        return res
          .status(sessionResponse.status)
          .json({ error: sessionData.message });
      }
    } catch (err) {
      console.error('Network error:', err);
      return res.status(500).json({ error: 'Network error', details: err });
    }
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
