# ERP BiH - Multi-Tenant ERP Sistem

## Instalacija

1. Kreiraj novi Supabase projekat na https://supabase.com
2. Izvrši SQL kod za kreiranje baza podataka (iz SQL fajla koji si dobio ranije)
3. U `js/config.js` zamijeni:
   - `SUPABASE_URL` sa tvojim Supabase URL-om
   - `SUPABASE_ANON_KEY` sa tvojim Supabase anon ključem

## Postavljanje na GitHub Pages

1. Kreiraj novi GitHub repozitorij
2. Uploadaj sve fajlove
3. Idi na Settings → Pages
4. Izaberi branch (obično `main`) i folder root `/`
5. Sačuvaj

## CORS podesavanje u Supabase

1. Idi na Supabase Dashboard → Project Settings → API
2. Pod "Additional Allowed Origins" dodaj:
   ```
   https://tvoj-username.github.io
   ```

## Struktura

- `login.html` - Prijava
- `register.html` - Registracija novih firmi
- `dashboard.html` - Kontrolna tabla sa statistikom
- `js/config.js` - Konfiguracija Supabase konekcije
- `js/auth.js` - Autentifikacija
- `js/i18n.js` - Dvojezičnost (BS/EN)
- `js/dashboard.js` - Logika za dashboard
- `translations/` - Prijevodi

## Super Admin

Za kreiranje super admin naloga, nakon registracije:
1. Idi u Supabase Dashboard → Table Editor → users
2. Pronađi svog korisnika
3. Promijeni `role` u `'super_admin'`
4. U tabeli `tenants` označi `approved` kao `true`

## Licenca

MIT
