// /api/consultations.js - GET list + POST create/update
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  const H = { apikey: process.env.SUPABASE_ANON_KEY, Authorization: `Bearer ${process.env.SUPABASE_ANON_KEY}`, 'Content-Type':'application/json', Prefer:'return=representation' };
  try {
    if (req.method === 'GET') {
      const r = await fetch(`${process.env.SUPABASE_URL}/rest/v1/consultations?select=*&order=created_at.desc`, { headers: H });
      return res.status(200).json(await r.json());
    }
    if (req.method === 'POST') {
      const r = await fetch(`${process.env.SUPABASE_URL}/rest/v1/consultations`, { method:'POST', headers:H, body: JSON.stringify(req.body) });
      return res.status(200).json(await r.json());
    }
    return res.status(405).json({error:'Method not allowed'});
  } catch(e){ return res.status(500).json({error:String(e)}); }
}
