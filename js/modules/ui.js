// js/modules/ui.js
// Functions that directly manipulate the User Interface.

import { dom } from './domElements.js';
import { state } from './state.js';
import { config } from './config.js';
import { stopReading } from './reader.js';

// Applies settings from the config object to the UI.
export function applySettings() {
    if (dom.reader.wordDisplay) {
        dom.reader.wordDisplay.style.fontSize = `${config.fontSize}px`;
        dom.reader.readerView.style.fontFamily = config.fontFamily;
    }
}

// Applies theme classes to the root HTML element.
export async function applyTheme() {
    const defaults = { theme: 'system' };
    const data = await chrome.storage.sync.get({ readingFocusOptions: defaults });
    const currentTheme = data.readingFocusOptions.theme;

    if (dom.html) {
        dom.html.classList.remove('theme-light', 'theme-dark');
        
        if (currentTheme === 'light') {
            dom.html.classList.add('theme-light');
        } else if (currentTheme === 'dark') {
            dom.html.classList.add('theme-dark');
        } else { // 'system'
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                dom.html.classList.add('theme-dark');
            } else {
                dom.html.classList.add('theme-light');
            }
        }
        
        // Also apply reader-specific OLED mode if applicable
        if (dom.reader.oledModeCheckbox) {
            dom.html.classList.toggle('oled-mode', config.oledMode);
        }
    }
}

// Watches for changes in the system's color scheme.
export function watchSystemTheme() {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', async () => {
        const defaults = { theme: 'system' };
        const data = await chrome.storage.sync.get({ readingFocusOptions: defaults });
        if (data.readingFocusOptions.theme === 'system') {
            applyTheme();
        }
    });
}

// Toggles CSS classes on the body based on the reading mode.
export function updateBodyClassForMode() {
    if (dom.body) {
        dom.body.classList.toggle('hold-mode', config.holdToRead);
        dom.body.classList.toggle('toggle-mode', !config.holdToRead);
    }
}

// Plays the tick sound if enabled.
export function playTickSound() {
    if (config.soundEnabled && dom.reader.wordTickSound) {
        try {
            dom.reader.wordTickSound.currentTime = 0;
            dom.reader.wordTickSound.play().catch(() => {});
        } catch (error) {
            console.error("Error playing tick sound:", error);
        }
    }
}

// Displays the current word and its context.
export async function displayWord() {
    if (!dom.reader.readerView || dom.reader.readerView.classList.contains('is-paragraph-view')) return;
    
    if (state.words.length === 0) {
        dom.reader.contextBefore.textContent = '';
        dom.reader.wordFocus.innerHTML = 'Importa un texto';
        dom.reader.contextAfter.textContent = '';
        dom.reader.wordFocus.style.color = 'inherit';
        updateStatsUI();
        return;
    }

    playTickSound();
    
    const i = Math.max(0, Math.min(state.currentIndex, state.words.length - 1));
    const focusWord = state.words[i];
    
    dom.reader.wordFocus.innerHTML = focusWord;
    dom.reader.contextBefore.textContent = state.words.slice(Math.max(0, i - config.contextWords), i).join(' ');
    dom.reader.contextAfter.textContent = state.words.slice(i + 1, i + 1 + config.contextWords).join(' ');
    
    await new Promise(resolve => requestAnimationFrame(resolve));
    
    const containerWidth = dom.reader.wordDisplay.clientWidth;
    const focusWidth = dom.reader.wordFocus.offsetWidth;
    const gapWidth = parseFloat(getComputedStyle(dom.reader.wordDisplay).gap) || 16;
    const availableSpace = (containerWidth - focusWidth - (2 * gapWidth)) / 2;
    
    if (dom.reader.contextBefore.offsetWidth > availableSpace) dom.reader.contextBefore.textContent = '';
    if (dom.reader.contextAfter.offsetWidth > availableSpace) dom.reader.contextAfter.textContent = '';
    
    dom.reader.wordFocus.style.color = 'inherit';
    switch (config.highlightStyle) {
        case 'word':
            dom.reader.wordFocus.style.color = 'var(--focus-word-color)';
            break;
        case 'letter':
            const midIndex = Math.floor((focusWord.length - 1) / 2);
            dom.reader.wordFocus.innerHTML = `${focusWord.substring(0, midIndex)}<span class="highlight-char">${focusWord.charAt(midIndex)}</span>${focusWord.substring(midIndex + 1)}`;
            break;
    }
    updateStatsUI();
}

