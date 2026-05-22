# 🌌 Welcome to Noteverse! 

Hey there! I built **Noteverse** because I wanted a beautiful, dreamy place to store my thoughts and memories. It's a glassmorphism-inspired, night-themed note-taking app that runs entirely in your browser. 

No complex setups, no databases—just open it up and start typing! ✨

---

## ✨ What's it like?

Imagine a paper-cut night landscape with a glowing moon, twinkling stars, and purple layered hills. That's your workspace! You can write, organize, and cherish your ideas right on top of it using sleek, frosted-glass cards.

---

## 🚀 Cool Things You Can Do

### 📝 Take & Manage Notes
- **Jot down ideas** with a title, message, and even an image!
- **Edit on the fly** — changes save instantly.
- **Pin the important stuff** so it stays at the top.
- **Archive** what you're done with (you can always bring it back).
- **Color-code** your thoughts in 5 pretty tones: Purple, Blue, Teal, Rose, Amber.
- **Upload pictures** directly to your notes! (It works offline too, which is super cool).

### 🔍 Find Stuff Fast
- **Live Search** — just start typing and it filters your notes instantly.
- **Categories** — jump between All Notes, Pinned, Archive, To-Do Lists, and Ideas.
- Keep track of time with **automatic timestamps**, and watch your **word count** go up as you write!

### 💾 It Never Forgets
- Everything is **automatically saved** right in your browser (`localStorage`).
- If you refresh, close the tab, or come back tomorrow, all your notes will still be there.
- It even remembers if you prefer the dreamy night theme or the bright day theme!

### ⌨️ Quick Shortcuts
| Press this | To do this |
|----------|--------|
| `Ctrl + S` | Save your note quickly |
| `Ctrl + F` | Jump to the search bar |
| `Escape` | Close whatever panel is open |

---

## 📁 How the project is organized

I kept the code as simple and clean as possible:

```text
noteverse/
├── index.html                  ← The main app page
├── css/
│   └── styles.css              ← All the pretty glassmorphism styling
├── js/
│   ├── app.js                  ← The brain of the app (saving, searching, etc.)
│   └── splashCursor.js         ← That cool fluid cursor effect!
├── assets/                     ← Images and icons go here
├── Dockerfile                  ← For running it in a container
├── staticwebapp.config.json    ← Azure hosting settings
└── robots.txt                  ← Search engine stuff
```

---

## 🖥️ Want to run it yourself?

You don't need any special tools to run this. 

**Option 1: The easiest way**
Just double-click `index.html` in your file explorer. Seriously, that's it!

**Option 2: Using a local server (My favorite)**
If you have Node.js installed, open your terminal and run:
```bash
npx serve -l 3000
```
Then visit [http://localhost:3000](http://localhost:3000).

**Option 3: Using Docker**
If you're a Docker fan, I've got you covered:
```bash
docker build -t noteverse .
docker run -d -p 8080:80 noteverse
```
Then visit [http://localhost:8080](http://localhost:8080).

---

## 💡 A little daily inspiration...

I added a rotating quote feature that updates every 10 seconds. You'll see words from great minds like Dr. A.P.J. Abdul Kalam, Mahatma Gandhi, Rabindranath Tagore, Swami Vivekananda, and Ratan Tata to keep you inspired while you write.

---

## 🛠️ How I built it

| What it does | What I used |
|-------|-----------|
| The bones | HTML5 |
| The beauty | Vanilla CSS + Tailwind CSS |
| The brains | Vanilla JavaScript |
| The font | Google Fonts (Caveat) |
| The memory | Browser localStorage |

*Quick heads up on images:* Because everything saves to your browser, really huge images might hit the browser's 5MB limit. If that happens, the app will let you know!

---

## 🤝 Let's make it better!

If you like this project, feel free to fork it, play around with the code, or open a pull request! I'd love to see what you add to it.

<div align="center">
  <p>Made with 💜 and a little bit of stardust by Surbhi</p>
  <p><strong>Noteverse</strong> — hold your memories, one note at a time.</p>
</div>
