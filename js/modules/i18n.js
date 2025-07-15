// js/modules/i18n.js
// Handles manual language loading and UI localization.

let activeMessages = {};

export async function loadLocale(lang) {
    try {
        const response = await fetch(chrome.runtime.getURL(`_locales/${lang}/messages.json`));
        if (!response.ok) {
            console.error(`Could not load locale file for: ${lang}`);
            return;
        }
        activeMessages = await response.json();
    } catch (error) {
        console.error("Error loading locale:", error);
    }
}

export function getMessage(key) {
    return activeMessages[key]?.message || '';
}

// -- MODIFIED FUNCTION --
// Now handles text, title attributes, and placeholders.
export function localizePage() {
    // Localize elements with data-i18n for text content
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const message = getMessage(key);
        if (message) el.textContent = message;
    });

    // Localize elements with data-i18n-title for their title attribute
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
        const key = el.getAttribute('data-i18n-title');
        const message = getMessage(key);
        if (message) el.title = message;
    });

    // Localize elements with data-i18n-placeholder for their placeholder attribute
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        const message = getMessage(key);
        if (message) el.placeholder = message;
    });
}

export async function initializeI18n() {
    const defaults = { language: 'es' };
    const data = await chrome.storage.sync.get({ readingFocusOptions: defaults });
    const savedLang = data.readingFocusOptions.language;

    await loadLocale(savedLang);
    localizePage();
}