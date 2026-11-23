// /api/pharmacists.js
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();
  try {
    const r = await fetch(`${process.env.SUPABASE_URL}/rest/v1/pharmacists?select=*&is_verified=eq.true&order=distance_km`, {
      headers: { apikey: process.env.SUPABASE_ANON_KEY, Authorization: `Bearer ${process.env.SUPABASE_ANON_KEY}` }
    });
    return res.status(200).json(await r.json());
  } catch(e){ return res.status(500).json({error:String(e)}); }
}
