// js/modules/eventListeners.js
// Centralizes the attachment of event listeners to DOM elements.

import { dom } from './domElements.js';
import { state } from './state.js';
import { config } from './config.js';
import { startReading, stopReading, processText } from './reader.js';
import { updateProgress, showConfigModal, hideConfigModal, showImportModal, hideImportModal, toggleParagraphView, syncFullscreenButton } from './ui.js';
import { handlePlayButtonClick, handleWheelSpeedChange, handleFile, toggleFullscreen, handleReaderViewInteraction, handleKeyDown, handleKeyUp } from './eventHandlers.js';

let isScrubbing = false;
let touchStartX = 0;

export function initEventListeners() {
    // Reader controls
    dom.reader.playPauseBtn.addEventListener('mousedown', () => { if (config.holdToRead) startReading(); });
    dom.reader.playPauseBtn.addEventListener('mouseup', () => { if (config.holdToRead) stopReading(); });
    dom.reader.playPauseBtn.addEventListener('mouseleave', () => { if (config.holdToRead) stopReading(); });
    dom.reader.playPauseBtn.addEventListener('click', handlePlayButtonClick);
    dom.reader.playPauseBtn.addEventListener('touchstart', (e) => { if (config.holdToRead) { e.preventDefault(); startReading(); } }, { passive: false });
    dom.reader.playPauseBtn.addEventListener('touchend', () => { if (config.holdToRead) stopReading(); });
    dom.reader.playPauseBtn.addEventListener('touchcancel', () => { if (config.holdToRead) stopReading(); });

    // Reader view interactions
    dom.reader.readerView.addEventListener('wheel', (e) => { e.preventDefault(); handleReaderViewInteraction(e.deltaY > 0 ? 1 : -1); });
    dom.reader.readerView.addEventListener('touchstart', (e) => { stopReading(); isScrubbing = true; touchStartX = e.touches[0].clientX; }, { passive: true });
    dom.reader.readerView.addEventListener('touchmove', (e) => {
        if (!isScrubbing) return;
        e.preventDefault();
        const deltaX = e.touches[0].clientX - touchStartX;
        handleReaderViewInteraction(deltaX > 0 ? -1 : 1);
        isScrubbing = false; // Prevents continuous scrolling on one swipe
    }, { passive: false });
    dom.reader.readerView.addEventListener('touchend', () => { isScrubbing = false; });
    dom.reader.readerView.addEventListener('touchcancel', () => { isScrubbing = false; });

    // Progress bar
    dom.reader.progressContainer.addEventListener('mousedown', (e) => { state.isDraggingProgress = true; stopReading(); updateProgress(e); });
    window.addEventListener('mousemove', (e) => { if (state.isDraggingProgress) updateProgress(e); });
    window.addEventListener('mouseup', () => { state.isDraggingProgress = false; });
    dom.reader.progressContainer.addEventListener('touchstart', (e) => { e.preventDefault(); state.isDraggingProgress = true; stopReading(); updateProgress(e); }, { passive: false });
    window.addEventListener('touchmove', (e) => { if (state.isDraggingProgress) { e.preventDefault(); updateProgress(e); } }, { passive: false });
    window.addEventListener('touchend', () => { state.isDraggingProgress = false; });

    // Modals and global buttons
    dom.reader.configBtn.addEventListener('click', showConfigModal);
    dom.reader.paragraphViewBtn.addEventListener('click', toggleParagraphView);
    dom.reader.configModalCloseBtn.addEventListener('click', hideConfigModal);
    dom.reader.configModalOverlay.addEventListener('click', (e) => { if (e.target === dom.reader.configModalOverlay) hideConfigModal(); });

    dom.reader.dropZone.addEventListener('click', showImportModal);
    dom.reader.importModalCloseBtn.addEventListener('click', hideImportModal);
    dom.reader.importModalOverlay.addEventListener('click', (e) => { if (e.target === dom.reader.importModalOverlay) hideImportModal(); });
    dom.reader.importFileBtnModal.addEventListener('click', () => dom.reader.fileInput.click());

    // File input and drag/drop
    // --- THIS IS THE FIX: Changed 'input' to 'change' ---
    dom.reader.textInput.addEventListener('change', (e) => processText(e.target.value));
    dom.reader.fileInput.addEventListener('change', (e) => handleFile(e.target.files[0]));
    dom.reader.dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dom.reader.dropZone.classList.add('is-dragover'); });
    dom.reader.dropZone.addEventListener('dragleave', (e) => { e.preventDefault(); dom.reader.dropZone.classList.remove('is-dragover'); });
    dom.reader.dropZone.addEventListener('drop', (e) => { e.preventDefault(); dom.reader.dropZone.classList.remove('is-dragover'); handleFile(e.dataTransfer.files[0]); });

    // Fullscreen
    dom.reader.fullscreenBtn.addEventListener('click', toggleFullscreen);
    document.addEventListener('fullscreenchange', syncFullscreenButton);

    // Keyboard and global events
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    window.addEventListener('wheel', handleWheelSpeedChange, { passive: false });
}