export default async function handler(req, res) {
  // Optional: log for debugging
  console.log('✅ Received success_callback from Chip (not used)');

  // Just respond with 200 OK
  return res.status(200).json({ message: 'Success callback received' });
}

// This is a dummy success_callback endpoint required by Chip API.
// Although we already handle all payment status updates via the main webhook (callback_url),
// Chip requires a success_callback URL to be provided in the payment creation payload.
// This endpoint is intentionally left without processing logic, as it's not used in our flow.
// Do not remove unless Chip changes their API requirements.
