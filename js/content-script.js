// js/content-script.js
// This script is injected after Readability.js is scheduled for injection.

function runExtraction() {
    try {
        // If Readability is not defined, this will throw an error.
        if (typeof Readability === 'undefined') {
            throw new Error('Readability not available yet.');
        }

        // Prevent the script from running multiple times on the same page
        if (document.body.hasAttribute('data-reading-focus-injected')) {
            return;
        }
        document.body.setAttribute('data-reading-focus-injected', 'true');


        const documentClone = document.cloneNode(true);
        const article = new Readability(documentClone).parse();

        if (article && article.textContent) {
            chrome.runtime.sendMessage({
                action: "openReaderWithText",
                text: article.textContent
            });
        } else {
            chrome.runtime.sendMessage({
                action: "openReaderWithText",
                text: "Reading Focus: No se pudo extraer el contenido del artículo de esta página."
            });
        }
    } catch (e) {
        // If it failed, wait a moment and try again. This handles race conditions.
        console.log("Reading Focus: Readability not ready, trying again in 100ms.");
        setTimeout(runExtraction, 100);
    }
}

runExtraction();