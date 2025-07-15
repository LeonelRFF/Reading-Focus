// js/modules/optionsConfig.js

import { dom } from './domElements.js';
import { applyTheme } from './ui.js';

export const options = {
    theme: 'system',
    language: 'es',
    shouldExtractArticle: false // Valor predeterminado para la nueva opción
};

export function saveOptions() {
    options.theme = document.querySelector('input[name="theme"]:checked').value;
    options.language = dom.options.languageSelect.value;
    options.shouldExtractArticle = dom.options.extractArticleCheckbox.checked; // Guardar la nueva opción

    chrome.storage.sync.set({ readingFocusOptions: options }, () => {
        dom.options.statusMessage.textContent = 'Opciones guardadas.';
        setTimeout(() => {
            dom.options.statusMessage.textContent = '';
        }, 1500);
    });
}

export async function loadOptions() {
    const data = await chrome.storage.sync.get({ readingFocusOptions: options });
    Object.assign(options, data.readingFocusOptions);

    document.querySelector(`input[name="theme"][value="${options.theme}"]`).checked = true;
    dom.options.languageSelect.value = options.language;
    dom.options.extractArticleCheckbox.checked = options.shouldExtractArticle; // Cargar la nueva opción
}

export function initOptionsEventListeners() {
    dom.options.saveButton.addEventListener('click', saveOptions);
    dom.options.themeRadios.forEach(radio => radio.addEventListener('change', () => {
        saveOptions();
        applyTheme();
    }));
    dom.options.languageSelect.addEventListener('change', saveOptions);
    dom.options.extractArticleCheckbox.addEventListener('change', saveOptions); // Añadir listener para la nueva opción
}