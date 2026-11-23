// NaijaCare API - FIXED: Supabase returns an array, unwrap it
const SUPABASE_URL = process.env.SUPABASE_URL;
const KEY = process.env.SUPABASE_ANON_KEY;
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','GET,POST,PATCH,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','Content-Type');
  if (req.method==='OPTIONS') return res.status(200).end();
  if (!SUPABASE_URL || !KEY) return res.status(500).json({error:'Missing SUPABASE_URL or SUPABASE_ANON_KEY in Vercel env vars'});
  const table = "prescriptions";
  const headers = { apikey: KEY, Authorization: `Bearer ${KEY}`, 'Content-Type':'application/json', Prefer:'return=representation' };
  try {
    if (req.method==='GET') {
      let q = `${SUPABASE_URL}/rest/v1/${table}?select=*&order=created_at.desc`;
      const { patient_id, doctor_id, pharmacy_id, state, pat_id } = req.query || {};
      if (patient_id) q += `&patient_id=eq.${encodeURIComponent(patient_id)}`;
      if (doctor_id) q += `&doctor_id=eq.${encodeURIComponent(doctor_id)}`;
      if (pharmacy_id) q += `&pharmacy_id=eq.${encodeURIComponent(pharmacy_id)}`;
      if (state) q += `&state=eq.${encodeURIComponent(state)}`;
      if (pat_id) q += `&pat_id=eq.${encodeURIComponent(pat_id)}`;
      const r = await fetch(q, { headers });
      const data = await r.json();
      if (!r.ok) return res.status(r.status).json({error: data?.message || 'Supabase GET failed', detail: data});
      return res.status(200).json(Array.isArray(data)?data:[]);
    }
    if (req.method==='POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body||'{}') : (req.body||{});
      const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, { method:'POST', headers, body: JSON.stringify(body) });
      const data = await r.json();
      if (!r.ok) return res.status(r.status).json({error: data?.message || 'Supabase POST failed', detail: data});
      // Supabase returns [ {...} ] - unwrap to single object so frontend can read pat_id
      const row = Array.isArray(data) ? data[0] : data;
      return res.status(201).json(row || {});
    }
    if (req.method==='PATCH') {
      const { id } = req.query || {};
      const body = typeof req.body === 'string' ? JSON.parse(req.body||'{}') : (req.body||{});
      const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`, { method:'PATCH', headers, body: JSON.stringify(body) });
      const data = await r.json();
      if (!r.ok) return res.status(r.status).json({error: data?.message || 'Supabase PATCH failed', detail: data});
      const row = Array.isArray(data) ? data[0] : data;
      return res.status(200).json(row || {});
    }
    return res.status(405).json({error:'Method not allowed'});
  } catch(e){ return res.status(500).json({error:String(e)}); }
}
