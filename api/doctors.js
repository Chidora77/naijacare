// /api/doctors.js - Vercel Serverless - keys stay on server only
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();
  try {
    const r = await fetch(`${process.env.SUPABASE_URL}/rest/v1/doctors?select=*&is_verified=eq.true&order=full_name`, {
      headers: { apikey: process.env.SUPABASE_ANON_KEY, Authorization: `Bearer ${process.env.SUPABASE_ANON_KEY}` }
    });
    const data = await r.json();
    return res.status(200).json(data);
  } catch(e){ return res.status(500).json({error:String(e)}); }
}
