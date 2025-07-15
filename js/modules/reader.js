// js/modules/reader.js
// Core logic for the speed reading functionality.

import { state } from './state.js';
import { config } from './config.js';
// --- FIXED: `dom` is imported from `domElements.js`, not `ui.js` ---
import { dom } from './domElements.js'; 
import { displayWord, hideConfigModal, hideImportModal } from './ui.js';

// Processes a raw text string into words and paragraphs for the reader.
export function processText(text) {
    const rawText = text.trim();
    state.words = rawText.split(/\s+/).filter(word => word.length > 0);
    state.paragraphs = rawText.split(/\n+/).filter(p => p.trim().length > 0);
    state.paragraphMap = [];
    let wordIndex = 0;
    state.paragraphs.forEach((p, pIndex) => {
        const paragraphWordCount = p.trim().split(/\s+/).length;
        for (let i = 0; i < paragraphWordCount; i++) {
            state.paragraphMap[wordIndex + i] = pIndex;
        }
        wordIndex += paragraphWordCount;
    });
    state.currentIndex = 0;
    displayWord();
    hideImportModal();
    hideConfigModal();
}

// Advances to the next word in the sequence.
export function advanceWord() {
    if (state.currentIndex >= state.words.length - 1) {
        stopReading();
    } else {
        state.currentIndex++;
    }
    displayWord();
}

// Starts the reading interval.
export function startReading() {
    if (dom.reader.readerView.classList.contains('is-paragraph-view')) return;
    if (state.isPlaying || state.words.length === 0 || state.currentIndex >= state.words.length) return;
    
    state.isPlaying = true;
    dom.body.classList.add('is-reading-now');
    if (!config.holdToRead) { dom.reader.playPauseBtn.innerHTML = '⏸️'; }
    
    displayWord();
    const interval = 60000 / config.wpm;
    state.readingInterval = setInterval(advanceWord, interval);
}

// Stops the reading interval.
export function stopReading() {
    clearInterval(state.readingInterval);
    state.isPlaying = false;
    dom.body.classList.remove('is-reading-now');
    if (!config.holdToRead) { dom.reader.playPauseBtn.innerHTML = '⚡️'; }
}