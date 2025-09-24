# 🔒 Malicious URL Detector

A simple browser extension that detects potentially malicious or suspicious URLs using heuristic checks.

## 🚀 Features
- Detects suspicious patterns like:
  - `@` in URLs
  - Raw IP addresses
  - Punycode (IDN homograph attacks)
  - Extremely long URLs
  - Suspicious keywords (`login`, `bank`, `verify`, etc.)
  - Concatenated/malformed URLs
- Real-time detection on active tab
- Popup shows whether the site is Safe ✅ or Suspicious ⚠️

## 🛠️ Tech Stack
- JavaScript
- WebExtensions API
- HTML, CSS

## 📦 Installation (Developer Mode)
1. Clone or download this repo.
2. In Firefox: open `about:debugging#/runtime/this-firefox` → "Load Temporary Add-on" → select `manifest.json`.
3. In Chrome/Edge: go to `chrome://extensions/` → Enable Developer Mode → "Load unpacked" → select project folder.
