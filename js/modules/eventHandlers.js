// js/modules/eventHandlers.js
// Contains the functions that are executed when an event occurs.

import { dom } from './domElements.js';
import { state } from './state.js';
import { config } from './config.js';
import { startReading, stopReading, advanceWord, processText } from './reader.js';
import { showConfigModal, hideConfigModal, showImportModal, hideImportModal, toggleParagraphView, displayWord, navigateParagraph } from './ui.js';

export function handlePlayButtonClick() {
    if (config.holdToRead || dom.reader.readerView.classList.contains('is-paragraph-view')) return;
    if (state.isPlaying) stopReading();
    else startReading();
}

export function handleSpeedChange() {
    if (!state.isPlaying) return;
    clearInterval(state.readingInterval);
    const newInterval = 60000 / config.wpm;
    state.readingInterval = setInterval(advanceWord, newInterval);
}

export function handleWheelSpeedChange(e) {
    if (!dom.reader.playPauseBtn) return;
    const isHoveringButton = dom.reader.playPauseBtn.contains(e.target);
    const isHoldReading = state.isPlaying && config.holdToRead && !dom.reader.readerView.contains(e.target);
    const isToggleReadingAndHover = state.isPlaying && !config.holdToRead && isHoveringButton;
    if (isHoldReading || isToggleReadingAndHover) {
        e.preventDefault();
        const step = e.shiftKey ? 50 : 10;
        if (e.deltaY < 0) config.wpm = Math.min(1500, config.wpm + step);
        else config.wpm = Math.max(50, config.wpm - step);
        dom.reader.wpmSlider.value = config.wpm;
        dom.reader.wpmValue.textContent = config.wpm;
        handleSpeedChange();
    }
}

export function handleFile(file) {
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => processText(event.target.result);
        reader.readAsText(file);
    }
}

export function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => console.error(err));
    } else if (document.exitFullscreen) {
        document.exitFullscreen();
    }
}

export function handleReaderViewInteraction(direction) {
    if (dom.reader.readerView.classList.contains('is-paragraph-view')) {
        navigateParagraph(direction);
    } else {
        stopReading();
        if (direction < 0) {
            if (state.currentIndex > 0) state.currentIndex--;
        } else {
            if (state.currentIndex < state.words.length - 1) state.currentIndex++;
        }
        displayWord();
    }
}

// --- THIS FUNCTION HAS THE CORRECTED LOGIC ---
export function handleKeyDown(e) {
    // Priority #1: Handle the Escape key universally. It should always close modals.
    if (e.key === 'Escape') {
        const isConfigModalVisible = dom.reader.configModalOverlay.classList.contains('is-visible');
        const isImportModalVisible = dom.reader.importModalOverlay.classList.contains('is-visible');

        if (isConfigModalVisible) hideConfigModal();
        if (isImportModalVisible) hideImportModal();
        
        // If a modal was closed, stop further execution.
        if (isConfigModalVisible || isImportModalVisible) return;
    }

    // Priority #2: If the user is typing in an input field, ignore ALL OTHER shortcuts.
    const activeElementTag = document.activeElement.tagName;
    if (activeElementTag === 'TEXTAREA' || activeElementTag === 'INPUT') {
        return; // Exit the function immediately to allow typing.
    }

    // Priority #3: If we've reached this point, no input is focused.
    // It's safe to process global shortcuts.
    const key = e.key.toLowerCase();
    
    const actions = {
        ',': e.ctrlKey ? showConfigModal : null,
        'i': e.ctrlKey ? () => dom.reader.fileInput.click() : showImportModal,
        'f': toggleFullscreen,
        't': toggleParagraphView,
        'a': () => handleReaderViewInteraction(-1),
        'arrowleft': () => handleReaderViewInteraction(-1),
        'd': () => handleReaderViewInteraction(1),
        'arrowright': () => handleReaderViewInteraction(1),
        ' ': () => {
            if (dom.reader.readerView.classList.contains('is-paragraph-view')) return;
            if (config.holdToRead) {
                if (!state.isSpacebarDown) {
                    startReading();
                    state.isSpacebarDown = true;
                }
            } else {
                handlePlayButtonClick();
            }
        }
    };

    if (actions[key]) {
        e.preventDefault();
        actions[key]();
    }
}

export function handleKeyUp(e) {
    if (e.key === ' ' && config.holdToRead) {
        stopReading();
        state.isSpacebarDown = false;
    }
}