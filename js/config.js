// js/config.js
const CONFIG = {
    SUPABASE_URL: 'https://tvoj-projekt.supabase.co', // ZAMIJENI SA TVOJIM URL-om
    SUPABASE_ANON_KEY: 'tvoj-anon-key-ovdje', // ZAMIJENI SA TVOJIM ANON KEY-em
    APP_NAME: 'ERP BiH',
    DEFAULT_LANGUAGE: 'bs',
    DEFAULT_CURRENCY: 'BAM',
    DEFAULT_PDV: 17.00
};

// Inicijalizuj Supabase klijenta
const supabase = supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);
