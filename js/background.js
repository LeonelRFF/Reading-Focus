// js/background.js

// This function creates the context menu, handling potential errors gracefully.
function setupContextMenu() {
  // First, try to remove any existing menu item with the same ID.
  chrome.contextMenus.remove("readingFocusSelectedText", () => {
    // --- THIS IS THE FIX ---
    // The callback function checks for an error.
    // If chrome.runtime.lastError is set, it means the item did not exist,
    // which is perfectly fine. We can safely ignore it.
    if (chrome.runtime.lastError) {
        // You can uncomment the next line for debugging if you want.
        // console.log("No previous context menu item to remove, which is okay.");
    }
    
    // After the callback (which confirms removal or absence), create the new item.
    // This ensures we never have a duplicate.
    chrome.contextMenus.create({
      id: "readingFocusSelectedText",
      title: "Leer con Reading Focus",
      contexts: ["selection"]
    });
  });
}

// Set up the context menu when the extension is first installed or updated.
chrome.runtime.onInstalled.addListener(setupContextMenu);

// Also set it up when the browser starts.
chrome.runtime.onStartup.addListener(setupContextMenu);


// --- THE REST OF THE FILE REMAINS UNCHANGED ---

// Handles clicks on the context menu item.
chrome.contextMenus.onClicked.addListener((info) => {
    if (info.menuItemId === "readingFocusSelectedText" && info.selectionText) {
        handleTextSelection(info.selectionText);
    }
});

// Handles clicks on the extension's toolbar icon.
chrome.action.onClicked.addListener(async (tab) => {
    const defaults = { shouldExtractArticle: false };
    const data = await chrome.storage.sync.get({ readingFocusOptions: defaults });
    
    if (data.readingFocusOptions.shouldExtractArticle) {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ["js/Readability.js", "js/content-script.js"]
        });
    } else {
        chrome.storage.local.remove('selectedTextForReadingFocus', () => {
            chrome.tabs.create({ url: chrome.runtime.getURL("index.html") });
        });
    }
});

// This function is activated FROM the content-script when the text has been extracted.
chrome.runtime.onMessage.addListener((request) => {
    if (request.action === "openReaderWithText" && request.text) {
        handleTextSelection(request.text);
    }
});

// This helper function opens the reader tab with the provided text.
async function handleTextSelection(text) {
    await chrome.storage.local.set({ selectedTextForReadingFocus: text });
    chrome.tabs.create({ url: chrome.runtime.getURL("index.html") });
}