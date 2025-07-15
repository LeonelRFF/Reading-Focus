// Holds the dynamic state of the application.

export const state = {
    // Reader state
    words: [],
    paragraphs: [],
    paragraphMap: [],
    currentIndex: 0,
    isPlaying: false,
    readingInterval: null,

    // UI Interaction state
    isDraggingProgress: false,
    isSpacebarDown: false
};