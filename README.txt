NAIJACARE REAL BACKEND - SORTS REFRESH ONCE AND FOR ALL

WHY PREVIEW WIPED ACCOUNTS:
Preview = frontend only, no database. It kept accounts in browser session memory.
Refresh = new session = empty. No backend = nothing to save to.

REAL BACKEND = Supabase (database) + Vercel (API) + GitHub (code)
Supabase IS the database - you do NOT need another database.

STEPS (30 mins, do once):
1. Supabase Dashboard (https://supabase.com/dashboard/project/yqgwnqdcupcidhyzjbpv)
   - SQL Editor > New Query > Paste supabase.sql > Run
   - Table Editor > Check: patients, doctors, pharmacists, consultations, prescriptions, messages exist
   - Table Editor > doctors > Add YOUR doctor (DOC-201, Dr Adaeze Okafor, Lagos, is_verified=true)
   - Table Editor > pharmacists > Add YOUR pharmacist
   - DELETE any old example rows (HealthPlus/MedCare with fake 2026-12-23 dates)

2. GitHub repo for Vercel project 'naijacare'
   - Upload this whole folder: index.html (latest NaijaCare preview) + api/ folder (6 files in this zip)
   - api/ MUST be a folder at root, not loose files. Do NOT put keys in any frontend file.

3. Vercel > naijacare > Settings > Environment Variables
   - SUPABASE_URL = https://yqgwnqdcupcidhyzjbpv.supabase.co
   - SUPABASE_ANON_KEY = sb_publishable_6ekUT4oRcOhWZ76LrhorXg_l5ukxLnc
   - Redeploy. Domain: naijacare-five.vercel.app

4. Test real persistence:
   - Open live site > Create patient account Mr IKE > Note PAT-101
   - Refresh -> Still logged in / appears in Saved accounts
   - Supabase > patients > Mr IKE row exists
   - Patient chats Dr Adaeze -> Supabase > consultations > New row -> Doctor sees My patients = 1
   - Pharmacist taps Mark Ready -> Mark Delivered -> Supabase > prescriptions > status changes

HOW IT WORKS:
- Patient signup: POST /api/patients -> Supabase patients table -> PAT-101 saved forever
- Doctor list: GET /api/doctors?state=Lagos -> Supabase doctors, filtered
- Chat: POST /api/messages + POST /api/consultations -> Doctor sees patient
- Prescription: POST /api/prescriptions -> PATCH /api/prescriptions?id=... status ready/delivered
- Subscription: PATCH /api/pharmacists?id=... subscription_expiry = today+30 days

SECURITY:
- Keys ONLY in Vercel env vars + api/ server files. Frontend only calls fetch('/api/...')
- For testing, RLS is OFF (open). Before public launch, turn on RLS + Supabase Auth so patient only sees own rows.

LIVE VIDEO/AUDIO (next step, not in this zip):
- Chat via Supabase Realtime (messages table) = live
- Video/Audio via WebRTC (Daily.co / Twilio / LiveKit) - needs a video provider, Supabase alone does not do video calls.
