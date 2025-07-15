// js/main.js
// Entry point for the index.html (main reader) page.

import { initializeReaderDom } from './modules/domElements.js';
import { loadReaderConfig, initReaderEventListeners } from './modules/config.js';
import { processText } from './modules/reader.js';
import { syncFullscreenButton, applyTheme, watchSystemTheme } from './modules/ui.js';
import { initEventListeners } from './modules/eventListeners.js';
import { initializeI18n, getMessage } from './modules/i18n.js';

// Initialize the reader application when the DOM is ready.
document.addEventListener('DOMContentLoaded', async () => {
    // 1. Initialize DOM elements.
    initializeReaderDom();

    // 2. Load the user's preferred language and translate the page.
    await initializeI18n();

    // 3. Load all user configurations for the reader.
    await loadReaderConfig();
    
    // 4. Apply theme settings immediately.
    applyTheme();
    watchSystemTheme();

    // 5. Sync UI elements like the fullscreen button.
    syncFullscreenButton();

    // 6. Set up all event listeners for the reader page.
    initEventListeners();
    initReaderEventListeners();

    // 7. Check for text passed from the context menu and initialize the reader.
    chrome.storage.local.get(['selectedTextForReadingFocus'], (result) => {
        // Use the translated welcome text as a fallback.
        const textToRead = result.selectedTextForReadingFocus || getMessage("welcomeText");
        processText(textToRead);
        
        // Clean up the storage to avoid reading the same text again.
        chrome.storage.local.remove('selectedTextForReadingFocus');
    });
});