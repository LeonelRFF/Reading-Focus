<div align="center">

# 📖 Reading Focus

**A modern browser extension for speed reading, designed to enhance focus and content absorption.**

---

[![Reading Focus Una Extensión para Leer Más Rápido Gratis](https://img.youtube.com/vi/-v2R2vdeew8/0.jpg)](https://www.youtube.com/watch?v=-v2R2vdeew8)

---

### 📜 Table of Contents

*   [About The Project](#about-the-project)
*   [Built With](#built-with)
*   [Getting Started](#getting-started)
    *   [Installation](#installation)
*   [Usage](#usage)
*   [Contributing](#contributing)
*   [Support This Project](#support-this-project)
*   [License](#license)
*   [Acknowledgements](#acknowledgements)

---

## 🚀 About The Project

In a world filled with digital distractions, absorbing information efficiently is harder than ever. **Reading Focus** is a tool designed to help you overcome this challenge. Using speed-reading techniques, this extension isolates text and presents it word-by-word at a controllable pace, minimizing eye movement and boosting concentration.

**Key Features:**

*   **⚡ Immersive Reader:** Presents text word-by-word to maximize reading speed.
*   **🧠 Smart Content Extraction:** With a single click, extracts the main content from any article or news story, removing ads and other clutter.
*   **🎨 Highly Customizable:** Adjust the speed (WPM), font size, and typography for a comfortable and personalized reading experience.
*   **🧩 Seamless Integration:** Activate the reader from the context menu on selected text or by clicking the extension icon.
*   **⌨️ Keyboard Shortcuts:** Control the entire application without ever touching your mouse.

---

## 🛠️ Built With

This project was built using modern and efficient technologies to ensure a smooth user experience and a maintainable codebase.

*   **HTML5**
*   **SCSS (Sass)**
*   **JavaScript (ES6 Modules)**
*   **Readability.js** by Mozilla

---

## 🏁 Getting Started

To get a local copy up and running, follow these simple steps.

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/LeonelRFF/Reading-Focus.git
    ```
2.  **Navigate to the project directory:**
    ```sh
    cd Reading-Focus
    ```
3.  **Install NPM packages:**
    ```sh
    npm install
    ```
4.  **Compile the Sass files:**
    ```sh
    npm run build:sass
    ```
    *For continuous development, you can use `npm run watch:sass`. This will automatically recompile your styles whenever you save a change to a `.scss` file.*

5.  **Load the extension in your browser (Chromium-based):**
    *   Open Chrome/Edge and navigate to `chrome://extensions` or `edge://extensions`.
    *   Enable **"Developer mode"** (usually a toggle in the top-right corner).
    *   Click on **"Load unpacked"**.
    *   Select the root project folder (`Reading-Focus`). You're all set!

---

## 💡 Usage

Once installed, you can use the extension in two main ways:

1.  **From the Context Menu:**
    *   Select any text on a webpage.
    *   Right-click the selection.
    *   Choose the **"Read with Reading Focus"** option. This will open a new tab with your selected text ready to be read.

2.  **From the Extension Icon:**
    *   Click the Reading Focus icon in your browser's toolbar.
    *   The behavior depends on your settings in the **Extension Options** page:
        *   If **"Automatically extract article content"** is **checked**, the extension will parse the current page, extract the main article, and open it in the reader tab.
        *   If it is **unchecked**, a blank reader tab will open, ready for you to paste text or import a file.

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

1.  Fork the Project.
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the Branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

---

## 💖 Support This Project

If you find this project useful and want to support its continued development, there are a few ways you can help:

- **⭐ Star the repository on GitHub:** This is the easiest way to show your appreciation and helps increase the project's visibility.
- **🗣️ Spread the word:** Share this extension with others who might find it useful.
- **💸 Donate:** Your financial support helps me dedicate more time to new features, bug fixes, and providing support. Any amount is greatly appreciated!

<div align="center">
    <a href="https://github.com/sponsors/LeonelRFF" target="_blank">
        <img src="https://img.shields.io/badge/Sponsor_on_GitHub-%E2%9D%A4-EA4AAA?style=for-the-badge&logo=github" alt="Sponsor on GitHub">
    </a>
    <a href="https://ko-fi.com/leonelrff" target="_blank">
        <img src="https://img.shields.io/badge/Buy_me_a_Ko--fi-F16061?style=for-the-badge&logo=ko-fi&logoColor=white" alt="Buy me a Ko-fi">
    </a>
    <a href="https://www.buymeacoffee.com/leonelrff" target="_blank">
        <img src="https://img.shields.io/badge/Buy_Me_A_Coffee-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black" alt="Buy Me A Coffee">
    </a>
</div>

---

## 📄 License

This project is distributed under the MIT License. See the `LICENSE` file for more information.

This project also incorporates third-party software. Please see the `NOTICE.md` file for detailed information regarding the libraries used and their respective licenses.

---

## 🙏 Acknowledgements

This project would not be possible without the incredible work of the open-source community.

*   **[Readability.js](https://github.com/mozilla/readability)** - Used for smart extraction of article content. Licensed under Apache License 2.0.

---

*Crafted with ❤️ by Leonel Rodriguez.*
