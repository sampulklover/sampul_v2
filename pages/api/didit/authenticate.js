export default async function handler(req, res) {
  const { method, body } = req;
  if (method === 'POST') {
    const url = process.env.NEXT_PUBLIC_DIDIT_URL + '/auth/v2/token/';
    const clientID = process.env.NEXT_PUBLIC_DIDIT_CLIENT_ID;
    const clientSecret = process.env.DIDIT_CLIENT_SECRET;

    const encodedCredentials = Buffer.from(
      `${clientID}:${clientSecret}`
    ).toString('base64');

    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${encodedCredentials}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params,
      });

      const data = await response.json();

      if (response.ok) {
        res.status(200).json({ data: data });
      }
    } catch (err) {
      res.status(500).json({ error: 'Error', err });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
