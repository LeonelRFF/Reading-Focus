// js/modules/config.js
// Handles the configuration specific to the reader UI (WPM, font, etc.).

// --- FIXED: Removed unnecessary imports that were causing circular dependencies ---
import { dom } from './domElements.js';
import { state } from './state.js';
import { applySettings, displayWord, updateBodyClassForMode, applyTheme } from './ui.js';

// Default reader configuration
export const config = {
    wpm: 300,
    fontSize: 48,
    fontFamily: "'Roboto', sans-serif",
    contextWords: 2,
    holdToRead: true,
    highlightStyle: 'word',
    soundEnabled: true,
    oledMode: false
};

// Saves the current reader config.
export function saveReaderConfig() {
    chrome.storage.sync.set({ readingFocusReaderConfig: config });
}

// Loads reader config and updates the UI controls.
export async function loadReaderConfig() {
    const data = await chrome.storage.sync.get({ readingFocusReaderConfig: config });
    Object.assign(config, data.readingFocusReaderConfig);
    
    dom.reader.wpmSlider.value = config.wpm;
    dom.reader.wpmValue.textContent = config.wpm;
    dom.reader.fontSizeSlider.value = config.fontSize;
    dom.reader.fontSizeValue.textContent = config.fontSize;
    dom.reader.fontFamilySelect.value = config.fontFamily;
    dom.reader.contextWordsSlider.value = config.contextWords;
    dom.reader.contextWordsValue.textContent = config.contextWords;
    dom.reader.holdToReadCheckbox.checked = config.holdToRead;
    dom.reader.soundEnabledCheckbox.checked = config.soundEnabled;
    dom.reader.oledModeCheckbox.checked = config.oledMode;

    const highlightRadio = document.querySelector(`input[name="highlight-style"][value="${config.highlightStyle}"]`);
    if (highlightRadio) highlightRadio.checked = true;

    const themeData = await chrome.storage.sync.get({ readingFocusOptions: { theme: 'system' } });
    const themeRadio = document.querySelector(`input[name="theme-style"][value="${themeData.readingFocusOptions.theme}"]`);
    if (themeRadio) themeRadio.checked = true;

    applySettings();
    updateBodyClassForMode();
}

// Centralized event listener setup for reader config controls.
export function initReaderEventListeners() {
    dom.reader.wpmSlider.addEventListener('input', (e) => {
        config.wpm = parseInt(e.target.value);
        dom.reader.wpmValue.textContent = config.wpm;
        if (state.isPlaying) {
            // We need a way to notify the reader to update its interval
            // For now, let's keep it simple. The speed will update on the next play.
        }
    });

    dom.reader.fontSizeSlider.addEventListener('input', () => {
        config.fontSize = parseInt(dom.reader.fontSizeSlider.value);
        dom.reader.fontSizeValue.textContent = config.fontSize;
        applySettings();
        displayWord();
    });

    dom.reader.fontFamilySelect.addEventListener('change', () => {
        config.fontFamily = dom.reader.fontFamilySelect.value;
        applySettings();
    });

    dom.reader.contextWordsSlider.addEventListener('input', () => {
        config.contextWords = parseInt(dom.reader.contextWordsSlider.value);
        dom.reader.contextWordsValue.textContent = config.contextWords;
        displayWord();
    });

    [dom.reader.wpmSlider, dom.reader.fontSizeSlider, dom.reader.fontFamilySelect, dom.reader.contextWordsSlider].forEach(el => el.addEventListener('change', saveReaderConfig));

    dom.reader.holdToReadCheckbox.addEventListener('change', () => {
        config.holdToRead = dom.reader.holdToReadCheckbox.checked;
        updateBodyClassForMode();
        saveReaderConfig();
    });

    dom.reader.soundEnabledCheckbox.addEventListener('change', () => {
        config.soundEnabled = dom.reader.soundEnabledCheckbox.checked;
        saveReaderConfig();
    });
    
    dom.reader.oledModeCheckbox.addEventListener('change', () => {
        config.oledMode = dom.reader.oledModeCheckbox.checked;
        applyTheme();
        saveReaderConfig();
    });
    
    dom.reader.highlightStyleRadios.forEach(radio => radio.addEventListener('change', () => {
        config.highlightStyle = document.querySelector('input[name="highlight-style"]:checked').value;
        displayWord();
        saveReaderConfig();
    }));

    dom.reader.themeRadios.forEach(radio => radio.addEventListener('change', async () => {
        const data = await chrome.storage.sync.get('readingFocusOptions');
        const options = data.readingFocusOptions || {};
        options.theme = document.querySelector('input[name="theme-style"]:checked').value;
        await chrome.storage.sync.set({ readingFocusOptions: options });
        applyTheme();
    }));
}