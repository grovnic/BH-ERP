// js/i18n.js
let currentLanguage = localStorage.getItem('language') || CONFIG.DEFAULT_LANGUAGE;
let translations = {};

// Učitaj prijevode
async function loadTranslations(lang) {
    try {
        const response = await fetch(`translations/${lang}.json`);
        translations = await response.json();
        currentLanguage = lang;
        localStorage.setItem('language', lang);
        updatePageTranslations();
    } catch (error) {
        console.error('Greška pri učitavanju prijevoda:', error);
    }
}

// Dohvati prijevod
function t(key) {
    return translations[key] || key;
}

// Ažuriraj sve elemente sa data-i18n atributom
function updatePageTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        element.textContent = t(key);
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        element.placeholder = t(key);
    });
}

// Promijeni jezik
function changeLanguage(lang) {
    loadTranslations(lang);
}

// Inicijalizuj na page load
document.addEventListener('DOMContentLoaded', () => {
    loadTranslations(currentLanguage);
});
