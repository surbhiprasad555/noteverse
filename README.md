# 🌌 Noteverse

> *A place where your memories and thoughts feel at home.*

Noteverse is a beautifully crafted, dreamy night-themed note-taking web application. Built with pure HTML, CSS, and JavaScript — no frameworks, no installs, just open and use.

---

## ✨ What it looks like

A stunning paper-cut night landscape with a glowing crescent moon, twinkling stars, and layered purple wave hills as your backdrop — while you write, organise, and cherish your thoughts in glassmorphism cards.

---

## 🚀 Features

### 📝 Notes
- **Create notes** with a title, message, and an optional image
- **Edit notes** anytime — changes are saved instantly
- **Pin** important notes to keep them at the top
- **Archive** notes you are done with (and restore them anytime)
- **Color-tag** notes in 5 tones: Purple, Blue, Teal, Rose, Amber
- **Image upload** — attach a photo to any note (stored locally, works offline)

### 🔍 Search & Organisation
- **Live search** — filter notes instantly as you type
- **Categories** — All Notes, Pinned, Archive, To-Do Lists, Ideas
- **Timestamps** — see when each note was created or last updated
- **Word count** — shown live while you write

### 💾 Always Saved
- All your notes are **automatically saved** to your browser's local storage
- Survive page refresh, browser restart, and coming back days later
- Your **day / night theme preference** is also remembered

### ⌨️ Keyboard Shortcuts
| Shortcut | Action |
|----------|--------|
| `Ctrl + S` | Save the current note |
| `Ctrl + F` | Focus the search bar |
| `Escape` | Close any open panel |

### 🎨 Design
- Dreamy night / sunny day theme toggle
- Glassmorphism UI with smooth animations
- Paper-cut layered landscape background
- Rotating motivational quotes from great minds
- Typewriter welcome greeting
- Interactive fluid cursor effect
- Fully responsive — works on mobile, tablet, and desktop

---

## 📁 Project Structure

```
noteverse/
├── index.html                  ← Main app (single page)
├── css/
│   └── styles.css              ← All custom styles
├── js/
│   ├── app.js                  ← All app logic
│   └── splashCursor.js         ← Fluid cursor animation
├── assets/                     ← Static assets (images, icons)
├── staticwebapp.config.json    ← Hosting configuration
├── robots.txt                  ← Search engine instructions
└── README.md
```

---

## 🖥️ Running Locally

No build tools or installs needed.

**Option 1 — Just open it:**
```
Double-click index.html in your file explorer
```

**Option 2 — With a local server (recommended):**
```bash
npx serve -l 3000
```
Then open [http://localhost:3000](http://localhost:3000)

---

## 💡 Quotes in the App

Noteverse rotates through these inspiring quotes every 10 seconds:

- *"If you want to shine like a sun, first burn like a sun."* — Dr. A.P.J. Abdul Kalam
- *"Be the change that you wish to see in the world."* — Mahatma Gandhi
- *"You can't cross the sea merely by standing and staring at the water."* — Rabindranath Tagore
- *"Arise, awake and stop not till the goal is reached."* — Swami Vivekananda
- *"I don't believe in taking right decisions. I take decisions and then make them right."* — Ratan Tata

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Structure | HTML5 (semantic) |
| Styling | Vanilla CSS + Tailwind CSS (CDN) |
| Logic | Vanilla JavaScript (ES6+) |
| Fonts | Google Fonts — Caveat |
| Storage | Browser localStorage |
| Animations | CSS keyframes + JS |

---

## 📌 Notes on Image Storage

Images attached to notes are converted to Base64 and saved inside localStorage alongside the note text. This means:
- ✅ Images work completely **offline**
- ✅ No server or backend needed
- ⚠️ Very large images may hit the browser's ~5MB storage limit — a warning toast will appear if this happens

---

## 🤝 Contributing

Feel free to fork this project, suggest improvements, or open a pull request. All feedback is welcome!

---

<div align="center">
  <p>Made with 💜 and a little bit of stardust</p>
  <p><strong>Noteverse</strong> — hold your memories, one note at a time.</p>
</div>
