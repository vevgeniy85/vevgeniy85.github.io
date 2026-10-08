// A connected service must return JSON { "success": true } after accepting the message.
export async function sendMessage(endpoint, payload) {
  if (!endpoint) return { status: 'unavailable' };
  const response = await fetch(endpoint, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload), signal: AbortSignal.timeout(15000)
  });
  if (!response.ok) throw new Error('Delivery failed');
  const confirmation = await response.json();
  if (confirmation.success !== true) throw new Error('No delivery confirmation');
  return { status: 'sent' };
}
