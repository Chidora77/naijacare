// NaijaCare API - Vercel Serverless, keys stay on server only
// Env vars in Vercel: SUPABASE_URL, SUPABASE_ANON_KEY
const SUPABASE_URL = process.env.SUPABASE_URL;
const KEY = process.env.SUPABASE_ANON_KEY;
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','GET,POST,PATCH,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','Content-Type');
  if (req.method==='OPTIONS') return res.status(200).end();
  const table = "doctors";
  const url = `${SUPABASE_URL}/rest/v1/${table}?select=*`;
  const headers = { apikey: KEY, Authorization: `Bearer ${KEY}`, 'Content-Type':'application/json', Prefer:'return=representation' };
  try {
    if (req.method==='GET') {
      // Role filtering: ?patient_id= / ?doctor_id= / ?pharmacy_id= / ?state=
      let q = url + '&order=created_at.desc';
      const { patient_id, doctor_id, pharmacy_id, state } = req.query || {};
      if (patient_id) q += `&patient_id=eq.${encodeURIComponent(patient_id)}`;
      if (doctor_id) q += `&doctor_id=eq.${encodeURIComponent(doctor_id)}`;
      if (pharmacy_id) q += `&pharmacy_id=eq.${encodeURIComponent(pharmacy_id)}`;
      if (state) q += `&state=eq.${encodeURIComponent(state)}`;
      const r = await fetch(q, { headers });
      const data = await r.json();
      return res.status(200).json(Array.isArray(data)?data:[]);
    }
    if (req.method==='POST') {
      const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, { method:'POST', headers, body: JSON.stringify(req.body) });
      const data = await r.json();
      return res.status(201).json(data);
    }
    if (req.method==='PATCH') {
      const { id } = req.query || {};
      const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`, { method:'PATCH', headers, body: JSON.stringify(req.body) });
      const data = await r.json();
      return res.status(200).json(data);
    }
    return res.status(405).json({error:'Method not allowed'});
  } catch(e){ return res.status(500).json({error:String(e)}); }
}
