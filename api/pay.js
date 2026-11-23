// /api/pay.js - placeholder until you add Paystack secret server-side
// DO NOT put Paystack secret in frontend. Add PAYSTACK_SECRET_KEY in Vercel Env Vars.
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({error:'POST only'});
  const { amount, email, consultation_id } = req.body || {};
  // TODO: call https://api.paystack.co/transaction/initialize with process.env.PAYSTACK_SECRET_KEY
  // For now return a mock success so flow can be tested end-to-end:
  return res.status(200).json({ ok:true, message:'Connect PAYSTACK_SECRET_KEY in Vercel to go live', authorization_url:'', consultation_id, amount });
}
