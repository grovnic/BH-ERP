// js/config.js
const CONFIG = {
    SUPABASE_URL: 'https://tvoj-projekt.supabase.co', // ZAMIJENI SA TVOJIM
    SUPABASE_ANON_KEY: 'tvoj-anon-key-ovdje', // ZAMIJENI SA TVOJIM
    APP_NAME: 'ERP BiH',
    DEFAULT_LANGUAGE: 'bs',
    DEFAULT_CURRENCY: 'BAM',
    DEFAULT_PDV: 17.00
};

// Globalna varijabla za Supabase klijenta (bit će inicijalizovano u HTML-u)
let supabaseClient = null;
