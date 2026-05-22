/* ============================================================
   Noteverse — app.js  v2.0
   Features: localStorage, edit, search, timestamps,
             keyboard shortcuts, copy-to-clipboard, toast
   ============================================================ */

/* ── Theme Toggle ─────────────────────────────────────────── */
const themeToggle = document.getElementById('input');

// Restore saved theme preference
const savedTheme = localStorage.getItem('nv_theme');
if (savedTheme === 'day') {
    document.body.classList.add('day-theme');
    themeToggle.checked = false;
}

themeToggle.addEventListener('change', (e) => {
    if (e.target.checked) {
        document.body.classList.remove('day-theme');
        localStorage.setItem('nv_theme', 'night');
    } else {
        document.body.classList.add('day-theme');
        localStorage.setItem('nv_theme', 'day');
    }
});

// Remove preload class after first render to enable transitions
window.addEventListener('load', () => {
    document.body.classList.remove('preload');
});

/* ── Generate Stars ───────────────────────────────────────── */
const starsContainer = document.getElementById('stars-container');
for (let i = 0; i < 40; i++) {
    const star = document.createElement('div');
    const size = Math.random() * 8 + 4;
    star.classList.add('star', 'star-glow');
    star.style.width    = `${size}px`;
    star.style.height   = `${size}px`;
    star.style.left     = `${Math.random() * 100}vw`;
    star.style.top      = `${Math.random() * 60}vh`;
    star.style.setProperty('--duration', `${Math.random() * 3 + 2}s`);
    starsContainer.appendChild(star);
}

/* ── Generate Birds (Day Theme) ───────────────────────────── */
const birdsContainer = document.getElementById('birds-container');
for (let i = 0; i < 8; i++) {
    const bird = document.createElement('div');
    bird.classList.add('bird');
    bird.style.left = `${Math.random() * 80 + 10}vw`;
    bird.style.top  = `${Math.random() * 40 + 10}vh`;
    bird.innerHTML  = `
        <svg viewBox="0 0 24 24" width="24" height="24">
            <path d="M2,16 Q6,12 12,16 Q18,12 22,16 Q18,14 12,18 Q6,14 2,16 Z" />
        </svg>`;
    bird.style.animation      = `fly ${Math.random() * 10 + 10}s infinite alternate ease-in-out`;
    bird.style.animationDelay = `-${Math.random() * 10}s`;
    birdsContainer.appendChild(bird);
}

/* ── localStorage Persistence ────────────────────────────── */
const STORAGE_KEY = 'nv_notes';

const DEFAULT_NOTES = [
    { id: 1, title: 'Welcome to Noteverse', message: 'This is your first note. Tap the + button to create your own memories and thoughts here!', status: 'all', color: 'purple', createdAt: '2025-01-01T00:00:00.000Z', updatedAt: '2025-01-01T00:00:00.000Z' },
    { id: 2, title: 'How to use',           message: 'Pin notes you love, archive ones you are done with, and search anything instantly. Your notes are saved automatically!', status: 'all', color: 'blue', createdAt: '2025-01-01T00:00:00.000Z', updatedAt: '2025-01-01T00:00:00.000Z' },
];

function loadNotes() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : DEFAULT_NOTES;
    } catch (e) {
        return DEFAULT_NOTES;
    }
}

function saveNotes() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(appNotes));
    } catch (e) {
        if (e.name === 'QuotaExceededError' || e.code === 22) {
            showToast('Storage full! Try removing large images from notes.');
        } else {
            showToast('Could not save notes — please try again.');
        }
    }
}

/* ── State ────────────────────────────────────────────────── */
let appNotes        = loadNotes();
let currentCategory = '';
let currentIconHTML = '';
let editingNoteId   = null; // null = create mode, number = edit mode
let searchQuery     = '';

// Note colour palette (Tailwind-friendly rgba values)
const NOTE_COLORS = {
    purple: 'rgba(139,92,246,0.25)',
    blue:   'rgba(59,130,246,0.25)',
    teal:   'rgba(20,184,166,0.25)',
    rose:   'rgba(244,63,94,0.25)',
    amber:  'rgba(245,158,11,0.25)',
    default:'rgba(255,255,255,0.2)',
};

