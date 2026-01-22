// js/config.js
const CONFIG = {
    SUPABASE_URL: 'https://vrwnotfnyrwldnismedw.supabase.co', // ZAMIJENI SA TVOJIM
    SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZyd25vdGZueXJ3bGRuaXNtZWR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwOTg4MDIsImV4cCI6MjA4NDY3NDgwMn0.JLhvCZvIGdB5VRVVIUGVFP-5MIV51alxDKssAag_x8Y', // ZAMIJENI SA TVOJIM
    APP_NAME: 'ERP BiH',
    DEFAULT_LANGUAGE: 'bs',
    DEFAULT_CURRENCY: 'BAM',
    DEFAULT_PDV: 17.00
};

// Globalna varijabla za Supabase klijenta (bit će inicijalizovano u HTML-u)
let supabaseClient = null;
