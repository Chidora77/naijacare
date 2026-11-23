// /api/subscribe.js - Pharmacist monthly subscription
// POST { pharmacist_id, plan: 'Monthly'|'Quarterly'|'Yearly', email, amount }
// Server-only: uses process.env.SUPABASE_URL / SUPABASE_ANON_KEY and PAYSTACK_SECRET_KEY
// DO NOT put Paystack secret in frontend.

const PLANS = {
  Monthly: { amount: 10000, days: 30 },
  Quarterly: { amount: 25000, days: 90 },
  Yearly: { amount: 90000, days: 365 },
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method === 'GET') {
    // GET ?pharmacist_id=xxx -> return subscription status for that pharmacist
    const pid = req.query.pharmacist_id;
    if (!pid) return res.status(400).json({ error: 'pharmacist_id required' });
    const r = await fetch(`${process.env.SUPABASE_URL}/rest/v1/pharmacists?id=eq.${pid}&select=id,pharmacy_name,subscription_status,subscription_plan,subscription_expiry,last_payment`, {
      headers: { apikey: process.env.SUPABASE_ANON_KEY, Authorization: `Bearer ${process.env.SUPABASE_ANON_KEY}` },
    });
    const data = await r.json();
    return res.status(200).json(data[0] || null);
  }
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  try {
    const { pharmacist_id, plan = 'Monthly', email } = req.body || {};
    if (!pharmacist_id) return res.status(400).json({ error: 'pharmacist_id required' });
    const p = PLANS[plan] || PLANS.Monthly;

    // TODO LIVE PAYSTACK: uncomment when you add PAYSTACK_SECRET_KEY in Vercel
    // const pay = await fetch('https://api.paystack.co/transaction/initialize', {
    //   method: 'POST',
    //   headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`, 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email: email || 'pharmacist@naijacare.ng', amount: p.amount * 100, callback_url: 'https://naijacare-five.vercel.app/?paid=1' }),
    // });
    // const payJson = await pay.json();
    // return res.status(200).json({ ok: true, authorization_url: payJson?.data?.authorization_url, plan, amount: p.amount });

    // TEST MODE (no real payment yet): mark subscription active immediately
    // In production, only mark active inside /api/paystack-webhook after Paystack confirms.
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + p.days);
    const expiryStr = expiry.toISOString().slice(0, 10);

    const H = { apikey: process.env.SUPABASE_ANON_KEY, Authorization: `Bearer ${process.env.SUPABASE_ANON_KEY}`, 'Content-Type': 'application/json', Prefer: 'return=representation' };
    const upd = await fetch(`${process.env.SUPABASE_URL}/rest/v1/pharmacists?id=eq.${pharmacist_id}`, {
      method: 'PATCH', headers: H,
      body: JSON.stringify({ subscription_status: 'active', subscription_plan: plan, subscription_expiry: expiryStr, last_payment: new Date().toISOString() }),
    });
    const updated = await upd.json();
    return res.status(200).json({ ok: true, test_mode: true, message: 'Test mode: subscription activated. Add PAYSTACK_SECRET_KEY to go live.', plan, amount: p.amount, subscription_expiry: expiryStr, pharmacist: updated[0] || null });
  } catch (e) {
    return res.status(500).json({ error: String(e) });
  }
}
