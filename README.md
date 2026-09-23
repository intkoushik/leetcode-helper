# 🧠 LeetCode Helper

A Chrome Extension that integrates Google's Gemini API to provide instant AI-powered assistance while solving LeetCode problems — automatically detecting the active problem and generating step-by-step hints, full C++ solutions, and time/space complexity analysis on demand.

---

## ✨ Features

- **Auto Problem Detection** — Automatically reads the problem title and description from any LeetCode problem page
- **Step-by-step Hints** — Get guided hints that help you think without giving away the full solution
- **Full C++ Solution** — Generate a complete solution with a detailed explanation of the approach
- **Complexity Analysis** — Get Time and Space complexity breakdown with explanation
- **Markdown Rendering** — Responses are beautifully formatted with bold text, code blocks, and numbered lists

---

## 🛠️ Tech Stack

- JavaScript (ES6+)
- Chrome Extensions API (Manifest V3)
- Google Gemini API (`gemini-2.5-flash-lite`)
- marked.js (markdown rendering)
- HTML & CSS

---

## 📁 Project Structure

```
leetcode-helper/
├── manifest.json       # Extension configuration and permissions
├── content.js          # Script injected into LeetCode pages
├── background.js       # Service worker — handles Gemini API calls
├── popup.html          # Extension popup UI
├── popup.js            # Popup logic and Chrome API interactions
└── marked.min.js       # Local markdown rendering library
```

---

## 🚀 Getting Started

### 1. Get a Gemini API Key
- Go to [https://aistudio.google.com](https://aistudio.google.com)
- Sign in with your Google account
- Click **Get API key** → **Create API key**
- Copy the key

### 2. Load the Extension
- Open Chrome and go to `chrome://extensions`
- Enable **Developer Mode** (toggle in top right)
- Click **Load unpacked** and select the `leetcode-helper` folder
- Pin the extension using the 🧩 puzzle icon in the toolbar

### 3. Set Your API Key
- Open any LeetCode problem page
- Click the extension icon
- Click **⚙️ Set API Key** and paste your Gemini key
- Click OK — your key is saved

### 4. Start Solving
- Navigate to any LeetCode problem (e.g. `leetcode.com/problems/two-sum`)
- Click the extension icon
- Choose **💡 Hints**, **✅ Full Solution**, or **⏱ Complexity Analysis**

---

## 🔧 How It Works

```
User clicks button
       ↓
popup.js injects extractFunc into the LeetCode tab
       ↓
Reads problem title (document.title) and description ([data-track-load="description_content"])
       ↓
Sends problem to background.js via chrome.runtime.sendMessage
       ↓
background.js builds a prompt and calls Gemini API
       ↓
Response returned → marked.js renders markdown → displayed in popup
```

---

## 🔑 Permissions

| Permission | Purpose |
|---|---|
| `activeTab` | Read the currently active tab URL |
| `scripting` | Inject script to extract problem data from LeetCode DOM |
| `storage` | Persist the Gemini API key across sessions |
| `host_permissions: leetcode.com/*` | Allow scripting on LeetCode pages |
| `host_permissions: generativelanguage.googleapis.com/*` | Allow Gemini API calls |

---

## ⚠️ Limitations

- Only works on `leetcode.com/problems/*` pages
- Requires an active internet connection
- Free tier Gemini API keys have daily rate limits
- LeetCode DOM selectors may need updating if LeetCode changes their frontend

---

## 📸 Preview

| Feature | Description |
|---|---|
| 💡 Hints | 3 guided hints to help you think through the problem |
| ✅ Full Solution | Complete C++ solution with approach explanation |
| ⏱ Complexity | Time and Space complexity with detailed breakdown |

---

## 👤 Author

**Sarkar Koushik Chandan**  
B.Tech – Electrical & Electronics Engineering, NIT Trichy  
