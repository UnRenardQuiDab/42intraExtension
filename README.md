# 🎓 42 Intra Tools

This repository contains a Web extension and a backend API designed to improve your interaction with the 42 school intranet.

## 🚀 Why This Project?

The 42 Intra Tools is focused on making the 42 intranet more user-friendly and efficient. 

- 📊 **Current Feature**: At present, the primary feature is an improved visualization of log times, making it easier for you to track your progress and manage your time.
- 🛠️ **Future Plans**: The goal is to continually add small, meaningful features that enhance various aspects of the intranet. This suite aims to evolve into a comprehensive toolset that makes the 42 intranet better for everyone.

## 🗂️ What's Inside?

This repository is divided into two main parts:

- **ext/**: The Web extension that enhances your 42 intranet experience.
- **api/**: The backend API built with Express, providing data and services to the extension.

## 📥 Download

- [Chrome Web Store](https://chromewebstore.google.com/detail/42-intratools/hmffgknhokibmhbfhmfgfknpcjgeclgo)
- [Firefox](https://github.com/UnRenardQuiDab/42intraExtension/releases)

## 🛠️ Getting Started

### Prerequisites

Ensure you have these installed before getting started:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)

### Installation Guide

#### 1. Setting Up the Web Extension

1. Open a terminal and navigate to the `ext` directory:
   ```bash
   cd ext
   ```

2. Install the required dependencies:
   ```bash
   npm install
   ```

3. Optionally, modify the API URL in the `config.js` file to match your backend setup.

4. Build the extension for deployment:

   - for Chrome
   ```bash
   npm run build:chrome
   ```
   
   - for Firefox
   ```bash
   npm run build:firefox
   ```

5. Load the extension

   - into Chrome:
      - Open `chrome://extensions/`.
      - Enable "Developer mode" at the top right.
      - Click "Load unpacked" and select the `ext/dist` folder.
   - into Firefox:
      - Open `about:debugging#/runtime/this-firefox`.
      - Click "Load Temporary Add-on" and select the `ext/dist` folder.

#### 2. Setting Up the Backend API

1. Navigate to the `api` directory:
   ```bash
   cd api
   ```

2. Create a `.env` file in the `api` directory with the following content:
   ```env
	CLIENT_ID=<your client id>
	CLIENT_SECRET=<your client secret>
	CALLBACK_URL=http://localhost:3000/auth/42/callback
   CHROME_EXTENSION_ID=
   FIREFOX_EXTENSION_ID=
   ```

3. Install the necessary dependencies:
   ```bash
   npm install
   ```

4. Start the Express server:
   ```bash
   npm start
   ```

## 🌐 Contributing

We welcome contributions from everyone! Whether it's a bug fix, new feature, or even a typo correction, feel free to fork this repository, make your changes, and submit a pull request.

## 📜 License

This project is licensed under the MIT License, so feel free to use and modify it as you see fit!

---

Happy coding! 🎉