export default async (req) => {
  // Only allow POST
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await req.json();
    const { email, first_name, _hp, source } = body;

    // Honeypot check — bots fill hidden fields
    if (_hp) {
      // Silently accept to not tip off bots
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Validate email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(JSON.stringify({ error: 'A valid email is required.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const API_KEY = process.env.BEEHIIV_API_KEY;
    const PUB_ID = process.env.BEEHIIV_PUB_ID;

    if (!API_KEY || !PUB_ID) {
      console.error('Missing Beehiiv environment variables');
      return new Response(JSON.stringify({ error: 'Server configuration error.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Map source to a readable tag for Beehiiv segmentation
    var sourceTag = source || 'htup-popup';

    const payload = {
      email,
      reactivate_existing: true,
      send_welcome_email: true,
      utm_source: sourceTag,
      referring_site: 'howtousepsychedelics.com',
      custom_fields: [
        { name: 'signup_source', value: sourceTag },
      ],
    };

    if (first_name && first_name.trim()) {
      payload.first_name = first_name.trim();
    }

    const res = await fetch(`https://api.beehiiv.com/v2/publications/${PUB_ID}/subscriptions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('Beehiiv API error:', res.status, err);
      return new Response(JSON.stringify({ error: 'Subscription failed. Please try again.' }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('Subscribe function error:', e);
    return new Response(JSON.stringify({ error: 'Something went wrong. Please try again.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