// Updates the word counters and progress bar.
export function updateStatsUI() {
    if (!dom.reader.wordCounter) return; // Exit if elements don't exist
    const totalWords = state.words.length;
    const displayIndex = totalWords > 0 ? Math.max(0, Math.min(totalWords, state.currentIndex + 1)) : 0;
    dom.reader.wordCounter.textContent = `${displayIndex} / ${totalWords}`;
    const percentage = totalWords > 0 ? Math.round((displayIndex / totalWords) * 100) : 0;
    dom.reader.percentageCounter.textContent = `${percentage}%`;
    dom.reader.progressBar.style.width = `${percentage}%`;
}

// Updates the progress bar based on user interaction.
export function updateProgress(e) {
    if (!dom.reader.progressContainer) return;
    const rect = dom.reader.progressContainer.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const percentage = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    state.currentIndex = Math.floor(percentage * (state.words.length -1));
    
    if (dom.reader.readerView.classList.contains('is-paragraph-view')) {
        showCurrentParagraph();
    } else {
        displayWord();
    }
}

// Toggles between word view and paragraph view.
export function toggleParagraphView() {
    if (!dom.reader.readerView) return;
    stopReading();
    dom.reader.readerView.classList.toggle('is-paragraph-view');
    if (dom.reader.readerView.classList.contains('is-paragraph-view')) {
        showCurrentParagraph();
        dom.reader.paragraphViewBtn.innerHTML = '📖';
    } else {
        dom.reader.paragraphViewBtn.innerHTML = '🔍';
        displayWord();
    }
}

// Shows the full paragraph corresponding to the current word.
export function showCurrentParagraph() {
    if (!dom.reader.paragraphDisplay) return;
    const currentParagraphIndex = state.paragraphMap[state.currentIndex];
    dom.reader.paragraphDisplay.textContent = state.paragraphs[currentParagraphIndex] || '';
    updateStatsUI();
}

// Navigates between paragraphs.
export function navigateParagraph(direction) {
    if (!dom.reader.readerView || !dom.reader.readerView.classList.contains('is-paragraph-view')) return;
    const currentPIndex = state.paragraphMap[state.currentIndex];
    const nextPIndex = currentPIndex + direction;
    if (nextPIndex >= 0 && nextPIndex < state.paragraphs.length) {
        const firstWordOfNextP = state.paragraphMap.indexOf(nextPIndex);
        state.currentIndex = firstWordOfNextP;
        showCurrentParagraph();
    }
}

// Modal visibility functions
export const showConfigModal = () => dom.reader.configModalOverlay.classList.add('is-visible');
export const hideConfigModal = () => dom.reader.configModalOverlay.classList.remove('is-visible');
export const showImportModal = () => { dom.reader.importModalOverlay.classList.add('is-visible'); dom.reader.textInput.focus(); dom.reader.textInput.value = ''; };
export const hideImportModal = () => dom.reader.importModalOverlay.classList.remove('is-visible');

// Syncs the fullscreen button icon with the current state.
export function syncFullscreenButton() {
    if (!dom.reader.fullscreenBtn) return;
    const isFullscreen = !!document.fullscreenElement;
    dom.reader.fullscreenBtn.innerHTML = isFullscreen ? '↙️' : '↗️';
    dom.reader.fullscreenBtn.title = isFullscreen ? 'Salir de Pantalla Completa (f)' : 'Pantalla Completa (f)';
}