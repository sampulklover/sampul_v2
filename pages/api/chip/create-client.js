export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email } = req.body;

  try {
    const CHIP_SECRET_KEY = process.env.CHIP_SECRET_KEY;

    const response = await fetch('https://gate.chip-in.asia/api/v1/clients/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${CHIP_SECRET_KEY}`,
      },
      body: JSON.stringify({
        email: email,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create client');
    }

    const data = await response.json();
    return res.status(200).json({ data });
  } catch (error) {
    console.error('Client error:', error);
    return res.status(500).json({ message: error.message });
  }
}
