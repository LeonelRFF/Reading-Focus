// js/modules/domElements.js
// Centralizes all DOM element selections for easy access and management.

export const dom = {
    reader: {},
    options: {}
};

export function initializeReaderDom() {
    // ... (la función initializeReaderDom no cambia, sigue igual que en la versión anterior)
    dom.html = document.documentElement;
    dom.body = document.body;
    // ... y todos los demás elementos del lector
    const readerElements = {
        appContainer: document.querySelector('.app-container'),
        readerView: document.querySelector('.reader-view'),
        wordDisplay: document.getElementById('word-display'),
        contextBefore: document.getElementById('context-before'),
        wordFocus: document.getElementById('word-focus'),
        contextAfter: document.getElementById('context-after'),
        paragraphViewBtn: document.getElementById('paragraph-view-btn'),
        paragraphDisplay: document.getElementById('paragraph-display'),
        wordCounter: document.getElementById('word-counter'),
        percentageCounter: document.getElementById('percentage-counter'),
        progressContainer: document.querySelector('.progress-container'),
        progressBar: document.getElementById('progress-bar'),
        playPauseBtn: document.getElementById('play-pause-btn'),
        fullscreenBtn: document.getElementById('fullscreen-btn'),
        wordTickSound: document.getElementById('word-tick-sound'),
        configBtn: document.getElementById('config-btn'),
        configModalOverlay: document.getElementById('config-modal-overlay'),
        configModalCloseBtn: document.getElementById('config-modal-close-btn'),
        importModalOverlay: document.getElementById('import-modal-overlay'),
        importModalCloseBtn: document.getElementById('import-modal-close-btn'),
        importFileBtnModal: document.getElementById('import-file-btn-modal'),
        textInput: document.getElementById('text-input'),
        dropZone: document.getElementById('main-drop-zone'),
        fileInput: document.getElementById('file-input'),
        wpmSlider: document.getElementById('wpm-slider'),
        wpmValue: document.getElementById('wpm-value'),
        fontSizeSlider: document.getElementById('font-size-slider'),
        fontSizeValue: document.getElementById('font-size-value'),
        fontFamilySelect: document.getElementById('font-family-select'),
        contextWordsSlider: document.getElementById('context-words-slider'),
        contextWordsValue: document.getElementById('context-words-value'),
        holdToReadCheckbox: document.getElementById('hold-to-read-checkbox'),
        highlightStyleRadios: document.querySelectorAll('input[name="highlight-style"]'),
        soundEnabledCheckbox: document.getElementById('sound-enabled-checkbox'),
        oledModeCheckbox: document.getElementById('oled-mode-checkbox'),
        themeRadios: document.querySelectorAll('input[name="theme-style"]'),
    };
    Object.assign(dom.reader, readerElements);
}

export function initializeOptionsDom() {
    dom.html = document.documentElement;
    dom.body = document.body;

    const optionsElements = {
        container: document.querySelector('.options-container'),
        themeRadios: document.querySelectorAll('input[name="theme"]'),
        languageSelect: document.getElementById('language-select'),
        extractArticleCheckbox: document.getElementById('extract-article-checkbox'), // NUEVO
        saveButton: document.getElementById('save-button'),
        statusMessage: document.getElementById('status-message'),
    };
    Object.assign(dom.options, optionsElements);
}