/* ── DOM References ───────────────────────────────────────── */
const categoryOverlay        = document.getElementById('category-overlay');
const mainSidebar            = document.getElementById('main-sidebar');
const addNoteBtn             = document.getElementById('add-note-btn');
const categoryCardsContainer = document.getElementById('category-cards');
const addNoteOverlay         = document.getElementById('add-note-overlay');
const noteDatetime           = document.getElementById('note-datetime');
const mainQuotesEl           = document.getElementById('main-quotes');
const topBarEl               = document.getElementById('top-bar');
const saveBtnEl              = document.getElementById('save-note-btn');
const overlayTitleEl         = document.getElementById('overlay-title');
const wordCountEl            = document.getElementById('word-count');
const colorPickerEl          = document.getElementById('note-color-picker');
const backBtnEl              = document.getElementById('back-btn');

/* ── Toast Notification ───────────────────────────────────── */
function showToast(msg, duration = 2200) {
    const container = document.getElementById('toast-container');
    const toast     = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = msg;
    container.appendChild(toast);
    setTimeout(() => {
        toast.classList.add('removing');
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

/* ── Helpers: show/hide home UI ─────────────────────────── */
function hideHomeUI() {
    mainQuotesEl?.classList.add('hide-ui');
    topBarEl?.classList.add('hide-ui');
}
function showHomeUI() {
    mainQuotesEl?.classList.remove('hide-ui');
    topBarEl?.classList.remove('hide-ui');
}
function showBackBtn() { document.getElementById('back-btn')?.classList.remove('hide-ui'); }
function hideBackBtn() { document.getElementById('back-btn')?.classList.add('hide-ui'); }

/* ── Format timestamp for display ────────────────────────── */
function fmtDate(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

/* ── Category Logic ───────────────────────────────────────── */
function openCategory(title, iconHTML) {
    currentCategory = title;
    if (iconHTML) currentIconHTML = iconHTML;
    searchQuery = '';

    document.getElementById('category-title').textContent      = currentCategory;
    document.getElementById('category-icon-wrapper').innerHTML = currentIconHTML;

    // Show/hide search bar only for note lists
    const searchWrapper = document.getElementById('search-bar-wrapper');
    const showSearch    = ['All notes', 'Pinned notes'].includes(title);
    if (searchWrapper) {
        searchWrapper.style.display = showSearch ? 'block' : 'none';
        const input = document.getElementById('search-input');
        if (input) input.value = '';
    }

    renderCategoryCards();

    categoryOverlay.classList.remove('hide-ui');
    mainSidebar.classList.add('hide-ui');
    addNoteBtn.classList.add('hide-ui');
    hideHomeUI();
    showBackBtn();
}

function closeCategory() {
    categoryOverlay.classList.add('hide-ui');
    mainSidebar.classList.remove('hide-ui');
    addNoteBtn.classList.remove('hide-ui');
    showHomeUI();
    hideBackBtn();
    searchQuery = '';
}

function handleOverlayClick(e) {
    const isInteractive = e.target.closest('.glass-card')
        || e.target.closest('button')
        || e.target.closest('input')
        || e.target.closest('textarea')
        || e.target.closest('label')
        || e.target.closest('#category-header')
        || e.target.closest('#search-bar-wrapper');
    if (!isInteractive) closeCategory();
}

function scrollCarousel(direction) {
    const container = document.getElementById('category-cards');
    const cardWidth = container.firstElementChild ? container.firstElementChild.offsetWidth : 300;
    const gap       = 40;
    container.scrollBy({ left: direction * (cardWidth + gap), behavior: 'smooth' });
}

/* ── Back button handler ────────────────────────────────── */
function handleBackBtn() {
    // Close whichever overlay is currently open
    if (!addNoteOverlay.classList.contains('hide-ui')) { closeAddNote(); return; }
    if (!categoryOverlay.classList.contains('hide-ui')) { closeCategory(); return; }
}

/* ── Search ─────────────────────────────────────────────── */
function handleSearch(e) {
    searchQuery = e.target.value.toLowerCase();
    renderCategoryCards();
}

/* ── Copy to Clipboard ────────────────────────────────────── */
function copyNote(id) {
    const note = appNotes.find(n => n.id === id);
    if (!note) return;
    const text = `${note.title}\n\n${note.message}`;
    navigator.clipboard.writeText(text)
        .then(()  => showToast('Copied to clipboard!'))
        .catch(()  => showToast('Could not copy — please copy manually'));
}

/* ── Render Cards ─────────────────────────────────────────── */
function renderCategoryCards() {
    let cardsHTML = '';

    if (currentCategory === 'To-do list') {
        for (let j = 0; j < 3; j++) {
            cardsHTML += `
                <div class="glass-card animate-card relative p-10 flex flex-col gap-8 w-[760px] max-w-[90vw] shrink-0 snap-center shadow-[0_10px_40px_rgba(0,0,0,0.3)] hover:scale-[1.02] transition-transform duration-300 min-h-[min-content] my-4"
                     style="border-radius:2.5rem;background:rgba(255,255,255,0.2);animation-delay:${j*0.15}s;backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);">
                    <input type="text" placeholder="Enter topic/name/title"
                           class="w-full bg-black/50 text-white placeholder-white/80 px-8 py-6 rounded-full outline-none font-sans text-2xl shadow-inner focus:ring-2 focus:ring-white/60 transition-all mb-2">
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 w-full pb-4">
                        ${Array.from({length: 6}).map((_, i) => `
                            <div class="flex items-center gap-4 w-full">
                                <label class="relative flex items-center justify-center cursor-pointer shrink-0">
                                    <input type="checkbox" class="peer sr-only" onchange="toggleTask(this)">
                                    <div class="w-12 h-12 rounded-full bg-black/50 shadow-inner peer-checked:bg-white/40 transition-all flex items-center justify-center hover:bg-black/60">
                                        <svg class="w-6 h-6 text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
                                        </svg>
                                    </div>
                                </label>
                                <input type="text" placeholder="Task ${i + 1}"
                                       class="task-input flex-1 bg-black/50 text-white placeholder-white/80 px-6 py-4 rounded-full outline-none font-sans text-xl shadow-inner focus:ring-2 focus:ring-white/60 transition-all min-w-0">
                            </div>
                        `).join('')}
                    </div>
                </div>`;
        }

    } else if (currentCategory === 'Archive') {
        const archivedNotes = appNotes.filter(n => n.status === 'archived');
        if (archivedNotes.length === 0) {
            cardsHTML = `<p class="text-3xl opacity-60 font-sans">No archived notes yet.</p>`;
        } else {
            const rotations = ['-rotate-6', 'rotate-0', 'rotate-6'];
            archivedNotes.forEach((note, i) => {
                const rot = rotations[i % 3];
                const bg  = NOTE_COLORS[note.color] || NOTE_COLORS.default;
                cardsHTML += `
                    <div class="animate-card shrink-0 snap-center" style="animation-delay:${(i%3)*0.15}s">
                        <div class="glass-card relative p-6 flex flex-col justify-between w-[280px] h-[380px] shadow-xl transition-transform duration-300 transform ${rot} hover:scale-105 hover:z-10"
                             style="border-radius:2rem;background:${bg};">
                            <button class="copy-btn" onclick="copyNote(${note.id})" title="Copy note" aria-label="Copy note">
                                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M16 1H4C2.9 1 2 1.9 2 3v14h2V3h12V1zm3 4H8C6.9 5 6 5.9 6 7v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
                            </button>
                            <div class="flex-1 overflow-hidden">
                                <h3 class="font-bold text-3xl mb-2 opacity-90 truncate text-center">${note.title}</h3>
                                <p class="text-xl opacity-70 text-center leading-relaxed line-clamp-6 font-sans">${note.message}</p>
                            </div>
                            <p class="text-center font-sans text-sm opacity-50 mt-2">${fmtDate(note.createdAt)}</p>
                            <button class="w-full bg-black/50 text-white/90 py-3 rounded-[2rem] text-3xl hover:bg-black/60 transition-colors shadow-inner mt-3"
                                    onclick="restoreNote(${note.id})">Restore</button>
                        </div>
                    </div>`;
            });
        }

    } else if (currentCategory === 'Ideas') {
        for (let i = 0; i < 3; i++) {
            cardsHTML += `
                <div class="animate-card shrink-0 snap-center" style="animation-delay:${i*0.15}s">
                    <div class="glass-card relative p-5 flex flex-col gap-4 w-[320px] h-[440px] shadow-xl transition-transform duration-300 hover:scale-105"
                         style="border-radius:2.5rem;background:rgba(255,255,255,0.25);">
                        <input type="text" placeholder="Topic"
                               class="w-full h-20 bg-white/30 text-white placeholder-white/80 px-6 rounded-3xl outline-none text-4xl shadow-inner focus:ring-2 focus:ring-white/60 transition-all text-center">
                        <textarea placeholder="Enter ideas..."
                                  class="w-full flex-1 bg-white/30 text-white placeholder-white/80 px-6 py-6 rounded-3xl outline-none text-3xl shadow-inner focus:ring-2 focus:ring-white/60 transition-all resize-none text-center"></textarea>
                    </div>
                </div>`;
        }

    } else {
        // All notes or Pinned notes
        const targetStatus = currentCategory === 'Pinned notes' ? 'pinned' : 'all';
        let filteredNotes  = appNotes.filter(n => n.status === targetStatus);

        // Apply search filter
        if (searchQuery) {
            filteredNotes = filteredNotes.filter(n =>
                n.title.toLowerCase().includes(searchQuery) ||
                n.message.toLowerCase().includes(searchQuery)
            );
        }

        if (filteredNotes.length === 0) {
            cardsHTML = searchQuery
                ? `<p class="text-3xl opacity-60 font-sans">No notes match "<em>${searchQuery}</em>"</p>`
                : `<p class="text-3xl opacity-60 font-sans">No notes here yet.</p>`;
        } else {
            filteredNotes.forEach((note, i) => {
                const bg     = NOTE_COLORS[note.color] || NOTE_COLORS.default;
                const pinBtn = targetStatus === 'all'
                    ? `<button class="note-action-btn" onclick="pinNote(${note.id})" title="Pin note">
                           <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M16 12V4H17V2H7V4H8V12L6 14V16H11V22H13V16H18V14L16 12Z"/></svg>
                           Pin
                       </button>`
                    : `<button class="note-action-btn" onclick="unpinNote(${note.id})" title="Unpin note">
                           <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M16 12V4H17V2H7V4H8V12L6 14V16H11V22H13V16H18V14L16 12Z"/></svg>
                           Unpin
                       </button>`;

                const imgHTML = note.image
                    ? `<div class="w-full h-24 rounded-2xl overflow-hidden mb-2 shrink-0"><img src="${note.image}" class="w-full h-full object-cover" alt="Note image"></div>`
                    : '';

                cardsHTML += `
                    <div class="glass-card flex flex-col animate-card hover:scale-105 shrink-0 snap-center w-[300px] h-[420px] p-5 shadow-xl relative"
                         style="border-radius:2rem;background:${bg};animation-delay:${(i%3)*0.15}s">
                        <button class="copy-btn" onclick="copyNote(${note.id})" title="Copy note" aria-label="Copy note">
                            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M16 1H4C2.9 1 2 1.9 2 3v14h2V3h12V1zm3 4H8C6.9 5 6 5.9 6 7v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
                        </button>
                        <div class="flex-1 overflow-hidden flex flex-col">
                            ${imgHTML}
                            <h3 class="font-bold text-3xl mb-2 opacity-90 truncate text-center drop-shadow-md pr-6">${note.title}</h3>
                            <p class="font-sans text-lg opacity-80 text-center leading-relaxed line-clamp-[6] flex-1">${note.message}</p>
                        </div>
                        <p class="text-center font-sans text-xs opacity-40 mt-1 mb-2">${fmtDate(note.updatedAt || note.createdAt)}</p>
                        <div class="flex gap-2 mt-2">
                            <button class="note-action-btn" onclick="editNote(${note.id})" title="Edit note">
                                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
                                Edit
                            </button>
                            ${pinBtn}
                            <button class="note-action-btn note-action-btn--danger" onclick="archiveNote(${note.id})" title="Delete note">
                                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                                Delete
                            </button>
                        </div>
                    </div>`;
            });
        }
    }

    categoryCardsContainer.innerHTML = cardsHTML;
}

/* ── Note CRUD ────────────────────────────────────────────── */
function pinNote(id)     { _setStatus(id, 'pinned');   }
function unpinNote(id)   { _setStatus(id, 'all');      }
function archiveNote(id) { _setStatus(id, 'archived'); showToast('Note archived'); }
function restoreNote(id) { _setStatus(id, 'all');      showToast('Note restored'); }

function _setStatus(id, status) {
    const note = appNotes.find(n => n.id === id);
    if (note) {
        note.status    = status;
        note.updatedAt = new Date().toISOString();
        saveNotes();
        renderCategoryCards();
    }
}

/* ── To-do Task Toggle ────────────────────────────────────── */
function toggleTask(checkbox) {
    const input = checkbox.closest('.flex').querySelector('.task-input');
    if (input) {
        input.classList.toggle('line-through', checkbox.checked);
        input.classList.toggle('opacity-50',   checkbox.checked);
    }
}

/* ── Date/Time for Add Note Overlay ──────────────────────── */
function updateDateTime() {
    if (!noteDatetime) return;
    const now     = new Date();
    const options = { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    noteDatetime.textContent = now.toLocaleString('en-US', options);
}

/* ── Add / Edit Note Overlay ──────────────────────────────── */
function openAddNote(noteId = null) {
    editingNoteId = noteId;

    // Pre-fill if editing
    if (noteId !== null) {
        const note = appNotes.find(n => n.id === noteId);
        if (note) {
            document.getElementById('note-title').value   = note.title;
            document.getElementById('note-message').value = note.message;
            if (colorPickerEl) colorPickerEl.value        = note.color || 'default';
            if (overlayTitleEl) overlayTitleEl.textContent = 'Edit Note';
            if (saveBtnEl) saveBtnEl.textContent           = 'Update Note';
            updateWordCount();
        }
    } else {
        document.getElementById('note-title').value   = '';
        document.getElementById('note-message').value = '';
        if (colorPickerEl) colorPickerEl.value        = 'default';
        if (overlayTitleEl) overlayTitleEl.textContent = 'New Note';
        if (saveBtnEl) saveBtnEl.textContent           = 'Save Note';
        if (wordCountEl) wordCountEl.textContent       = '0 words';
    }

    addNoteOverlay.classList.remove('hide-ui');
    updateDateTime();
    mainSidebar.classList.add('hide-ui');
    addNoteBtn.classList.add('hide-ui');
    hideHomeUI();
    showBackBtn();

    // Set pending image from existing note if editing
    window._pendingImage = (noteId !== null && appNotes.find(n => n.id === noteId)?.image) || null;
    const previewImg = document.getElementById('main-preview-img');
    if (previewImg) {
        if (window._pendingImage) {
            previewImg.src = window._pendingImage;
            previewImg.classList.remove('hidden');
        } else {
            previewImg.src = '';
            previewImg.classList.add('hidden');
        }
    }

    // Focus title field
    setTimeout(() => document.getElementById('note-title')?.focus(), 100);
}

function closeAddNote() {
    addNoteOverlay.classList.add('hide-ui');
    mainSidebar.classList.remove('hide-ui');
    addNoteBtn.classList.remove('hide-ui');
    editingNoteId = null;
    showHomeUI();
    hideBackBtn();
}

function handleAddNoteOverlayClick(e) {
    if (e.target === addNoteOverlay) closeAddNote();
}

function handleFileUpload(event) {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file   = files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
        const base64 = e.target.result; // data:image/...;base64,...
        const previewImg = document.getElementById('main-preview-img');
        previewImg.src   = base64;
        previewImg.classList.remove('hidden');
        // Store in a temporary variable so saveNote() can grab it
        window._pendingImage = base64;
    };

    reader.onerror = () => showToast('Could not load image');
    reader.readAsDataURL(file);
}

function updateWordCount() {
    if (!wordCountEl) return;
    const msg   = document.getElementById('note-message')?.value || '';
    const words = msg.trim() === '' ? 0 : msg.trim().split(/\s+/).length;
    wordCountEl.textContent = `${words} word${words !== 1 ? 's' : ''}`;
}

function editNote(id) {
    // Close category overlay first, then open in edit mode
    categoryOverlay.classList.add('hide-ui');
    openAddNote(id);
}

function saveNote() {
    const title = document.getElementById('note-title').value.trim()   || 'Untitled Note';
    const msg   = document.getElementById('note-message').value.trim() || 'No content...';
    const color = colorPickerEl?.value || 'default';

    if (editingNoteId !== null) {
        // ── Update existing note ──
        const note = appNotes.find(n => n.id === editingNoteId);
        if (note) {
            note.title     = title;
            note.message   = msg;
            note.color     = color;
            note.updatedAt = new Date().toISOString();
            // Only update image if one was explicitly selected (not null reset)
            if (window._pendingImage !== undefined && window._pendingImage !== null) {
                note.image = window._pendingImage;
            } else if (window._pendingImage === null && !appNotes.find(n => n.id === editingNoteId)?.image) {
                note.image = null;
            }
            saveNotes();
            showToast('Note updated!');
        }
    } else {
        // ── Create new note ──
        appNotes.unshift({
            id:        Date.now(),
            title,
            message:   msg,
            status:    'all',
            color,
            image:     window._pendingImage || null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        });
        saveNotes();
        showToast('Note saved!');
    }

    // Clear form
    document.getElementById('note-title').value   = '';
    document.getElementById('note-message').value = '';
    document.getElementById('file-upload').value  = '';
    window._pendingImage = null;
    const previewImg = document.getElementById('main-preview-img');
    if (previewImg) { previewImg.src = ''; previewImg.classList.add('hidden'); }
    if (wordCountEl) wordCountEl.textContent = '0 words';

    closeAddNote();

    // Show All notes so user sees their new/edited note
    openCategory('All notes', `<svg viewBox="0 0 24 24" class="icon-svg w-8 h-8 text-black fill-current"><path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"/></svg>`);
}

/* ── Rotating Quotes ──────────────────────────────────────── */
const quotes = [
    { text: "If you want to shine like a sun, first burn like a sun.",                               author: "Dr. A.P.J. Abdul Kalam" },
    { text: "Be the change that you wish to see in the world.",                                      author: "Mahatma Gandhi"         },
    { text: "You can't cross the sea merely by standing and staring at the water.",                  author: "Rabindranath Tagore"    },
    { text: "Arise, awake and stop not till the goal is reached.",                                   author: "Swami Vivekananda"      },
    { text: "I don't believe in taking right decisions. I take decisions and then make them right.", author: "Ratan Tata"             }
];
let currentQuoteIndex = 0;

function updateQuote() {
    const quoteTextEl   = document.getElementById('quote-text');
    const quoteAuthorEl = document.getElementById('quote-author');
    if (!quoteTextEl || !quoteAuthorEl) return;
    quoteTextEl.style.opacity   = '0';
    quoteAuthorEl.style.opacity = '0';
    setTimeout(() => {
        quoteTextEl.textContent   = `"${quotes[currentQuoteIndex].text}"`;
        quoteAuthorEl.textContent = `— ${quotes[currentQuoteIndex].author}`;
        quoteTextEl.style.opacity   = '1';
        quoteAuthorEl.style.opacity = '1';
        currentQuoteIndex = (currentQuoteIndex + 1) % quotes.length;
    }, 1000);
}

/* ── Typewriter Greeting ──────────────────────────────────── */
const WELCOME_TEXT = "Hey welcome to Noteverse! Good to see you here, I can't wait to hold your memories and thoughts";
const typewriterEl = document.getElementById('typewriter-text');
let typeIndex      = 0;

function typeWriter() {
    if (typewriterEl && typeIndex < WELCOME_TEXT.length) {
        typewriterEl.textContent += WELCOME_TEXT.charAt(typeIndex);
        typeIndex++;
        setTimeout(typeWriter, 50);
    }
}

/* ── Keyboard Shortcuts ───────────────────────────────────── */
document.addEventListener('keydown', (e) => {
    const key     = e.key;
    const ctrlCmd = e.ctrlKey || e.metaKey;

    // Escape → close whichever overlay is open
    if (key === 'Escape') {
        if (!addNoteOverlay.classList.contains('hide-ui')) { closeAddNote(); return; }
        if (!categoryOverlay.classList.contains('hide-ui')) { closeCategory(); return; }
    }

    // Ctrl/Cmd+S → save note (only when add-note overlay is open)
    if (ctrlCmd && key === 's') {
        if (!addNoteOverlay.classList.contains('hide-ui')) {
            e.preventDefault();
            saveNote();
        }
    }

    // Ctrl/Cmd+F → focus search (only when category overlay is open & search visible)
    if (ctrlCmd && key === 'f') {
        const searchInput = document.getElementById('search-input');
        if (!categoryOverlay.classList.contains('hide-ui') && searchInput && searchInput.style.display !== 'none') {
            e.preventDefault();
            searchInput.focus();
        }
    }
});

/* ── Bootstrap ────────────────────────────────────────────── */
updateDateTime();
setInterval(updateDateTime, 1000);

updateQuote();
setInterval(updateQuote, 10000);

setTimeout(typeWriter, 1000);
