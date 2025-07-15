// js/options-main.js
// Entry point for the options.html page.

import { initializeOptionsDom } from './modules/domElements.js';
import { initOptionsEventListeners, loadOptions, saveOptions } from './modules/optionsConfig.js';
import { applyTheme, watchSystemTheme } from './modules/ui.js';
// --- FIXED: Import from our new i18n module ---
import { initializeI18n, loadLocale, localizePage } from './modules/i18n.js';

// Initialize the options page when the DOM is ready.
document.addEventListener('DOMContentLoaded', async () => {
    // 1. Initialize DOM elements
    initializeOptionsDom();

    // 2. Load and apply the correct language
    await initializeI18n();

    // 3. Load other options and apply the theme
    await loadOptions(); // Ensure options are loaded
    applyTheme();
    watchSystemTheme();
    
    // 4. Set up all event listeners for the options page.
    initOptionsEventListeners();

    // --- ADDED: Special listener for language change ---
    // This provides instant feedback to the user.
    document.getElementById('language-select').addEventListener('change', async (event) => {
        const newLang = event.target.value;
        await loadLocale(newLang); // Load the new language file
        localizePage();           // Re-translate the page immediately
        saveOptions();            // Save the new preference
    });
});